// Theme preference shared by the nav toggle and the first-visit chooser.
// Stored values: "light", "dark" or "system" (follow the device).

export type ThemeChoice = "light" | "dark" | "system";

const KEY = "theme";
export const THEME_EVENT = "portfolio:theme";

export function readTheme(): ThemeChoice | null {
  try {
    const value = localStorage.getItem(KEY);
    return value === "light" || value === "dark" || value === "system" ? value : null;
  } catch {
    return null;
  }
}

export function systemPrefersDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyTheme(choice: ThemeChoice) {
  const dark = choice === "dark" || (choice === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", dark);
}

export function saveTheme(choice: ThemeChoice) {
  applyTheme(choice);
  try {
    localStorage.setItem(KEY, choice);
  } catch {
    // Storage can be unavailable (private mode); the choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: choice }));
}
