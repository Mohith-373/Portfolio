"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HeroDigitGame } from "./HeroDigitGame";
import { HeroPlayground } from "./HeroPlayground";

// A two-slide carousel for the hero games. Both games stay mounted (so a drawing
// survives a slide), stacked in one grid cell; only the active slide is visible
// and focusable, and the clustering animation pauses while it is off screen.

const games = [
  { id: "digits", label: "Draw a digit" },
  { id: "clustering", label: "Live clustering" },
] as const;

export function HeroGames() {
  const [index, setIndex] = useState(0);
  const go = (i: number) => setIndex((i + games.length) % games.length);

  const arrow =
    "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-fg transition-colors hover:bg-surface-2";

  return (
    <div aria-roledescription="carousel" aria-label="Interactive demos" data-games data-index={index}>
      <div className="grid overflow-hidden rounded-2xl">
        {games.map((game, i) => {
          const isActive = i === index;
          return (
            <div
              key={game.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${games.length}: ${game.label}`}
              aria-hidden={!isActive}
              inert={!isActive}
              className="col-start-1 row-start-1 transition-[transform,opacity,visibility] duration-500 ease-out motion-reduce:transition-none"
              style={{
                transform: `translateX(${(i - index) * 106}%)`,
                opacity: isActive ? 1 : 0,
                visibility: isActive ? "visible" : "hidden",
              }}
            >
              {game.id === "digits" ? <HeroDigitGame /> : <HeroPlayground active={isActive} />}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <button type="button" onClick={() => go(index - 1)} aria-label="Previous game" className={arrow}>
          <ChevronLeft className="size-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-1.5 rounded-full bg-surface-2 p-1" role="group" aria-label="Choose a game">
          {games.map((game, i) => (
            <button
              key={game.id}
              type="button"
              onClick={() => go(i)}
              aria-current={i === index ? "true" : undefined}
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm transition-colors ${
                i === index ? "bg-surface text-fg shadow-sm" : "text-muted hover:text-fg"
              }`}
            >
              <span className={`size-1.5 rounded-full ${i === index ? "bg-accent" : "bg-line-strong"}`} aria-hidden="true" />
              {game.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(index + 1)} aria-label="Next game" className={arrow}>
          <ChevronRight className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
