import { Download, Mail } from "lucide-react";
import { site } from "@/content/site";
import { withBase } from "@/lib/paths";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { ContactForm } from "./ContactForm";
import { Section } from "./Section";

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
    <Section
      id="contact"
      title="Let's connect and build something meaningful."
      lead="I'm looking for data science, data analytics, machine learning and AI placements in the UK. Email is the quickest way to reach me."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.35fr]">
        <div>
          <ul className="divide-y divide-line border-y border-line">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex items-center gap-4 py-4"
                >
                  <span className="text-muted group-hover:text-fg">{link.icon}</span>
                  <span className="min-w-0">
                    <span className="block text-sm text-muted">{link.label}</span>
                    <span className="block truncate text-fg underline decoration-transparent underline-offset-4 group-hover:decoration-line-strong">
                      {link.value}
                    </span>
                  </span>
                  {link.external ? <span className="sr-only">(opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={withBase(site.cvPath)}
            download
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-line-strong bg-surface px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:bg-surface-2"
          >
            <Download className="size-4" aria-hidden="true" />
            Download CV (PDF)
          </a>
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
