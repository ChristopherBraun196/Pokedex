let currentPokemonId = null;

export function initDialog() {
  const dialog = document.getElementById("openPokemonDialog");
  document.addEventListener("keydown", switchKey);

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
    }
    if (event.target.closest(".closeBtn")) closeDialogClick();

    if (event.target.closest(".prevBtn")) lastPokemon(currentPokemonId);
    if (event.target.closest(".nextBtn")) nextPokemon(currentPokemonId);
  });

  const list = document.querySelector("#loadPokemon");

  list.addEventListener("click", (event) => {
    const card = event.target.closest(".pokeCards");
    if (!card) return;
    openPokemonDialog(Number(card.dataset.pokemonId));
  });
}

function openPokemonDialog(pokemonId) {
  const dialogRef = document.getElementById("openPokemonDialog");
  const pokemon = allPokemons.find((p) => p.id == pokemonId);

  currentPokemonId = pokemonId;

  dialogRef.innerHTML = BigPokedexCard(pokemon);
  dialogRef.showModal();
}

function closeDialogClick() {
  document.querySelector("#openPokemonDialog").close();
}

function nextPokemon(currentId) {
  const index = allPokemons.findIndex((p) => p.id === currentId);
  let nextIndex = index + 1;

  if (nextIndex >= allPokemons.length) {
    nextIndex = 0;
  }

  const nextId = allPokemons[nextIndex].id;
  openPokemonDialog(nextId);
}

function lastPokemon(currentId) {
  const index = allPokemons.findIndex((p) => p.id === currentId);
  let prevIndex = index - 1;

  if (prevIndex < 0) {
    prevIndex = allPokemons.length - 1;
  }

  const prevId = allPokemons[prevIndex].id;
  openPokemonDialog(prevId);
}

function switchKey(event) {
  if (event.key === "ArrowLeft") {
    lastPokemon(currentPokemonId);
  }
  if (event.key === "ArrowRight") {
    nextPokemon(currentPokemonId);
  }
}
