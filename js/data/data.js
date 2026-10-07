export async function loadPokemonData() {
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

export async function loadMorePokemon() {
  const spinner = document.getElementById("loading-spinner");
  const loadBtn = document.getElementById("loadMoreBtn");
  spinner.classList.remove("hidden");
  loadBtn.disable = true;
  offSet += LIMIT;
  await Promise.all([
    loadPokemonData(),
    new Promise((resolve) => setTimeout(resolve, 650)),
  ]);

  spinner.classList.add("hidden");
  loadBtn.disabled = false;
}

export async function preloadAllPokemonNames() {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
  const data = await response.json();
  pokemonNamesList = data.results;
}

export async function getPokemonData(match) {
  let pokemon = allPokemons.find((p) => p.name === match.name);
  if (pokemon) return pokemon;

  pokemon = await fetchPokemon(match.url);
  allPokemons.push(pokemon);
  return pokemon;
}

async function fetchPokemon(url) {
  const res = await fetch(url);
  const data = await res.json();
  return {
    ...data,
    artwork: data.sprites.other["official-artwork"].front_default,
  };
}
