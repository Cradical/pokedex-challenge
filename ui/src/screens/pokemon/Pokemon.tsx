import React, { useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps, Link } from '@reach/router'
import { useQuery, gql } from '@apollo/client'
import { Container as NesContainer } from 'nes-react'

import Search from 'components/Search'
import TypeFilter from 'components/TypeFilter'

const Wrapper = styled.div`
  display: flex;
`

export const Container = styled(NesContainer)`
  && {
    background: white;
    margin: 2rem 15%;

    ::after {
      z-index: unset;
      pointer-events: none;
    }
  }
`

const List = styled.ul`
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
`

const ListItem = styled.li`
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 1rem;

  > *:first-child {
    margin-right: 1rem;
  }
`

const POKEMON_MANY = gql`
  query($skip: Int, $limit: Int) {
    pokemonMany(skip: $skip, limit: $limit) {
      id
      name
      num
      img
    }
  }
`

const Pokemon: React.FC<RouteComponentProps & { clickLink: Function }> = ({
  clickLink,
}) => {
  const [resultList, setResultlist] = useState<any>(null)
  const { loading, error, data } = useQuery(POKEMON_MANY)

  const pokemonList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  if (loading) {
    return <p>Loading...</p>
  }
  if (error || !pokemonList) {
    return <p>Error!</p>
  }

  const generateLink = pokemon => {
    return (
      <Link to={pokemon.id} onMouseDown={clickLink as any}>
        <ListItem>
          <img src={pokemon.img} />
          {pokemon.name} - {pokemon.num}
        </ListItem>
      </Link>
    )
  }

  const renderList = () => {
    if (resultList) {
      return resultList.map(pokemon => generateLink(pokemon))
    } else {
      return pokemonList.map(pokemon => generateLink(pokemon))
    }
  }

  return (
    <Wrapper>
      <TypeFilter />
      <Container rounded>
        <Search setResultList={setResultlist} />
        <List>{renderList()}</List>
      </Container>
    </Wrapper>
  )
}

export default Pokemon
