import { renderPokemonList } from "../components/pokemonCard.js";
import { REGIONS } from "./regions.js";

export const allPokemons = [];
export let pokemonNamesList = [];

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMONS_PER_PAGE = 20;
const MIN_LOADING_TIME = 650;

const pokemonCache = {};
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const loadingSpinner = document.querySelector("#loading-spinner");
const loadError = document.querySelector("#loadError");

let offset = 0;
let currentRegion = REGIONS[0];

export function initData() {
  loadFirstPokemons();
  loadPokemonNames();
  initLoadMoreButton();
}

async function loadFirstPokemons() {
  try {
    await loadNextPokemons();
  } catch (error) {
    loadError.classList.remove("hidden");
  }
}

function initLoadMoreButton() {
  loadMoreBtn.addEventListener("click", handleLoadMoreClick);
}

async function loadPokemonNames() {
  const data = await fetchJson(`${POKEMON_API_URL}?limit=151`);
  pokemonNamesList = data.results;
}

async function loadNextPokemons() {
  const start = currentRegion.first - 1 + offset;
  const data = await fetchJson(
    `${POKEMON_API_URL}?limit=${POKEMONS_PER_PAGE}&offset=${start}`,
  );
  const promises = data.results.map((pokemon) => loadOnePokemon(pokemon.url));

  const newPokemons = await Promise.all(promises);
  allPokemons.push(...newPokemons);

  renderPokemonList(newPokemons, offset === 0);
}

async function handleLoadMoreClick() {
  setLoading(true);
  offset += POKEMONS_PER_PAGE;
  loadError.classList.add("hidden");

  try {
    await Promise.all([loadNextPokemons(), wait(MIN_LOADING_TIME)]);
  } catch (error) {
    offset -= POKEMONS_PER_PAGE;
    loadError.classList.remove("hidden");
  } finally {
    setLoading(false);
  }
}

function setLoading(isLoading) {
  loadingSpinner.classList.toggle("hidden", !isLoading);
  loadMoreBtn.disabled = isLoading;
}

function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export async function loadOnePokemon(pokemonUrl) {
  if (pokemonCache[pokemonUrl]) {
    return pokemonCache[pokemonUrl];
  }

  const fullData = await fetchJson(pokemonUrl);
  const artwork = fullData.sprites.other["official-artwork"].front_default;

  const pokemon = { ...fullData, artwork };
  pokemonCache[pokemonUrl] = pokemon;
  return pokemon;
}

export function loadPokemonById(pokemonId) {
  return loadOnePokemon(`${POKEMON_API_URL}/${pokemonId}/`);
}

export function getPokemonById(pokemonId) {
  return Object.values(pokemonCache).find((p) => p.id === pokemonId);
}

export async function loadEvolutionChain(pokemon) {
  const species = await fetchJson(pokemon.species.url);
  const evolution = await fetchJson(species.evolution_chain.url);

  const ids = getLineIds(evolution.chain, pokemon.id);

  const promises = ids.map((id) => loadPokemonById(id));
  return Promise.all(promises);
}

function getLineIds(chain, pokemonId) {
  const path = findPathTo(chain, pokemonId);
  const ancestors = path.slice(0, -1);
  const ancestorIds = ancestors.map((box) => getIdFromUrl(box.species.url));

  return [...ancestorIds, ...getEvolutionIds(path.at(-1))];
}

function findPathTo(chain, pokemonId) {
  const open = [[chain]];

  while (open.length > 0) {
    const path = open.shift();
    const current = path.at(-1);

    if (getIdFromUrl(current.species.url) === pokemonId) return path;

    open.push(...current.evolves_to.map((next) => [...path, next]));
  }

  return [chain];
}

function getEvolutionIds(chain) {
  const ids = [];
  const open = [chain];

  while (open.length > 0) {
    const current = open.shift();
    ids.push(getIdFromUrl(current.species.url));
    open.push(...current.evolves_to);
  }

  return ids;
}

function getIdFromUrl(url) {
  return Number(url.split("/").at(-2));
}

export function switchRegion(regionName) {
  currentRegion = REGIONS.find((region) => region.name === regionName);
  offset = 0;
  allPokemons.length = 0;

  loadFirstPokemons();
}
