import { GetPokemonsQuery } from '../src/generated/graphql';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Image from 'next/image';
import { useState } from 'react';

const GET_POKEMONS = gql`
  query GetPokemons($limit: Int, $offset: Int) {
    pokemons(limit: $limit, offset: $offset) {
      id
      name
      image
    }
  }
`;

const PokemonsPage = () => {
  const [offset, setOffset] = useState(0);
  const [offsetStack, setOffsetStack] = useState([0]);
  const { loading, error, data } = useQuery<GetPokemonsQuery>(GET_POKEMONS, {
    variables: { limit: 30, offset: offset },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Check if data is present and contains pokemons
  if (!data || !data.pokemons) {
    return <p>No Pokemon available</p>;
  }

  const pokemonRows = [];
  for (let i = 0; i < data?.pokemons.length; i += 3) {
    pokemonRows.push(data?.pokemons.slice(i, i + 3));
  }

  return (
    <>
      <div style={{ width: '100%' }}>
        <h1 className="pokemonListTitle">Pokémon List</h1>
        {pokemonRows.map((pokemonRow, rowIndex) => (
          <div key={rowIndex} className="pokemonCardContainer">
            {pokemonRow.map((pokemon) => (
              <div key={pokemon.id} className="pokemonCard">
                <h2 className="pokemonName">{pokemon.name}</h2>
                <div className="pokemonImageContainer">
                  <Image
                    src={pokemon.image}
                    alt={pokemon.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
            ))}
          </div>
        ))}
        <button
          onClick={() => {
            if (offsetStack.length > 1) {
              // to avoid going back from the first page
              const newOffsetStack = [...offsetStack];
              newOffsetStack.pop(); // remove the current offset from the stack
              setOffsetStack(newOffsetStack);
              setOffset(newOffsetStack[newOffsetStack.length - 1]); // set the offset to the previous value
            }
          }}
        >
          Prev
        </button>
        <button
          onClick={() => {
            setOffsetStack([...offsetStack, offset + 30]); // add the new offset to the stack
            setOffset(offset + 30);
          }}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default PokemonsPage;
