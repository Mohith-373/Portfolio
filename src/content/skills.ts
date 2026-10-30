// Skills grouped by area. These are tools and topics you have used or are learning,
// not proficiency ratings. `appliedIn` lists project slugs (see projects.ts) where the
// area is used; leave it empty for areas you're learning through your MSc.

export interface SkillGroup {
  area: string;
  items: string[];
  appliedIn: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    area: "Programming",
    items: ["Python", "SQL", "R", "C++", "JavaScript"],
    appliedIn: ["nifty-drawdown-alert", "async-analytics-job-api", "bookshop-microservices", "rk-creators-builders"],
  },
  {
    area: "Data analysis",
    items: ["pandas", "NumPy", "Data cleaning", "Exploratory data analysis", "Statistical analysis"],
    appliedIn: ["stroke-prediction"],
  },
  {
    area: "Data visualisation",
    items: ["Power BI", "Matplotlib", "Seaborn", "Excel"],
    appliedIn: [],
  },
  {
    area: "Machine learning and AI",
    items: [
      "Supervised learning",
      "Unsupervised learning",
      "Predictive modelling",
      "scikit-learn",
      "CNNs",
      "Natural language processing",
      "Large language models",
      "Retrieval-augmented generation",
    ],
    appliedIn: ["fake-news-detection", "stroke-prediction"],
  },
  {
    area: "Databases",
    items: ["MySQL", "SQLite", "Relational database concepts", "Database management"],
    appliedIn: ["bookshop-microservices", "nifty-drawdown-alert"],
  },
  {
    area: "APIs and backend",
    items: ["Flask", "REST API development", "Microservices", "Node.js", "Serverless functions"],
    appliedIn: ["async-analytics-job-api", "bookshop-microservices", "rk-creators-builders"],
  },
  {
    area: "Cloud and infrastructure",
    items: ["Cloud computing", "Internet-scale systems", "Docker", "CI/CD with GitHub Actions"],
    appliedIn: ["nifty-drawdown-alert", "rk-creators-builders"],
  },
  {
    area: "Development tools",
    items: ["Git", "GitHub", "VS Code", "Jupyter Notebook", "Google Colab", "Linux / Ubuntu"],
    appliedIn: [],
  },
  {
    area: "IoT and embedded",
    items: ["NodeMCU (ESP8266)", "Arduino", "Sensor integration"],
    appliedIn: ["vehicle-black-box"],
  },
];
