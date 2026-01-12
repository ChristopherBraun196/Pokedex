const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const BASE_IMG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

const LIMIT = 20;
const allPokemons = [];

let offSet = 0;

function init() {
  loadPokemonData();
}

async function loadPokemonData() {
  const response = await fetch(`${BASE_URL}?limit=${LIMIT}&offset=${offSet}`);
  const data = await response.json();
 
  const newPokemons = [];

  for (const pokemon of data.results) {
    const res = await fetch(pokemon.url);
    const fullData = await res.json();
    const artwork = fullData.sprites.other["official-artwork"].front_default;

    const pokemonObj = {...fullData, artwork };

  allPokemons.push(pokemonObj); // Speicher
  newPokemons.push(pokemonObj); // Neu Rendern
  }
  
  renderPokemonList(newPokemons, offSet === 0);
}

function renderPokemonList(pokemons, clear = false) {
  const pokemonLists = document.getElementById("loadPokemon"); 
  
  if (clear) pokemonLists.innerHTML = "";
  
  for (let i = 0; i < pokemons.length; i++) {
    pokemonLists.innerHTML += PokedexCard(pokemons[i]);
 
    
  }
  
}

function loadMorePokemon() {
  offSet += LIMIT;
  loadPokemonData();
}

// function openPokemonDialog(){

// }