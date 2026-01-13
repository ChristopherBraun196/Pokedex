function PokedexCard(pokemon) {
  // console.log(pokemon.types[0].type.name);
  return `
     <div onclick="openPokemonDialog(${pokemon.id})"class="pokeCards ${
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

function BigPokedexCard(pokemon){
return `
    <div class="bigCardContainer">
        <div class="bigCardHeader ${pokemon.types[0].type.name}">
            <button class="closeBtn">X</button>
            <div>
             <p>#${pokemon.id}</p>
              <h2>${pokemon.name}</h2>                
            </div>
            <img class="bigPokemonImage" src="${pokemon.artwork}" alt="${pokemon.name}">
        </div>

        <div class="bigCardBody">
            <div class="pokemonStats">
                <p><strong>HP:</strong> ${pokemon.stats[0].base_stat}</p>
                <p><strong>Attack:</strong> ${pokemon.stats[1].base_stat}</p>
                <p><strong>Defense:</strong> ${pokemon.stats[2].base_stat}</p>
            </div>
        </div>
    </div>
  `;
}