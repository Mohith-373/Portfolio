import type { CSSProperties } from "react";
import { Award, BookOpen, Dumbbell, Mountain, type LucideIcon } from "lucide-react";
import {
  beyondTechnology,
  certifications,
  coursesInProgress,
  currentlyExploring,
  experience,
} from "@/content/profile";
import { site } from "@/content/site";
import { Section } from "./Section";

export function Exploring() {
  return (
    <Section
      id="exploring"
      title="Currently building & exploring"
      lead={`What I'm working on alongside my lectures. Last updated ${site.lastUpdated}.`}
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {currentlyExploring.map((item, i) => (
          <li key={item} data-reveal style={{ "--i": i % 2 } as CSSProperties} className="card flex items-baseline gap-3.5 px-4 py-3.5 text-fg/90">
            <span className="font-mono text-xs tabular-nums text-accent" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Certifications() {
  return (
    <Section
      id="certifications"
      title="Certifications & professional development"
      lead="Only certificates I've completed and can verify are listed here."
    >
      {certifications.length > 0 ? (
        <ul className="divide-y divide-line border-y border-line">
          {certifications.map((cert) => (
            <li key={cert.title} className="flex flex-col gap-2 py-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex gap-3">
                <Award className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
                <div>
                  <p className="font-medium text-fg">{cert.title}</p>
                  <p className="text-sm text-muted">
                    {cert.issuer}, {cert.date}
                    {cert.credentialId ? `. Credential ID ${cert.credentialId}` : ""}
                  </p>
                </div>
              </div>
              {cert.verifyUrl ? (
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-accent underline decoration-accent/30 underline-offset-2"
                >
                  Verify<span className="sr-only"> {cert.title} (opens in a new tab)</span>
                </a>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-xl border border-dashed border-line-strong p-5">
          <p className="font-medium text-fg">No certifications listed yet</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Completed certificates will appear here with the issuer, completion date and a verification link.
          </p>
        </div>
      )}

      <h3 className="mt-10 font-medium text-fg">Courses in progress</h3>
      {coursesInProgress.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {coursesInProgress.map((course) => (
            <li key={course.title} className="text-muted">
              <span className="text-fg">{course.title}</span>, {course.provider}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-muted">
          None outside my degree right now. My current study is the MSc Data Science programme, listed under{" "}
          <a href="#education" className="text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent">
            Academic journey
          </a>
          .
        </p>
      )}
    </Section>
  );
}

export function Experience() {
  return (
    <Section
      id="experience"
      title="Academic & independent experience"
      lead="Coursework, academic and independent work. None of it is paid employment."
    >
      <ol data-reveal className="card divide-y divide-line px-5 sm:px-8">
        {experience.map((item) => (
          <li key={item.title + item.period} className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <p className="pt-0.5 font-mono text-xs tabular-nums text-subtle">{item.period}</p>
            <div>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-medium text-fg">{item.title}</span>
                <span className="rounded-full border border-line px-2 py-0.5 text-xs text-muted">{item.kind}</span>
              </p>
              <p className="mt-1.5 max-w-[65ch] leading-relaxed text-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const beyondIcons: Record<(typeof beyondTechnology)[number]["icon"], LucideIcon> = {
  dumbbell: Dumbbell,
  mountain: Mountain,
  book: BookOpen,
};

export function Beyond() {
  return (
    <Section id="beyond" title="Beyond technology" lead="What I do away from a screen.">
      <ul className="grid gap-4 sm:grid-cols-3">
        {beyondTechnology.map((item, i) => {
          const Icon = beyondIcons[item.icon];
          return (
            <li
              key={item.label}
              data-reveal
              data-spot
              style={{ "--i": i } as CSSProperties}
              className="card card-hover group flex min-h-44 flex-col justify-between p-5 sm:p-6"
            >
              <div className="flex items-start justify-between">
                <span
                  className="grid size-11 place-items-center rounded-xl border border-accent/20 bg-accent-soft text-accent transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                  aria-hidden="true"
                >
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <span className="eyebrow text-subtle" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-8 text-xl font-medium leading-snug tracking-[-0.02em] text-fg">{item.label}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
