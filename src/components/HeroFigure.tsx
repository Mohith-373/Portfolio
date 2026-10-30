// "Figure 1": a small research-style plot of noisy observations, a fitted trend
// and its uncertainty band. The data is generated from a fixed seed, so the figure
// is identical on every build. It is illustrative and makes no claim about results.

const W = 480;
const H = 320;
const PLOT = { left: 40, right: 460, top: 28, bottom: 284 };
const SIGMA = 0.055;

function seeded(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const trend = (x: number) => 0.46 + 0.24 * Math.sin(2.5 * x - 0.7) + 0.16 * x;
const sx = (x: number) => PLOT.left + x * (PLOT.right - PLOT.left);
const sy = (y: number) => PLOT.bottom - y * (PLOT.bottom - PLOT.top);
const fmt = (n: number) => n.toFixed(1);

function buildFigure() {
  const rand = seeded(20261030);
  const gaussian = () => {
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const points = Array.from({ length: 46 }, () => rand() * 0.96 + 0.02)
    .sort((a, b) => a - b)
    .map((x) => ({ x, y: trend(x) + gaussian() * SIGMA }));

  const samples = Array.from({ length: 81 }, (_, i) => i / 80);
  const line = samples.map((x, i) => `${i === 0 ? "M" : "L"}${fmt(sx(x))} ${fmt(sy(trend(x)))}`).join(" ");
  const upper = samples.map((x) => `${fmt(sx(x))},${fmt(sy(trend(x) + 1.96 * SIGMA))}`);
  const lower = samples
    .slice()
    .reverse()
    .map((x) => `${fmt(sx(x))},${fmt(sy(trend(x) - 1.96 * SIGMA))}`);

  return { points, line, band: [...upper, ...lower].join(" ") };
}

const figure = buildFigure();
const gridYs = [0.2, 0.4, 0.6, 0.8];
const ticksX = [0, 0.25, 0.5, 0.75, 1];

export function HeroFigure() {
  return (
    <figure className="rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        aria-labelledby="fig1-caption"
        className="h-auto w-full"
      >
        {gridYs.map((y) => (
          <line
            key={y}
            x1={PLOT.left}
            x2={PLOT.right}
            y1={sy(y)}
            y2={sy(y)}
            stroke="var(--line)"
            strokeDasharray="3 5"
          />
        ))}

        <polygon className="fig-band" points={figure.band} fill="var(--accent)" fillOpacity={0.13} />

        {figure.points.map((p, i) => (
          <circle
            key={i}
            className="fig-point"
            style={{ animationDelay: `${i * 16}ms` }}
            cx={fmt(sx(p.x))}
            cy={fmt(sy(p.y))}
            r={2.8}
            fill="var(--muted)"
            fillOpacity={0.8}
          />
        ))}

        <path
          className="fig-trend"
          d={figure.line}
          pathLength={1}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={2.25}
          strokeLinecap="round"
        />

        <path
          d={`M${PLOT.left} ${PLOT.top - 8} V${PLOT.bottom} H${PLOT.right + 8}`}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={1.25}
        />
        {ticksX.map((t) => (
          <line
            key={t}
            x1={sx(t)}
            x2={sx(t)}
            y1={PLOT.bottom}
            y2={PLOT.bottom + 5}
            stroke="var(--line-strong)"
          />
        ))}

        <text x={PLOT.right + 4} y={PLOT.bottom + 20} fill="var(--subtle)" fontSize="13" fontFamily="var(--font-mono)" fontStyle="italic">
          x
        </text>
        <text x={PLOT.left - 22} y={PLOT.top} fill="var(--subtle)" fontSize="13" fontFamily="var(--font-mono)" fontStyle="italic">
          y
        </text>
        <text x={PLOT.left + 14} y={PLOT.top + 10} fill="var(--muted)" fontSize="14" fontFamily="var(--font-mono)">
          y = f(x) + ε
        </text>
      </svg>
      <figcaption id="fig1-caption" className="mt-3 text-sm leading-relaxed text-muted">
        <span className="font-medium text-fg">Figure 1.</span> Noisy observations with a fitted trend and its uncertainty
        band.
      </figcaption>
    </figure>
  );
}
