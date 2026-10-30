// Core identity and contact details used across the site and in SEO metadata.
// Edit these values to update your details everywhere at once.

export const site = {
  name: "Mohith Thuraiyur Kirubanandham",
  shortName: "Mohith T K",
  roles: ["MSc Data Science Student", "Aspiring Data Scientist", "AI & Machine Learning Enthusiast"],
  headline: "Turning data into insights. Building intelligence into solutions.",
  intro:
    "I'm an MSc Data Science student at the University of Surrey with an academic foundation in Artificial Intelligence and Data Science. I'm interested in turning complex data into meaningful insights and building intelligent solutions with machine learning and emerging AI technologies.",
  university: "University of Surrey",
  location: "United Kingdom",
  availability: "Open to UK placement opportunities",

  // CONFIRM: this is the email from your previous CV and portfolio.
  // Replace it here if you set up a dedicated professional address.
  email: "tkmohith2006@gmail.com",

  github: "https://github.com/Mohith-373",
  linkedin: "https://www.linkedin.com/in/mohith-tk-5412632a2/",
  sourceRepo: "https://github.com/Mohith-373/Portfolio",

  // Public address of the deployed site (no trailing slash). Used for canonical and share links.
  url: "https://mohith-373.github.io/Portfolio",

  // Your CV lives in public/cv/. Replace the PDF there and keep this file name,
  // or change this path to match the new file.
  cvPath: "/cv/Mohith-Thuraiyur-Kirubanandham-CV.pdf",

  // Optional: paste a Formspree (or similar) form endpoint, e.g. "https://formspree.io/f/abcdwxyz".
  // Leave empty and the contact form opens the visitor's email app instead.
  contactFormEndpoint: "",

  // Shown in the footer and the "Currently building" section. Update when you edit content.
  lastUpdated: "October 2026",

  seo: {
    title: "Mohith T K | MSc Data Science | University of Surrey",
    description:
      "Explore the portfolio of Mohith T K, an MSc Data Science student at the University of Surrey, showcasing projects, technical interests, research exploration and work in Data Science, Artificial Intelligence and Machine Learning.",
  },
} as const;

export const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
] as const;
