"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { navItems, site } from "@/content/site";
import { withBase } from "@/lib/paths";
import { ThemeToggle } from "./ThemeToggle";

export function Nav() {
  const [active, setActive] = useState<string>("home");
  const [open, setOpen] = useState(false);
  const [pendingTarget, setPendingTarget] = useState<string | null>(null);

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
      <header className="sticky top-0 z-50 border-b border-line bg-bg/85 backdrop-blur-md">
        <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <a href="#home" className="text-[0.95rem] font-semibold tracking-tight text-fg">
            {site.shortName}
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                      isActive ? "bg-surface-2 text-fg" : "text-muted hover:text-fg"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={withBase(site.cvPath)}
              download
              className="hidden items-center gap-2 rounded-md border border-line-strong px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2 sm:inline-flex"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-md text-fg hover:bg-surface-2 lg:hidden"
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
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-bg lg:hidden">
          <ul className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={(event) => {
                    event.preventDefault();
                    setPendingTarget(item.id);
                    setOpen(false);
                  }}
                  aria-current={active === item.id ? "location" : undefined}
                  className={`block border-b border-line py-4 text-lg ${active === item.id ? "text-fg" : "text-muted"}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
            <a
              href={withBase(site.cvPath)}
              download
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 text-sm font-medium text-on-accent"
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
