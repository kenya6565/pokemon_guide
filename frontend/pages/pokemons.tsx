import { GetPokemonsQuery } from '../src/generated/graphql';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
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
  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#4B5563',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s',
  };

  // style when hovering over
  const hoveredButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6B7280',
  };

  const [offset, setOffset] = useState(0);
  const [offsetStack, setOffsetStack] = useState([0]);
  const [isPrevButtonHovered, setIsPrevButtonHovered] = useState(false);
  const [isNextButtonHovered, setIsNextButtonHovered] = useState(false);
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
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Link href="/" legacyBehavior>
            <a style={{ color: '#fff', fontSize: '20px' }}>Pokémon Pokedex</a>
          </Link>
        </div>
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
                    sizes="(max-width: 600px) 30vw, (max-width: 900px) 50vw, 100vw"
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
            style={isPrevButtonHovered ? hoveredButtonStyle : buttonStyle}
            onClick={() => {
              if (offsetStack.length > 1) {
                const newOffsetStack = [...offsetStack];
                // offsetStack.pop();でもいいがコピーを作ってそれに対して処理をすることで安全性の確保をする
                newOffsetStack.pop();
                setOffsetStack(newOffsetStack);
                setOffset(newOffsetStack[newOffsetStack.length - 1]);
              }
            }}
            onMouseEnter={() => setIsPrevButtonHovered(true)}
            onMouseLeave={() => setIsPrevButtonHovered(false)}
          >
            Prev
          </button>
          <button
            style={isNextButtonHovered ? hoveredButtonStyle : buttonStyle}
            onClick={() => {
              // [0, 30, 60, 90]
              setOffsetStack([...offsetStack, offset + 30]);
              setOffset(offset + 30);
            }}
            onMouseEnter={() => setIsNextButtonHovered(true)}
            onMouseLeave={() => setIsNextButtonHovered(false)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default PokemonsPage;
