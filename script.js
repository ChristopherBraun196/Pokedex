const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const BASE_IMG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

const LIMIT = 20;
const allPokemons = [];
let pokemonNamesList = [];
let offSet = 0;
let currentPokemonId = null;

async function init() {
  eventListener();
  await preloadAllPokemonNames();
  loadPokemonData();
}

function eventListener() {
  const dialog = document.getElementById("openPokemonDialog");
  document.addEventListener("keydown", switchKey);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
  });
}

async function loadPokemonData() {
  const response = await fetch(`${BASE_URL}?limit=${LIMIT}&offset=${offSet}`);
  const data = await response.json();

  const newPokemons = [];

  for (const pokemon of data.results) {
    const res = await fetch(pokemon.url);
    const fullData = await res.json();
    const artwork = fullData.sprites.other["official-artwork"].front_default;

    const pokemonObj = { ...fullData, artwork };

    allPokemons.push(pokemonObj); // Speicher
    newPokemons.push(pokemonObj); // Neu Rendern
  }

  renderPokemonList(newPokemons, offSet === 0);
}

async function loadMorePokemon() {
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

async function preloadAllPokemonNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  pokemonNamesList = data.results;
}

async function searchPokemon() {
  const query = document.getElementById("search").value.toLowerCase();
  const pokemonList = document.getElementById("loadPokemon");

  if (query.length < 3) {
    renderPokemonList(allPokemons, true);
    return;
  }
  const matches = pokemonNamesList
    .filter((p) => p.name.includes(query))
    .slice(0, 10);

  if (matches.length === 0) {
    pokemonList.innerHTML = `<div class="no-found">No Pokémon found matching '${query}'.</div>`;
    return;
  }

  pokemonList.innerHTML = "";

  for (const match of matches) {
    let pokemonData = allPokemons.find((p) => p.name === match.name);

    if (!pokemonData) {
      const res = await fetch(match.url);
      const data = await res.json();
      const artwork = data.sprites.other["official-artwork"].front_default;
      pokemonData = { ...data, artwork };
    }

    pokemonList.innerHTML += PokedexCard(pokemonData);
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
  const pokemon = allPokemons.find((p) => p.id === pokemonId);

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
