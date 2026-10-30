"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Minus, Play, Plus, Shuffle } from "lucide-react";
import { GameHeader, type GameTab } from "./GameTabs";

const SOURCE_CODE = "https://github.com/Mohith-373/Portfolio/blob/main/src/components/HeroPlayground.tsx";

// Live k-means playground. Points drift around a few moving "sources", the
// cluster centres chase them in real time, and visitors can stir the data with
// the pointer, drop in new points, and change k. Pure canvas, no libraries.

const COLORS = ["#4f7cf7", "#a46cf2", "#14b3a3", "#f0a030", "#ef6475", "#6cbf4a"];
const BASE_POINTS = 150;
const MAX_POINTS = 260;
const STIR_RADIUS = 70;
const MIN_K = 2;
const MAX_K = 6;

type Point = { x: number; y: number; vx: number; vy: number; ox: number; oy: number; src: number; cluster: number; born: number };
type Source = { ax: number; ay: number; fx: number; fy: number; px: number; py: number; spread: number; x: number; y: number; temp?: boolean; until?: number };
type Centroid = { x: number; y: number };

function gaussian(rand: () => number) {
  const u = Math.max(rand(), 1e-9);
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * rand());
}

function makeSources(count: number, rand: () => number): Source[] {
  return Array.from({ length: count }, (_, i) => ({
    ax: 0.18 + rand() * 0.14,
    ay: 0.16 + rand() * 0.14,
    fx: 0.05 + rand() * 0.07,
    fy: 0.04 + rand() * 0.07,
    px: (i / count) * Math.PI * 2 + rand(),
    py: rand() * Math.PI * 2,
    spread: 0.05 + rand() * 0.035,
    x: 0.5,
    y: 0.5,
  }));
}

function seedCentroids(points: Point[], k: number, rand: () => number): Centroid[] {
  // k-means++ style seeding so a change of k looks sensible straight away.
  if (points.length === 0) return Array.from({ length: k }, () => ({ x: rand(), y: rand() }));
  const first = points[Math.floor(rand() * points.length)];
  const cs: Centroid[] = [{ x: first.x, y: first.y }];
  while (cs.length < k) {
    const d = points.map((p) => Math.min(...cs.map((c) => (p.x - c.x) ** 2 + (p.y - c.y) ** 2)));
    const total = d.reduce((a, b) => a + b, 0) || 1;
    let r = rand() * total;
    let idx = 0;
    for (; idx < d.length - 1; idx++) {
      r -= d[idx];
      if (r <= 0) break;
    }
    cs.push({ x: points[idx].x, y: points[idx].y });
  }
  return cs;
}

export function HeroPlayground({ active = true }: { active?: boolean }) {
  const baseId = useId();
  const [tab, setTab] = useState<GameTab>("play");
  const wrapRef = useRef<HTMLDivElement>(null);
  // The loop only runs while this game is the visible slide and its Play tab is open.
  const enabledRef = useRef(active);
  const runRef = useRef({ start: () => {}, stop: () => {} });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [k, setK] = useState(4);
  const [count, setCount] = useState(BASE_POINTS);
  const [touch, setTouch] = useState(false);

  const sim = useRef({
    points: [] as Point[],
    sources: [] as Source[],
    centroids: [] as Centroid[],
    k: 4,
    t: 0,
    pointer: { x: -1, y: -1, active: false },
    rand: Math.random,
    redraw: () => {},
    settle: () => {},
  });

  const spawnPoint = useCallback((src: number, t: number): Point => {
    const s = sim.current;
    const source = s.sources[src];
    const ox = gaussian(s.rand) * source.spread;
    const oy = gaussian(s.rand) * source.spread;
    return { x: source.x + ox, y: source.y + oy, vx: 0, vy: 0, ox, oy, src, cluster: 0, born: t };
  }, []);

  const reset = useCallback(() => {
    const s = sim.current;
    s.sources = makeSources(4, s.rand);
    // Place sources at their t=0 positions before spawning points around them.
    for (const src of s.sources) {
      src.x = 0.5 + src.ax * Math.sin(src.px);
      src.y = 0.5 + src.ay * Math.sin(src.py);
    }
    s.points = Array.from({ length: BASE_POINTS }, (_, i) => spawnPoint(i % s.sources.length, 0));
    s.centroids = seedCentroids(s.points, s.k, s.rand);
    s.settle();
    setCount(s.points.length);
    s.redraw();
  }, [spawnPoint]);

  // Change k: reseed the centres from the current data.
  useEffect(() => {
    const s = sim.current;
    s.k = k;
    s.centroids = seedCentroids(s.points, k, s.rand);
    s.redraw();
  }, [k]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = sim.current;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTouch(window.matchMedia("(hover: none)").matches);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let line = "#252c37";
    let fg = "#e8ebef";

    const readTheme = () => {
      const css = getComputedStyle(document.documentElement);
      line = css.getPropertyValue("--line").trim() || line;
      fg = css.getPropertyValue("--fg").trim() || fg;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const step = (dt: number) => {
      s.t += dt;
      const t = s.t;
      const now = performance.now();

      // Sources wander on slow Lissajous paths, so the "true" clusters keep moving.
      for (const src of s.sources) {
        if (src.temp) continue;
        src.x = 0.5 + src.ax * Math.sin(src.px + t * src.fx * 2 * Math.PI);
        src.y = 0.5 + src.ay * Math.sin(src.py + t * src.fy * 2 * Math.PI);
      }
      // Remove expired click bursts once their points have faded.
      s.points = s.points.filter((p) => {
        const src = s.sources[p.src];
        return !(src.temp && src.until !== undefined && now > src.until);
      });

      const aspect = width / Math.max(height, 1);
      for (const p of s.points) {
        const src = s.sources[p.src];
        const hx = src.x + p.ox;
        const hy = src.y + p.oy;
        // Spring towards home, plus a little noise.
        p.vx += (hx - p.x) * 0.9 * dt + gaussian(s.rand) * 0.0009;
        p.vy += (hy - p.y) * 0.9 * dt + gaussian(s.rand) * 0.0009;
        // Pointer stirs nearby points outwards.
        if (s.pointer.active) {
          const dx = (p.x - s.pointer.x) * aspect;
          const dy = p.y - s.pointer.y;
          const dist = Math.hypot(dx, dy) * height;
          if (dist < STIR_RADIUS && dist > 0.01) {
            const force = (1 - dist / STIR_RADIUS) * 0.012;
            p.vx += (dx / (dist / height)) * force / aspect;
            p.vy += (dy / (dist / height)) * force;
          }
        }
        p.vx *= 0.9;
        p.vy *= 0.9;
        p.x += p.vx;
        p.y += p.vy;
        p.x = Math.min(0.99, Math.max(0.01, p.x));
        p.y = Math.min(0.99, Math.max(0.01, p.y));
      }

      // One k-means step per frame: assign, then ease each centre towards its mean.
      const sums = s.centroids.map(() => ({ x: 0, y: 0, n: 0 }));
      for (const p of s.points) {
        let best = 0;
        let bestD = Infinity;
        for (let c = 0; c < s.centroids.length; c++) {
          const d = (p.x - s.centroids[c].x) ** 2 + (p.y - s.centroids[c].y) ** 2;
          if (d < bestD) {
            bestD = d;
            best = c;
          }
        }
        p.cluster = best;
        sums[best].x += p.x;
        sums[best].y += p.y;
        sums[best].n += 1;
      }
      s.centroids.forEach((c, i) => {
        if (sums[i].n > 0) {
          c.x += (sums[i].x / sums[i].n - c.x) * 0.08;
          c.y += (sums[i].y / sums[i].n - c.y) * 0.08;
        } else {
          // Empty cluster: jump to a random point, as k-means implementations do.
          const p = s.points[Math.floor(s.rand() * s.points.length)];
          if (p) {
            c.x = p.x;
            c.y = p.y;
          }
        }
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Faint grid.
      ctx.strokeStyle = line;
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 5]);
      for (let i = 1; i < 4; i++) {
        const y = Math.round((height * i) / 4) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Spokes from each point to its centre.
      ctx.lineWidth = 1;
      for (const p of s.points) {
        const c = s.centroids[p.cluster];
        if (!c) continue;
        ctx.strokeStyle = COLORS[p.cluster % COLORS.length] + "22";
        ctx.beginPath();
        ctx.moveTo(p.x * width, p.y * height);
        ctx.lineTo(c.x * width, c.y * height);
        ctx.stroke();
      }

      // Points.
      const now = performance.now();
      for (const p of s.points) {
        const src = s.sources[p.src];
        let alpha = 0.9;
        if (src.temp && src.until !== undefined) alpha = Math.max(0, Math.min(0.9, (src.until - now) / 1500));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = COLORS[p.cluster % COLORS.length];
        ctx.beginPath();
        ctx.arc(p.x * width, p.y * height, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Centres: a ring with a cross.
      s.centroids.forEach((c, i) => {
        const x = c.x * width;
        const y = c.y * height;
        ctx.fillStyle = COLORS[i % COLORS.length];
        ctx.globalAlpha = 0.16;
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = COLORS[i % COLORS.length];
        ctx.lineWidth = 2.25;
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = fg;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - 4, y);
        ctx.lineTo(x + 4, y);
        ctx.moveTo(x, y - 4);
        ctx.lineTo(x, y + 4);
        ctx.stroke();
      });

      // Stir radius under the pointer.
      if (s.pointer.active) {
        ctx.strokeStyle = fg;
        ctx.globalAlpha = 0.18;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(s.pointer.x * width, s.pointer.y * height, STIR_RADIUS, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    s.redraw = () => {
      if (width === 0) return;
      draw();
    };
    // Run the simulation forward without drawing, so new data starts as clusters, not a blob.
    s.settle = () => {
      for (let i = 0; i < 90; i++) step(1 / 60);
    };

    readTheme();
    resize();
    if (s.points.length === 0) reset();
    draw();

    // Animation loop, paused when off screen or the tab is hidden.
    let raf = 0;
    let last = 0;
    let visible = true;
    const loop = (time: number) => {
      const dt = last ? Math.min((time - last) / 1000, 1 / 20) : 1 / 60;
      last = time;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced || raf || !visible || document.hidden || !enabledRef.current) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    runRef.current = { start, stop };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    // Re-read colours when the theme changes.
    const mo = new MutationObserver(() => {
      readTheme();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Pointer interaction.
    const toLocal = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height };
    };
    const onMove = (e: PointerEvent) => {
      const pos = toLocal(e);
      s.pointer = { ...pos, active: true };
      if (reduced) {
        // Without motion: apply a few steps so the stir is still visible.
        for (let i = 0; i < 6; i++) step(1 / 60);
        draw();
      }
    };
    const onLeave = () => {
      s.pointer.active = false;
      if (reduced) draw();
    };
    const onDown = (e: PointerEvent) => {
      const pos = toLocal(e);
      const now = performance.now();
      const burst: Source = { ax: 0, ay: 0, fx: 0, fy: 0, px: 0, py: 0, spread: 0.035, x: pos.x, y: pos.y, temp: true, until: now + 9000 };
      s.sources.push(burst);
      const idx = s.sources.length - 1;
      const room = Math.max(0, MAX_POINTS - s.points.length);
      const add = Math.min(18, room);
      for (let i = 0; i < add; i++) s.points.push(spawnPoint(idx, s.t));
      setCount(s.points.length);
      if (reduced) {
        for (let i = 0; i < 30; i++) step(1 / 60);
        draw();
      }
    };
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointercancel", onLeave);

    // Keep the point count label in sync as bursts expire.
    const counter = window.setInterval(() => setCount(s.points.length), 1000);

    start();
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointercancel", onLeave);
      window.clearInterval(counter);
    };
  }, [reset, spawnPoint]);

  useEffect(() => {
    enabledRef.current = active && tab === "play";
    if (enabledRef.current) runRef.current.start();
    else runRef.current.stop();
  }, [active, tab]);

  const button =
    "inline-flex size-8 items-center justify-center rounded-md border border-line text-fg transition-colors hover:bg-surface-2 disabled:opacity-40 disabled:hover:bg-transparent";

  return (
    <div
      ref={wrapRef}
      className="h-full rounded-2xl border border-line bg-surface p-4 sm:p-5"
      data-game="clustering"
      data-k={k}
      data-points={count}
      data-tab={tab}
    >
      <GameHeader baseId={baseId} title="Live clustering" dotClass="bg-[#14b3a3]" tab={tab} onTab={setTab} />

      {/* Play */}
      <div role="tabpanel" id={`${baseId}-panel-play`} aria-labelledby={`${baseId}-tab-play`} hidden={tab !== "play"} className="mt-3">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-muted">Groups to find</p>
          <div className="flex items-center gap-1.5">
            <button type="button" className={button} onClick={() => setK((v) => Math.max(MIN_K, v - 1))} disabled={k <= MIN_K} aria-label="Fewer groups">
              <Minus className="size-4" aria-hidden="true" />
            </button>
            <span className="min-w-[4.5rem] text-center text-sm tabular-nums text-fg" aria-live="polite">
              {k} groups
            </span>
            <button type="button" className={button} onClick={() => setK((v) => Math.min(MAX_K, v + 1))} disabled={k >= MAX_K} aria-label="More groups">
              <Plus className="size-4" aria-hidden="true" />
            </button>
            <button type="button" className={`${button} ml-1.5`} onClick={reset} aria-label="Shuffle the data">
              <Shuffle className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Animated k-means clustering of ${count} dots into ${k} groups. Move the pointer over it to scatter the dots, or click to add more.`}
          className="mt-3 aspect-square w-full cursor-crosshair touch-pan-y rounded-xl border border-line bg-bg"
        />

        <p className="mt-3 text-sm leading-relaxed text-muted">
          The computer sorts the dots into {k} groups, one colour each. Every{" "}
          <span className="font-medium text-fg">⊕</span> is a group&apos;s centre, chasing the middle of its dots.
        </p>
        <p className="mt-1.5 flex items-center justify-between gap-3 text-sm text-subtle">
          <span>{touch ? "Drag to scatter the dots. Tap to add more." : "Move your mouse to scatter the dots. Click to add more."}</span>
          <span className="shrink-0 tabular-nums">{count} dots</span>
        </p>
      </div>

      {/* How it works */}
      <div
        role="tabpanel"
        id={`${baseId}-panel-info`}
        aria-labelledby={`${baseId}-tab-info`}
        hidden={tab !== "info"}
        className="mt-3 space-y-4 text-sm leading-relaxed text-muted"
      >
        <section>
          <h3 className="font-medium text-fg">How to play</h3>
          <ol className="mt-1.5 list-decimal space-y-1 pl-5 marker:text-subtle">
            <li>Watch the coloured dots. The computer sorts them into groups, one colour per group.</li>
            <li>{touch ? "Drag your finger" : "Move your mouse"} through the dots to scatter them, and watch the groups re-form.</li>
            <li>{touch ? "Tap" : "Click"} to drop in new dots. Use − and + to change how many groups it looks for, or shuffle for new data.</li>
          </ol>
          <p className="mt-1.5">Try 2 groups: it has to merge clusters that don&apos;t belong together. Try 6: it splits real ones apart.</p>
        </section>
        <section>
          <h3 className="font-medium text-fg">What&apos;s happening</h3>
          <p className="mt-1.5">
            This is <span className="text-fg">k-means clustering</span>, a machine learning method for finding groups in data
            that nobody has labelled. &quot;k&quot; is the number of groups.
          </p>
          <p className="mt-1.5">
            It repeats two steps, many times a second: every dot joins its nearest centre (⊕), then each centre moves to the
            middle of its dots. Businesses use the same idea to group similar customers.
          </p>
          <p className="mt-1.5">It runs entirely in your browser, written from scratch with no machine learning library.</p>
        </section>
        <p>
          <a
            href={SOURCE_CODE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
          >
            See the code on GitHub<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
        <button
          type="button"
          onClick={() => setTab("play")}
          className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
        >
          <Play className="size-4" aria-hidden="true" />
          Back to the dots
        </button>
      </div>
    </div>
  );
}
