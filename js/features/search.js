import { allPokemons, pokemonNamesList, loadOnePokemon } from "../data/data.js";
import {
  renderPokemonList,
  createCardHtml,
} from "../components/pokemonCard.js";

const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector('[data-id="search-button"]');
const resetSearchBtn = document.querySelector("#resetSearchBtn");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const pokemonList = document.querySelector("#loadPokemon");

export function initSearch() {
  searchInput.addEventListener("keyup", searchPokemon);
  searchBtn.addEventListener("click", searchPokemon);
  resetSearchBtn.addEventListener("click", resetSearch);
}

async function searchPokemon() {
  const query = searchInput.value.toLowerCase();

  updateSearchButtons(query);

  if (query.length < 3) return renderPokemonList(allPokemons, true);

  const matches = findMatches(query);
  if (!matches.length) return renderNoResults(query, pokemonList);

  pokemonList.innerHTML = "";
  await renderMatches(matches, pokemonList);
}

function updateSearchButtons(query) {
  searchBtn.disabled = query.length < 3;
  loadMoreBtn.classList.toggle("hidden", query.length >= 3);
  resetSearchBtn.classList.toggle("hidden", query.length < 3);
}

function resetSearch() {
  searchInput.value = "";
  resetSearchBtn.classList.add("hidden");
  loadMoreBtn.classList.remove("hidden");
  renderPokemonList(allPokemons, true);
  searchBtn.disabled = true;
}

function findMatches(query) {
  return pokemonNamesList.filter((p) => p.name.includes(query)).slice(0, 10);
}

function renderNoResults(query, list) {
  list.innerHTML = `<div class="no-found">No Pokémon found matching '${query}'.</div>`;
}

async function renderMatches(matches, list) {
  const promises = matches.map((match) => loadOnePokemon(match.url));
  const pokemons = await Promise.all(promises);

  for (const pokemon of pokemons) {
    list.innerHTML += createCardHtml(pokemon);
  }
}
