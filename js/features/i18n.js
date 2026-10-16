import { TRANSLATIONS } from "../data/translations.js";
import { GERMAN_NAMES } from "../data/germanNames.js";
import { rerenderCards } from "../components/pokemonCard.js";

const STORAGE_KEY = "lang";
const languageSwitch = document.querySelector("#languageSwitch");

let currentLanguage = "en";

export function initLanguage() {
  setLanguage(loadLanguage());
  languageSwitch.addEventListener("click", handleLanguageClick);
}

export function getPokemonName(pokemon) {
  if (currentLanguage === "de") return GERMAN_NAMES[pokemon.id];
  return pokemon.name;
}

export function translate(key) {
  return TRANSLATIONS[currentLanguage][key];
}

function handleLanguageClick(event) {
  const button = event.target.closest(".switch__button");

  if (!button) return;
  setLanguage(button.dataset.lang);
  rerenderCards();
}

function loadLanguage() {
  return localStorage.getItem(STORAGE_KEY) ?? "en";
}

function setLanguage(language) {
  currentLanguage = language;

  localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;
  translateTexts(language);
  markActiveLanguage(language);
}

function translateTexts(language) {
  const texts = TRANSLATIONS[language];

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = texts[element.dataset.i18n];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.placeholder = texts[element.dataset.i18nPlaceholder];
  });
}

function markActiveLanguage(language) {
  const buttons = languageSwitch.querySelectorAll(".switch__button");

  buttons.forEach((button) =>
    button.setAttribute("aria-pressed", button.dataset.lang === language),
  );
}
