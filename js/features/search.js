import { allPokemons, pokemonNamesList, loadOnePokemon } from "../data/data.js";
import { renderPokemonList } from "../components/pokemonCard.js";

const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector('[data-id="search-button"]');
const resetSearchBtn = document.querySelector("#resetSearchBtn");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const pokemonList = document.querySelector("#loadPokemon");
const loadError = document.querySelector("#loadError");

export function initSearch() {
  searchInput.addEventListener("keyup", searchPokemon);
  searchBtn.addEventListener("click", searchPokemon);
  resetSearchBtn.addEventListener("click", resetSearch);
}

async function searchPokemon() {
  const query = searchInput.value.toLowerCase();
  loadError.classList.add("hidden");

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

function resetSearch() {
  searchInput.value = "";
  resetSearchBtn.classList.add("hidden");
  loadMoreBtn.classList.remove("hidden");
  renderPokemonList(allPokemons, true);
  searchBtn.disabled = true;
  loadError.classList.add("hidden");
}

function findMatches(query) {
  return pokemonNamesList.filter((p) => p.name.includes(query)).slice(0, 10);
}

function renderNoResults(query) {
  const message = document.createElement("p");
  message.className = "no-found";
  message.dataset.id = "not-found";
  message.textContent = `No Pokémon found matching '${query}'.`;
  pokemonList.replaceChildren(message);
}

async function renderMatches(matches) {
  try {
    const promises = matches.map((match) => loadOnePokemon(match.url));
    const pokemons = await Promise.all(promises);

    renderPokemonList(pokemons, true);
  } catch (error) {
    loadError.classList.remove("hidden");
  }
}
