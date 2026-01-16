const BASE_URL = "https://pokeapi.co/api/v2/pokemon";
const BASE_IMG =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/";

const LIMIT = 20;
const allPokemons = [];

const closeDialog = document.getElementById("closeDialog");

let offSet = 0;

function init() {
  loadPokemonData();
}

async function loadPokemonData() {
  const response = await fetch(`${BASE_URL}?limit=${LIMIT}&offset=${offSet}`);
  const data = await response.json();

  const newPokemons = [];

  for (const pokemon of data.results) {
    const res = await fetch(pokemon.url);
    const fullData = await res.json();
    const artwork = fullData.sprites.other["official-artwork"].front_default;

    const pokemonObj = { ...fullData, artwork };

    allPokemons.push(pokemonObj); // Speicher
    newPokemons.push(pokemonObj); // Neu Rendern
  }

  renderPokemonList(newPokemons, offSet === 0);
}

function renderPokemonList(pokemons, clear = false) {
  const pokemonLists = document.getElementById("loadPokemon");

  if (clear) pokemonLists.innerHTML = "";

  for (let i = 0; i < pokemons.length; i++) {
    pokemonLists.innerHTML += PokedexCard(pokemons[i]);
  }
}

function loadMorePokemon() {
  offSet += LIMIT;
  loadPokemonData();
}

function openPokemonDialog(pokemonId) {
  const dialogRef = document.getElementById("openPokemonDialog");

  const pokemon = allPokemons.find((p) => p.id === pokemonId);

  dialogRef.innerHTML = BigPokedexCard(pokemon);

  dialogRef.showModal();
}

function openOnEnter(event, pokemonId) {
    if (event.key === "Enter") {
   openPokemonDialog(pokemonId);
  }
}


function closeDialog(event, ) {
  if (event.target === dialogRef) {
    closeBtn();
    
  }
}




// function nextBtn() {
//   currentIndex++;
//   if (currentIndex >= pictures.length) currentIndex = 0;
//   renderImage();
// }

// function prevBtn() {
//   currentIndex--;
//   if (currentIndex < 0) currentIndex = pictures.length - 1;
//   renderImage();
// }


// function searchBar(){
//   const searchPokemon = document.getElementById("mySearch");   

// }
