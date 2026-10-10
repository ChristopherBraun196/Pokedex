const pokemonList = document.querySelector("#loadPokemon");

export function renderPokemonList(pokemons, clear = false) {
  if (clear) pokemonList.innerHTML = "";

  for (let i = 0; i < pokemons.length; i++) {
    pokemonList.innerHTML += createCardHtml(pokemons[i]);
  }
}

export function createCardHtml(pokemon) {
  return `
     <button class="pokeCards ${pokemon.types[0].type.name}" 
     tabindex="0"
      data-pokemon-id="${pokemon.id}"

     aria-label="Open ${pokemon.name}">
     
        <img src="${pokemon.artwork}"  alt="${pokemon.name}">        
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
