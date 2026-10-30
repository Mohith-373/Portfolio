import type { ReactNode } from "react";

// Shared section frame: heading and a one-sentence lead on the left rail,
// content on the right. Keeps every section aligned to the same grid.
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
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-[17rem_1fr] lg:gap-16">
        <header className="lg:sticky lg:top-24 lg:self-start">
          <h2 id={`${id}-title`} className="text-2xl font-semibold tracking-[-0.02em] text-fg sm:text-3xl">
            {title}
          </h2>
          {lead ? <p className="mt-3 max-w-prose text-[0.95rem] leading-relaxed text-muted">{lead}</p> : null}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
