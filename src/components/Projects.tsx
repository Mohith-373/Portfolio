"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { categories, projects, type Category, type Project } from "@/content/projects";
import { GitHubIcon } from "./BrandIcons";
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
      title="Featured projects"
      lead="Coursework, independent and undergraduate projects, strongest first. Open a project to read the full case study."
    >
      <div role="group" aria-label="Filter projects by category" className="-mx-1 flex flex-wrap gap-2">
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
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  selected
                    ? "border-fg bg-fg text-bg"
                    : "border-line bg-surface text-muted hover:border-line-strong hover:text-fg"
                }`}
              >
                {c}
                <span className={`ml-1.5 tabular-nums ${selected ? "text-bg/70" : "text-subtle"}`}>
                  {c === "All" ? projects.length : counts.get(c)}
                </span>
              </button>
            );
          })}
      </div>
      <p className="sr-only" role="status">
        Showing {shown.length} {shown.length === 1 ? "project" : "projects"}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {shown.map((project) => (
          <ProjectCard key={project.slug} project={project} wide={filter === "All" && !!project.featured} />
        ))}
      </div>
    </Section>
  );
}

function ProjectCard({ project, wide }: { project: Project; wide: boolean }) {
  const caseStudy = (
    <details className="group mt-6 border-t border-line pt-4">
      <summary className="inline-flex cursor-pointer items-center gap-1.5 rounded text-sm font-medium text-fg">
        Read case study
        <ChevronDown className="chevron size-4 text-muted transition-transform" aria-hidden="true" />
      </summary>
      <dl className="mt-4 space-y-5 text-[0.9375rem] leading-relaxed">
        {!wide ? (
          <>
            <Field label="Problem">{project.problem}</Field>
            <Field label="Objective">{project.objective}</Field>
          </>
        ) : null}
        <Field label="My contribution">{project.contribution}</Field>
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
        {project.results?.length ? (
          <Field label="Results">
            <List items={project.results} />
          </Field>
        ) : null}
      </dl>
    </details>
  );

  const header = (
    <>
      <p className="flex items-baseline justify-between gap-4 text-sm text-muted">
        <span>{project.context}</span>
        <span className="tabular-nums text-subtle">{project.year}</span>
      </p>
      <h3 className="mt-3 text-lg font-semibold tracking-[-0.015em] text-fg sm:text-xl">{project.title}</h3>
      <p className="mt-2 leading-relaxed text-muted">{project.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
        {project.stack.map((tech) => (
          <li key={tech} className="rounded-md bg-surface-2 px-2 py-0.5 text-[0.8125rem] text-muted">
            {tech}
          </li>
        ))}
      </ul>
      {project.status ? (
        <p className="mt-4 border-l-2 border-line-strong pl-3 text-sm leading-relaxed text-muted">{project.status}</p>
      ) : null}
      <Links project={project} />
    </>
  );

  return (
    <article
      id={`project-${project.slug}`}
      className={`scroll-mt-24 rounded-xl border border-line bg-surface p-6 sm:p-7 ${wide ? "md:col-span-2" : ""}`}
    >
      {wide ? (
        <div className="grid gap-8 md:grid-cols-[1.05fr_1fr] md:gap-10">
          <div>{header}</div>
          <div className="md:border-l md:border-line md:pl-10">
            <dl className="space-y-5 text-[0.9375rem] leading-relaxed">
              <Field label="Problem">{project.problem}</Field>
              <Field label="Objective">{project.objective}</Field>
            </dl>
            {caseStudy}
          </div>
        </div>
      ) : (
        <>
          {header}
          {caseStudy}
        </>
      )}
    </article>
  );
}

function Links({ project }: { project: Project }) {
  if (!project.repo && !project.demo) return null;
  return (
    <p className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
      {project.repo ? (
        <a
          href={project.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
        >
          <GitHubIcon className="size-4" />
          View code<span className="sr-only"> for {project.title} on GitHub (opens in a new tab)</span>
        </a>
      ) : null}
      {project.demo ? (
        <a
          href={project.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-medium text-fg underline decoration-line-strong underline-offset-4 hover:decoration-fg"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          Live site<span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      ) : null}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-sm font-medium text-fg">{label}</dt>
      <dd className="mt-1 text-muted">{children}</dd>
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
