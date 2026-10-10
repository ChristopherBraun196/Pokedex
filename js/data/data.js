import { renderPokemonList } from "../components/pokemonCard.js";

export const allPokemons = [];
export let pokemonNamesList = [];

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMONS_PER_PAGE = 20;

const pokemonCache = {};
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const loadingSpinner = document.querySelector("#loading-spinner");

let offset = 0;

export function initData() {
  loadPokemonNames();
  loadNextPokemons();

  initLoadMoreButton();
}

function initLoadMoreButton() {
  loadMoreBtn.addEventListener("click", handleLoadMoreClick);
}

async function loadPokemonNames() {
  const response = await fetch(`${POKEMON_API_URL}?limit=151`);
  const data = await response.json();
  pokemonNamesList = data.results;
}

async function loadNextPokemons() {
  const response = await fetch(
    `${POKEMON_API_URL}?limit=${POKEMONS_PER_PAGE}&offset=${offset}`,
  );
  const data = await response.json();
  const promises = data.results.map((pokemon) => loadOnePokemon(pokemon.url));

  const newPokemons = await Promise.all(promises);
  allPokemons.push(...newPokemons);

  renderPokemonList(newPokemons, offset === 0);
}

async function handleLoadMoreClick() {
  loadingSpinner.classList.remove("hidden");
  loadMoreBtn.disabled = true;
  offset += POKEMONS_PER_PAGE;
  await Promise.all([
    loadNextPokemons(),
    new Promise((resolve) => setTimeout(resolve, 650)),
  ]);

  loadingSpinner.classList.add("hidden");
  loadMoreBtn.disabled = false;
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
