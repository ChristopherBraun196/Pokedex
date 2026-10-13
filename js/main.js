import { initData } from "./data/data.js";
import { initSearch } from "./features/search.js";
import { initDialog } from "./components/dialog.js";
import { initFavorites } from "./features/favorites.js";
import { initTheme } from "./features/theme.js";

function init() {
  initData();
  initDialog();
  initSearch();
  initFavorites();
  initTheme();
}

document.addEventListener("DOMContentLoaded", init);
