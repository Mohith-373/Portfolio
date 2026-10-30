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
      <ul className="grid overflow-hidden rounded-xl border-l border-t border-line sm:grid-cols-2 xl:grid-cols-3">
        {researchInterests.map((item) => {
          const Icon = icons[item.icon];
          return (
            <li key={item.title} className="border-b border-r border-line bg-surface p-6">
              <Icon className="size-5 text-accent" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="mt-4 font-medium leading-snug text-fg">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.text}</p>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
