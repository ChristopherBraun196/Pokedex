import { allPokemons, pokemonNamesList, loadOnePokemon } from "../data/data.js";
import { renderPokemonList } from "../components/pokemonCard.js";
import { translate } from "./i18n.js";
import { GERMAN_NAMES } from "../data/germanNames.js";

const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector('[data-id="search-button"]');
const resetSearchBtn = document.querySelector("#resetSearchBtn");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const pokemonList = document.querySelector("#loadPokemon");
const loadError = document.querySelector("#loadError");
const notFound = document.querySelector("#notFound");

export function initSearch() {
  searchInput.addEventListener("keyup", searchPokemon);
  searchBtn.addEventListener("click", searchPokemon);
  resetSearchBtn.addEventListener("click", resetSearch);
}

async function searchPokemon() {
  const query = searchInput.value.toLowerCase();
  loadError.classList.add("hidden");
  notFound.classList.add("hidden");

  updateSearchButtons(query);

  if (query.length < 3) return renderPokemonList(allPokemons, true);

  const matches = findMatches(query);
  if (!matches.length) return renderNoResults(query);

  await renderMatches(matches);
}

function updateSearchButtons(query) {
  searchBtn.disabled = query.length < 3;
  loadMoreBtn.classList.toggle("hidden", query.length >= 3);
  resetSearchBtn.classList.toggle("hidden", query.length < 3);
}

export function resetSearch() {
  searchInput.value = "";
  resetSearchBtn.classList.add("hidden");
  loadMoreBtn.classList.remove("hidden");
  renderPokemonList(allPokemons, true);
  searchBtn.disabled = true;
  loadError.classList.add("hidden");
  notFound.classList.add("hidden");
}

function findMatches(query) {
  return pokemonNamesList
    .filter((entry) => matchesQuery(entry, query))
    .slice(0, 10);
}

function matchesQuery(entry, query) {
  const id = Number(entry.url.split("/").at(-2));
  const germanName = GERMAN_NAMES[id].toLowerCase();
  return entry.name.includes(query) || germanName.includes(query);
}

function renderNoResults(query) {
  pokemonList.innerHTML = "";
  notFound.textContent = `${translate("no-results")} '${query}'.`;
  notFound.classList.remove("hidden");
}

async function renderMatches(matches) {
  try {
    const promises = matches.map((match) => loadOnePokemon(match.url));
    const pokemons = await Promise.all(promises);

    renderPokemonList(pokemons, true);
  } catch (error) {
    console.error(error);
    loadError.classList.remove("hidden");
  }
}
