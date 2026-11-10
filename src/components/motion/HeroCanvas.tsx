"use client";

import { useEffect, useRef } from "react";

// Hero backdrop: a slow field of points joined by faint lines where they pass close to
// each other, like a network forming and dissolving. Points near the pointer link to it.
// Pure canvas, no libraries. It stops completely when the hero is off screen or the tab
// is hidden, draws one still frame for reduced motion, and uses fewer points on phones.

type Point = { x: number; y: number; vx: number; vy: number; r: number };

const LEVELS = 4; // lines are drawn in a few opacity bands, one draw call per band

export function HeroCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reach = coarse ? 105 : 150;

    let width = 0;
    let height = 0;
    let points: Point[] = [];
    let rgb = "138, 169, 255";
    let raf = 0;
    let onScreen = true;
    const pointer = { x: -9999, y: -9999 };

    const readColor = () => {
      const hex = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      const m = /^#([0-9a-f]{6})$/i.exec(hex);
      if (!m) return;
      const n = parseInt(m[1], 16);
      rgb = `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(coarse ? 42 : 110, (width * height) / 13000));
      if (points.length === count) return;
      points = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: 0.6 + Math.random() * 1.5,
      }));
    };

    const draw = (move: boolean) => {
      ctx.clearRect(0, 0, width, height);
      if (move) {
        for (const p of points) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = width + 20;
          else if (p.x > width + 20) p.x = -20;
          if (p.y < -20) p.y = height + 20;
          else if (p.y > height + 20) p.y = -20;
        }
      }

      // Sort each link into an opacity band, then stroke each band once.
      const bands: number[][] = Array.from({ length: LEVELS }, () => []);
      const reach2 = reach * reach;
      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const b = points[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > reach2) continue;
          const band = Math.min(LEVELS - 1, Math.floor((1 - d2 / reach2) * LEVELS));
          bands[band].push(a.x, a.y, b.x, b.y);
        }
      }
      ctx.lineWidth = 1;
      for (let band = 0; band < LEVELS; band++) {
        const seg = bands[band];
        if (seg.length === 0) continue;
        ctx.strokeStyle = `rgba(${rgb}, ${0.05 + band * 0.055})`;
        ctx.beginPath();
        for (let k = 0; k < seg.length; k += 4) {
          ctx.moveTo(seg[k], seg[k + 1]);
          ctx.lineTo(seg[k + 2], seg[k + 3]);
        }
        ctx.stroke();
      }

      // Links from nearby points to the pointer.
      const near = 190 * 190;
      ctx.strokeStyle = `rgba(${rgb}, 0.35)`;
      ctx.beginPath();
      for (const p of points) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        if (dx * dx + dy * dy > near) continue;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(pointer.x, pointer.y);
      }
      ctx.stroke();

      ctx.fillStyle = `rgba(${rgb}, 0.75)`;
      ctx.beginPath();
      for (const p of points) {
        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      }
      ctx.fill();
    };

    const loop = () => {
      draw(true);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (reduced || raf || !onScreen || document.hidden) return;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    readColor();
    resize();
    draw(false);

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
      else stop();
    });
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      draw(false);
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      readColor();
      draw(false);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // The canvas sits behind the hero text, so the pointer is tracked on its section.
    const host = canvas.parentElement;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    host?.addEventListener("pointermove", onMove, { passive: true });
    host?.addEventListener("pointerleave", onLeave);

    start();
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      host?.removeEventListener("pointermove", onMove);
      host?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 -z-10 size-full" />;
}
