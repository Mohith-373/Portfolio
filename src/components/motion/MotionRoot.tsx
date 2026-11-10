"use client";

import { useEffect, useRef } from "react";

// One client component drives every page-wide interaction, so sections stay server
// components and only add data attributes:
//   data-reveal            fade/slide in when scrolled into view ("title" = masked words)
//   data-magnetic          element leans towards the pointer
//   data-spot              sets --mx/--my for the spotlight in globals.css
//   data-tilt              first child tilts in 3D under the pointer
// Pointer effects are attached only for a mouse or trackpad; touch screens get the
// reveals and nothing else. Everything is removed again on unmount.
export function MotionRoot() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Scroll reveals -------------------------------------------------
    const show = (el: Element) => el.classList.add("is-in");
    let io: IntersectionObserver | null = null;
    let mo: MutationObserver | null = null;
    const all = () => document.querySelectorAll("[data-reveal]:not(.is-in)");
    if (reduced || !("IntersectionObserver" in window)) {
      all().forEach(show);
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            show(entry.target);
            io?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      all().forEach((el) => io?.observe(el));
      // Cards that mount later (for example after a project filter changes).
      mo = new MutationObserver(() => all().forEach((el) => io?.observe(el)));
      const main = document.getElementById("main");
      if (main) mo.observe(main, { childList: true, subtree: true });
    }

    // ---- Pointer effects (mouse and trackpad only) -----------------------
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || reduced) {
      return () => {
        io?.disconnect();
        mo?.disconnect();
      };
    }

    const cursor = cursorRef.current;
    let raf = 0;
    let tx = -100;
    let ty = -100;
    let cx = -100;
    let cy = -100;
    let magnet: HTMLElement | null = null;
    let tilt: HTMLElement | null = null;

    // The follower eases towards the pointer and stops the loop once it has caught up.
    const follow = () => {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      if (cursor) cursor.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.2 ? requestAnimationFrame(follow) : 0;
    };

    const release = () => {
      if (magnet) magnet.style.translate = "";
      magnet = null;
    };
    const flatten = () => {
      const inner = tilt?.firstElementChild as HTMLElement | null;
      if (inner) inner.style.transform = "";
      tilt = null;
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      tx = event.clientX;
      ty = event.clientY;
      if (cursor) {
        if (cx < 0) {
          cx = tx;
          cy = ty;
        }
        cursor.classList.add("on");
        if (!raf) raf = requestAnimationFrame(follow);
      }

      const target = event.target as Element | null;
      if (!target?.closest) return;
      cursor?.classList.toggle("hot", !!target.closest("a, button, summary, [data-cursor]"));

      const m = target.closest<HTMLElement>("[data-magnetic]");
      if (m !== magnet) release();
      if (m) {
        magnet = m;
        const r = m.getBoundingClientRect();
        const dx = (tx - (r.left + r.width / 2)) * 0.28;
        const dy = (ty - (r.top + r.height / 2)) * 0.4;
        m.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      }

      const spot = target.closest<HTMLElement>("[data-spot]");
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${(tx - r.left).toFixed(0)}px`);
        spot.style.setProperty("--my", `${(ty - r.top).toFixed(0)}px`);
      }

      const t = target.closest<HTMLElement>("[data-tilt]");
      if (t !== tilt) flatten();
      if (t) {
        tilt = t;
        const r = t.getBoundingClientRect();
        const px = (tx - r.left) / r.width - 0.5;
        const py = (ty - r.top) / r.height - 0.5;
        const inner = t.firstElementChild as HTMLElement | null;
        if (inner) inner.style.transform = `perspective(900px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 9).toFixed(2)}deg)`;
      }
    };
    const onLeave = () => {
      cursor?.classList.remove("on");
      release();
      flatten();
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      io?.disconnect();
      mo?.disconnect();
      cancelAnimationFrame(raf);
      document.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      release();
      flatten();
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <div ref={cursorRef} className="cursor" aria-hidden="true" />
    </>
  );
}
