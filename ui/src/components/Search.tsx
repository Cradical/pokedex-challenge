import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from '@reach/router'
import { useQuery, gql } from '@apollo/client'

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin: auto;
`

const Label = styled.label`
  padding: 0 2rem;
`

interface SearchProps {
  setResultList: any
}

const POKEMON_SEARCH = gql`
  query($searchFilter: String) {
    pokemonMany(searchFilter: $searchFilter) {
      id
      name
      num
      img
    }
  }
`

const Search: React.FC<RouteComponentProps & SearchProps> = props => {
  const [searchFilter, setSearchFilter] = useState<string>('')
  const searchInput = useRef<HTMLInputElement | null>(null)
  const { setResultList } = props
  const { loading, error, data } = useQuery(POKEMON_SEARCH, {
    variables: { searchFilter: searchFilter },
  })

  const pokemonSearch:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  const onChangeHandler = (): void => {
    if (!searchInput.current && searchInput.current.value === '') return
    setTimeout(() => {
      setSearchFilter(searchInput.current.value)
    }, 500)
  }

  setResultList(pokemonSearch)

  return (
    <Container>
      <Label>Search </Label>
      <input ref={searchInput} type="text" onChange={onChangeHandler} />
    </Container>
  )
}

export default Search
