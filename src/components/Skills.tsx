import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { Section } from "./Section";

const projectTitle = new Map(projects.map((p) => [p.slug, p.title]));

// Every skill once, split into two ribbons that drift in opposite directions.
const allSkills = skillGroups.flatMap((group) => group.items);
const half = Math.ceil(allSkills.length / 2);
const ribbons = [allSkills.slice(0, half), allSkills.slice(half)];

function Ribbon({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const track = (hidden: boolean) => (
    <ul className="marquee-track" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li key={item} className="whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm text-fg/90">
          {item}
        </li>
      ))}
    </ul>
  );
  // The second copy only exists to make the loop seamless.
  return (
    <div className={`marquee ${reverse ? "reverse" : ""}`}>
      {track(false)}
      {track(true)}
    </div>
  );
}

export function Skills() {
  return (
    <Section
      id="skills"
      title="Technical skills"
      lead="Tools and topics I use or am learning, grouped by area. These aren't proficiency ratings: where an area is used in a project, the project is linked."
    >
      {/* Decorative overview; the same skills are listed by area in the cards below. */}
      <div data-reveal className="space-y-3" aria-hidden="true">
        <Ribbon items={ribbons[0]} />
        <Ribbon items={ribbons[1]} reverse />
      </div>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        {skillGroups.map((group, i) => (
          <div key={group.area} data-reveal data-spot style={{ "--i": i % 2 } as CSSProperties} className="card flex flex-col p-5 sm:p-6">
            <dt className="flex items-baseline justify-between gap-3">
              <span className="text-lg font-medium tracking-[-0.02em] text-fg">{group.area}</span>
              <span className="eyebrow text-subtle" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </dt>
            <dd className="mt-4 flex flex-1 flex-col">
              <ul className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <li key={item} className="rounded-md border border-line bg-surface-2/60 px-2.5 py-1 text-sm text-fg/90">
                    {item}
                  </li>
                ))}
              </ul>
              {group.learning?.length ? (
                <div className="mt-4">
                  <p className="eyebrow text-subtle">Learning</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {group.learning.map((item) => (
                      <li key={item} className="rounded-md border border-dashed border-line-strong px-2.5 py-1 text-sm text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="mt-auto pt-5">
                {group.appliedIn.length > 0 ? (
                  <ul className="space-y-1 border-t border-line pt-4 text-sm" aria-label={`Projects using ${group.area}`}>
                    {group.appliedIn.map((slug) => (
                      <li key={slug}>
                        <a
                          href={`#project-${slug}`}
                          className="tap group relative z-10 inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent"
                        >
                          <ArrowUpRight className="size-3.5 shrink-0 text-accent transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                          {projectTitle.get(slug) ?? slug}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="border-t border-line pt-4 text-sm text-subtle">Learning through my MSc and self-study</p>
                )}
              </div>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
