export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  kind: "education" | "work" | "project" | "milestone";
  desc: string;
  tags?: string[];
};

// The engineering journey — a narrative arc from foundations to production ownership.
export const timeline: TimelineItem[] = [
  {
    period: "2022",
    title: "Started B.Tech, Mathematics & Data Science",
    org: "NIT Bhopal (MANIT)",
    kind: "education",
    desc: "Began a rigorous math-heavy data-science degree — the foundation for ML, statistics, and systems thinking.",
    tags: ["Math", "Data Science", "Algorithms"],
  },
  {
    period: "2024",
    title: "Airbnb Price Prediction",
    org: "Self-driven ML project",
    kind: "project",
    desc: "Built an XGBoost regression model with extensive EDA and feature engineering — first end-to-end ML pipeline.",
    tags: ["XGBoost", "EDA", "Feature Engineering"],
  },
  {
    period: "2025",
    title: "Local-Hosted Desktop AI Agent",
    org: "Self-driven AI project",
    kind: "project",
    desc: "A fully offline voice assistant — Whisper STT + local Ollama LLM + Edge-TTS — with an async, multithreaded pipeline.",
    tags: ["Ollama", "Whisper", "asyncio"],
  },
  {
    period: "Jun – Aug 2025",
    title: "IT Project Intern",
    org: "AMU Leasing Pvt. Ltd.",
    kind: "work",
    desc: "Power BI financial dashboards (−50% report time) and CRIF + Aadhaar eKYC API integrations for automated verification.",
    tags: ["Power BI", "APIs", "KYC"],
  },
  {
    period: "2025",
    title: "ML & Analytics Portal",
    org: "Self-driven product build",
    kind: "project",
    desc: "A full-stack BFSI predictive platform — real-time RF/LogReg inference, a Llama 3 SQL agent, and a themed analytics UI.",
    tags: ["FastAPI", "React", "Llama 3"],
  },
  {
    period: "Feb 2026 – Present",
    title: "Software Development Intern",
    org: "ATS Services",
    kind: "work",
    desc: "Sole architect of a production BFSI analytics platform — pipelines, 7 prediction engines, a 7-layer security model, and a 200+ chart UI.",
    tags: ["FastAPI", "PostgreSQL", "AI", "Security"],
  },
  {
    period: "2026",
    title: "Graduating · open to full-time roles",
    org: "SWE · AI · Data Engineering",
    kind: "milestone",
    desc: "Looking to own production systems end to end — backend, applied AI, and data platforms at a product company.",
    tags: ["Backend", "Applied AI", "Data"],
  },
];
