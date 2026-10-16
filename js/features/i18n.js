import { TRANSLATIONS } from "../data/translations.js";

const STORAGE_KEY = "lang";
const languageSwitch = document.querySelector("#languageSwitch");

export function initLanguage() {
  setLanguage(loadLanguage());
  languageSwitch.addEventListener("click", handleLanguageClick);
}

function handleLanguageClick(event) {
  const button = event.target.closest(".languageBtn");
  if (!button) return;
  setLanguage(button.dataset.lang);
}

function loadLanguage() {
  return localStorage.getItem(STORAGE_KEY) ?? "en";
}

function setLanguage(language) {
  localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;
  translateTexts(language);
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
