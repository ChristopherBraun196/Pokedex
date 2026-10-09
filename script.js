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
