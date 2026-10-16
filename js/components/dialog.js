import { getPokemonById, loadEvolutionChain } from "../data/data.js";
import { translate, getPokemonName } from "../features/i18n.js";
import { isFavorite } from "../features/favorites.js";

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
  if (event.target.closest(".detail__close")) closeDialog();
  if (event.target.closest(".detail__nav--prev")) showNeighbor(-1);
  if (event.target.closest(".detail__nav--next")) showNeighbor(1);
}

function handleCardClick(event) {
  const card = event.target.closest(".card__open");
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
  const container = dialog.querySelector(".detail__evolution");

  try {
    const evolutions = await loadEvolutionChain(pokemon);

    container.innerHTML = createEvolutionListHtml(evolutions, pokemon.id);
  } catch (error) {
    console.error(error);
    container.textContent = translate("evolution-error");
  }
}

function closeDialog() {
  dialog.close();
}

function getShownPokemonIds() {
  const cards = pokemonList.querySelectorAll(".card__open");
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
  const name = getPokemonName(pokemon);
  const number = String(pokemon.id).padStart(3, "0");
  const typesHtml = pokemon.types
    .map((entry) => createDetailTypeHtml(entry.type.name))
    .join("");
  const statsHtml = pokemon.stats.map((stat) => createStatHtml(stat)).join("");

  return `
    <div class="detail__hero" data-type="${pokemon.types[0].type.name}">
      <button class="detail__close" data-id="close-dialog-button" aria-label="Close dialog">
        <svg class="detail__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
      <span class="detail__number">#${number}</span>
      <button
        class="detail__favorite"
        data-pokemon-id="${pokemon.id}"
        aria-pressed="${isFavorite(pokemon.id)}"
        aria-label="Favorite ${name}"
      >
        <svg class="detail__heart" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        </svg>
      </button>
      <button class="detail__nav detail__nav--prev" data-id="prev-button" aria-label="Previous Pokémon">
        <svg class="detail__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <img
        class="detail__image"
        data-id="dialog-image"
        src="${pokemon.artwork}"
        alt="${name}"
        width="260"
        height="260"
      />
      <button class="detail__nav detail__nav--next" data-id="next-button" aria-label="Next Pokémon">
        <svg class="detail__icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <h2 class="detail__name" data-id="overlay-pokemon-name">${name}</h2>
      <div class="detail__types">${typesHtml}</div>
    </div>
    <div class="detail__body" data-type="${pokemon.types[0].type.name}">
      <h3 class="detail__heading">${translate("base-stats")}</h3>
      <div class="detail__stats">${statsHtml}</div>
      <div class="detail__facts">
        ${createFactHtml("height", `${formatNumber(pokemon.height / 10)} m`)}
        ${createFactHtml("weight", `${formatNumber(pokemon.weight / 10)} kg`)}
      </div>
      <h3 class="detail__heading">${translate("evolution")}</h3>
      <div class="detail__evolution"></div>
    </div>
  `;
}

function createDetailTypeHtml(typeName) {
  return `<span class="detail__type" data-type="${typeName}">${translate(typeName)}</span>`;
}

function createStatHtml(stat) {
  const percent = Math.min(100, Math.round((stat.base_stat / 150) * 100));

  return `
    <div class="detail__stat">
      <span class="detail__stat-label">${translate(stat.stat.name)}</span>
      <span class="detail__stat-value">${stat.base_stat}</span>
      <span class="detail__stat-bar">
        <span class="detail__stat-fill" style="width: ${percent}%"></span>
      </span>
    </div>
  `;
}

function createFactHtml(key, value) {
  return `
    <div class="detail__fact">
      <span class="detail__fact-label">${translate(key)}</span>
      <span class="detail__fact-value">${value}</span>
    </div>
  `;
}

function formatNumber(value) {
  return value.toLocaleString(document.documentElement.lang);
}

function createEvolutionListHtml(evolution, currentId) {
  const { main, branches } = evolution;

  if (main.length === 1 && branches.length === 0) {
    return `<p class="detail__note">${translate("does-not-evolve")}</p>`;
  }

  return `
    <div class="detail__evo-main">${createStagesHtml(main, currentId, false)}</div>
    ${createBranchesHtml(branches, currentId)}
  `;
}

function createBranchesHtml(branches, currentId) {
  if (branches.length === 0) return "";

  const branchesHtml = branches
    .map(
      (stages) =>
        `<div class="detail__branch">${createStagesHtml(stages, currentId, true)}</div>`,
    )
    .join("");
  const gridClass = branches.every((stages) => stages.length === 1)
    ? " detail__branches--grid"
    : "";
  return `<div class="detail__branches${gridClass}">${branchesHtml}</div>`;
}

function createStagesHtml(stages, currentId, isBranch) {
  return stages
    .map((evo, index) =>
      createEvolutionHtml(evo, index > 0 || isBranch, currentId, isBranch),
    )
    .join("");
}

function createEvolutionHtml(evo, showTrigger, currentId, isSmall) {
  const triggerHtml = showTrigger ? createTriggerHtml(evo.trigger) : "";
  const currentClass = evo.id === currentId ? " detail__evo--current" : "";
  const sizeClass = isSmall ? " detail__evo--small" : "";

  return `
    ${triggerHtml}
    <div class="detail__evo${currentClass}${sizeClass}" data-type="${evo.types[0].type.name}">
      <img
        class="detail__evo-image"
        src="${evo.artwork}"
        alt="${getPokemonName(evo)}"
        width="84"
        height="84"
        loading="lazy"
      />
      <span class="detail__evo-name">${getPokemonName(evo)}</span>
    </div>
  `;
}

function createTriggerHtml(trigger) {
  return `
    <div class="detail__trigger">
      <span class="detail__trigger-label">${formatTrigger(trigger)}</span>
      <svg class="detail__arrow" viewBox="0 0 36 16" aria-hidden="true">
        <path d="M2 8h30M26 2l6 6-6 6" />
      </svg>
    </div>
  `;
}

function formatTrigger(trigger) {
  if (trigger?.level) return `Lv. ${trigger.level}`;
  if (trigger?.item)
    return translate(trigger.item) ?? trigger.item.replace("-", " ");
  if (trigger?.friendship) return formatFriendship(trigger.time);
  if (trigger?.trade) return translate("trade");
  return "";
}

function formatFriendship(time) {
  if (!time) return translate("friendship");
  return `${translate("friendship")}, ${translate(time)}`;
}
