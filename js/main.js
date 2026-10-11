import { initData } from "./data/data.js";
import { initSearch } from "./features/search.js";
import { initDialog } from "./components/dialog.js";
import { initFavorites } from "./features/favorites.js";

function init() {
  initData();
  initDialog();
  initSearch();
  initFavorites();
}

document.addEventListener("DOMContentLoaded", init);
