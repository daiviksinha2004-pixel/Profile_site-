export type SkillGroup = { category: string; icon: string; items: { name: string; level: number }[] };

// level is a self-assessed proficiency 0–100, used for the animated skill bars.
export const skills: SkillGroup[] = [
  {
    category: "Backend & APIs",
    icon: "server",
    items: [
      { name: "FastAPI", level: 92 },
      { name: "Python (async)", level: 93 },
      { name: "REST API Design", level: 90 },
      { name: "SQLAlchemy 2", level: 86 },
      { name: "Pydantic v2", level: 88 },
      { name: "Auth / JWT / OAuth2", level: 85 },
    ],
  },
  {
    category: "AI & Machine Learning",
    icon: "brain",
    items: [
      { name: "LLM Integration", level: 88 },
      { name: "RAG", level: 84 },
      { name: "NL-to-SQL Agents", level: 86 },
      { name: "Llama 3 / Ollama", level: 85 },
      { name: "scikit-learn", level: 83 },
      { name: "Forecasting / XGBoost", level: 82 },
    ],
  },
  {
    category: "Data & Pipelines",
    icon: "database",
    items: [
      { name: "PostgreSQL", level: 90 },
      { name: "ETL / Ingestion", level: 87 },
      { name: "Data Warehousing", level: 82 },
      { name: "Table Partitioning", level: 80 },
      { name: "Oracle / MySQL", level: 76 },
      { name: "Vector Databases", level: 75 },
    ],
  },
  {
    category: "Frontend",
    icon: "layout",
    items: [
      { name: "React 18", level: 88 },
      { name: "TypeScript", level: 88 },
      { name: "TanStack Query", level: 85 },
      { name: "Zustand", level: 84 },
      { name: "Recharts", level: 86 },
      { name: "Tailwind CSS", level: 87 },
    ],
  },
  {
    category: "Tools & DevOps",
    icon: "wrench",
    items: [
      { name: "Git", level: 88 },
      { name: "Docker", level: 82 },
      { name: "Linux", level: 80 },
      { name: "CI/CD (GitLab)", level: 76 },
      { name: "Power BI", level: 80 },
      { name: "Postman", level: 85 },
    ],
  },
  {
    category: "Security (Applied)",
    icon: "shield",
    items: [
      { name: "JWT Rotation", level: 86 },
      { name: "AES Payload Encryption", level: 82 },
      { name: "CSRF / Rate Limiting", level: 84 },
      { name: "RBAC / Row-level", level: 83 },
      { name: "Audit Logging", level: 82 },
      { name: "Security Headers", level: 80 },
    ],
  },
];

// Aggregated capability radar (0–100 per axis).
export const radar: { axis: string; value: number }[] = [
  { axis: "Backend", value: 92 },
  { axis: "AI / ML", value: 86 },
  { axis: "Data Eng.", value: 88 },
  { axis: "Frontend", value: 85 },
  { axis: "System Design", value: 84 },
  { axis: "Security", value: 83 },
];
