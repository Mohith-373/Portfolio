import { Award, BookOpen, Cpu, Dumbbell, Mountain, type LucideIcon } from "lucide-react";
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
      <ul className="grid gap-x-10 sm:grid-cols-2">
        {currentlyExploring.map((item) => (
          <li key={item} className="flex items-start gap-3 border-b border-line py-3.5 text-fg/90">
            <span className="mt-[0.45rem] size-2 shrink-0 rounded-full border-2 border-accent" aria-hidden="true" />
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
      <ol className="divide-y divide-line border-y border-line">
        {experience.map((item) => (
          <li key={item.title + item.period} className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-6">
            <p className="text-sm tabular-nums text-subtle">{item.period}</p>
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
  cpu: Cpu,
  book: BookOpen,
};

export function Beyond() {
  return (
    <Section id="beyond" title="Beyond technology">
      <ul className="flex flex-wrap gap-x-10 gap-y-4 pt-1">
        {beyondTechnology.map((item) => {
          const Icon = beyondIcons[item.icon];
          return (
            <li key={item.label} className="inline-flex items-center gap-2.5 text-fg/90">
              <Icon className="size-[1.1rem] text-muted" strokeWidth={1.75} aria-hidden="true" />
              {item.label}
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
