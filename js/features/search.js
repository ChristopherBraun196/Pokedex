export async function searchPokemon() {
  const query = searchQuery();
  const list = getPokemonListElement();
  const btn = document.getElementById("loadMoreBtn");
  const resetBtn = document.getElementById("resetSearchBtn");

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
}

function searchQuery() {
  return document.getElementById("search").value.toLowerCase();
}

function getPokemonListElement() {
  return document.getElementById("loadPokemon");
}

function findMatches(query) {
  return allPokemons.filter((p) => p.name.includes(query)).slice(0, 10);
}

function renderNoResults(query, list) {
  list.innerHTML = `<div class="no-found">No Pokémon found matching '${query}'.</div>`;
}

async function renderMatches(matches, list) {
  for (const match of matches) {
    list.innerHTML += PokedexCard(match);
  }
}
