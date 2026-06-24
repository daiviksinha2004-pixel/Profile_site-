// Credentials shown as a "verified by shipped work" wall — honest and recruiter-friendly.
// `evidence` links a competency to a real project that demonstrates it.
// ➕ Drop real external certificates (issuer + year + url) into this same array when you have them.

export type Credential = {
  title: string;
  issuer: string;
  year: string;
  type: "degree" | "competency" | "certificate";
  icon: string; // lucide icon name
  blurb: string;
  evidence?: string; // project slug or label
  url?: string;
};

export const credentials: Credential[] = [
  {
    title: "B.Tech — Mathematics & Data Science",
    issuer: "NIT Bhopal (MANIT)",
    year: "2022 – 2026",
    type: "degree",
    icon: "graduation-cap",
    blurb: "Math-heavy data-science degree — statistics, ML, and CS fundamentals.",
  },
  {
    title: "Production Backend Engineering",
    issuer: "Demonstrated in production",
    year: "2026",
    type: "competency",
    icon: "server",
    blurb: "Async FastAPI services on a strict layered architecture, shipped to production.",
    evidence: "ATS CRP · 60+ routes",
  },
  {
    title: "Applied AI & LLM Engineering",
    issuer: "Demonstrated in production",
    year: "2026",
    type: "competency",
    icon: "brain",
    blurb: "LLM/RAG, NL-to-SQL agents, and local-LLM systems built end to end.",
    evidence: "Llama 3 SQL agent · Desktop AI Agent",
  },
  {
    title: "Data Engineering & Pipelines",
    issuer: "Demonstrated in production",
    year: "2026",
    type: "competency",
    icon: "database",
    blurb: "40 GB+ Oracle→PostgreSQL ingestion with partitioning and staged transforms.",
    evidence: "ATS CRP ingestion pipeline",
  },
  {
    title: "Machine Learning & Forecasting",
    issuer: "Demonstrated in projects",
    year: "2024 – 2026",
    type: "competency",
    icon: "line-chart",
    blurb: "Random Forest, Logistic Regression, GradientBoosting, XGBoost, S-curve forecasting.",
    evidence: "7 prediction engines",
  },
  {
    title: "Application Security",
    issuer: "Demonstrated in production",
    year: "2026",
    type: "competency",
    icon: "shield-check",
    blurb: "JWT rotation, AES-256-CBC payload encryption, CSRF, RBAC, and audit logging.",
    evidence: "7-layer security model",
  },
];
