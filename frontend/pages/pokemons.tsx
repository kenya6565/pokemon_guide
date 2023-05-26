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

  if (loading) return <p>ポケモン取得中...</p>;
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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#4B5563',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              if (offsetStack.length > 1) {
                const newOffsetStack = [...offsetStack];
                newOffsetStack.pop();
                setOffsetStack(newOffsetStack);
                setOffset(newOffsetStack[newOffsetStack.length - 1]);
              }
            }}
          >
            Prev
          </button>
          <button
            style={{
              padding: '10px 20px',
              backgroundColor: '#4B5563',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={() => {
              setOffsetStack([...offsetStack, offset + 30]);
              setOffset(offset + 30);
            }}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PokemonsPage;
