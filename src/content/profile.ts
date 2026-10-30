// About, research interests, education, current learning, certifications,
// experience and personal interests. Edit the arrays below to update the site.

export const about = [
  "I studied Artificial Intelligence and Data Science at Rathinam College of Arts and Science in Coimbatore, where my projects ranged from fake news detection and stroke-risk prediction to an encrypted vehicle black box. In 2026 I moved to the UK to begin an MSc in Data Science at the University of Surrey.",
  "I'm most interested in analytical problem-solving: understanding a complex dataset, finding the patterns that matter, building predictive models and checking whether the results hold up statistically. I want to apply that to real problems, especially in healthcare and safety.",
  "Alongside my studies I build independent projects, from a market drawdown alert system to backend services, to practise the engineering side of working with data. I'm looking for a placement in data science, data analytics, machine learning or AI in the UK.",
];

export const researchInterests = [
  {
    icon: "brain",
    title: "Artificial intelligence and machine learning",
    text: "Exploring intelligent systems, predictive modelling, machine learning algorithms and practical AI applications.",
  },
  {
    icon: "heart-pulse",
    title: "Healthcare and AI",
    text: "Interested in AI-powered healthcare applications, diagnostic assistance and data-driven healthcare research.",
  },
  {
    icon: "car",
    title: "Vehicular safety and intelligent systems",
    text: "Interested in applying AI, sensor data and computational methods to improve vehicle safety and accident analysis.",
  },
  {
    icon: "languages",
    title: "Natural language processing",
    text: "Exploring NLP, language models, text processing and intelligent information retrieval.",
  },
  {
    icon: "library",
    title: "Retrieval-augmented generation",
    text: "Interested in building knowledge-grounded AI systems that combine document retrieval with language models.",
  },
  {
    icon: "flask",
    title: "Data science research",
    text: "Exploring statistical analysis, experimental design, reproducibility, data-driven discovery and research methods.",
  },
] as const;

export type ResearchIcon = (typeof researchInterests)[number]["icon"];

export const education = [
  {
    years: "2026 – 2027",
    degree: "MSc Data Science",
    institution: "University of Surrey",
    place: "Guildford, United Kingdom",
    status: "In progress",
  },
  {
    years: "2023 – 2026",
    degree: "BSc Artificial Intelligence and Data Science",
    institution: "Rathinam College of Arts and Science",
    place: "Coimbatore, India",
    status: "Completed",
  },
];

// MSc learning areas. These are modules being studied, not completed qualifications.
export const mscModules = [
  "Statistical Data Science",
  "Database Systems and Business Intelligence",
  "Cloud Computing",
  "Computational Intelligence",
  "Engineering Internet-Scale Systems",
  "Business Analytics with Data Visualisation",
  "Machine Learning for Data Science",
  "Artificial Intelligence and AI Programming",
  "Natural Language Processing",
  "Applied Machine Learning",
  "Research Ethics and Security",
];

export const bscAreas = [
  "Python",
  "deep learning",
  "data analysis",
  "database management systems",
  "data visualisation",
  "IoT",
  "predictive analytics",
];

export const englishTest = "IELTS 6.5";

// Add academic coursework write-ups here as you complete them. Leave a field
// out (or empty) if it doesn't apply; empty fields are not shown.
export interface AcademicProject {
  title: string;
  module: string;
  problem: string;
  dataset?: string;
  methodology?: string;
  techniques?: string[];
  results?: string;
  evaluation?: string;
  link?: string;
}

export const academicProjects: AcademicProject[] = [
  // Example:
  // {
  //   title: "Customer churn prediction",
  //   module: "Applied Machine Learning",
  //   problem: "Predict which customers are likely to leave a subscription service.",
  //   dataset: "Telco Customer Churn (Kaggle), 7,043 rows",
  //   methodology: "Cleaned and encoded features, compared models with 5-fold cross-validation.",
  //   techniques: ["Logistic regression", "Random forest", "SHAP"],
  //   results: "Fill in only with results from your own run.",
  //   evaluation: "What worked, what didn't, and what you'd change.",
  //   link: "https://github.com/Mohith-373/your-repo",
  // },
];

export const currentlyExploring = [
  "Strengthening Python and SQL",
  "Improving statistical and analytical skills",
  "Developing practical machine learning projects",
  "Building data visualisation dashboards",
  "Exploring cloud-based data systems",
  "Experimenting with LLMs and RAG architectures",
  "Improving software engineering and GitHub practices",
  "Preparing for technical placement interviews",
];

// Only add certificates you have completed and can verify.
export interface Certification {
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  verifyUrl?: string;
}

export const certifications: Certification[] = [
  // { title: "Google Data Analytics", issuer: "Google / Coursera", date: "March 2027", credentialId: "ABC123", verifyUrl: "https://..." },
];

export interface CourseInProgress {
  title: string;
  provider: string;
  link?: string;
}

export const coursesInProgress: CourseInProgress[] = [
  // { title: "Machine Learning Specialization", provider: "DeepLearning.AI / Coursera", link: "https://..." },
];

export const experience = [
  {
    period: "2026 – present",
    kind: "MSc coursework",
    title: "University of Surrey",
    text: "Building backend and data systems in coursework, including an asynchronous analytics job API and a bookshop microservices system.",
  },
  {
    period: "2026",
    kind: "Independent",
    title: "Self-directed projects",
    text: "Built a NIFTY 50 drawdown alert system with Docker and tests, and a website with serverless functions for a family-run construction business.",
  },
  {
    period: "2023 – 2026",
    kind: "BSc academic",
    title: "Rathinam College of Arts and Science",
    text: "Academic projects in fake news detection with a CNN, stroke-risk prediction and an encrypted IoT vehicle black box.",
  },
  {
    period: "2025",
    kind: "Team project",
    title: "Naan Mudhalvan programme",
    text: "Contributed to a team-built Salesforce app for medical inventory management.",
  },
];

export const beyondTechnology = [
  { icon: "dumbbell", label: "Fitness and strength training" },
  { icon: "mountain", label: "Trekking and outdoor exploration" },
  { icon: "cpu", label: "Technology and innovation" },
  { icon: "book", label: "Continuous learning" },
] as const;
