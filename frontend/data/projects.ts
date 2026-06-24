export type Metric = { label: string; value: string; sub?: string };
export type Challenge = { title: string; problem: string; solution: string };
export type Shot = { src: string; title: string; caption: string; group?: string };
export type ArchStack = {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
  ai: string[];
};

export type Accent = "violet" | "cyan" | "emerald" | "amber";

export type Project = {
  slug: string;
  name: string;
  kicker: string; // short status tag e.g. "Flagship · Production"
  tagline: string;
  year: string;
  status: string;
  role: string;
  category: "flagship" | "featured" | "secondary";
  accent: Accent;
  cover?: string;
  // Rich content blocks
  summary: string; // executive summary
  problem: string;
  impact: string[]; // business impact
  architecture: ArchStack;
  highlights: string[]; // feature callouts
  challenges: Challenge[];
  learnings: string[];
  future: string[];
  metrics: Metric[];
  tags: string[];
  gallery: Shot[];
  repoUrl?: string;
  liveUrl?: string;
};

// ───────────────────────────────────────────────────────────────────────────
// FLAGSHIP — BFSI Customer Resolution Platform (ATS CRP)
// ───────────────────────────────────────────────────────────────────────────
const atsCrp: Project = {
  slug: "ats-crp",
  name: "ATS CRP — BFSI Analytics Platform",
  kicker: "Flagship · Production · Solo build",
  tagline:
    "An enterprise debt-collection & insurance-retention analytics platform — architected and shipped from scratch.",
  year: "2026",
  status: "In Production",
  role: "Sole architect & engineer (SDE Intern)",
  category: "flagship",
  accent: "violet",
  cover: "/projects/bfsi/bfsi-01.png",
  summary:
    "ATS CRP (Customer Resolution Platform) is an internal, multi-tenant BFSI analytics & operations platform serving two business lines — debt collection (recovering non-performing loans: DPD, EMI, PTP, recovery curves) and insurance retention (preventing life & health policy lapse: revival, propensity, churn). I designed and built it solo: an async FastAPI backend on a single PostgreSQL 17 schema in strict controller→service→repository layering, a React 18 + TypeScript SPA with 200+ analytics charts, a schema-driven ingestion pipeline, 7 prediction/forecasting engines, and a 7-layer security model — the whole thing parameterised over 3 domains and 3 data vendors so a new client is a config change, not a rewrite.",
  problem:
    "BFSI recovery and retention is one optimisation: prioritised outreach under a fixed budget. Out of 30,000+ overdue loans or lapsing policies per campaign month, which accounts are worth contacting, when, and through which channel? Teams had no forecasting, no outreach analytics, and no single source of truth. The platform's job is to ingest the book, score and rank it, forecast recovery/revival, and measure the calling operation against targets — all auditable and secure enough for sensitive financial data.",
  impact: [
    "Single source of truth across 30,000+ policies / campaign month over 3 domains and 3 vendors, replacing scattered spreadsheets.",
    "Reconciled 40 GB+ datasets through a staging → transform pipeline, eliminating manual data-prep effort.",
    "7 prediction engines surface recovery & lapse forecasts so teams prioritise high-propensity accounts data-first.",
    "Turned multi-channel outreach (dialer, AI bot, SMS, WhatsApp, PTP) into measurable revival/recovery analytics.",
    "Cut operational footprint to 3 processes + 1 database (no Redis/Celery/S3) — far less to run, back up, and secure.",
    "A 7-layer security model with full audit logging, fit for internal BFSI financial data.",
  ],
  architecture: {
    frontend: [
      "React 18 + TypeScript (Vite)",
      "Zustand (auth/filter state) + TanStack Query (server cache)",
      "Recharts — ~203 chart instances across 25 modules",
      "Tailwind CSS · React Router v6",
      "Client-side PDF reporting (jsPDF + html2canvas)",
    ],
    backend: [
      "Python 3.12 — async end to end",
      "FastAPI + Pydantic v2 · SQLAlchemy 2 (asyncpg)",
      "Strict controller → service → repository layering",
      "25 controllers · 60+ routes under /api/v1 (central registry)",
      "Domain-parameterised: 3 domains × 3 vendors",
    ],
    database: [
      "PostgreSQL 17 — single schema (atsdbwh)",
      "RANGE-partitioned fact tables (by lot_date) + partition pruning",
      "Postgres-native job queue: FOR UPDATE SKIP LOCKED (no Celery)",
      "File storage in BYTEA · sliding-window rate limiter (no Redis/S3)",
      "Mixed Alembic + hand-written SQL migrations",
    ],
    infrastructure: [
      "Docker — separate backend/frontend images on a shared network",
      "nginx (SPA history-fallback) · TLS terminated at the edge",
      "Cross-origin SPA ↔ API subdomain over CORS",
      "Zero-external-dependency design — 3 processes, 1 database",
    ],
    ai: [
      "7 forecasting engines — segmented DPD baseline + GradientBoostingRegressor blend (debt)",
      "Time-series models: 3M/6M moving average, Holt's double smoothing, OLS regression",
      "Per-vendor lapse/revival engines (Kotak · BSLI · BAXA) + statistical ensemble",
      "In-app analytics assistant (Groq · Llama-3.3-70B), audited",
    ],
  },
  highlights: [
    "Zero-external-dependency design: PostgreSQL handles the job queue (FOR UPDATE SKIP LOCKED), file storage (BYTEA), caching, rate limiting and the token blocklist — no Redis, Celery, or S3.",
    "Schema-driven ingestion: a jsonb_populate_record + jsonb_object_agg(lower(key)) transform maps CSV/Excel/SFTP headers onto fact columns by name, so a new column is a migration, not loader code.",
    "7 prediction engines: segmented DPD baselines blended with a GradientBoosting model (0.45/0.55), trend-damped and clamped — baseline-first so it degrades gracefully on thin data.",
    "7-layer security: 15-min HS256 JWTs + 7-day rotating refresh with a 30s grace window, AES-256-CBC payload encryption, CSRF, device-aware rate limiting, RBAC + row-level tenant scoping, and audit logs.",
    "Multi-layer caching: Postgres analytics cache + in-process TTL caches with O(1) generation-based invalidation + TanStack Query.",
    "20+ KPI treatment dashboard, a χ² cross-tab matrix (Cramér's V + standardized residuals), and an in-app NL analytics assistant.",
  ],
  challenges: [
    {
      title: "Dashboard mount-burst → DB pool exhaustion",
      problem:
        "The Treatment dashboard fired ~21 useQuery panels on mount — an empty-month wave plus the real wave, ~36 requests against a 15-connection pool — and tail requests hit the 25s statement timeout, leaving panels permanently blank.",
      solution:
        "Gated month-dependent queries with enabled: !!datasetMonth, added retry+exponential-backoff, and routed analytics/treatment GETs through a 15-permit semaphore so the burst drains instead of stampeding.",
    },
    {
      title: "Refresh-token rotation race → random logouts",
      problem:
        "With rotating refresh tokens, concurrent tabs replay the same just-rotated cookie; the backend treated the benign race as token theft and revoked every session.",
      solution:
        "Added a 30s server-side grace window (a fresh active token ⇒ benign replay, not theft) plus a cross-tab Web Locks single-flight refresh on the client.",
    },
    {
      title: "Non-sargable date_trunc on partitioned tables",
      problem:
        "date_trunc('month', col) in a WHERE clause is non-sargable and full-scans the lot_date-partitioned fact tables, even for a 2-value IN list.",
      solution:
        "Filtered the bare column with a half-open date range and queried one month per statement, so the planner prunes partitions; cast binds with CAST(:p AS DATE).",
    },
    {
      title: "BAXA forecast double-counting",
      problem:
        "Folding already-paid policies into the forecast as 'locked-in' double-counted the amount — the KPI card diverged from the band table and the actual-vs-predicted chart.",
      solution:
        "Enforced the invariant overall_* === Σ(lapse_band_breakdown); removed a hardcoded calibration multiplier and projected the brand-new DUE band via a pacing curve instead.",
    },
    {
      title: "Stale GETs from the browser HTTP cache",
      problem:
        "A new tab replayed stale API GET responses — and JavaScript can't purge the browser HTTP cache.",
      solution:
        "Stamped Cache-Control: no-store on API responses in SecurityHeadersMiddleware so financial data is never served stale.",
    },
  ],
  learnings: [
    "How far one well-modelled PostgreSQL instance goes — queue, storage, cache, rate limiting and revocation without extra infra.",
    "Layered architecture (controller/service/repository) that stays testable and honest about HTTP vs business vs SQL boundaries.",
    "Productionising forecasting: baselines first, ML blend second, with damping and the hard invariant that the headline KPI equals the sum of its bands.",
    "Security as composable layers — auth, rotation, encryption, CSRF, rate limiting, RBAC and audit working together, enforced in middleware.",
  ],
  future: [
    "PostgreSQL read replica to offload heavy EOD analytics from the request path.",
    "Recharts performance pass (disable isAnimationActive, virtualize the 30-chart pages).",
    "Job-queue admin UI over atsdbwh.jobs and Audit Logs 2.0.",
    "Extend the χ² cross-tab matrix to the debt domain; auto-trigger predictions from ingestion via the job queue.",
  ],
  metrics: [
    { label: "Datasets reconciled", value: "40 GB+", sub: "staging → transform" },
    { label: "Policies / month", value: "30K+", sub: "per campaign cycle" },
    { label: "Prediction engines", value: "7", sub: "baseline + ML blend" },
    { label: "Security layers", value: "7", sub: "auth → audit" },
    { label: "API routes", value: "60+", sub: "25 controllers" },
    { label: "Chart instances", value: "200+", sub: "across 25 modules" },
  ],
  tags: [
    "FastAPI",
    "PostgreSQL 17",
    "React 18",
    "TypeScript",
    "SQLAlchemy 2",
    "GradientBoosting",
    "Groq · Llama 3.3",
    "Docker",
    "Recharts",
    "TanStack Query",
  ],
  gallery: [
    // Dashboard
    { src: "/projects/bfsi/bfsi-01.png", group: "Dashboard", title: "Portfolio Retention Dashboard", caption: "Retention filters above gradient KPI cards — Total Policies 1,39,529, Premium Collected ₹6.65Cr, Renewal Rate, and open policies." },
    { src: "/projects/bfsi/bfsi-02.png", group: "Dashboard", title: "Recovery Rate S-Curve", caption: "Daily-recovered bars with a cumulative S-curve and live tooltip showing ₹3.6Cr recovered on 22 June." },
    { src: "/projects/bfsi/bfsi-03.png", group: "Dashboard", title: "State-wise Payment Heatmap", caption: "Interactive India choropleth shading states by payment rate, with per-state paid/unpaid tooltips." },
    { src: "/projects/bfsi/bfsi-06.png", group: "Dashboard", title: "Dashboard & Navigation", caption: "Full module navigation — Performance, Collaboration, Portfolio Management, and System Administration." },
    { src: "/projects/bfsi/bfsi-07.png", group: "Dashboard", title: "State Performance Panel", caption: "State-wise performance heatmap of policy retention with a 0–3% payment-rate legend." },
    // Analytics
    { src: "/projects/bfsi/bfsi-11.png", group: "Analytics", title: "Dark Analytics KPI Grid", caption: "Dark-mode analytics with neon gradient KPI tiles — 98,951 policies, recovery rate, ₹1481.9Cr outstanding." },
    { src: "/projects/bfsi/bfsi-12.png", group: "Analytics", title: "Cash-Flow Trajectory", caption: "Payment-rate trend with a premium cash-flow trajectory area chart." },
    { src: "/projects/bfsi/bfsi-13.png", group: "Analytics", title: "Aging Distribution", caption: "Payment-status donut, lapse-aging bars, and a policy-aging bar/line combo." },
    { src: "/projects/bfsi/bfsi-14.png", group: "Analytics", title: "Lapse Hazard Curve", caption: "Lapse-hazard curve by payment frequency plus a cumulative-value vs discontinuation chart." },
    { src: "/projects/bfsi/bfsi-08.png", group: "Analytics", title: "Metrics Breakdown", caption: "Life-retention analytics: policy & financial metric cards with outstanding vs collected premium." },
    { src: "/projects/bfsi/bfsi-09.png", group: "Analytics", title: "Distribution Donuts", caption: "Policy-status and premium-value donuts beside payment-rate-by-propensity and product bars." },
    { src: "/projects/bfsi/bfsi-10.png", group: "Analytics", title: "Channel Performance", caption: "Channel paid/total combo chart with payment-rate-by-zone bars." },
    // Forecasting & ML
    { src: "/projects/bfsi/bfsi-15.png", group: "Forecasting & ML", title: "Prediction Engine Controls", caption: "Configure domain, campaign, target month, and channel/product/state engines, then run a cumulative prediction." },
    { src: "/projects/bfsi/bfsi-18.png", group: "Forecasting & ML", title: "Debt-Collection Engine Setup", caption: "Debt-collection engines — 3M/6M moving average, Holt's double smoothing, and OLS linear regression." },
    { src: "/projects/bfsi/bfsi-04.png", group: "Forecasting & ML", title: "Predicted Collection by Ageing", caption: "ML KPI cards (predicted paid count, ₹6.52Cr predicted collection, confidence) over an ageing-band table." },
    { src: "/projects/bfsi/bfsi-16.png", group: "Forecasting & ML", title: "Cumulative Reliable Prediction", caption: "Forecast results — reliability %, predicted paid count, outstanding and predicted collection by band." },
    { src: "/projects/bfsi/bfsi-17.png", group: "Forecasting & ML", title: "Actual vs Predicted", caption: "Cumulative actual vs predicted collections with MTD variance KPIs and daily due-band collection." },
    // Treatment & Engagement
    { src: "/projects/bfsi/bfsi-20.png", group: "Treatment & Engagement", title: "Dialer Connect Center", caption: "941,202 attempts, 136,252 customers, RPC rate & containment, with RPC-by-ticket and geography charts." },
    { src: "/projects/bfsi/bfsi-24.png", group: "Treatment & Engagement", title: "Cross-Tabulation Matrix", caption: "Multi-dimensional χ² cross-tab heatmap of lapse cohorts by ticket-size band with over/under-representation cells." },
    { src: "/projects/bfsi/bfsi-19.png", group: "Treatment & Engagement", title: "Engagement Monitoring", caption: "Treatment & engagement KPIs — completed variants, RPC, BIO equipped, and health score." },
    { src: "/projects/bfsi/bfsi-22.png", group: "Treatment & Engagement", title: "Channel Overview", caption: "Dials/triggers/WhatsApp/SMS dispatch with revival-contribution-by-channel and avg-touches charts." },
    { src: "/projects/bfsi/bfsi-23.png", group: "Treatment & Engagement", title: "Customer Journeys", caption: "A sample SMS→Bot→Voice→Revived journey timeline with touches-to-revival and top channel-sequence paths." },
    { src: "/projects/bfsi/bfsi-21.png", group: "Treatment & Engagement", title: "Outreach Performance", caption: "Per-customer dialer/SMS/WhatsApp touch counts in an outreach-performance monitoring table." },
    { src: "/projects/bfsi/bfsi-26.png", group: "Treatment & Engagement", title: "Forecast Accuracy & Experiments", caption: "Revival-rate accuracy line, experiment outcomes, and system-capability ratios." },
    { src: "/projects/bfsi/bfsi-25.png", group: "Treatment & Engagement", title: "Compliance & Governance", caption: "Strategic-insight cards with 100% DND compliance, call quality, and zero escalations/pending audits." },
    // AI & Collaboration
    { src: "/projects/bfsi/bfsi-27.png", group: "AI & Collaboration", title: "In-App AI Assistant", caption: "Natural-language analytics assistant answering a lapse-aging question with suggested prompt chips." },
    { src: "/projects/bfsi/bfsi-28.png", group: "AI & Collaboration", title: "Reviews & Feedback", caption: "Threaded review composer with section tags for Dashboard/Analytics/Forecasting/Treatment." },
    // Data & Admin
    { src: "/projects/bfsi/bfsi-29.png", group: "Data & Admin", title: "Client Registry", caption: "Operational registry of enterprise partners with active-portfolio and campaign-footprint summary cards." },
    { src: "/projects/bfsi/bfsi-30.png", group: "Data & Admin", title: "Campaigns Registry", caption: "Campaign registry with domain filters, statuses, targets, and start dates across vendors." },
    { src: "/projects/bfsi/bfsi-31.png", group: "Data & Admin", title: "Upload & Ingestion", caption: "Ingestion stat cards (50 uploads, volume, failures, queue) and a direct file-upload drop zone." },
    { src: "/projects/bfsi/bfsi-33.png", group: "Data & Admin", title: "Remote Source Explorer", caption: "Network-share / SFTP gateway toggle with a UNC path field and remote directory listing." },
    { src: "/projects/bfsi/bfsi-34.png", group: "Data & Admin", title: "Upload History", caption: "Ingestion history from ingestion_files — batch statuses, row counts, and error counts." },
    { src: "/projects/bfsi/bfsi-40.png", group: "Data & Admin", title: "Read-only DB Viewer", caption: "212,096-row data grid with client/campaign/month/table filters and pagination." },
    // Security & Identity
    { src: "/projects/bfsi/bfsi-36.png", group: "Security & Identity", title: "Audit Log", caption: "Activity log of timestamped events (LOGIN, PROCESS FEATURES) with reference IDs, IP, location, device." },
    { src: "/projects/bfsi/bfsi-38.png", group: "Security & Identity", title: "User Management", caption: "User directory with total/admin/locked summary cards and role/status filters." },
    { src: "/projects/bfsi/bfsi-39.png", group: "Security & Identity", title: "Portal Administration", caption: "Profile & security with password change plus JWT access-token / session-termination controls." },
    { src: "/projects/bfsi/bfsi-37.png", group: "Security & Identity", title: "System Health Summary", caption: "Active clients, files processed, pending/failed, and audit-event summary cards." },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// FEATURED — ML & Analytics Portal (BFSI Predictive Platform)
// ───────────────────────────────────────────────────────────────────────────
const mlPortal: Project = {
  slug: "ml-analytics-portal",
  name: "ML & Analytics Portal",
  kicker: "Featured · ML Product",
  tagline:
    "A full-stack BFSI predictive platform — real-time ML inference, a Llama 3 SQL agent, and a polished light/dark analytics UI.",
  year: "2026",
  status: "Personal / Product build",
  role: "Full-stack & ML engineer",
  category: "featured",
  accent: "cyan",
  cover: "/projects/ml-portal/ux-05.png",
  summary:
    "A production-style predictive analytics product for life-insurance and debt portfolios. It serves real-time Random Forest and Logistic Regression inference for lapse and recovery forecasting, ships a Llama 3-powered natural-language SQL agent for ad-hoc querying, and presents it all through a refined glassmorphism dashboard with full light/dark theming and interactive charts.",
  problem:
    "Analysts needed to forecast policy lapse and recovery and query portfolios in plain English — without writing SQL or waiting on a data team. The goal was a single product where prediction, analytics, and natural-language exploration live together behind clean auth.",
  impact: [
    "Real-time lapse & recovery prediction surfaced directly in the dashboard for analyst decisions.",
    "A natural-language SQL agent removed the SQL barrier for non-technical users.",
    "A polished light/dark analytics UI made portfolio KPIs instantly legible.",
    "Modular, JWT-secured architecture designed to extend to new insurance lines.",
  ],
  architecture: {
    frontend: [
      "React + TypeScript",
      "Glassmorphism UI with full light/dark theming",
      "Recharts — historical timeline, lapse decay, forecast trend",
      "Responsive KPI dashboards",
    ],
    backend: [
      "FastAPI (async)",
      "JWT authentication",
      "Alembic-managed schema migrations",
      "Prediction + query service layers",
    ],
    database: ["PostgreSQL", "Migration-versioned schema", "Analytical query layer"],
    infrastructure: ["Vite dev proxy", "Modular service deployment"],
    ai: [
      "Random Forest training & inference",
      "Logistic Regression (life insurance)",
      "Llama 3 natural-language-to-SQL agent",
      "Lapse-forecast & KPI prediction engine",
    ],
  },
  highlights: [
    "One-click model training & inference (Random Forest, Logistic Regression) from the UI.",
    "Full model-evaluation dashboard — accuracy, precision/recall, F1, ROC-AUC, confusion matrix, and a performance-profile radar per model.",
    "Data Copilot — an in-app analytics chatbot powered by Groq + Llama 3 for natural-language questions over the data.",
    "Predictive lapse analytics: historical timeline, lapse decay curve, predicted volume by product.",
    "Fully themed light & dark dashboards with consistent KPI cards and gradients.",
  ],
  challenges: [
    {
      title: "Real-time inference UX",
      problem:
        "Model runs are slow relative to a click — the UI needed to stay responsive while training/predicting.",
      solution:
        "Modeled prediction as explicit jobs with ready/loading states and clear empty states before a forecast is generated.",
    },
    {
      title: "Trustworthy NL-to-SQL",
      problem:
        "An LLM writing SQL can hallucinate columns or run unbounded queries.",
      solution:
        "Constrained the agent to the known schema and surfaced results as charts, keeping the model on rails.",
    },
  ],
  learnings: [
    "Wiring an LLM agent to a real schema so it's useful without being dangerous.",
    "Designing a design-system that holds up in both light and dark themes.",
    "Packaging ML training/inference behind a clean, job-based product UX.",
  ],
  future: [
    "Model registry + versioned experiments with accuracy tracking.",
    "Streaming inference and cached feature stores.",
    "Role-based sharing of saved NL queries and dashboards.",
  ],
  metrics: [
    { label: "ML models", value: "3", sub: "RF · LogReg · forecast" },
    { label: "RF Accuracy", value: "94.3%", sub: "81,271 test records" },
    { label: "ROC-AUC", value: "≤89.5%", sub: "ranking quality" },
    { label: "Data Copilot", value: "Llama 3", sub: "via Groq" },
  ],
  tags: ["FastAPI", "React", "Llama 3", "Groq", "PostgreSQL", "Random Forest", "Logistic Regression", "Recharts"],
  gallery: [
    // Prediction Engine
    { src: "/projects/ml-portal/ml-04.png", group: "Prediction Engine", title: "Prediction Engine — Light", caption: "Light-theme ML engine stack — Lapse Forecast & KPI Prediction, Random Forest Training Engine (v1), and Logistic Regression v2 — each with a target/test-month picker and run action." },
    { src: "/projects/ml-portal/ml-06.png", group: "Prediction Engine", title: "Prediction Engine — Overview", caption: "Full light-theme prediction console showing all three engines with empty 'not generated yet' states before a run is triggered." },
    { src: "/projects/ml-portal/ml-03.png", group: "Prediction Engine", title: "Prediction Engine — Dark", caption: "Dark-theme version of the same engine stack with Generate Forecast / Run Prediction controls." },
    { src: "/projects/ml-portal/ml-05.png", group: "Prediction Engine", title: "Predictive Lapse Analytics", caption: "Predicted risk 2.0K, exposure 36.0K, conversion 5.6%, amount ₹9.6Cr — over a historical timeline and a lapse decay curve." },
    // Model Evaluation
    { src: "/projects/ml-portal/ml-07.png", group: "Model Evaluation", title: "Random Forest — Metrics (Light)", caption: "Random Forest results on 81,271 test records: 94.3% accuracy, 23.4% precision, 9.9% recall, 13.9% F1, 85.0% ROC-AUC, with a performance-profile radar and confusion matrix." },
    { src: "/projects/ml-portal/ml-10.png", group: "Model Evaluation", title: "Random Forest — Metrics (Dark)", caption: "Dark-theme Random Forest evaluation — metric cards, an all-metrics performance-profile radar, and a confusion matrix (TN 76,280 · FP 1,219)." },
    { src: "/projects/ml-portal/ml-08.png", group: "Model Evaluation", title: "Actual vs Predicted + Forecast", caption: "Logistic Regression v2 — actual-vs-predicted Will-Pay/Will-Default bars and an AI forecast-distribution donut (Will Pay 1,591 · Will Default 79,680)." },
    { src: "/projects/ml-portal/ml-09.png", group: "Model Evaluation", title: "Model Evaluation — Full View", caption: "Dark-theme end-to-end evaluation dashboard: metric cards, confusion matrix, actual-vs-predicted, and AI forecast distribution on one screen." },
    { src: "/projects/ml-portal/ml-11.png", group: "Model Evaluation", title: "Logistic Regression — Metrics", caption: "Logistic Regression (Life Insurance): 89.3% accuracy, 14.7% precision, 70.7% recall, 24.9% F1, 89.5% ROC-AUC, with performance radar and confusion matrix." },
    { src: "/projects/ml-portal/ml-12.png", group: "Model Evaluation", title: "Logistic Regression — Charts", caption: "Performance-profile radar, confusion matrix (TN 75,884 · TP 1,494), actual-vs-predicted, and forecast distribution over 86,651 accounts." },
    // AI Data Copilot
    { src: "/projects/ml-portal/ml-13.png", group: "AI Data Copilot", title: "Data Copilot — Llama 3", caption: "In-app 'Data Copilot' analytics chatbot powered by Groq + Llama 3 — ask natural-language questions about your data." },
    // Dashboard
    { src: "/projects/ml-portal/ml-01.png", group: "Dashboard", title: "Core KPIs — Light", caption: "Light dashboard — 542,636 policies, ₹8306.52Cr outstanding premium, payment rate 2.4%, and avg lapse ageing 615.1 days." },
    { src: "/projects/ml-portal/ml-02.png", group: "Dashboard", title: "Core KPIs — Dark", caption: "Identical KPI metrics rendered in a deep-navy dark theme with neon accent values." },
  ],
};

// ───────────────────────────────────────────────────────────────────────────
// FEATURED — Local-Hosted Desktop AI Agent (no screenshots → generated visuals)
// ───────────────────────────────────────────────────────────────────────────
const desktopAgent: Project = {
  slug: "desktop-ai-agent",
  name: "Local-Hosted Desktop AI Agent",
  kicker: "Featured · Privacy-first AI",
  tagline:
    "A fully offline, real-time voice assistant — Whisper STT + a local Ollama LLM + Edge-TTS — so all data stays on-device.",
  year: "2025",
  status: "Personal build",
  role: "AI / systems engineer",
  category: "featured",
  accent: "emerald",
  summary:
    "A desktop voice assistant that runs entirely offline. Speech is transcribed locally with Whisper, reasoned over by a local Ollama LLM, and spoken back with Edge-TTS — wrapped in a Tkinter UI. Because nothing leaves the machine, it's a genuinely private alternative to cloud assistants. Async processing and multithreading keep voice capture and LLM inference running concurrently.",
  problem:
    "Cloud voice assistants send your microphone audio and conversations to third-party servers. The goal was a capable assistant with zero data egress — full speech-to-text, reasoning, and text-to-speech happening on-device.",
  impact: [
    "100% on-device pipeline — no audio or transcripts ever leave the machine.",
    "Real-time feel via async + multithreaded capture and inference.",
    "Swappable local models through Ollama — upgrade reasoning without changing the app.",
    "A blueprint for privacy-first, offline-first AI tooling.",
  ],
  architecture: {
    frontend: ["Tkinter desktop UI", "Live mic capture & playback controls"],
    backend: [
      "Python + asyncio",
      "Multithreading for concurrent capture/inference",
      "Audio I/O pipeline orchestration",
    ],
    database: ["On-device only — no external storage"],
    infrastructure: ["Runs fully offline on a local machine"],
    ai: [
      "Whisper — speech-to-text (STT)",
      "Ollama — local LLM reasoning",
      "Edge-TTS — text-to-speech (TTS)",
      "Streaming voice → text → reasoning → voice loop",
    ],
  },
  highlights: [
    "Speech-to-text → LLM reasoning → text-to-speech, fully local.",
    "Async + multithreaded so listening and thinking overlap.",
    "Privacy by design: no network calls in the inference path.",
    "Model-agnostic through Ollama — Llama, Mistral, and more.",
  ],
  challenges: [
    {
      title: "Concurrency without freezing the UI",
      problem:
        "Voice capture, transcription, and LLM inference are all blocking — naively they freeze the Tkinter window.",
      solution:
        "Ran the pipeline on background threads with an asyncio loop, keeping the UI thread free and the interaction real-time.",
    },
    {
      title: "Latency on local hardware",
      problem:
        "Local STT + LLM + TTS chained serially feels sluggish.",
      solution:
        "Overlapped stages so transcription and speech synthesis pipeline alongside reasoning instead of waiting end-to-end.",
    },
  ],
  learnings: [
    "Orchestrating an async, multithreaded audio + inference pipeline.",
    "The real engineering of local LLMs: memory, latency, and model selection.",
    "Designing for privacy as a hard constraint, not an afterthought.",
  ],
  future: [
    "Wake-word detection and barge-in (interrupt while speaking).",
    "Local RAG over personal documents for grounded answers.",
    "GPU acceleration and quantized models for faster inference.",
  ],
  metrics: [
    { label: "Data egress", value: "0", sub: "fully offline" },
    { label: "Pipeline", value: "STT→LLM→TTS", sub: "real-time loop" },
    { label: "Models", value: "Local", sub: "via Ollama" },
    { label: "Concurrency", value: "async", sub: "+ multithreading" },
  ],
  tags: ["Python", "Ollama", "Whisper", "Edge-TTS", "Tkinter", "asyncio"],
  gallery: [], // no screenshots — rendered via generated visuals (mockup + pipeline diagram)
};

// ───────────────────────────────────────────────────────────────────────────
// SECONDARY projects
// ───────────────────────────────────────────────────────────────────────────
const financialPortal: Project = {
  slug: "financial-analysis-portal",
  name: "Financial Analysis Portal",
  kicker: "Project · Analytics",
  tagline: "An analytics dashboard with a natural-language SQL agent and Recharts KPI visualizations over PostgreSQL.",
  year: "2025",
  status: "Personal build",
  role: "Full-stack engineer",
  category: "secondary",
  accent: "amber",
  summary:
    "A focused analytics dashboard that pairs a natural-language SQL agent with interactive Recharts KPI visualizations over a PostgreSQL backend — an early exploration of agentic querying that later matured into the ML & Analytics Portal.",
  problem: "Non-technical users needed to explore financial KPIs without writing SQL.",
  impact: [
    "Plain-English querying over PostgreSQL via a SQL agent.",
    "Interactive KPI charts for fast financial exploration.",
  ],
  architecture: {
    frontend: ["React + Vite", "Recharts KPI charts"],
    backend: ["FastAPI", "SQL agent service"],
    database: ["PostgreSQL"],
    infrastructure: ["Vite dev proxy"],
    ai: ["Natural-language-to-SQL agent"],
  },
  highlights: [
    "Natural-language SQL agent over PostgreSQL.",
    "Interactive Recharts KPI dashboard.",
  ],
  challenges: [],
  learnings: ["Foundations of agentic NL-to-SQL and dashboard design."],
  future: ["Merge learnings into the ML & Analytics Portal."],
  metrics: [
    { label: "Query", value: "NL → SQL", sub: "agentic" },
    { label: "Charts", value: "Recharts", sub: "interactive" },
    { label: "DB", value: "PostgreSQL", sub: "" },
  ],
  tags: ["FastAPI", "React", "Vite", "SQL Agent", "Recharts"],
  gallery: [],
};

const airbnb: Project = {
  slug: "airbnb-price-prediction",
  name: "Airbnb Price Prediction",
  kicker: "Project · ML",
  tagline: "An XGBoost regression model for price forecasting with extensive EDA and rigorous feature engineering.",
  year: "2024",
  status: "ML project",
  role: "ML engineer",
  category: "secondary",
  accent: "emerald",
  summary:
    "A supervised-learning project forecasting Airbnb listing prices with an XGBoost regression model, backed by extensive exploratory data analysis and careful feature engineering to maximise predictive accuracy.",
  problem: "Predict nightly listing price from heterogeneous listing features.",
  impact: [
    "Trained an XGBoost regressor with strong predictive performance.",
    "Demonstrated end-to-end EDA → feature engineering → modeling.",
  ],
  architecture: {
    frontend: [],
    backend: ["Python (Google Colab)"],
    database: ["Tabular dataset"],
    infrastructure: ["Google Colab"],
    ai: ["XGBoost regression", "EDA + feature engineering"],
  },
  highlights: ["Extensive EDA and feature engineering.", "XGBoost regression for price forecasting."],
  challenges: [],
  learnings: ["The full classical-ML modeling loop on real, messy data."],
  future: ["Hyperparameter search and model interpretability (SHAP)."],
  metrics: [
    { label: "Model", value: "XGBoost", sub: "regression" },
    { label: "Workflow", value: "EDA→FE→Model", sub: "" },
  ],
  tags: ["XGBoost", "Python", "Google Colab", "scikit-learn"],
  gallery: [],
};

export const projects: Project[] = [atsCrp, mlPortal, desktopAgent, financialPortal, airbnb];

export const flagship = atsCrp;
export const featuredProjects = [atsCrp, mlPortal, desktopAgent];
export const secondaryProjects = [financialPortal, airbnb];
