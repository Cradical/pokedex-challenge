import { ApolloServer, gql, IResolvers } from 'apollo-server'
import sortBy from 'lodash/sortBy'
import find from 'lodash/find'
import filter from 'lodash/filter'
import pokemon from './pokemon.json'
interface Pokemon {
  id: string
  num: string
  name: string
  img: string
  types: string[]
  weaknesses: string[]
  height: string
  weight: string
  egg: string
  prevEvolutions?: Array<{ num: string; name: string }>
  nextEvolutions?: Array<{ num: string; name: string }>
  candy?: string
  candyCount?: number
}

const typeDefs = gql`
  type Pokemon {
    id: ID!
    num: ID!
    name: String!
    img: String!
    types: [String!]!
    weaknesses: [String!]!
    height: String!
    weight: String!
    egg: String!
    prevEvolutions: [Pokemon!]!
    nextEvolutions: [Pokemon!]!
    candy: String
    candyCount: Int
  }

  type Query {
    pokemonMany(
      skip: Int
      limit: Int
      searchFilter: String
      weaknessFilter: [String]
    ): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
  }
`

const resolvers: IResolvers<any, any> = {
  Pokemon: {
    prevEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.prevEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
    nextEvolutions(rawPokemon: Pokemon) {
      return (
        rawPokemon.nextEvolutions?.map(evolution =>
          find(pokemon, otherPokemon => otherPokemon.num === evolution.num)
        ) || []
      )
    },
  },
  Query: {
    pokemonMany(
      _,
      {
        skip = 0,
        limit = 999,
        searchFilter = '',
        weaknessFilter = [],
      }: {
        skip?: number
        limit?: number
        searchFilter?: string
        weaknessFilter?: string[]
      }
    ): Pokemon[] {
      if (weaknessFilter.length) {
        return filter(pokemon, poke => {
          const characters: any = []
          weaknessFilter.sort((a, b) => a.localeCompare(b))
          for (let i = 0; i < weaknessFilter.length; i++) {
            if (
              weaknessFilter.length === 1 &&
              poke.weaknesses.includes(weaknessFilter[i])
            ) {
              // return true
              characters.push(poke)
            }

            if (
              poke.weaknesses.includes(weaknessFilter[i]) &&
              i > 0 &&
              poke.weaknesses.includes(weaknessFilter[i - 1])
            ) {
              console.log(weaknessFilter[i])
              // return true
              characters.push(poke)
            }
          }
          return characters
        })
      } else if (searchFilter !== '') {
        return filter(pokemon, poke => poke.name.includes(searchFilter))
      } else {
        return sortBy(pokemon, poke => parseInt(poke.id, 10)).slice(
          skip,
          limit + skip
        )
      }
    },
    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`)
})
