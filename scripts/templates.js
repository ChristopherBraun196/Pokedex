function PokedexCard(pokemon) {
  // console.log(pokemon.types[0].type.name);
  return `
     <div class="pokeCards ${
       pokemon.types[0].type.name
     }"tabindex="0" role="button" aria-label="Open ${pokemon.name}">
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
    </div>
    `;
}
