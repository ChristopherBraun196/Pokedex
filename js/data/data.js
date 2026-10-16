import { renderPokemonList } from "../components/pokemonCard.js";
import { REGIONS } from "./regions.js";

export const allPokemons = [];
export let pokemonNamesList = [];

const POKEMON_API_URL = "https://pokeapi.co/api/v2/pokemon";
const POKEMONS_PER_PAGE = 20;
const MIN_LOADING_TIME = 1200;

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
    const newPokemons = await loadNextPokemons();
    showPokemons(newPokemons);
  } catch (error) {
    console.error(error);
    loadError.classList.remove("hidden");
  }
}

function initLoadMoreButton() {
  loadMoreBtn.addEventListener("click", handleLoadMoreClick);
}

async function loadPokemonNames() {
  const data = await fetchJson(
    `${POKEMON_API_URL}?limit=${getRegionSize()}&offset=${currentRegion.first - 1}`,
  );
  pokemonNamesList = data.results;
}

async function loadNextPokemons() {
  const limit = Math.min(POKEMONS_PER_PAGE, getRegionSize() - offset);
  const start = currentRegion.first - 1 + offset;
  const data = await fetchJson(
    `${POKEMON_API_URL}?limit=${limit}&offset=${start}`,
  );
  const promises = data.results.map((pokemon) => loadOnePokemon(pokemon.url));

  const newPokemons = await Promise.all(promises);
  return newPokemons;
}

function showPokemons(newPokemons) {
  allPokemons.push(...newPokemons);

  renderPokemonList(newPokemons, offset === 0);
  loadMoreBtn.classList.toggle("hidden", allPokemons.length >= getRegionSize());
}

async function handleLoadMoreClick() {
  setLoading(true);
  offset += POKEMONS_PER_PAGE;
  loadError.classList.add("hidden");

  try {
    const [newPokemons] = await Promise.all([
      loadNextPokemons(),
      wait(MIN_LOADING_TIME),
    ]);
    showPokemons(newPokemons);
  } catch (error) {
    console.error(error);
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
  const line = getLine(evolution.chain, pokemon.id);

  const main = await loadStages(line.main);
  const branches = await Promise.all(
    line.branches.map((boxes) => loadStages(boxes)),
  );
  return { main, branches };
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

function getIdFromUrl(url) {
  return Number(url.split("/").at(-2));
}

function getLine(chain, pokemonId) {
  const main = findPathTo(chain, pokemonId);
  let current = main.at(-1);

  while (current.evolves_to.length === 1) {
    current = current.evolves_to[0];
    main.push(current);
  }

  const branches = current.evolves_to.map((box) => getStraightLine(box));
  return { main, branches };
}

function getStraightLine(box) {
  const boxes = [box];

  while (boxes.at(-1).evolves_to.length > 0) {
    boxes.push(boxes.at(-1).evolves_to[0]);
  }
  return boxes;
}

function loadStages(boxes) {
  return Promise.all(boxes.map((box) => loadStage(box)));
}

async function loadStage(box) {
  const pokemon = await loadPokemonById(getIdFromUrl(box.species.url));
  return { ...pokemon, trigger: getTrigger(box) };
}

function getTrigger(box) {
  const details = box.evolution_details;
  const first = details[0];

  return {
    level: first?.min_level ?? null,
    item: details.find((detail) => detail.item)?.item.name ?? null,
    friendship: details.some(
      (detail) => detail.min_happiness || detail.min_affection,
    ),
    time: first?.time_of_day || null,
    trade: first?.trigger.name === "trade",
  };
}

export function switchRegion(regionName) {
  currentRegion = REGIONS.find((region) => region.name === regionName);
  offset = 0;
  allPokemons.length = 0;

  loadFirstPokemons();
  loadPokemonNames();
}

function getRegionSize() {
  return currentRegion.last - currentRegion.first + 1;
}
