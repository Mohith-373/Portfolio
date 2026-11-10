import type { CSSProperties } from "react";
import { HeroGames } from "./HeroGames";
import { Section } from "./Section";

// The interactive demos, in a section of their own. What each one is, in the same
// words the demos use about themselves.
const demos = [
  {
    name: "Draw a digit",
    text: "A small convolutional neural network, trained on MNIST, guesses the digit while you draw. It runs in your browser with no machine learning library.",
  },
  {
    name: "Live clustering",
    text: "k-means clustering written from scratch. Scatter the dots, add more, or change the number of groups and watch the centres chase the data.",
  },
  {
    name: "Work with me?",
    text: "Three questions about what you value in a teammate, each answered with how I work.",
  },
];

export function Lab() {
  return (
    <Section
      id="lab"
      title="Interactive lab"
      lead="Small things I built that you can try here. Everything runs on this page: nothing you draw or answer is sent anywhere."
    >
      <div className="grid gap-10 xl:grid-cols-[minmax(0,30rem)_1fr] xl:gap-12">
        <div data-reveal className="mx-auto w-full max-w-[30rem] xl:mx-0">
          <HeroGames />
        </div>
        <ol className="space-y-4 self-center">
          {demos.map((demo, i) => (
            <li key={demo.name} data-reveal style={{ "--i": i + 1 } as CSSProperties} className="flex gap-5 border-t border-line pt-4">
              <span className="eyebrow pt-1 text-accent" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-medium tracking-[-0.01em] text-fg">{demo.name}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{demo.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
