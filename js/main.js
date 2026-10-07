import {
  preloadAllPokemonNames,
  loadPokemonData,
  loadMorePokemon,
} from "./data/data.js";

async function init() {
  eventListener();
  await preloadAllPokemonNames();
  loadPokemonData();

  document
    .querySelector("#loadMoreBtn")
    .addEventListener("click", loadMorePokemon);
}

init();
