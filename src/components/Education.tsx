import { academicProjects, bscAreas, education, englishTest, mscModules, type AcademicProject } from "@/content/profile";
import { Section } from "./Section";

export function Education() {
  const [msc, bsc] = education;
  return (
    <Section
      id="education"
      title="Academic journey"
      lead="How my MSc builds on an undergraduate foundation in artificial intelligence and data science."
    >
      <div className="relative space-y-5 pl-7 sm:pl-10">
        <div className="absolute bottom-3 left-[5px] top-3 w-px bg-line" aria-hidden="true">
          <div className="rail-fill size-full origin-top bg-gradient-to-b from-accent to-accent-2" />
        </div>
        <div data-reveal className="relative">
          <span className="absolute -left-7 top-9 size-[11px] rounded-full border-2 border-accent bg-bg sm:-left-10" aria-hidden="true" />
        <article data-spot className="card card-featured p-5 sm:p-8">
          <Degree item={msc} />
          <h3 className="eyebrow mt-8 border-t border-line pt-6 text-subtle">MSc learning areas</h3>
          <p className="mt-2 text-sm text-muted">Modules I&apos;m studying this year, listed as learning areas rather than qualifications.</p>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {mscModules.map((module, i) => (
              <li key={module} className="flex items-baseline gap-3 rounded-lg border border-line bg-surface-2/50 px-3 py-2.5 text-[0.9375rem] text-fg/90">
                <span className="font-mono text-xs tabular-nums text-subtle" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {module}
              </li>
            ))}
          </ul>

          {/* Shown once there is a write-up in content/profile.ts. */}
          {academicProjects.length > 0 ? (
            <>
              <h3 className="mt-10 font-medium text-fg">Coursework write-ups</h3>
              <div className="mt-4 grid gap-5 md:grid-cols-2">
                {academicProjects.map((project) => (
                  <AcademicCard key={project.title} project={project} />
                ))}
              </div>
            </>
          ) : (
            <p className="mt-6 text-sm leading-relaxed text-muted">
              Lab projects from this term are in{" "}
              <a href="#projects" className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
                Projects
              </a>
              .
            </p>
          )}
        </article>
        </div>

        <div data-reveal className="relative">
          <span className="absolute -left-7 top-9 size-[11px] rounded-full border-2 border-line-strong bg-line-strong sm:-left-10" aria-hidden="true" />
        <article data-spot className="card p-5 sm:p-8">
          <Degree item={bsc} />
          <p className="mt-6 max-w-[65ch] leading-relaxed text-muted">
            <span className="font-medium text-fg">Covered: </span>
            {bscAreas.join(", ")}.
          </p>
          <p className="mt-2 text-sm text-muted">English language: {englishTest}</p>
        </article>
        </div>
      </div>
    </Section>
  );
}

function Degree({ item }: { item: (typeof education)[number] }) {
  return (
    <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div>
        <h3 className="text-xl font-semibold tracking-[-0.02em] text-fg sm:text-2xl">{item.degree}</h3>
        <p className="mt-1 text-muted">
          {item.institution}, {item.place}
        </p>
      </div>
      <p className="flex shrink-0 items-center gap-3 text-sm text-muted">
        <span className="font-mono text-xs tabular-nums">{item.years}</span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            item.status === "In progress" ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted"
          }`}
        >
          {item.status}
        </span>
      </p>
    </header>
  );
}

function AcademicCard({ project }: { project: AcademicProject }) {
  const rows: [string, string | undefined][] = [
    ["Problem", project.problem],
    ["Dataset", project.dataset],
    ["Methodology", project.methodology],
    ["Techniques", project.techniques?.join(", ")],
    ["Results", project.results],
    ["Critical evaluation", project.evaluation],
  ];
  return (
    <article className="rounded-xl border border-line bg-surface-2/50 p-5">
      <p className="text-sm text-muted">{project.module}</p>
      <h4 className="mt-2 font-semibold text-fg">{project.title}</h4>
      <dl className="mt-4 space-y-3 text-sm leading-relaxed">
        {rows
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label}>
              <dt className="font-medium text-fg">{label}</dt>
              <dd className="mt-0.5 text-muted">{value}</dd>
            </div>
          ))}
      </dl>
      {project.link ? (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-sm font-medium text-accent underline decoration-accent/30 underline-offset-2"
        >
          Repository or documentation<span className="sr-only"> (opens in a new tab)</span>
        </a>
      ) : null}
    </article>
  );
}
