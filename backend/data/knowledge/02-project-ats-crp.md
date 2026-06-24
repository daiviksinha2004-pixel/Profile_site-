# Project — ATS CRP (Customer Resolution Platform)

## What it is
ATS CRP is an internal enterprise analytics and operations platform for the BFSI industry, built by
Daivik Sinha from scratch during his Software Development Internship at ATS Services. It serves two
business units:
- **Debt Collection** — track, forecast, and manage recovery of non-performing loans (NPAs).
  Metrics: DPD (days past due), EMI amounts, recovery rates, PTP (promise-to-pay) commitments.
- **Insurance Retention** — prevent life and health insurance policy lapses: predict churn
  propensity, run outreach campaigns, and measure revival (policies brought back from lapse).

Users: internal ops/analytics teams plus restricted client-portal users (e.g. a Bharti Axa Life
"activist" role that sees only its own data). Scale: portfolios of 30,000+ policies per campaign
month; multi-MB CSV/Excel ingestion per batch; queries over partitioned fact tables; real-time
multi-channel outreach tracking (dialer, AI bot, SMS, WhatsApp, PTP).

## Tech stack
**Backend:** Python 3.12 (async throughout), FastAPI with Pydantic v2 DTOs, SQLAlchemy 2 (asyncpg),
PostgreSQL 17 (single schema `atsdbwh`). Background jobs run on a custom PostgreSQL-native worker
(polls `atsdbwh.jobs` with `FOR UPDATE SKIP LOCKED`). File storage is PostgreSQL BYTEA (no S3).
Rate limiting is a PostgreSQL-backed sliding window (no Redis). Migrations are mixed Alembic +
hand-written `.sql`. Testing with pytest. ML/stats via scikit-learn (GradientBoostingRegressor) and
custom rule-based engines.

**Frontend:** React 18 + TypeScript, Vite (dev proxy `/api → :8000`), Tailwind CSS. State split:
Zustand (auth/filter, persisted to localStorage) + TanStack Query (server data). Charts via Recharts
(~203 ResponsiveContainer instances across 25 files). Client-side PDF export with jsPDF + html2canvas.
Single Axios instance (`src/lib/api.ts`). Routing via React Router v6.

**Infra:** Docker (separate backend/frontend images on a shared network, backend aliased `api:8000`),
nginx reverse proxy for the SPA, TLS at the edge, GitLab CI pipeline stub.

## The big architectural decisions
- **Zero external dependencies (PostgreSQL-only):** no Redis, no Celery, no MinIO/S3. Every
  background job is a row in `atsdbwh.jobs` (queryable, replayable); uploads live as BYTEA in
  `atsdbwh.file_store`; rate-limit state is in `atsdbwh.rate_limit_hits`. The trade was
  infrastructure *breadth* for *depth*: one database to manage, back up, and make highly available.
- **Strict layered architecture:** `controller → service → repository → DB`. Controllers do HTTP +
  Pydantic validation only; services hold business logic and never know about HTTP; repositories do
  SQL only, no conditionals. Easy to unit-test services with mocked repos.
- **Session injection pattern (enforced):** one `AsyncSession` per request, injected via
  `Depends(get_db)`; never `AsyncSessionLocal()` in a request path. `get_db` sets `work_mem=4MB` and
  `statement_timeout=25s`, preventing pool exhaustion and giving consistent timeouts.
- **Middleware order matters:** security headers → CORS → request context → analytics throttle →
  CSRF → auth → rate limit → payload encryption. Auth and CSRF are enforced in middleware, not
  per-route. A 15-semaphore analytics throttle sits between request context and CSRF.
- **Multi-domain, multi-vendor design:** three domains (`life_retention`, `health_retention`,
  `debt_collection`), each with its own fact table, validation rules, and prediction engines.
  Vendors (Kotak, BSLI, Baxa) add another dimension; prediction logic branches on `is_kotak`,
  `is_baxa`. Deliberately *not* abstracted into a generic engine because the business rules genuinely
  differ (e.g. Baxa has a "DUE" lapse band that doesn't exist in BSLI history).

## What was built — feature by feature
- **Auth & session security:** JWT lifecycle with 15-min access + 7-day refresh tokens with rotation;
  token blocklist (`atsdbwh.revoked_tokens` by `jti`, plus `atsdbwh.user_revocations` for mass
  revoke). Refresh-token race fix: a 30-second grace window so a benign double-refresh from two tabs
  isn't treated as token theft. Cross-tab single-flight refresh via the browser Web Locks API in
  `lib/api.ts`. Device-aware rate limiting keyed on `(X-Device-ID, client IP, endpoint)`, with an
  `X-Forwarded-For` fix for the shared-bucket-behind-proxy bug.
- **AES-256-CBC payload encryption:** all API traffic is double-encrypted — TLS at the edge plus
  app-layer AES-256-CBC. Frontend `lib/encryption.ts` encrypts requests / decrypts responses; backend
  `PayloadEncryptionMiddleware` mirrors it. Keys derived from `SECRET_KEY`.
- **Data ingestion pipeline:** upload (CSV/Excel) → parser → row validator → domain loader → staging
  table → transform → fact table. A PostgreSQL JSONB trick (`jsonb_populate_record` +
  `jsonb_object_agg(lower(key), value)`) maps CSV headers to columns by name, so adding a new column
  needs zero loader-code changes. Validation is domain-aware (life retention allows negative values =
  in-grace period; debt collection flags them). SFTP ingestion for automated remote pickup.
- **Background job worker:** a custom `MinimalistWorker` polling `atsdbwh.jobs` with
  `FOR UPDATE SKIP LOCKED` (correct multi-worker pattern without Redis), dispatching by `job_type`.
  Post-upload jobs: analytics rollup, prediction run, daily aggregation. Every job is a DB row →
  full auditability, no lost jobs.
- **Prediction & forecasting engines (7 total):**
  - *Debt collection* — Phase A: segmented historical baseline by DPD buckets (≤30 / 31–90 / >90),
    computing realized recovery rate over the last N months, blended by current-month outstanding
    weights. Phase B: optional ML blend — if ≥4 months of history, a `GradientBoostingRegressor` on
    campaign-level features; final rate = 0.45×baseline + 0.55×ml. Trend damping caps at 55%.
  - *Life retention* — blend of in-month PMT rate, propensity-band priors, and damped trend vs prior
    months; `data_completeness_pct` scales exposure for partial batches.
  - *BAXA/BSLI vendor engines* — three parallel engines (channel / product type / state), averaged.
    BAXA uses the full unpaid book (30,385 policies); a DUE-band extrapolation paces this month's
    realised DUE collections to month-end.
- **Analytics & KPI layer:** S-curve / payment-curve charts (model prediction vs actual vs target);
  a generation-folded controller cache that auto-bumps when `MAX(dataset_month)` advances; a
  Postgres-backed analytics cache with explicit invalidation; `Cache-Control: no-store` headers to
  stop stale GETs.
- **Treatment dashboard:** the most complex feature — 20+ KPI cards, 6 chart sections, multi-tab.
  Treatments at customer grain (`life_campaign_treatments`); outcomes at policy grain
  (`life_campaign_records`).
- **Cross-tab matrix:** 16 whitelisted dimensions, raw per-cell aggregates, re-derived margins, a χ²
  independence test, optional month-over-month compare, and a drill-down endpoint.
- **Collaboration / reviews:** threaded `atsdbwh.dashboard_reviews`, 20-second polling via TanStack
  `refetchInterval`.
- **PDF export system:** three report types (Portfolio Performance, Forecast, Treatment) generated
  client-side in `pdfReportGenerator.tsx`.
- **RBAC & business-line routing:** activist role restricted by `allowed_client_id` /
  `allowed_campaign_id` enforced at every endpoint; fixed a vertical routing bug by making
  `lib/verticals.ts` business-line-aware and resetting filter state on login.

## Hard problems Daivik solved
1. **PostgreSQL `date_trunc` on a bind param is ambiguous** — call `date_trunc` only on typed
   columns; cast bind params with `CAST(:p AS DATE)`.
2. **`date_trunc` in WHERE is non-sargable** — even a 2-value `IN` on `dataset_month` full-scans;
   query one month per statement.
3. **Treatment mount burst → DB pool exhaustion** — ~21 `useQuery` panels fired on mount (~36
   concurrent requests against a 15-connection pool). Fixed with `enabled: !!datasetMonth` gating, a
   throttle middleware, and exponential backoff.
4. **Browser HTTP cache replaying stale API responses** — server must send `Cache-Control: no-store`
   (added to `SecurityHeadersMiddleware`).
5. **BAXA forecast double-counted already-paid policies** — invariant: `overall_*` must always equal
   `sum(lapse_band_breakdown)`.
6. **Rate limiting shared one bucket behind the proxy** — fixed with `X-Forwarded-For` parsing when
   `TRUST_PROXY_HEADERS=true`.

## Security controls (7 layers)
JWT rotation + blocklist; 30s refresh grace window; cross-tab single-flight refresh (Web Locks API);
AES-256-CBC payload encryption; CSRF middleware (header-based); device-aware rate limiting; security
headers (CSP, `X-Frame-Options: DENY`, HSTS); `Cache-Control: no-store`; row-level security
(`allowed_client_id` / `allowed_campaign_id`); audit logging (`atsdbwh.audit_logs`); input-injection
safety (16-dimension whitelist + Pydantic boundaries).

## Numbers & impact
- 30,000+ policies per campaign month; 40 GB+ datasets reconciled.
- 3 domains (life retention, health retention, debt collection); 3 vendors (Kotak, BSLI/Baxa).
- 25+ controllers, 60+ routes under `/api/v1`; 25+ frontend route-level pages.
- ~203 Recharts chart instances; 7 prediction engines; 7 security layers.

## Roadmap (what's next)
Near-term: Life Retention dashboard enhancements (three-way paid toggle, BAU/POC cross-tab breakdown,
dynamic Y-axis toggles), cross-tab for the debt domain, Recharts performance optimization
(disable `isAnimationActive`, lazy-render heavy chart pages). Medium-term: job-queue admin UI,
propensity-band tuning, Audit Logs 2.0, full GitLab CI, graceful worker shutdown. Long-term:
PostgreSQL read replica, `daily_policy_count` in S-curve analytics, FastAPI/Starlette security bump.
