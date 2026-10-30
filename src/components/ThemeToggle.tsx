"use client";

import { Moon, Sun } from "lucide-react";
import { saveTheme } from "@/lib/theme";

// The initial theme is set before paint by the inline script in layout.tsx.
// Icons switch with CSS (dark: classes), so there is no hydration mismatch.
export function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.contains("dark");
    saveTheme(isDark ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch between light and dark theme"
      className="inline-flex size-9 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
    >
      <Sun className="hidden size-[1.1rem] dark:block" aria-hidden="true" />
      <Moon className="size-[1.1rem] dark:hidden" aria-hidden="true" />
    </button>
  );
}
