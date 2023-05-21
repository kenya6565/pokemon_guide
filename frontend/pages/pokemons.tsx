import { GetPokemonsQuery } from '../src/generated/graphql';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import Image from 'next/image';


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
  const { loading, error, data } = useQuery<GetPokemonsQuery>(GET_POKEMONS, {
    variables: { limit: 20, offset: 0 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

   // Check if data is present and contains pokemons
   if (!data || !data.pokemons) {
    return <p>No Pokemon available</p>
  }

  const pokemonRows = [];
  for (let i = 0; i < data?.pokemons.length; i += 3) {
    pokemonRows.push(data?.pokemons.slice(i, i + 3));
  }

  return (
    <div style={{width: "100%"}}>
    <h1 style={{textAlign: "center", fontSize: "3rem", fontWeight: "bold", marginBottom: "2rem", color: "black"}}>Pokémon List</h1>
    {pokemonRows.map((pokemonRow, rowIndex) => (
      <div key={rowIndex} style={{display: "flex", justifyContent: "space-around", marginBottom: "1rem"}}>
        {pokemonRow.map((pokemon) => (
          <div key={pokemon.id} style={{display: "flex", flexDirection: "column", alignItems: "center", padding: "1rem", background: "#fff", borderRadius: "12px", boxShadow: "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)", transition: "transform 0.3s ease-in-out"}}
               onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <h2 style={{fontSize: "1.2rem", fontWeight: "600", marginBottom: "1rem", color: "black"}}>{pokemon.name}</h2>
            <div style={{width: "100px", height: "100px", position: "relative"}}>
              <Image src={pokemon.image} alt={pokemon.name} layout="fill" objectFit="contain"/>
            </div>
          </div>
        ))}
      </div>
    ))}
  </div>
  );
};

export default PokemonsPage;
