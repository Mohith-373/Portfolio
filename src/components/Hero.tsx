import { Download, GraduationCap, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { withBase } from "@/lib/paths";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { HeroFigure } from "./HeroFigure";

export function Hero() {
  return (
    <section id="home" aria-labelledby="home-title" className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6 md:pb-28 md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_1fr] lg:gap-16">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-sm text-fg">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />
            {site.availability}
          </p>

          <h1
            id="home-title"
            className="mt-6 text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.035em] text-balance text-fg sm:text-6xl"
          >
            {site.name}
          </h1>

          <p className="mt-5 text-lg font-medium text-fg">{site.roles[0]}</p>
          <p className="mt-0.5 text-[0.95rem] text-muted">{site.roles.slice(1).join(", ")}</p>

          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <GraduationCap className="size-4" aria-hidden="true" />
              {site.university}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="size-4" aria-hidden="true" />
              {site.location}
            </span>
          </p>

          <p className="mt-9 max-w-xl text-xl font-medium leading-snug tracking-[-0.015em] text-fg sm:text-2xl">
            {site.headline}
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-muted">{site.intro}</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              View projects
            </a>
            <a
              href={withBase(site.cvPath)}
              download
              className="inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </a>
            <a
              href="#contact"
              className="inline-flex items-center rounded-md px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
            >
              Contact me
            </a>
            <span className="mx-1 hidden h-6 w-px bg-line sm:block" aria-hidden="true" />
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile (opens in a new tab)"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <GitHubIcon className="size-5" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile (opens in a new tab)"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              <LinkedInIcon className="size-5" />
            </a>
          </div>
        </div>

        <HeroFigure />
      </div>
    </section>
  );
}
