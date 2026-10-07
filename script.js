const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const BASE_IMG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

const LIMIT = 20;
const allPokemons = [];
let pokemonNamesList = [];
let offSet = 0;
let currentPokemonId = null;

function eventListener() {
  const dialog = document.getElementById("openPokemonDialog");
  document.addEventListener("keydown", switchKey);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

async function searchPokemon() {
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

function resetSearch() {
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

function renderPokemonList(pokemons, clear = false) {
  const pokemonLists = document.getElementById("loadPokemon");

  if (clear) pokemonLists.innerHTML = "";

  for (let i = 0; i < pokemons.length; i++) {
    pokemonLists.innerHTML += PokedexCard(pokemons[i]);
  }
}

function openPokemonDialog(pokemonId) {
  const dialogRef = document.getElementById("openPokemonDialog");
  const pokemon = allPokemons.find((p) => p.id == pokemonId);

  currentPokemonId = pokemonId;

  dialogRef.innerHTML = BigPokedexCard(pokemon);
  dialogRef.showModal();
}

function closeDialogClick() {
  document.getElementById("openPokemonDialog").close();
}

function nextPokemon(currentId) {
  const index = allPokemons.findIndex((p) => p.id === currentId);
  let nextIndex = index + 1;

  if (nextIndex >= allPokemons.length) {
    nextIndex = 0;
  }

  const nextId = allPokemons[nextIndex].id;
  openPokemonDialog(nextId);
}

function lastPokemon(currentId) {
  const index = allPokemons.findIndex((p) => p.id === currentId);
  let prevIndex = index - 1;

  if (prevIndex < 0) {
    prevIndex = allPokemons.length - 1;
  }

  const prevId = allPokemons[prevIndex].id;
  openPokemonDialog(prevId);
}

function switchKey(event) {
  if (event.key === "ArrowLeft") {
    lastPokemon(currentPokemonId);
  }
  if (event.key === "ArrowRight") {
    nextPokemon(currentPokemonId);
  }
}
