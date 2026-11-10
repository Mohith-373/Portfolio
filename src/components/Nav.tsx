"use client";

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Download, Menu, X } from "lucide-react";
import { navItems, site } from "@/content/site";
import { withBase } from "@/lib/paths";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);

  // Scroll to a section picked in the mobile menu only after the menu has closed
  // and page scrolling is unlocked, so the target position is measured correctly.
  useEffect(() => {
    if (open || !pendingTarget) return;
    document.getElementById(pendingTarget)?.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#${pendingTarget}`);
    setPendingTarget(null);
  }, [open, pendingTarget]);

  // Highlight the nav item for the section crossing the middle of the viewport.
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Desktop: one highlight slides between links instead of each link switching on and off.
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measure = () => {
      // Each link sits in its own positioned <li>, so the offset comes from that item.
      const item = list.querySelector<HTMLElement>(`a[href="#${active}"]`)?.parentElement;
      setPill(item ? { x: item.offsetLeft, width: item.offsetWidth } : null);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, [active]);

  // Close the mobile menu with Escape, and stop the page scrolling behind it.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Phones and tablets: a solid full-width bar (a blurred sticky bar is the costliest thing
          to repaint while scrolling). Desktop: a floating glass pill. */}
      <header className="sticky top-0 z-50 border-b border-line bg-bg pt-[env(safe-area-inset-top)] lg:pointer-events-none lg:border-b-0 lg:bg-transparent lg:pt-3">
        <nav
          aria-label="Main"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:pointer-events-auto lg:h-14 lg:w-[calc(100%-3rem)] lg:max-w-5xl lg:rounded-full lg:border lg:border-line lg:bg-surface/70 lg:pl-5 lg:pr-2.5 lg:shadow-[var(--shadow-float)] lg:backdrop-blur-xl"
        >
          <a href="#home" className="tap inline-flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-tight text-fg">
            <span
              className="grid size-7 place-items-center rounded-lg bg-gradient-to-br from-accent to-accent-2 text-[0.8125rem] font-bold text-on-accent"
              aria-hidden="true"
            >
              M
            </span>
            {site.shortName}
          </a>

          <ul ref={listRef} className="relative hidden items-center gap-0.5 lg:flex">
            <li
              aria-hidden="true"
              className="nav-pill pointer-events-none absolute inset-y-0 left-0 rounded-full bg-surface-2 ring-1 ring-inset ring-line"
              style={{ transform: `translateX(${pill?.x ?? 0}px)`, width: pill?.width ?? 0, opacity: pill ? 1 : 0 }}
            />
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`block rounded-full px-3 py-1.5 text-sm transition-colors duration-300 ${
                      isActive ? "font-medium text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-1.5">
            <ThemeToggle />
            <a
              href={withBase(site.cvPath)}
              download
              data-magnetic
              className="hidden items-center gap-2 rounded-full bg-fg px-3.5 py-1.5 text-sm font-medium text-bg transition-opacity hover:opacity-85 sm:inline-flex"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
            <button
              type="button"
              className="tap inline-flex size-9 items-center justify-center rounded-full text-fg transition-colors hover:bg-surface-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Outside the header: its backdrop blur would otherwise contain this fixed panel. */}
      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[calc(4rem+env(safe-area-inset-top))] z-40 flex flex-col overflow-y-auto overscroll-contain bg-bg pb-[env(safe-area-inset-bottom)] motion-safe:animate-[menu-in_0.25s_ease-out] lg:hidden"
        >
          <ul className="mx-auto w-full max-w-6xl flex-1 px-4 py-4 sm:px-6">
            {navItems.map((item, i) => (
              <li key={item.id} className="menu-link" style={{ "--i": i } as CSSProperties}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setPendingTarget(item.id);
                    setOpen(false);
                  }}
                  aria-current={active === item.id ? "location" : undefined}
                  className={`flex items-baseline gap-4 border-b border-line py-4 text-[1.75rem] font-medium tracking-[-0.03em] ${
                    active === item.id ? "text-fg" : "text-muted"
                  }`}
                >
                  <span className="eyebrow w-6 text-accent" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="menu-link mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6" style={{ "--i": navItems.length } as CSSProperties}>
            <a
              href={withBase(site.cvPath)}
              download
              className="btn-primary tap inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-medium"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}
