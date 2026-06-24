export type Experience = {
  role: string;
  company: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  bullets: string[];
  stack: string[];
};

export const experience: Experience[] = [
  {
    role: "Software Development Intern",
    company: "ATS Services",
    location: "Faridabad, India",
    period: "Feb 2026 – Present",
    current: true,
    summary:
      "Sole architect & engineer of a production BFSI debt-collection and insurance-retention analytics platform, built from scratch.",
    bullets: [
      "Architected and built a production BFSI analytics platform end to end — async FastAPI + PostgreSQL backend and a React 18 + TypeScript (Vite) SPA on a strict controller–service–repository architecture.",
      "Engineered an automated Oracle→PostgreSQL sync service: a schema-mapping layer converts live Oracle data into the warehouse model, run nightly by a PostgreSQL-native worker (FOR UPDATE SKIP LOCKED) that incrementally loads new files.",
      "Processed and reconciled 40 GB+ datasets via staging tables, chunked batch transforms, and table partitioning with index/partition-pruning tuning.",
      "Built a multi-layer caching strategy (Postgres analytics cache, in-process TTL caches with O(1) generation-based invalidation, TanStack Query) cutting DB load and dashboard latency.",
      "Engineered the AI layer — a Llama 3 natural-language-to-SQL agent plus ML prediction engines (Random Forest, Logistic Regression) and S-curve forecasting.",
      "Secured financial data with JWT auth (single-flight refresh), AES-256-CBC payload encryption, CSRF protection, device-aware rate limiting, and role-based access control.",
    ],
    stack: ["FastAPI", "PostgreSQL", "React", "TypeScript", "Llama 3", "scikit-learn", "Docker"],
  },
  {
    role: "IT Project Intern",
    company: "AMU Leasing Pvt. Ltd.",
    location: "Noida, India",
    period: "Jun 2025 – Aug 2025",
    summary:
      "Built financial-analytics dashboards and automated customer verification with KYC/credit-bureau API integrations.",
    bullets: [
      "Built Power BI dashboards for financial analytics, reducing report-generation time by 50%.",
      "Integrated CRIF and Aadhaar eKYC APIs for automated customer verification, processing 500+ documents monthly.",
    ],
    stack: ["Power BI", "REST APIs", "CRIF", "Aadhaar eKYC"],
  },
];
