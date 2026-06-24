# Professional Experience — Daivik Sinha

## Software Development Intern — ATS Services, Faridabad (Feb 2026 – Present)
Daivik architected and built a production BFSI debt-collection and insurance-retention analytics
platform from scratch — internally called ATS CRP (Customer Resolution Platform). Highlights:

- Built an async **FastAPI + PostgreSQL** backend and a **React 18 + TypeScript (Vite)** SPA on a
  strict controller–service–repository architecture (Spring-Boot-style layering in Python).
- Engineered an automated **Oracle-to-PostgreSQL sync service**: a schema-mapping layer converts raw
  data from a live Oracle database into the warehouse model, run nightly at 2 AM by a
  PostgreSQL-native worker using `FOR UPDATE SKIP LOCKED` that incrementally loads new files and
  refreshes portal tables for daily-updated analytics.
- Processed and reconciled **40 GB+ datasets** through staging tables, chunked batch transforms, and
  table partitioning with index/partition-pruning tuning under `work_mem` / `statement_timeout` guards.
- Built a **multi-layer caching strategy** — a Postgres-backed analytics cache, in-process TTL caches
  with generation-based O(1) invalidation, and client-side TanStack Query caching — cutting redundant
  database load and dashboard latency.
- Engineered the **AI layer** — an LLM-powered (Llama 3) natural-language-to-SQL agent, plus ML
  prediction engines (Random Forest, Logistic Regression) and statistical S-curve forecasting for
  debt-recovery and policy-lapse propensity.
- Secured sensitive financial data with **JWT authentication** (single-flight refresh),
  **AES-256-CBC** payload encryption, CSRF protection, rate limiting, and role-based access control.

See the dedicated ATS CRP project file for the full architecture, decisions, problems solved, and
interview-ready detail.

## IT Project Intern — AMU Leasing Pvt. Ltd., Noida (Jun 2025 – Aug 2025)
- Built **Power BI** dashboards for financial analytics, reducing report-generation time by **50%**.
- Integrated **CRIF and Aadhaar eKYC APIs** for automated customer verification, processing **500+
  documents monthly**.
