import { allPokemons, loadPokemonById } from "../data/data.js";
import { renderPokemonList } from "../components/pokemonCard.js";
import { translate } from "./i18n.js";

const STORAGE_KEY = "favoritePokemonIds";
const showAllBtn = document.querySelector("#showAllBtn");
const showFavoritesBtn = document.querySelector("#showFavoritesBtn");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const favoriteCount = document.querySelector("#favoriteCount");
const notFound = document.querySelector("#notFound");
const loadError = document.querySelector("#loadError");

let favoriteIds = loadFavoriteIds();

export function initFavorites() {
  document.addEventListener("click", handleFavoriteClick);
  showAllBtn.addEventListener("click", showAll);
  showFavoritesBtn.addEventListener("click", showFavorites);
  updateFavoriteCount();
}

function loadFavoriteIds() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveFavoriteIds() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
}

export function isFavorite(pokemonId) {
  return favoriteIds.includes(pokemonId);
}

export function toggleFavorite(pokemonId) {
  if (isFavorite(pokemonId)) {
    favoriteIds = favoriteIds.filter((id) => id !== pokemonId);
  } else {
    favoriteIds.push(pokemonId);
  }
  saveFavoriteIds();
  updateFavoriteCount();
}

function handleFavoriteClick(event) {
  const button = event.target.closest(".card__favorite, .detail__favorite");
  if (!button) return;

  const pokemonId = Number(button.dataset.pokemonId);
  toggleFavorite(pokemonId);
  markFavoriteButtons(pokemonId);

  if (isFavoritesView()) showFavorites();
}

async function showFavorites() {
  loadMoreBtn.classList.add("hidden");
  notFound.classList.add("hidden");

  if (favoriteIds.length === 0) return showNoFavorites();

  markActiveView(showFavoritesBtn);
  try {
    const pokemons = await loadFavoritePokemons();
    renderPokemonList(pokemons, true);
  } catch (error) {
    console.error(error);
    loadError.classList.remove("hidden");
  }
}

function loadFavoritePokemons() {
  const sortedIds = [...favoriteIds].sort((a, b) => a - b);
  return Promise.all(sortedIds.map((id) => loadPokemonById(id)));
}

function showAll() {
  notFound.classList.add("hidden");
  loadError.classList.add("hidden");
  renderPokemonList(allPokemons, true);
  loadMoreBtn.classList.remove("hidden");
  markActiveView(showAllBtn);
}

function markActiveView(activeButton) {
  showAllBtn.setAttribute("aria-pressed", showAllBtn === activeButton);
  showFavoritesBtn.setAttribute(
    "aria-pressed",
    showFavoritesBtn === activeButton,
  );
}

function updateFavoriteCount() {
  favoriteCount.textContent = favoriteIds.length;
}

function markFavoriteButtons(pokemonId) {
  const selector = `.card__favorite[data-pokemon-id="${pokemonId}"], .detail__favorite[data-pokemon-id="${pokemonId}"]`;
  const buttons = document.querySelectorAll(selector);

  buttons.forEach((button) =>
    button.setAttribute("aria-pressed", isFavorite(pokemonId)),
  );
}

function showNoFavorites() {
  renderPokemonList([], true);
  notFound.textContent = translate("no-favorites");
  notFound.classList.remove("hidden");
  markActiveView(showFavoritesBtn);
}

function isFavoritesView() {
  return showFavoritesBtn.getAttribute("aria-pressed") === "true";
}

export function resetView() {
  notFound.classList.add("hidden");
  markActiveView(showAllBtn);
}
