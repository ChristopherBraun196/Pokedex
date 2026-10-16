import { REGIONS } from "../data/regions.js";
import { switchRegion } from "../data/data.js";
import { resetSearch } from "./search.js";
import { resetView } from "./favorites.js";

const regionNav = document.querySelector("#regionNav");
const regions = document.querySelector(".regions");
const regionToggle = document.querySelector("#regionToggle");
const regionCurrent = document.querySelector("#regionCurrent");

export function initRegions() {
  regionNav.innerHTML = REGIONS.map((region) =>
    createRegionButtonHtml(region),
  ).join("");
  regionNav.addEventListener("click", handleRegionClick);
  regionToggle.addEventListener("click", toggleRegionMenu);
}

function handleRegionClick(event) {
  const button = event.target.closest(".regions__button");

  if (!button) return;
  resetSearch();
  resetView();

  switchRegion(button.dataset.region);
  markActiveRegion(button);
  regionCurrent.textContent = button.dataset.region;
  setRegionMenuOpen(false);
}

function markActiveRegion(activeButton) {
  const buttons = regionNav.querySelectorAll(".regions__button");

  buttons.forEach((button) =>
    button.setAttribute("aria-pressed", button === activeButton),
  );
}

function createRegionButtonHtml(region) {
  return `
   <button class="regions__button" data-region="${region.name}" aria-pressed="${region === REGIONS[0]}" >${region.name} </button>

  `;
}

function setRegionMenuOpen(isOpen) {
  regions.classList.toggle("regions--open", isOpen);
  regionToggle.setAttribute("aria-expanded", isOpen);
}

function toggleRegionMenu() {
  const isOpen = regions.classList.contains("regions--open");
  setRegionMenuOpen(!isOpen);
}
