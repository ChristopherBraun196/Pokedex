import {
  preloadAllPokemonNames,
  loadPokemonData,
  loadMorePokemon,
} from "./data/data.js";
import { searchPokemon, resetSearch } from "./features/search.js";

async function init() {
  eventListener();
  await preloadAllPokemonNames();
  loadPokemonData();

  document
    .querySelector("#loadMoreBtn")
    .addEventListener("click", loadMorePokemon);

  document.querySelector("#search").addEventListener("keyup", searchPokemon);

  document
    .querySelector("#resetSearchBtn")
    .addEventListener("click", resetSearch);
}

init();
