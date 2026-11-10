import type { CSSProperties, ReactNode } from "react";

// Line-drawn schematics used as project previews. They are diagrams of what each
// project does, not screenshots: no project here has published screenshots yet.
// Every stroke has pathLength 1, so CSS can draw it on when the card scrolls into view
// (see .pv-line in globals.css). --n staggers the strokes.

const n = (order: number) => ({ "--n": order }) as CSSProperties;
const L = ({ d, order = 0, dim = false }: { d: string; order?: number; dim?: boolean }) => (
  <path d={d} pathLength={1} className={`pv-line ${dim ? "pv-dim" : ""}`} style={n(order)} />
);

const visuals: Record<string, ReactNode> = {
  // Stroke prediction: a pulse trace feeding a risk dial.
  "stroke-prediction": (
    <>
      <L dim d="M20 150 H300" />
      <L order={1} d="M20 110 H78 l10 -8 l10 8 h16 l9 -52 l12 96 l11 -44 h18 l12 -16 l12 16 H214" />
      <L order={3} d="M232 124 a36 36 0 0 1 72 0" />
      <L order={4} d="M268 124 l18 -24" />
      <circle cx="268" cy="124" r="3.5" className="pv-dot pv-pulse" />
    </>
  ),
  // Vehicle black box: sensor traces flowing into a sealed, locked unit.
  "vehicle-black-box": (
    <>
      <L order={1} d="M20 62 q14 -18 28 0 t28 0 t28 0 t28 0 H176" />
      <L order={2} d="M20 100 l16 -10 l14 16 l14 -20 l16 22 l14 -12 l14 8 H176" />
      <L order={3} d="M20 138 h30 v-12 h26 v20 h28 v-14 h30 v6 H176" />
      <rect x="184" y="48" width="112" height="104" rx="12" className="pv-fill" />
      <L order={4} d="M196 48 h88 a12 12 0 0 1 12 12 v80 a12 12 0 0 1 -12 12 h-88 a12 12 0 0 1 -12 -12 v-80 a12 12 0 0 1 12 -12 z" />
      <L order={5} d="M224 98 h32 v28 h-32 z M230 98 v-10 a10 10 0 0 1 20 0 v10" />
      <circle cx="240" cy="112" r="3" className="pv-dot pv-pulse" />
    </>
  ),
  // Drawdown alert: an index line falling through threshold levels.
  "nifty-drawdown-alert": (
    <>
      <L dim d="M20 76 H300 M20 108 H300 M20 140 H300" />
      <L order={1} d="M20 118 l22 -16 l18 8 l22 -30 l18 6 l20 -34 l22 10 l20 22 l18 -8 l22 34 l20 -6 l22 40 l18 -4 l18 26" />
      <L order={3} d="M282 136 v-26 M270 110 h24" dim />
      <circle cx="264" cy="134" r="4" className="pv-dot pv-pulse" />
    </>
  ),
  // Async job API: jobs queue up, a worker processes them, results come out.
  "async-analytics-job-api": (
    <>
      <L order={1} d="M22 86 h26 v28 h-26 z M56 86 h26 v28 h-26 z M90 86 h26 v28 h-26 z" dim />
      <L order={2} d="M124 100 H152" />
      <L order={3} d="M188 100 m-32 0 a32 32 0 1 0 64 0 a32 32 0 1 0 -64 0 M188 80 v20 l14 10" />
      <L order={4} d="M224 100 H250" />
      <L order={5} d="M258 86 h40 v28 h-40 z M266 100 l7 7 l14 -14" />
      <circle cx="35" cy="100" r="3" className="pv-dot pv-pulse" />
    </>
  ),
  // Bookshop microservices: a gateway routing to services, each with its own store.
  "bookshop-microservices": (
    <>
      <L order={1} d="M130 34 h60 v30 h-60 z" />
      <L order={2} d="M160 64 V84 M160 84 H60 V104 M160 84 V104 M160 84 H260 V104" dim />
      <L order={3} d="M30 104 h60 v30 h-60 z M130 104 h60 v30 h-60 z M230 104 h60 v30 h-60 z" />
      <L order={4} d="M46 150 a14 5 0 0 0 28 0 a14 5 0 0 0 -28 0 v14 a14 5 0 0 0 28 0 v-14 M146 150 a14 5 0 0 0 28 0 a14 5 0 0 0 -28 0 v14 a14 5 0 0 0 28 0 v-14 M246 150 a14 5 0 0 0 28 0 a14 5 0 0 0 -28 0 v14 a14 5 0 0 0 28 0 v-14" dim />
      <circle cx="160" cy="49" r="3" className="pv-dot pv-pulse" />
    </>
  ),
  // Construction business website: a browser frame with a skyline inside.
  "rk-creators-builders": (
    <>
      <L order={1} d="M40 40 h240 a8 8 0 0 1 8 8 v104 a8 8 0 0 1 -8 8 h-240 a8 8 0 0 1 -8 -8 v-104 a8 8 0 0 1 8 -8 z M32 62 H288" />
      <L order={2} dim d="M46 51 h4 M58 51 h4 M70 51 h4" />
      <L order={3} d="M60 142 V104 h34 v38 M94 142 V84 h44 v58 M138 142 V112 h30 v30 M52 142 H180" />
      <L order={4} dim d="M200 88 h66 M200 104 h52 M200 120 h60" />
      <L order={5} d="M200 134 h40 v12 h-40 z" />
    </>
  ),
};

// Fallback for a project added later without its own drawing: a plain node graph.
const fallback = (
  <>
    <L order={1} d="M60 60 L160 100 L260 60 M60 140 L160 100 L260 140" dim />
    <L order={2} d="M160 100 m-18 0 a18 18 0 1 0 36 0 a18 18 0 1 0 -36 0" />
    <circle cx="160" cy="100" r="3.5" className="pv-dot pv-pulse" />
  </>
);

export function ProjectVisual({ slug }: { slug: string }) {
  return (
    <svg viewBox="0 0 320 200" className="size-full" role="presentation" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      {visuals[slug] ?? fallback}
    </svg>
  );
}
