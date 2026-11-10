import type { CSSProperties } from "react";
import { ArrowDown, ArrowRight, Download } from "lucide-react";
import { education } from "@/content/profile";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { skillGroups } from "@/content/skills";
import { withBase } from "@/lib/paths";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { HeroCanvas } from "./motion/HeroCanvas";
import { Split } from "./motion/Split";

// Counted from the content files, so the strip never drifts from what the page shows.
const facts = [
  { value: String(projects.length).padStart(2, "0"), label: "Projects" },
  { value: String(skillGroups.length).padStart(2, "0"), label: "Skill areas" },
  { value: education[0].years, label: education[0].degree },
];

// Delay of each piece in the opening sequence (see .hero-in in globals.css).
const at = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="home-title"
      className="hero-in relative isolate flex min-h-[100svh] flex-col overflow-hidden lg:-mt-[4.25rem]"
    >
      <HeroCanvas />
      <div className="hero-orb -right-[20%] -top-[30%] -z-10 size-[70vmax]" aria-hidden="true" />
      <div className="hero-orb alt -bottom-[40%] -left-[25%] -z-10 size-[60vmax]" aria-hidden="true" />
      {/* Fade into the page below so the particle field has no hard edge. */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-bg to-transparent" aria-hidden="true" />

      <div className="hero-recede mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 pb-10 pt-12 sm:px-6 lg:pt-28">
        <p className="hero-fade inline-flex items-center gap-2.5 self-start rounded-full border border-line bg-surface/60 py-1 pl-2.5 pr-3.5 text-sm text-fg backdrop-blur-sm" style={at(0.1)}>
          <span className="grid size-4 place-items-center rounded-full bg-ok/15" aria-hidden="true">
            <span className="size-1.5 rounded-full bg-ok" />
          </span>
          {site.availability}
        </p>

        <p className="eyebrow mt-8 text-accent sm:mt-10 sm:text-sm" aria-label={site.identity} style={at(0.25)}>
          <Split text={site.identity} />
        </p>
        <h1
          id="home-title"
          aria-label={site.shortName}
          className="hero-name mt-3 text-[clamp(3.6rem,min(16.5vw,24svh),13rem)] font-semibold leading-[0.9] tracking-[-0.055em]"
          style={at(0.35)}
        >
          <Split text={site.shortName} by="char" />
        </h1>

        <div className="mt-8 grid gap-8 lg:mt-10 lg:grid-cols-[1.15fr_1fr] lg:items-end lg:gap-16">
          <div>
            <p className="max-w-xl font-serif text-[1.75rem] italic leading-[1.12] text-fg sm:text-4xl" aria-label={site.headline} style={at(0.75)}>
              <Split text={site.headline} />
            </p>
            <div className="hero-fade mt-8 flex flex-wrap items-center gap-3" style={at(1.15)}>
              <a
                href="#projects"
                data-magnetic
                className="btn-primary tap group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
              >
                View projects
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href={withBase(site.cvPath)}
                download
                data-magnetic
                className="tap inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface/70 px-6 py-3 text-sm font-medium text-fg backdrop-blur-sm transition-colors hover:border-accent/60 hover:bg-surface-2"
              >
                <Download className="size-4" aria-hidden="true" />
                Download CV
              </a>
              <a
                href="#contact"
                className="tap inline-flex items-center justify-center rounded-full px-4 py-3 text-sm font-medium text-fg underline decoration-line-strong underline-offset-8 transition-colors hover:decoration-accent"
              >
                Contact me
              </a>
            </div>
          </div>

          <div className="hero-fade" style={at(1.0)}>
            <p className="max-w-md leading-relaxed text-muted">{site.intro}</p>
            <p className="mt-4 text-sm text-subtle">
              {site.name} · {site.roles[0]} · {site.university}, {site.location}
            </p>
          </div>
        </div>
      </div>

      <div className="hero-fade mx-auto flex w-full max-w-6xl items-end justify-between gap-6 px-4 pb-8 sm:px-6" style={at(1.35)}>
        <dl className="grid grid-cols-[auto_auto_auto] gap-x-7 sm:gap-x-12">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse gap-1">
              <dt className="text-xs text-muted sm:text-sm">{fact.label}</dt>
              <dd className="font-mono text-lg font-medium tabular-nums tracking-tight text-fg sm:text-2xl">{fact.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex items-end gap-5">
          <div className="hidden items-center gap-1 sm:flex">
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
              data-magnetic
              className="tap inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-fg"
            >
              <GitHubIcon className="size-5" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
              data-magnetic
              className="tap inline-flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-fg"
            >
              <LinkedInIcon className="size-5" />
            </a>
          </div>
          <a href="#about" className="tap group flex flex-col items-center gap-3 text-subtle transition-colors hover:text-fg" aria-label="Scroll to About">
            <span className="eyebrow [writing-mode:vertical-rl]" aria-hidden="true">
              Scroll
            </span>
            <span className="scroll-cue-line" aria-hidden="true" />
            <ArrowDown className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
