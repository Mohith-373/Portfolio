import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-line bg-surface/40">
      <p
        aria-hidden="true"
        className="wordmark mx-auto max-w-6xl select-none whitespace-nowrap px-4 pt-10 text-center text-[clamp(3.25rem,16.5vw,13rem)] font-semibold leading-none tracking-[-0.055em] sm:px-6"
      >
        {site.shortName}
      </p>
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 pb-[calc(2.5rem+env(safe-area-inset-bottom))] pt-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span>Last updated {site.lastUpdated}</span>
          <a
            href={site.sourceRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="tap inline-flex items-center underline decoration-line-strong underline-offset-4 hover:text-fg"
          >
            Source code<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href="#home" className="tap inline-flex items-center underline decoration-line-strong underline-offset-4 hover:text-fg">
            Back to top
          </a>
        </p>
      </div>
    </footer>
  );
}
