import { REGIONS } from "../data/regions.js";

const regionNav = document.querySelector("#regionNav");

export function initRegions() {
  regionNav.innerHTML = REGIONS.map((region) =>
    createRegionButtonHtml(region),
  ).join("");
}

function createRegionButtonHtml(region) {
  return `

  <button class="regionBtn" data-region="${region.name}">${region.name}</button>
  `;
}
