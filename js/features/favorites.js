const STORAGE_KEY = "favoritePokemonIds";
const pokemonList = document.querySelector("#loadPokemon");

let favoriteIds = loadFavoriteIds();

export function initFavorites() {
  pokemonList.addEventListener("click", handleFavoriteClick);
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
