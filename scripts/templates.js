function PokedexCard(pokemon) {
  // console.log(pokemon.types[0].type.name);
  return `
     <button class="pokeCards ${pokemon.types[0].type.name}" 
     tabindex="0"
     onclick="openPokemonDialog(${pokemon.id})"      
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

function BigPokedexCard(pokemon) {
  return `
    <div class="bigCardContainer">
        <div class="bigCardHeader ${pokemon.types[0].type.name}">
        <div class="NameNumber">
         <p class="PokeNumber">#${pokemon.id}</p>
              <h3>${pokemon.name}</h3>  
              </div>
            <button class="closeBtn" onclick="closeDialogClick() ">&#10761;</button>
            <button class="prevBtn" onclick="lastPokemon(${pokemon.id})">&#8592;</button>
            <button class="nextBtn" onclick="nextPokemon(${pokemon.id})">&#8594;</button>
            <img class="bigPokemonImage" src="${pokemon.artwork}" alt="${pokemon.name}">             
        </div>
        
        <div class="bigCardBody">
            <div class="pokemonStats">
  <h4>Base Stats</h4>
  ${pokemon.stats
    .map(
      (stat) => `
    <div class="stat-row">
      <span class="stat-label">${stat.stat.name.toUpperCase()}</span>
      <span class="stat-value">${stat.base_stat}</span>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${(stat.base_stat / 150) * 100}%"></div>
      </div>
    </div>
  `,
    )
    .join("")}
</div>
        </div>
    </div>
  `;
}
