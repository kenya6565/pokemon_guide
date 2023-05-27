import Link from 'next/link';
import Image from 'next/image';

const HomePage = () => {
  return (
    <div
      style={{
        textAlign: 'center',
        background: '#000000',
        height: '100vh',
        padding: '50px 0',
      }}
    >
      <h1
        style={{
          marginBottom: '30px',
          color: '#FFFFFF',
          fontSize: '3rem',
          fontWeight: 'bold',
        }}
      >
        Welcome to the Pokémon Pokedex
      </h1>
      <p
        style={{ fontSize: '1.25rem', marginBottom: '30px', color: '#FFFFFF' }}
      >
        Explore the amazing world of Pokémon with our interactive Pokédex. Click
        the button below to start!
      </p>
      {/* <div style={{ margin: '0 auto', width: '200px', height: '200px' }}>
        <Image
          src="/path/to/pokemon/image.png" // replace with your own image path
          alt="Pokemon"
          layout="fill"
          objectFit="contain"
        />
      </div> */}
      <Link href="/pokemons" passHref>
        <div
          style={{
            display: 'inline-block',
            marginTop: '30px',
            padding: '10px 20px',
            backgroundColor: '#FFFFFF',
            color: '#000000',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          View Pokémon List
        </div>
      </Link>
    </div>
  );
};

export default HomePage;
