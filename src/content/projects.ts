// Projects shown in the Projects section, strongest first.
// Every statement here is based on the project's repository or on details you gave.
// Optional fields (challenges, results, demo) are hidden when empty: only add them
// when you can back them up, e.g. with a test run, a screenshot or a write-up.

export type Category =
  | "Data Science"
  | "Data Analytics"
  | "Artificial Intelligence"
  | "Machine Learning"
  | "Data Engineering"
  | "Software Development"
  | "Research Projects";

export type ProjectContext = "Independent project" | "MSc coursework" | "BSc academic project" | "Team project";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  context: ProjectContext;
  year: string;
  categories: Category[];
  stack: string[];
  problem: string;
  objective: string;
  contribution: string;
  approach: string[];
  decisions: string[];
  challenges?: string[];
  results?: string[];
  /** Honest note about the project's current state, shown on the card. */
  status?: string;
  repo?: string;
  demo?: string;
  featured?: boolean;
}

export const categories: Category[] = [
  "Data Science",
  "Data Analytics",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Engineering",
  "Software Development",
  "Research Projects",
];

export const projects: Project[] = [
  {
    slug: "nifty-drawdown-alert",
    title: "NIFTY 50 Drawdown Alert System",
    summary:
      "A monitoring service that tracks the NIFTY 50 index and sends an alert when it falls set percentages below its rolling 52-week high.",
    context: "Independent project",
    year: "2026",
    categories: ["Data Engineering", "Data Analytics"],
    stack: ["Python", "yfinance", "SQLite", "Docker", "Telegram Bot API", "pytest"],
    problem:
      "Market drawdowns build up over days or weeks, and checking an index by hand makes it easy to miss the moment a decline crosses a level that matters.",
    objective:
      "Watch the NIFTY 50 during market hours and send one alert per drawdown threshold by Telegram or email, without ever touching a trading account.",
    contribution: "Designed and built the data pipeline, alert logic, notifications and deployment setup.",
    approach: [
      "Prices come from yfinance through a pluggable data provider and are validated before use.",
      "The service computes the drawdown from the rolling 52-week high and checks it against thresholds of 10% to 50% in 5-point steps (configurable).",
      "Alerts go out through Telegram and SMTP email, with SMS and push left as stubs for a provider to plug in.",
      "It runs as a systemd service, a cron job, or two Docker Compose containers: the monitor and a Telegram assistant that answers status questions.",
    ],
    decisions: [
      "Each threshold fires once and only re-arms after the drawdown recovers within a 2% buffer, so small swings don't repeat alerts.",
      "Alert state is stored in SQLite, so a restart never resends an alert.",
      "Polling is gated by market hours, weekends and an exchange-holiday file, and stale prices are rejected.",
      "Monitoring only: the system has no broker or demat access by design.",
    ],
    repo: "https://github.com/Mohith-373/nifty-drawdown-alert",
    featured: true,
  },
  {
    slug: "async-analytics-job-api",
    title: "Asynchronous Analytics Job API",
    summary:
      "A Flask API that accepts long-running analytics jobs, runs them in the background and lets clients poll for status and results.",
    context: "MSc coursework",
    year: "2026",
    categories: ["Data Engineering", "Software Development"],
    stack: ["Python", "Flask", "REST"],
    problem:
      "Analytics jobs such as MapReduce or Spark runs take too long for a single request and response, so clients need a way to submit work and check back later.",
    objective: "Implement the asynchronous job pattern for an analytics service: submit a job, track its status, then fetch results when ready.",
    contribution: "Implemented the service as part of University of Surrey coursework (COM3033).",
    approach: [
      "POST /jobs validates the request and returns 202 Accepted with a job ID.",
      "A background thread moves each job from QUEUED to RUNNING to SUCCEEDED.",
      "GET /jobs/<id> returns the status, and GET /jobs/<id>/results returns 409 until the job has finished.",
      "/health and /metadata describe the service and the engines it supports.",
    ],
    decisions: [
      "Specific JSON error codes (MISSING_FIELDS, INVALID_ENGINE, JOB_NOT_FOUND, RESULT_NOT_READY) instead of generic failures.",
      "The engine field is limited to mapreduce or spark, matching the platforms the service is designed around.",
    ],
    status: "Coursework version: processing is simulated and jobs are held in memory.",
    repo: "https://github.com/Mohith-373/async-analytics-job-api",
    featured: true,
  },
  {
    slug: "vehicle-black-box",
    title: "Secure Vehicle Black Box",
    summary:
      "An IoT black box prototype that records vehicle sensor data, encrypts every packet and stores it for post-incident analysis.",
    context: "BSc academic project",
    year: "2026",
    categories: ["Research Projects", "Data Engineering"],
    stack: ["NodeMCU (ESP8266)", "Arduino C/C++", "Python", "RC6 encryption", "ThingSpeak"],
    problem:
      "After a road incident, investigators and insurers need sensor records they can trust have not been altered.",
    objective: "Capture motion, location and environmental readings from a vehicle and keep them in an encrypted log for later analysis.",
    contribution: "Developed the NodeMCU firmware and the Python encryption and decryption scripts in this repository.",
    approach: [
      "A NodeMCU reads an MPU6050 accelerometer and gyroscope, a NEO-6M GPS module and a DHT11 temperature and humidity sensor, with a 16x2 LCD for local display.",
      "A Python script polls the device every 5 seconds, encrypts each reading with RC6 using a 128-bit key and appends it to a CSV log.",
      "A second script decrypts the log for analysis, and ciphertext can also be sent to ThingSpeak dashboards.",
    ],
    decisions: [
      "Symmetric RC6 encryption with a shared 128-bit key between the logging and decryption scripts.",
      "A push button and a potentiometer simulate braking and speed, so the prototype can be tested on a bench.",
    ],
    status:
      "Prototype. Tamper detection, event replay and automated reports are described as design goals but are not yet in the published code.",
    repo: "https://github.com/Mohith-373/vehicle-black-box-forensics",
    featured: true,
  },
  {
    slug: "bookshop-microservices",
    title: "Bookshop Microservices API",
    summary:
      "Three Flask services, a gateway, a catalogue and an orders service, that work together over HTTP to run a small online bookshop.",
    context: "MSc coursework",
    year: "2026",
    categories: ["Software Development", "Data Engineering"],
    stack: ["Python", "Flask", "SQLite", "REST", "Requests"],
    problem:
      "Splitting an application into services creates new failure modes: a service can be slow or down, and stock has to stay consistent across services.",
    objective: "Build a gateway-fronted system where each service owns its own data and failures are reported clearly.",
    contribution: "Implemented the gateway, catalogue and orders services as University of Surrey coursework.",
    approach: [
      "The gateway exposes /api/books and /api/orders and forwards each request to the service that owns it.",
      "The catalogue service keeps books and stock in SQLite, and the orders service keeps orders in its own SQLite database.",
      "Placing an order checks the book with the catalogue, reduces its stock, then saves the order.",
    ],
    decisions: [
      "Every call between services has a 2 to 3 second timeout, so one slow service can't hang the system.",
      "Clear status codes: 502 when the gateway can't reach a service, 503 when the catalogue is down, 409 on insufficient stock.",
      "The gateway's /health endpoint combines the health of every service and reports degraded with a 503.",
      "Ports, service URLs and database paths come from environment variables, ready for containers.",
    ],
    repo: "https://github.com/Mohith-373/bookshop-microservices-api",
  },
  {
    slug: "fake-news-detection",
    title: "Fake News Detection Model",
    summary: "A convolutional neural network that classifies news articles as real or fake from their text.",
    context: "BSc academic project",
    year: "2023–2026",
    categories: ["Artificial Intelligence", "Machine Learning"],
    stack: ["Python", "CNN", "Deep learning", "NLP"],
    problem: "Misinformation spreads faster than people can check it by hand, so automated screening of news text is a useful first filter.",
    objective: "Train a deep learning model to separate real and fake news using the article text.",
    contribution: "Developed the model as a BSc academic project.",
    approach: ["Preprocessed the article text for the model.", "Built a CNN architecture for text classification."],
    decisions: ["A convolutional network, which picks up local word patterns in text, as the classifier."],
    status: "Code not yet published.",
  },
  {
    slug: "stroke-prediction",
    title: "Stroke Prediction System",
    summary: "A machine learning model that estimates a patient's stroke risk from their attributes.",
    context: "BSc academic project",
    year: "2023–2026",
    categories: ["Data Science", "Machine Learning"],
    stack: ["Python", "scikit-learn"],
    problem: "Spotting people at higher risk of stroke early can support earlier medical follow-up.",
    objective: "Predict the likelihood of stroke from patient attributes using supervised learning.",
    contribution: "Developed the analysis and model as a BSc academic project.",
    approach: [
      "Explored the patient attributes with exploratory data analysis.",
      "Selected features for the model.",
      "Built the predictive model with scikit-learn.",
    ],
    decisions: ["Framed as early risk identification only, not diagnosis."],
    status: "Academic project, not for clinical use. Code not yet published.",
  },
  {
    slug: "rk-creators-builders",
    title: "RK Creators & Builders Website",
    summary: "A website and admin panel for a family-run construction business in Thuraiyur, Tamil Nadu.",
    context: "Independent project",
    year: "2026",
    categories: ["Software Development"],
    stack: ["HTML", "CSS", "JavaScript", "Node.js", "Netlify Functions", "Netlify Blobs", "GitHub Actions"],
    problem: "The business needed an online presence where customers can see its services and past work and send enquiries.",
    objective: "Ship a fast static site with a working enquiry form and a private panel for managing projects and enquiries.",
    contribution: "Built the site, the serverless functions and the deployment pipeline.",
    approach: [
      "Static HTML, CSS and JavaScript pages for home, about, services, process, projects and contact.",
      "Netlify Functions handle enquiries, admin login, and project and enquiry management, with data stored in Netlify Blobs.",
      "A GitHub Actions workflow deploys to Netlify on every push to main.",
    ],
    decisions: [
      "The enquiry endpoint uses a honeypot field, per-IP rate limiting and input validation to cut spam.",
      "New enquiries are emailed through Nodemailer.",
    ],
    challenges: [
      "The CI deploy failed on a platform-specific lockfile conflict; fixed by installing only the functions' dependencies in the workflow.",
    ],
    repo: "https://github.com/Mohith-373/rk-creators-builders",
  },
  {
    slug: "medical-inventory",
    title: "Medical Inventory Management",
    summary: "A Salesforce app for tracking medical suppliers, products, purchase orders and expiry dates.",
    context: "Team project",
    year: "2025",
    categories: ["Software Development"],
    stack: ["Salesforce", "Apex", "Lightning", "Flows"],
    problem: "Medical stock has to be tracked against suppliers and expiry dates so that expired items are not used.",
    objective: "Build a Salesforce Lightning app that manages suppliers, products, purchase orders and inventory transactions.",
    contribution: "Team member in a Naan Mudhalvan programme project; the work was shared across the team.",
    approach: [
      "Custom objects for products, purchase orders, order items, inventory transactions and suppliers.",
      "Validation rules, page and compact layouts, profiles, roles and permission sets.",
      "A flow that updates actual delivery dates and an Apex trigger that totals order-item amounts per purchase order.",
    ],
    decisions: ["Purchase order totals are calculated by an Apex trigger so they stay correct when order items change."],
    status: "The repository holds the team's project report.",
    repo: "https://github.com/Mohith-373/mohith-medical-inventory-management-",
  },
];
