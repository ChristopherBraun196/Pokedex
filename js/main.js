import { initData } from "./data/data.js";
import { initSearch } from "./features/search.js";
import { initDialog } from "./components/dialog.js";

function init() {
  initData();
  initDialog();
  initSearch();
}

document.addEventListener("DOMContentLoaded", init);
