const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const BASE_IMG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";
const LIMIT = 20;

let offSet = 0;

function init() {
  loadPokemonData();
}

async function loadPokemonData() {
  const response = await fetch(`${BASE_URL}?limit=${LIMIT}&offset=${offSet}`);
  const data = await response.json();
  const fullPokemons = [];

  for (const pokemon of data.results) {
    const res = await fetch(pokemon.url);
    const fullData = await res.json();
    const artwork = fullData.sprites.other["official-artwork"].front_default;
    fullPokemons.push({ ...fullData, artwork: artwork });
  }
<<<<<<< HEAD
=======
  console.log(fullPokemons);
>>>>>>> 4b7acadc585d6a52aad077726248fd7b2a8350ed
  renderPokemonList(fullPokemons, offSet === 0);
}

function renderPokemonList(pokemons, clear = false) {
  const pokemonLists = document.getElementById("loadPokemon");
<<<<<<< HEAD
 
  
  if (clear) pokemonLists.innerHTML = "";
=======

  if (clear) pokemonLists.innerHTML = "";

>>>>>>> 4b7acadc585d6a52aad077726248fd7b2a8350ed
  for (let i = 0; i < pokemons.length; i++) {
    pokemonLists.innerHTML += PokedexCard(pokemons[i]);
 
    
  }
  
}

function loadMorePokemon() {
  offSet += LIMIT;
  loadPokemonData();
}

function loadMorePokemon() {
  offSet += LIMIT;
  loadPokemonData();
}

// function openPokemonDialog(){

// }