import type { CSSProperties } from "react";
import { Brain, Car, FlaskConical, HeartPulse, Languages, Library, type LucideIcon } from "lucide-react";
import { researchInterests, type ResearchIcon } from "@/content/profile";
import { Section } from "./Section";

const icons: Record<ResearchIcon, LucideIcon> = {
  brain: Brain,
  "heart-pulse": HeartPulse,
  car: Car,
  languages: Languages,
  library: Library,
  flask: FlaskConical,
};

export function Research() {
  return (
    <Section
      id="research"
      title="Research interests & areas of exploration"
      lead="Areas I'm reading about and want to work in. These are interests, not completed research."
    >
      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {researchInterests.map((item, i) => {
          const Icon = icons[item.icon];
          return (
            <li
              key={item.title}
              data-reveal
              data-spot
              style={{ "--i": i % 3 } as CSSProperties}
              className="card card-hover group flex flex-col p-5 sm:p-6"
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
              <h3 className="mt-8 text-lg font-medium leading-snug tracking-[-0.02em] text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
