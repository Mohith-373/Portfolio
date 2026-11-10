import type { CSSProperties } from "react";

// Splits text into masked words (and optionally characters) so CSS can slide each one
// up into place. Screen readers get the plain string from aria-label on the parent
// element; the pieces themselves are hidden from them.
// See ".split" in globals.css for the two ways it is animated (hero load, scroll reveal).
export function Split({ text, by = "word", start = 0 }: { text: string; by?: "word" | "char"; start?: number }) {
  const words = text.split(" ");
  let index = start;
  return (
    <span className="split" aria-hidden="true">
      {words.map((word, w) => (
        <span key={`${word}-${w}`}>
          <span className="w">
            {by === "char" ? (
              Array.from(word).map((char, c) => (
                <span key={c} className="c" style={{ "--i": index++ } as CSSProperties}>
                  {char}
                </span>
              ))
            ) : (
              <span className="c" style={{ "--i": index++ } as CSSProperties}>
                {word}
              </span>
            )}
          </span>
          {w < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
