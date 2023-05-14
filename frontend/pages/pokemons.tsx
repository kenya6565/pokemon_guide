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

  return (
    <div>
      <h1>Pokémon List</h1>
      <ul>
        {data?.pokemons.map((pokemon) => (
         <div key={pokemon.id}>
         <h2>{pokemon.name}</h2>
         <Image src={pokemon.image} alt={pokemon.name} width={10} height={10} layout="responsive"/>
     </div>
        ))}
      </ul>
    </div>
  );
};

export default PokemonsPage;
