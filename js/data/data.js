import { renderPokemonList } from "../components/pokemonCard.js";

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";

const pokemonCache = {};

const LIMIT = 20;
export const allPokemons = [];
export let pokemonNamesList = [];
let offSet = 0;

export async function loadPokemonData() {
  const response = await fetch(
    `${POKEMON_API_URL}?limit=${LIMIT}&offset=${offSet}`,
  );
  const data = await response.json();
  const promises = data.results.map((pokemon) => loadOnePokemon(pokemon.url));

  const newPokemons = await Promise.all(promises);
  allPokemons.push(...newPokemons);

  renderPokemonList(newPokemons, offSet === 0);
}

export async function loadOnePokemon(pokemonUrl) {
  if (pokemonCache[pokemonUrl]) {
    return pokemonCache[pokemonUrl];
  }

  const response = await fetch(pokemonUrl);
  const fullData = await response.json();
  const artwork = fullData.sprites.other["official-artwork"].front_default;

  const pokemon = { ...fullData, artwork };
  pokemonCache[pokemonUrl] = pokemon;
  return pokemon;
}

export function getPokemonById(pokemonId) {
  return Object.values(pokemonCache).find((p) => p.id === pokemonId);
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
