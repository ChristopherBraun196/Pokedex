const themeToggleBtn = document.querySelector("#themeToggleBtn");
const STORAGE_KEY = "theme";

export function initTheme() {
  themeToggleBtn.addEventListener("click", toggleTheme);
  const theme = loadTheme();
  applyTheme(theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.toggle("dark");
  localStorage.setItem(STORAGE_KEY, isDark ? "dark" : "light");
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
