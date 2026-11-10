"use client";

import type { KeyboardEvent } from "react";
import { Info, Play } from "lucide-react";

export type GameTab = "play" | "info";

// Shared header for the hero games: a title with a coloured dot, and Play / How it works tabs.
// shortTitle (optional) replaces the title on narrow cards; it needs an @container ancestor.
export function GameHeader({
  baseId,
  title,
  shortTitle,
  dotClass,
  tab,
  onTab,
}: {
  baseId: string;
  title: string;
  shortTitle?: string;
  dotClass: string;
  tab: GameTab;
  onTab: (tab: GameTab) => void;
}) {
  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next: GameTab = tab === "play" ? "info" : "play";
    onTab(next);
    document.getElementById(`${baseId}-tab-${next}`)?.focus();
  }

  const tabClass = (active: boolean) =>
    `tap inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm transition-colors ${
      active ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
    }`;

  const tabs: { id: GameTab; label: string; icon: typeof Play }[] = [
    { id: "play", label: "Play", icon: Play },
    { id: "info", label: "How it works", icon: Info },
  ];

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="inline-flex min-w-0 items-center gap-2 font-medium text-fg">
        <span className={`size-2 shrink-0 rounded-full ${dotClass}`} aria-hidden="true" />
        {shortTitle ? (
          <span className="truncate">
            <span className="text-sm @sm:hidden">{shortTitle}</span>
            <span className="hidden @sm:inline">{title}</span>
          </span>
        ) : (
          <span className="truncate">{title}</span>
        )}
      </p>
      <div role="tablist" aria-label={title} className="inline-flex shrink-0 rounded-lg bg-surface-2 p-0.5">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`${baseId}-tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`${baseId}-panel-${id}`}
            tabIndex={tab === id ? 0 : -1}
            onKeyDown={onKey}
            onClick={() => onTab(id)}
            className={tabClass(tab === id)}
          >
            <Icon className="size-3.5" aria-hidden="true" />
            {/* On narrow cards the second tab is shortened so the game title is never cut off. */}
            {id === "info" ? (
              <>
                <span className="@sm:hidden" aria-hidden="true">
                  Info
                </span>
                <span className="sr-only @sm:not-sr-only">{label}</span>
              </>
            ) : (
              label
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
