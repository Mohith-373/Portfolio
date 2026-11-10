import type { CSSProperties } from "react";
import { about, education } from "@/content/profile";
import { Section } from "./Section";

export function About() {
  const [opening, ...rest] = about;
  return (
    <Section id="about" title="About me" lead="From an undergraduate degree in AI to postgraduate data science in the UK.">
      <div className="grid gap-10 md:grid-cols-[1fr_16rem] md:gap-12">
        <div className="max-w-[65ch]">
          {/* The opening paragraph is set large, as a standfirst. */}
          <p data-reveal className="text-[1.375rem] leading-[1.45] tracking-[-0.015em] text-fg sm:text-2xl sm:leading-[1.4]">
            {opening}
          </p>
          <div className="mt-8 space-y-5 text-[1.0625rem] leading-relaxed text-muted">
            {rest.map((paragraph, i) => (
              <p key={paragraph.slice(0, 24)} data-reveal style={{ "--i": i + 1 } as CSSProperties}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <aside data-reveal data-spot aria-label="Education timeline" className="card self-start p-5 sm:p-6" style={{ "--i": 2 } as CSSProperties}>
          <p className="eyebrow text-subtle">Timeline</p>
          <ol className="relative mt-5 space-y-7 border-l border-line pl-6">
            {education.map((item) => (
              <li key={item.degree} className="relative">
                <span
                  className={`absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full border-2 ${
                    item.status === "In progress" ? "border-accent bg-surface" : "border-line-strong bg-line-strong"
                  }`}
                  aria-hidden="true"
                />
                <p className="font-mono text-xs tabular-nums text-subtle">{item.years}</p>
                <p className="mt-1 font-medium leading-snug text-fg">{item.degree}</p>
                <p className="mt-1 text-sm text-muted">
                  {item.institution}, {item.place}
                </p>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </Section>
  );
}
