# ✅ Assets & Info You Need to Provide

Good news: I've already pre-filled most of the **text** content from your resume and the ATS CRP
project guide. What's left is mostly **media, links, and a few decisions**. Work top-to-bottom.

Legend: ⭐ = required for a great first impression · ◻ = nice to have

---

## 1. Identity & contact (confirm/correct)
- ◻ **Display name** — I used **Daivik Sinha** (from your resume). Confirm or change.
- ✅ **Email** to show publicly — set to `daiviksinha2004@gmail.com`.
- ⭐ **LinkedIn URL** — your resume links it but I can't read the target. Paste the full URL.
- ⭐ **GitHub URL** — same; paste the full URL.
- ◻ **Phone** — `+91-8287035751` (only include if you want it public; many devs omit it).
- ◻ **Location** — e.g. "Bhopal / Noida, India" + "open to relocate / remote".
- ◻ **One-line tagline** — I drafted: _"Final-year Data Science student building full-stack, AI-powered BFSI platforms."_ Tweak if you like.

> Where to edit: `frontend/data/profile.ts` and `backend/data/knowledge/00-profile.md`.

---

## 2. Images → drop into `frontend/public/`
- ⭐ **Professional headshot** → `public/headshot.jpg` (square, ~600×600, well-lit). Used on hero + about.
- ⭐ **Resume PDF** → `public/DaivikSinhaResume.pdf` (so the "Download Résumé" button works).
- ◻ **OG / social-share image** → `public/og-image.png` (1200×630) — the preview when the link is shared.
- ◻ **Favicon** → `public/favicon.ico`.
- ◻ **Project screenshots** (huge for impact) → `public/projects/<slug>.png`. Suggested, one each:
  - `ats-crp.png` — a dashboard / S-curve / treatment screen (blur any client data).
  - `ml-analytics-portal.png` — the glassmorphism predictive UI.
  - `desktop-ai-agent.png` — the Tkinter voice-assistant window.
  - `financial-analysis-portal.png` — the SQL-agent chat + Recharts KPIs.
  - `airbnb-price-prediction.png` — an EDA / feature-importance chart from Colab.

> ⚠️ Since ATS CRP is an internal BFSI product, screenshot only non-sensitive UI and blur any real
> customer / policy data before publishing.

---

## 3. The remaining projects (you said there are more)
I've fully written up **ATS CRP** and stubbed the 4 resume projects. For each *additional* project
(past internships + personal), send me — or fill into `frontend/data/projects.ts` +
a new `backend/data/knowledge/0X-project-<name>.md`:
- Name + one-line summary
- Tech stack
- 2–4 bullet points (what you built, the hard part, the impact/numbers)
- Live URL and/or GitHub repo link
- Optional screenshot

The richer the writeup, the smarter the AI bot is about that project.

---

## 4. Achievements / extras (optional but recommended)
- ◻ Certifications (e.g. cloud, ML, any course certs) — name, issuer, year, link.
- ◻ Awards / hackathons / rankings.
- ◻ Publications / blog posts / talks.
- ◻ A short "About me" paragraph in your own voice (hobbies, what you're looking for).

> Where to edit: add `backend/data/knowledge/06-achievements.md` and a section in `profile.ts`.

---

## 5. API keys (for the AI bot to run)
- ⭐ **Anthropic API key** → https://console.anthropic.com → put in `backend/.env` as `ANTHROPIC_API_KEY`.
- ⭐ **Voyage AI key** (embeddings) → https://www.voyageai.com → `backend/.env` as `VOYAGE_API_KEY`.
- ◻ (Production) a hosted vector DB key if you outgrow local Chroma — Qdrant Cloud / Pinecone.

> 💡 Cost: the bot is cheap to run. Each chat answer is a few cents on Claude; embeddings are a one-time
> cost at ingest. For a public bot you can switch `CHAT_MODEL` to `claude-haiku-4-5` to cut cost ~5×.

---

## 6. Deployment decisions (later — not needed to start)
- ◻ Domain name (e.g. `daiviksinha.dev`).
- ◻ Frontend host: **Vercel** (best for Next.js, free tier).
- ◻ Backend host: **Render / Railway / Fly.io** (free/cheap FastAPI hosting).
- ◻ Whether to gate the chatbot behind a rate limit (recommended for public).

---

### TL;DR — to get a working demo today, I need:
1. Your **LinkedIn + GitHub URLs**
2. A **headshot** + the **resume PDF** in `frontend/public/`
3. An **Anthropic key** and a **Voyage key** in `backend/.env`

Everything else can be filled in incrementally.
