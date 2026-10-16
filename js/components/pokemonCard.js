import { isFavorite } from "../features/favorites.js";
import { translate, getPokemonName } from "../features/i18n.js";
import { getPokemonById } from "../data/data.js";

const pokemonList = document.querySelector("#loadPokemon");

export function renderPokemonList(pokemons, clear = false) {
  if (clear) pokemonList.innerHTML = "";

  const cardsHtml = pokemons.map((pokemon) => createCardHtml(pokemon)).join("");
  pokemonList.insertAdjacentHTML("beforeend", cardsHtml);
}

export function rerenderCards() {
  const cards = pokemonList.querySelectorAll(".card__open");
  const ids = [...cards].map((card) => Number(card.dataset.pokemonId));
  if (!ids.length) return;

  renderPokemonList(
    ids.map((id) => getPokemonById(id)),
    true,
  );
}

function createCardHtml(pokemon) {
  const name = getPokemonName(pokemon);
  const number = String(pokemon.id).padStart(3, "0");
  const typesHtml = pokemon.types
    .map((entry) => createTypeHtml(entry.type.name))
    .join("");

  return `
    <li class="card" data-type="${pokemon.types[0].type.name}">
      <button
        class="card__open"
        data-id="card"
        data-pokemon-id="${pokemon.id}"
        aria-label="Open ${name}"
      >
        <span class="card__number">#${number}</span>
        <img
          class="card__image"
          data-id="card-image"
          src="${pokemon.artwork}"
          alt="${name}"
          width="136"
          height="136"
          loading="lazy"
        />
        <span class="card__name">${name}</span>
        <span class="card__types">${typesHtml}</span>
      </button>
      <button
        class="card__favorite"
        data-pokemon-id="${pokemon.id}"
        aria-pressed="${isFavorite(pokemon.id)}"
        aria-label="Favorite ${name}"
      >
        <svg class="card__heart" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
        </svg>
      </button>
    </li>
  `;
}

function createTypeHtml(typeName) {
  return `<span class="card__type" data-type="${typeName}">${translate(typeName)}</span>`;
}
