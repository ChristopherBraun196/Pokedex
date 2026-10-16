const themeToggleBtn = document.querySelector("#themeToggleBtn");
const STORAGE_KEY = "theme";

export function initTheme() {
  themeToggleBtn.addEventListener("click", toggleTheme);
  const theme = loadTheme();
  applyTheme(theme);
}

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  const theme = isDark ? "light" : "dark";

  applyTheme(theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) return saved;

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";

  document.documentElement.classList.toggle("dark", isDark);
  themeToggleBtn.setAttribute(
    "aria-label",
    isDark ? "Switch to light mode" : "Switch to dark mode",
  );
}
