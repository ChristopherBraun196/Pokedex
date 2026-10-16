import { allPokemons, loadPokemonById } from "../data/data.js";
import { renderPokemonList } from "../components/pokemonCard.js";

const STORAGE_KEY = "favoritePokemonIds";
const pokemonList = document.querySelector("#loadPokemon");
const showAllBtn = document.querySelector("#showAllBtn");
const showFavoritesBtn = document.querySelector("#showFavoritesBtn");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const favoriteCount = document.querySelector("#favoriteCount");

let favoriteIds = loadFavoriteIds();

export function initFavorites() {
  pokemonList.addEventListener("click", handleFavoriteClick);
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
  const button = event.target.closest(".favoriteBtn");
  if (!button) return;

  const pokemonId = Number(button.dataset.pokemonId);
  toggleFavorite(pokemonId);
  button.textContent = getHeartSymbol(pokemonId);
}

export function getHeartSymbol(pokemonId) {
  return isFavorite(pokemonId) ? "♥" : "♡";
}

async function showFavorites() {
  loadMoreBtn.classList.add("hidden");
  const sortedIds = [...favoriteIds].sort((a, b) => a - b);
  const promises = sortedIds.map((id) => loadPokemonById(id));

  const pokemons = await Promise.all(promises);

  renderPokemonList(pokemons, true);
  markActiveView(showFavoritesBtn);
}

function showAll() {
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
