import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="flex flex-wrap gap-x-6 gap-y-2">
          <span>Last updated {site.lastUpdated}</span>
          <a
            href={site.sourceRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-line-strong underline-offset-4 hover:text-fg"
          >
            Source code<span className="sr-only"> (opens in a new tab)</span>
          </a>
          <a href="#home" className="underline decoration-line-strong underline-offset-4 hover:text-fg">
            Back to top
          </a>
        </p>
      </div>
    </footer>
  );
}
