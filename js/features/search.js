import { allPokemons, pokemonNamesList, loadOnePokemon } from "../data/data.js";
import { renderPokemonList, PokedexCard } from "../components/pokemonCard.js";

export async function searchPokemon() {
  const query = searchQuery();
  const list = getPokemonListElement();
  const btn = document.getElementById("loadMoreBtn");
  const resetBtn = document.getElementById("resetSearchBtn");

  const searchBtn = document.querySelector('[data-id="search-button"]');
  searchBtn.disabled = query.length < 3;

  btn.classList.toggle("hidden", query.length >= 3);
  resetBtn.classList.toggle("hidden", query.length < 3);

  if (query.length < 3) return renderPokemonList(allPokemons, true);

  const matches = findMatches(query);
  if (!matches.length) return renderNoResults(query, list);

  list.innerHTML = "";
  await renderMatches(matches, list);
}

export function resetSearch() {
  document.getElementById("search").value = "";
  document.getElementById("resetSearchBtn").classList.add("hidden");
  document.getElementById("loadMoreBtn").classList.remove("hidden");
  renderPokemonList(allPokemons, true);
  document.querySelector('[data-id="search-button"]').disabled = true;
}

function searchQuery() {
  return document.getElementById("search").value.toLowerCase();
}

function getPokemonListElement() {
  return document.getElementById("loadPokemon");
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
    list.innerHTML += PokedexCard(pokemon);
  }
}
