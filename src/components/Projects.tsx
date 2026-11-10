"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { categories, projects, type Category, type Project } from "@/content/projects";
import { GitHubIcon } from "./BrandIcons";
import { ProjectVisual } from "./ProjectVisual";
import { Section } from "./Section";

type Filter = "All" | Category;

export function Projects() {
  const [filter, setFilter] = useState<Filter>("All");

  // Links like #project-nifty-drawdown-alert (from Skills) must land on a visible card,
  // so clear any active filter and scroll once the full list has rendered.
  useEffect(() => {
    const onHash = () => {
      const id = window.location.hash.slice(1);
      if (!id.startsWith("project-")) return;
      setFilter("All");
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "start" }));
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const counts = useMemo(() => {
    const map = new Map<Category, number>();
    for (const c of categories) map.set(c, projects.filter((p) => p.categories.includes(c)).length);
    return map;
  }, []);

  const shown = filter === "All" ? projects : projects.filter((p) => p.categories.includes(filter));

  return (
    <Section
      id="projects"
      title="Selected projects"
      lead="Academic, coursework and independent projects. Each one states what it is, what I did, and where it stands today."
    >
      <div data-reveal role="group" aria-label="Filter projects by category" className="-mx-1 flex flex-wrap gap-2">
        {(["All", ...categories] as Filter[])
          .filter((c) => c === "All" || (counts.get(c) ?? 0) > 0)
          .map((c) => {
            const selected = filter === c;
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selected}
                onClick={() => setFilter(c)}
                className={`tap inline-flex items-center rounded-full border px-3.5 py-1.5 text-sm transition-colors duration-300 ${
                  selected
                    ? "border-accent bg-accent font-medium text-on-accent"
                    : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                {c}
                <span className={`ml-1.5 tabular-nums ${selected ? "opacity-70" : "text-subtle"}`}>
                  {c === "All" ? projects.length : counts.get(c)}
                </span>
              </button>
            );
          })}
      </div>
      <p className="sr-only" role="status">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>

      <div className="mt-10 space-y-6 sm:space-y-8">
        {shown.map((project) => (
          <ProjectShowcase key={project.slug} project={project} number={projects.indexOf(project) + 1} />
        ))}
      </div>
    </Section>
  );
}

// One project, presented like a product: a drawn preview on top, the essentials beside
// the problem it solves, and the full case study behind a disclosure.
function ProjectShowcase({ project, number }: { project: Project; number: number }) {
  return (
    <article id={`project-${project.slug}`} data-reveal data-spot className="card group/card scroll-mt-28 overflow-hidden">
      <div data-tilt className="border-b border-line">
        <div className="pv relative aspect-[16/8] sm:aspect-[16/6]">
          <ProjectVisual slug={project.slug} />
          <span className="eyebrow absolute left-5 top-5 text-subtle sm:left-8 sm:top-6" aria-hidden="true">
            {String(number).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </span>
          <span className="eyebrow absolute right-5 top-5 tabular-nums text-subtle sm:right-8 sm:top-6">{project.year}</span>
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <p className="eyebrow text-accent">{project.context}</p>
          <h3 className="mt-3 text-2xl font-semibold leading-[1.1] tracking-[-0.03em] text-fg sm:text-[2rem]">{project.title}</h3>
          <p className="mt-4 leading-relaxed text-muted">{project.summary}</p>
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-md border border-line bg-surface-2/60 px-2 py-0.5 font-mono text-xs text-muted">
                {tech}
              </li>
            ))}
          </ul>
          {project.status ? (
            <p className="mt-5 border-l-2 border-accent/40 pl-3 text-sm leading-relaxed text-muted">{project.status}</p>
          ) : null}
          <Links project={project} />
        </div>

        <div>
          <dl className="space-y-5 text-[0.9375rem] leading-relaxed">
            <Field label="Problem">{project.problem}</Field>
            <Field label="My contribution">{project.contribution}</Field>
            {project.results?.length ? (
              <Field label="Key outcomes">
                <List items={project.results} />
              </Field>
            ) : null}
          </dl>

          <details className="mt-6 border-t border-line pt-4">
            <summary className="tap inline-flex cursor-pointer items-center gap-1.5 rounded text-sm font-medium text-fg">
              Read case study
              <ChevronDown className="chevron size-4 text-muted transition-transform duration-300" aria-hidden="true" />
            </summary>
            <dl className="mt-4 space-y-5 text-[0.9375rem] leading-relaxed">
              <Field label="Objective">{project.objective}</Field>
              <Field label="Approach">
                <List items={project.approach} />
              </Field>
              <Field label="Key technical decisions">
                <List items={project.decisions} />
              </Field>
              {project.challenges?.length ? (
                <Field label="Challenges">
                  <List items={project.challenges} />
                </Field>
              ) : null}
            </dl>
          </details>
        </div>
      </div>
    </article>
  );
}

function Links({ project }: { project: Project }) {
  if (!project.repo && !project.demo) return null;
  const link =
    "tap group/link inline-flex items-center gap-2 rounded-full border border-line-strong bg-surface px-4 py-2 font-medium text-fg transition-colors duration-300 hover:border-accent/60 hover:text-accent";
  return (
    <p className="mt-6 flex flex-wrap gap-2.5 text-sm">
      {project.repo ? (
        <a href={project.repo} target="_blank" rel="noopener noreferrer" data-magnetic className={link}>
          <GitHubIcon className="size-4" />
          View code<span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span>
        </a>
      ) : null}
      {project.demo ? (
        <a href={project.demo} target="_blank" rel="noopener noreferrer" data-magnetic className={link}>
          Live site<span className="sr-only"> for {project.title} (opens in a new tab)</span>
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
        </a>
      ) : null}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="eyebrow text-subtle">{label}</dt>
      <dd className="mt-1.5 text-muted">{children}</dd>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-line-strong">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
