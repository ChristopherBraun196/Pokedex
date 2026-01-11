const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20"
const BASE_IMG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";


function init() {
  loadPokemonData();
}

async function loadPokemonData() {
  const response = await fetch(BASE_URL);
  const data = await response.json();

  const fullPokemons = [];

  for (const pokemon of data.results) {
    const res = await fetch(pokemon.url);
    const fullData = await res.json();
    const artwork = fullData.sprites.other["official-artwork"].front_default;
    fullPokemons.push({...fullData,artwork: artwork}
    );
  }
  console.log(fullPokemons);
  renderPokemonList(fullPokemons);
}

function renderPokemonList(pokemons) {
  const pokemonLists = document.getElementById("loadPokemon");
  pokemonLists.innerHTML = "";

  for (let i = 0; i < pokemons.length; i++) {
    pokemonLists.innerHTML += PokedexCard(pokemons[i]);
  }
}
