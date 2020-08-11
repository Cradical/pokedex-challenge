import React, { useState } from 'react'
import styled from 'styled-components'
import { useQuery, gql } from '@apollo/client'

const FilterContainer = styled.div`
  border: 3px solid black;
  border-radius: 5px;
  width: 20vw;
  background: white;
  margin: 2rem 5%;

  ::after {
    z-index: unset;
    pointer-events: none;
  }
`

const ChecklistContainer = styled.div`
  padding: 0 5px;
`

const types = [
  'Flying',
  'Grass',
  'Poison',
  'Fire',
  'Water',
  'Bug',
  'Normal',
  'Electric',
  'Ground',
]

const weaknesses = [
  'Fighting',
  'Electric',
  'Ice',
  'Psychic',
  'Rock',
  'Fire',
  'Flying',
  'Poison',
  'Bug',
  'Water',
  'Grass',
  'Fairy',
]

const POKEMON_MANY = gql`
  query($typeFilter: [String], $weaknessFilter: [String]) {
    pokemonMany(typeFilter: $typeFilter, weaknessFilter: $weaknessFilter) {
      id
      name
      num
      img
    }
  }
`

const TypeFilter = (props: any) => {
  const [typeFilter, setTypeFilter] = useState([])
  const [weaknessFilter, setWeaknessFilter] = useState([])
  const { loading, error, data } = useQuery(POKEMON_MANY, {
    variables: { typeFilter, weaknessFilter },
  })

  const pokemonFilterList:
    | Array<{ id: string; name: string; img: string; num: string }>
    | undefined = data?.pokemonMany

  if (data && !error) {
    props.setFilterResults(pokemonFilterList)
  }

  const handleWeaknessSelection = (event, weakness) => {
    if (event.target.checked) {
      setWeaknessFilter([...weaknessFilter, weakness])
    } else {
      const removeWeakness = weaknessFilter.filter(item => item !== weakness)
      setWeaknessFilter(removeWeakness)
    }
  }

  const handleTypeSelection = (event, type) => {
    if (event.target.checked) {
      setTypeFilter([...typeFilter, type])
    } else {
      const removeTypes = typeFilter.filter(item => item !== type)
      setTypeFilter(removeTypes)
    }
  }

  const generateTypes = () =>
    types.map((type, index) => (
      <li key={index}>
        <label>{type}</label>
        <input
          type="checkbox"
          value={type}
          onClick={event => handleTypeSelection(event, type)}
        />
      </li>
    ))

  const generateWeaknesses = () =>
    weaknesses.map((weakness, index) => (
      <li key={index}>
        <label>{weakness}</label>
        <input
          type="checkbox"
          value={weakness}
          onClick={event => handleWeaknessSelection(event, weakness)}
        />
      </li>
    ))

  return (
    <FilterContainer>
      <h1>Filters:</h1>
      <ChecklistContainer>
        <h3>Type:</h3>
        <ul>{generateTypes()}</ul>
      </ChecklistContainer>
      <ChecklistContainer>
        <h3>Weaknesses:</h3>
        <ul>{generateWeaknesses()}</ul>
      </ChecklistContainer>
    </FilterContainer>
  )
}

export default TypeFilter
