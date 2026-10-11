const pokemonList = document.querySelector("#loadPokemon");

export function renderPokemonList(pokemons, clear = false) {
  if (clear) pokemonList.innerHTML = "";

  const cardsHtml = pokemons.map((pokemon) => createCardHtml(pokemon)).join("");
  pokemonList.insertAdjacentHTML("beforeend", cardsHtml);
}

function createCardHtml(pokemon) {
  return `
     <button data-id="card" class="pokeCards ${pokemon.types[0].type.name}" 
     tabindex="0"
      data-pokemon-id="${pokemon.id}"

     aria-label="Open ${pokemon.name}">
     
        <img  data-id="card-image" src="${pokemon.artwork}"  alt="${pokemon.name}">        
        <p class="PositionNumber">#${pokemon.id}</p>
        <h2> ${pokemon.name}</h2>
        <div class="PokeElement">
        <span class="type ${pokemon.types[0].type.name}">${
          pokemon.types[0].type.name
        }</span> 
        ${
          pokemon.types[1]
            ? `<span class="type ${pokemon.types[1].type.name}">${pokemon.types[1].type.name}</span>`
            : ""
        }  
        </div>     
    </button>
    `;
}
