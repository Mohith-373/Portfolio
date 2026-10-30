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
      <div className="space-y-14">
        <article>
          <Degree item={msc} />
          <h3 className="mt-8 font-medium text-fg">MSc learning areas</h3>
          <p className="mt-1 text-sm text-muted">Modules I&apos;m studying this year, listed as learning areas rather than qualifications.</p>
          <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
            {mscModules.map((module) => (
              <li key={module} className="border-b border-line py-2.5 text-[0.9375rem] text-fg/90">
                {module}
              </li>
            ))}
          </ul>

          <h3 className="mt-10 font-medium text-fg">Coursework write-ups</h3>
          {academicProjects.length > 0 ? (
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              {academicProjects.map((project) => (
                <AcademicCard key={project.title} project={project} />
              ))}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-dashed border-line-strong p-5 text-sm leading-relaxed text-muted">
              <p>
                Write-ups of MSc assignments will appear here as modules finish, each with the problem, dataset, method,
                results and an evaluation of what worked.
              </p>
              <p className="mt-2">
                Lab projects from this term are already in{" "}
                <a href="#projects" className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
                  Projects
                </a>
                .
              </p>
            </div>
          )}
        </article>

        <article>
          <Degree item={bsc} />
          <p className="mt-6 max-w-[65ch] leading-relaxed text-muted">
            <span className="font-medium text-fg">Covered: </span>
            {bscAreas.join(", ")}.
          </p>
          <p className="mt-2 text-sm text-muted">English language: {englishTest}</p>
        </article>
      </div>
    </Section>
  );
}

function Degree({ item }: { item: (typeof education)[number] }) {
  return (
    <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
      <div>
        <h3 className="text-xl font-semibold tracking-[-0.015em] text-fg">{item.degree}</h3>
        <p className="mt-1 text-muted">
          {item.institution}, {item.place}
        </p>
      </div>
      <p className="flex shrink-0 items-center gap-3 text-sm text-muted">
        <span className="tabular-nums">{item.years}</span>
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
    <article className="rounded-xl border border-line bg-surface p-6">
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
