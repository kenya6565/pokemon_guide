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
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {data?.pokemons.map((pokemon) => (
         <div key={pokemon.id}>
         <h2>{pokemon.name}</h2>
         <Image src={pokemon.image} alt={pokemon.name} width={100} height={100}/>
     </div>
        ))}
      </ul>
    </div>
  );
};

export default PokemonsPage;
