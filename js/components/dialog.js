import { getPokemonById, loadEvolutionChain } from "../data/data.js";
import { translate, getPokemonName } from "../features/i18n.js";

const dialog = document.querySelector("#openPokemonDialog");
const pokemonList = document.querySelector("#loadPokemon");

let currentPokemonId = null;

export function initDialog() {
  document.addEventListener("keydown", handleArrowKeys);
  dialog.addEventListener("click", handleDialogClick);
  pokemonList.addEventListener("click", handleCardClick);
}

function handleArrowKeys(event) {
  if (!dialog.open) return;
  if (event.key === "ArrowLeft") showNeighbor(-1);
  if (event.key === "ArrowRight") showNeighbor(1);
}

function handleDialogClick(event) {
  if (event.target === dialog) dialog.close();
  if (event.target.closest(".closeBtn")) closeDialog();
  if (event.target.closest(".prevBtn")) showNeighbor(-1);
  if (event.target.closest(".nextBtn")) showNeighbor(1);
}

function handleCardClick(event) {
  const card = event.target.closest(".pokeCards");
  if (!card) return;
  openPokemonDialog(Number(card.dataset.pokemonId));
}

function openPokemonDialog(pokemonId) {
  const pokemon = getPokemonById(pokemonId);

  currentPokemonId = pokemonId;

  dialog.innerHTML = createDialogHtml(pokemon);
  dialog.showModal();
  renderEvolution(pokemon);
}

async function renderEvolution(pokemon) {
  const container = dialog.querySelector(".evolutionChain");

  try {
    const evolutions = await loadEvolutionChain(pokemon);

    container.innerHTML = createEvolutionListHtml(evolutions);
  } catch (error) {
    console.error(error);
    container.textContent = translate("evolution-error");
  }
}

function closeDialog() {
  dialog.close();
}

function getShownPokemonIds() {
  const cards = pokemonList.querySelectorAll(".pokeCards");
  return [...cards].map((card) => Number(card.dataset.pokemonId));
}

function showNeighbor(step) {
  const ids = getShownPokemonIds();
  const index = ids.indexOf(currentPokemonId);
  let newIndex = index + step;

  if (newIndex >= ids.length) newIndex = 0;
  if (newIndex < 0) newIndex = ids.length - 1;

  openPokemonDialog(ids[newIndex]);
}

function createDialogHtml(pokemon) {
  return `
    <div data-id="overlay-pokemon-name" class="bigCardContainer">
        <div class="bigCardHeader ${pokemon.types[0].type.name}">
        <div class="NameNumber">
         <p class="PokeNumber">#${pokemon.id}</p>
              <h3>${getPokemonName(pokemon)}</h3>  
              </div>
                <button data-id="close-dialog-button" class="closeBtn" aria-label="Close dialog">&#10761;</button>
                <button data-id="prev-button" class="prevBtn" aria-label="Previous Pokémon">&#8592;</button>
                <button data-id="next-button" class="nextBtn" aria-label="Next Pokémon">&#8594;</button>

            <img data-id="dialog-image" class="bigPokemonImage" src="${pokemon.artwork}" alt="${pokemon.name}">             
        </div>
        
        <div class="bigCardBody">
            <div class="pokemonStats">
  <h4>${translate("base-stats")}</h4>
  ${pokemon.stats
    .map(
      (stat) => `
    <div class="stat-row">
      <span class="stat-label">${translate(stat.stat.name)}</span>
      <span class="stat-value">${stat.base_stat}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${(stat.base_stat / 150) * 100}%"></div>
      </div>

    </div>
  `,
    )
    .join("")}
</div>
      <h4>${translate("evolution")}</h4>
      <div class="evolutionChain"></div>
        </div>
    </div>
  `;
}

function createEvolutionHtml(pokemon) {
  return `
    <div class="evolutionStep">
      <img src="${pokemon.artwork}" alt="${pokemon.name}" width="80">
      <p>${getPokemonName(pokemon)}</p>
    </div>
  `;
}

function createEvolutionListHtml(evolutions) {
  if (evolutions.length === 1) return translate("does-not-evolve");

  return evolutions.map((evolution) => createEvolutionHtml(evolution)).join("");
}
