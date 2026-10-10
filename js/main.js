import {
  preloadAllPokemonNames,
  loadPokemonData,
  loadMorePokemon,
} from "./data/data.js";
import { searchPokemon, resetSearch } from "./features/search.js";
import { initDialog } from "./components/dialog.js";

async function init() {
  initDialog();
  await preloadAllPokemonNames();
  loadPokemonData();

  document
    .querySelector("#loadMoreBtn")
    .addEventListener("click", loadMorePokemon);

  document.querySelector("#search").addEventListener("keyup", searchPokemon);

  document
    .querySelector("#resetSearchBtn")
    .addEventListener("click", resetSearch);

  document
    .querySelector('[data-id="search-button"]')
    .addEventListener("click", searchPokemon);
}

init();
