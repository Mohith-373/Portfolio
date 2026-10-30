import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";
import { Section } from "./Section";

const projectTitle = new Map(projects.map((p) => [p.slug, p.title]));

export function Skills() {
  return (
    <Section
      id="skills"
      title="Technical skills"
      lead="Tools and topics I use or am learning, grouped by area. These aren't proficiency ratings: where an area is used in a project, the project is linked."
    >
      <dl className="divide-y divide-line border-y border-line">
        {skillGroups.map((group) => (
          <div key={group.area} className="grid gap-2 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
            <dt className="font-medium text-fg">{group.area}</dt>
            <dd>
              <p className="leading-relaxed text-fg/90">{group.items.join(", ")}</p>
              <p className="mt-1.5 text-sm text-muted">
                {group.appliedIn.length > 0 ? (
                  <>
                    Used in{" "}
                    {group.appliedIn.map((slug, i) => (
                      <span key={slug}>
                        {i > 0 ? (i === group.appliedIn.length - 1 ? " and " : ", ") : null}
                        <a
                          href={`#project-${slug}`}
                          className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent"
                        >
                          {projectTitle.get(slug) ?? slug}
                        </a>
                      </span>
                    ))}
                  </>
                ) : (
                  <span className="text-subtle">Learning through my MSc and self-study</span>
                )}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
