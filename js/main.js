import { initData } from "./data/data.js";
import { initSearch } from "./features/search.js";
import { initDialog } from "./components/dialog.js";
import { initFavorites } from "./features/favorites.js";
import { initTheme } from "./features/theme.js";
import { initRegions } from "./features/regions.js";
import { initLanguage } from "./features/i18n.js";

function init() {
  initLanguage();
  initData();
  initDialog();
  initSearch();
  initFavorites();
  initTheme();
  initRegions();
}

document.addEventListener("DOMContentLoaded", init);
