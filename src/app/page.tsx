import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Education } from "@/components/Education";
import { Footer } from "@/components/Footer";
import { Beyond, Certifications, Experience, Exploring } from "@/components/Growth";
import { Hero } from "@/components/Hero";
import { Lab } from "@/components/Lab";
import { Nav } from "@/components/Nav";
import { Projects } from "@/components/Projects";
import { Research } from "@/components/Research";
import { Skills } from "@/components/Skills";
import { certifications, coursesInProgress } from "@/content/profile";
import { site } from "@/content/site";

// Structured data so search engines can identify the person behind the site.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  alternateName: site.shortName,
  jobTitle: "MSc Data Science Student",
  url: `${site.url}/`,
  email: `mailto:${site.email}`,
  affiliation: { "@type": "CollegeOrUniversity", name: site.university },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Rathinam College of Arts and Science" },
  knowsAbout: ["Data science", "Machine learning", "Artificial intelligence", "Natural language processing"],
  sameAs: [site.github, site.linkedin],
};

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Research />
        <Lab />
        <Projects />
        <Skills />
        <Education />
        <Exploring />
        {/* Hidden until there is a certificate or course to show (see content/profile.ts). */}
        {certifications.length + coursesInProgress.length > 0 ? <Certifications /> : null}
        <Experience />
        <Beyond />
        <Contact />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
    </>
  );
}
