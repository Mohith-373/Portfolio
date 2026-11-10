import type { ReactNode } from "react";
import { Split } from "./motion/Split";

// Shared section frame: number, heading and a one-sentence lead on the left rail,
// content on the right. Keeps every section aligned to the same grid. The heading's
// words slide up from a mask when the section scrolls into view.
export function Section({
  id,
  title,
  lead,
  children,
}: {
  id: string;
  title: string;
  lead?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`}>
      <div className="rule mx-auto max-w-6xl" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[17rem_1fr] lg:gap-16 lg:py-36">
        <header data-reveal="title" className="lg:sticky lg:top-28 lg:self-start">
          <p className="eyebrow mb-4 flex items-center gap-3 text-accent" aria-hidden="true">
            <span className="section-index" />
            <span className="h-px w-8 bg-accent/40" />
          </p>
          <h2
            id={`${id}-title`}
            aria-label={title}
            className="text-balance text-[2rem] font-semibold leading-[1.08] tracking-[-0.035em] text-fg sm:text-[2.5rem]"
          >
            <Split text={title} />
          </h2>
          {lead ? (
            <p data-reveal className="mt-5 max-w-prose text-[0.95rem] leading-relaxed text-muted">
              {lead}
            </p>
          ) : null}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
