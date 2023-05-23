import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Pokémon Pokedex</h1>
      <Link href="/pokemons">View Pokémon List</Link>
    </div>
  );
};

export default HomePage;
