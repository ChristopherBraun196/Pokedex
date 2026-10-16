import { REGIONS } from "../data/regions.js";
import { switchRegion } from "../data/data.js";
import { resetSearch } from "./search.js";

const regionNav = document.querySelector("#regionNav");

export function initRegions() {
  regionNav.innerHTML = REGIONS.map((region) =>
    createRegionButtonHtml(region),
  ).join("");
  regionNav.addEventListener("click", handleRegionClick);
}

function handleRegionClick(event) {
  const button = event.target.closest(".regionBtn");
  if (!button) return;
  resetSearch();
  switchRegion(button.dataset.region);
}

function createRegionButtonHtml(region) {
  return `
    <button class="regionBtn" data-region="${region.name}">${region.name}</button>
  `;
}
