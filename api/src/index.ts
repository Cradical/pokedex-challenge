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
      typeFilter: [String]
      weaknessFilter: [String]
    ): [Pokemon!]!
    pokemonOne(id: ID!): Pokemon
    searchPokemon(searchFilter: String): [Pokemon]!
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
        typeFilter = [],
        weaknessFilter = [],
      }: {
        skip?: number
        limit?: number
        typeFilter?: string[]
        weaknessFilter?: string[]
      }
    ): Pokemon[] {
      if (typeFilter.length && weaknessFilter.length) {
        return filter(pokemon, poke => {
          const typeMatch = (type: string) => {
            return poke.types.includes(type)
          }

          const weaknessMatch = (weakness: string) => {
            return poke.weaknesses.includes(weakness)
          }

          return (
            typeFilter.every(typeMatch) && weaknessFilter.every(weaknessMatch)
          )
        })
      } else if (typeFilter.length) {
        return filter(pokemon, poke => {
          const typeMatch = (type: string) => {
            return poke.types.includes(type)
          }

          return typeFilter.every(typeMatch)
        })
      } else if (weaknessFilter.length) {
        return filter(pokemon, poke => {
          const weaknessMatch = (weakness: string) => {
            return poke.weaknesses.includes(weakness)
          }

          return weaknessFilter.every(weaknessMatch)
        })
      }
      return sortBy(pokemon, poke => parseInt(poke.id, 10)).slice(
        skip,
        limit + skip
      )
    },
    pokemonOne(_, { id }: { id: string }): Pokemon {
      return (pokemon as Record<string, Pokemon>)[id]
    },
    searchPokemon(_, { searchFilter = '' }): Pokemon[] {
      if (searchFilter !== '') {
        return filter(pokemon, poke => poke.name.includes(searchFilter))
      }

      return []
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
