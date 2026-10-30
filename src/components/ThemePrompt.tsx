"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, X, type LucideIcon } from "lucide-react";
import { THEME_EVENT, applyTheme, readTheme, saveTheme, type ThemeChoice } from "@/lib/theme";

const DISMISSED_KEY = "theme-prompt-dismissed";

const options: { value: ThemeChoice; label: string; icon: LucideIcon }[] = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "Match device", icon: Monitor },
];

// First-visit chooser: a small card that asks which theme the visitor wants.
// It never blocks the page, appears once per browser, and can be closed;
// until a choice is made the site follows the device setting.
export function ThemePrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Keep following the device while no fixed choice is saved.
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onDeviceChange = () => {
      const saved = readTheme();
      if (saved === null || saved === "system") applyTheme("system");
    };
    media.addEventListener("change", onDeviceChange);

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      dismissed = true; // no storage: don't ask on every visit
    }
    const timer = readTheme() === null && !dismissed ? window.setTimeout(() => setVisible(true), 1200) : undefined;

    const onChosen = () => setVisible(false);
    window.addEventListener(THEME_EVENT, onChosen);
    return () => {
      media.removeEventListener("change", onDeviceChange);
      window.removeEventListener(THEME_EVENT, onChosen);
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [visible]);

  function dismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="theme-prompt-title"
      aria-describedby="theme-prompt-text"
      className="fixed inset-x-4 bottom-4 z-[60] rounded-xl border border-line bg-surface p-4 shadow-[0_8px_30px_rgba(15,18,23,0.12)] sm:inset-x-auto sm:right-6 sm:bottom-6 sm:w-[22rem] dark:shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p id="theme-prompt-title" className="font-medium text-fg">
            Choose a theme
          </p>
          <p id="theme-prompt-text" className="mt-0.5 text-sm text-muted">
            Pick how this site looks. You can change it later with the button at the top.
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close theme chooser"
          className="-mr-1 -mt-1 inline-flex size-8 shrink-0 items-center justify-center rounded-md text-muted hover:bg-surface-2 hover:text-fg"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {options.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => saveTheme(value)}
            className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-bg px-2 py-3 text-sm text-fg transition-colors hover:border-accent hover:bg-accent-soft"
          >
            <Icon className="size-[1.1rem] text-muted" aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
