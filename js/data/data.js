import { renderPokemonList } from "../components/pokemonCard.js";

const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

const LIMIT = 20;
export const allPokemons = [];
let pokemonNamesList = [];
let offSet = 0;

export async function loadPokemonData() {
  const response = await fetch(`${BASE_URL}?limit=${LIMIT}&offset=${offSet}`);
  const data = await response.json();
  const promises = data.results.map((pokemon) => loadOnePokemon(pokemon.url));

  const newPokemons = await Promise.all(promises);
  allPokemons.push(...newPokemons);

  renderPokemonList(newPokemons, offSet === 0);
}

async function loadOnePokemon(url) {
  const response = await fetch(url);
  const fullData = await response.json();
  const artwork = fullData.sprites.other["official-artwork"].front_default;

  return { ...fullData, artwork };
}

export async function loadMorePokemon() {
  const spinner = document.getElementById("loading-spinner");
  const loadBtn = document.getElementById("loadMoreBtn");
  spinner.classList.remove("hidden");
  loadBtn.disable = true;
  offSet += LIMIT;
  await Promise.all([
    loadPokemonData(),
    new Promise((resolve) => setTimeout(resolve, 650)),
  ]);

  spinner.classList.add("hidden");
  loadBtn.disabled = false;
}

export async function preloadAllPokemonNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  pokemonNamesList = data.results;
}
