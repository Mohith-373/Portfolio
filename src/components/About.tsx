import { about, education } from "@/content/profile";
import { Section } from "./Section";

export function About() {
  return (
    <Section id="about" title="About me" lead="From an undergraduate degree in AI to postgraduate data science in the UK.">
      <div className="grid gap-12 md:grid-cols-[1fr_15rem]">
        <div className="max-w-[65ch] space-y-5 text-[1.0625rem] leading-relaxed text-muted">
          {about.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>

        <aside aria-label="Education timeline">
          <ol className="relative space-y-8 border-l border-line pl-6">
            {education.map((item) => (
              <li key={item.degree} className="relative">
                <span
                  className={`absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full border-2 ${
                    item.status === "In progress" ? "border-accent bg-bg" : "border-line-strong bg-line-strong"
                  }`}
                  aria-hidden="true"
                />
                <p className="text-sm tabular-nums text-subtle">{item.years}</p>
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
