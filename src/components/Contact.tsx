import { ArrowUpRight, Download, Mail } from "lucide-react";
import { site } from "@/content/site";
import { withBase } from "@/lib/paths";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { ContactForm } from "./ContactForm";

// The closing section breaks from the two-column section frame: a centred
// call to action, then the direct links beside the form.
export function Contact() {
  const links = [
    { href: `mailto:${site.email}`, label: "Email", value: site.email, icon: <Mail className="size-[1.1rem]" aria-hidden="true" /> },
    {
      href: site.linkedin,
      label: "LinkedIn",
      value: "linkedin.com/in/mohith-tk-5412632a2",
      icon: <LinkedInIcon className="size-[1.1rem]" />,
      external: true,
    },
    {
      href: site.github,
      label: "GitHub",
      value: "github.com/Mohith-373",
      icon: <GitHubIcon className="size-[1.1rem]" />,
      external: true,
    },
  ];

  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate">
      <div className="rule mx-auto max-w-6xl" aria-hidden="true" />
      <div className="cta-bg absolute inset-0 -z-10" aria-hidden="true" />
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:py-28">
        <header data-reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow flex items-center justify-center gap-3 text-accent" aria-hidden="true">
            <span className="h-px w-8 bg-accent/40" />
            <span className="section-index" />
            <span className="h-px w-8 bg-accent/40" />
          </p>
          <h2
            id="contact-title"
            className="mt-5 text-balance font-serif text-[2.5rem] italic leading-[1.05] text-fg sm:text-6xl"
          >
            Let&apos;s connect and build something meaningful.
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-muted">
            I&apos;m looking for data science, data analytics, machine learning and AI placements in the UK. Email is the
            quickest way to reach me.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:${site.email}`}
              data-magnetic
              className="btn-primary tap inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium"
            >
              <Mail className="size-4" aria-hidden="true" />
              Email me
            </a>
            <a
              href={withBase(site.cvPath)}
              download
              data-magnetic
              className="tap inline-flex items-center justify-center gap-2 rounded-full border border-line-strong bg-surface px-5 py-2.5 text-sm font-medium text-fg shadow-[var(--shadow-card)] transition-colors hover:bg-surface-2"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV (PDF)
            </a>
          </div>
        </header>

        <div data-reveal className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.45fr]">
          <ul className="card min-w-0 self-start divide-y divide-line px-5 sm:px-6">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 py-5"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-line bg-surface-2 text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                    {link.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="eyebrow block text-subtle">{link.label}</span>
                    <span className="mt-1 block truncate text-fg">{link.value}</span>
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-subtle transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                    aria-hidden="true"
                  />
                  {link.external ? <span className="sr-only">(opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
