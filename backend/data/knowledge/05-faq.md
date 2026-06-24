# FAQ — common recruiter & interviewer questions about Daivik Sinha

> These mirror real interview questions and give the chatbot ready, grounded answers. Phrased so the
> bot can answer in the third person.

## "Walk me through the architecture of his main project."
ATS CRP is a two-app system: an async FastAPI backend and a React 18 + TypeScript SPA. The backend
follows strict controller → service → repository layering. The defining decision was *zero external
dependencies* — no Redis, no Celery, no S3 — with PostgreSQL doing job queueing (`FOR UPDATE SKIP
LOCKED`), file storage (BYTEA), and rate limiting. This made the system simple to operate, audit, and
back up.

## "What was the hardest bug he fixed?"
The Treatment dashboard mount burst: the page fired ~21 `useQuery` panels simultaneously on mount,
producing ~36 concurrent requests against a 15-connection DB pool and exhausting it. He fixed it by
gating month-dependent queries (`enabled: !!datasetMonth`), adding throttle middleware, and
exponential backoff.

## "How does the prediction engine work?"
For debt collection it's two-phase: Phase A is a segmented historical baseline over DPD buckets;
Phase B optionally blends a GradientBoostingRegressor (final = 0.45×baseline + 0.55×ML) when there's
enough history, with trend damping capped at 55%. For insurance retention, it blends in-month payment
rate, propensity-band priors, and a damped trend, scaling exposure by data completeness.

## "How did he handle security?"
Multiple layers: TLS at the edge plus AES-256-CBC payload encryption at the app layer; short-lived
JWTs (15 min) with rotating refresh tokens (7 days) and a blocklist; CSRF middleware; device-aware
rate limiting; security headers; row-level access control for client-portal users; and audit logging.

## "How does the data ingestion pipeline work?"
Files upload through the API and are stored as BYTEA in PostgreSQL, then a background worker processes
them. The loader uses `jsonb_populate_record` to map CSV headers to columns by name, so new columns
need no loader changes. Validation is domain-aware.

## "What does he want to work on / what roles is he looking for?"
Backend and applied-AI engineering — FastAPI services, RAG/LLM features, data pipelines, and ML
inference. He enjoys owning systems end to end and shipping production code.

## "Is he available / how can we contact him?"
He's a final-year student (graduating 2026) open to roles. The best way to reach him is via the
contact links on this site (email / LinkedIn / GitHub).

## "Does he know <technology>?"
Check his skills: Python, SQL, JS/TS; FastAPI, SQLAlchemy, Pydantic, async; PostgreSQL/Oracle/MySQL,
ETL, vector DBs; React, Vite, Zustand, TanStack Query, Recharts, Tailwind; LLM/RAG, LangChain,
Llama 3, Ollama, scikit-learn, XGBoost; Git, Docker, Linux, Power BI, CI/CD. If a technology isn't
listed, the honest answer is that it's not in his documented experience.
