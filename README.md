# Daivik Sinha — AI-Powered Portfolio

An advanced personal portfolio that showcases my resume, achievements, projects, and professional
experience — plus an **AI chat layer** ("Ask‑Me‑Anything") powered by a RAG
(Retrieval‑Augmented Generation) bot that answers questions about me using my own data.

> Recruiters can read the site **or** just chat with my AI twin:
> _"Walk me through the ATS CRP architecture."_ · _"Does Daivik know FastAPI and RAG?"_ ·
> _"What was the hardest bug he fixed?"_ · _"Summarize his strongest project."_

Fitting, since I build full-stack AI/RAG platforms for a living — this portfolio *is* a live demo of that.

---

## Architecture

```
                ┌──────────────────────────┐
                │   Next.js Frontend (UI)  │   portfolio pages + chat widget
                │  TypeScript · Tailwind   │
                └────────────┬─────────────┘
                             │  HTTPS / SSE (streaming)
                ┌────────────▼─────────────┐
                │   FastAPI Backend (API)  │
                │  /api/chat  /api/health  │
                └────────────┬─────────────┘
                             │
            ┌────────────────┼────────────────────┐
            ▼                ▼                     ▼
   ┌──────────────┐  ┌────────────────┐   ┌──────────────────┐
   │ Voyage AI    │  │ Vector DB      │   │ Anthropic Claude │
   │ (embeddings) │  │ (Chroma/Qdrant)│   │ (answer gen.)    │
   └──────────────┘  └────────────────┘   └──────────────────┘
```

**RAG flow:** my bio / experience / projects / resume (in `backend/data/knowledge/*.md`) are chunked
and embedded once (`ingest`), then stored in the vector DB. On each question the backend embeds the
question, retrieves the most relevant chunks, and asks Claude to answer **grounded only in that
context** — so the bot stays accurate and never invents facts about me.

---

## Repository layout

```
Profile/
├── README.md                  ← you are here
├── ASSETS_NEEDED.md           ← ⭐ what you still need to provide (photos, links, screenshots)
├── docker-compose.yml         ← optional one-command local stack
├── .gitignore
│
├── frontend/                  ← Next.js portfolio site
│   ├── app/                   ← pages (home; add about/projects/experience/contact)
│   ├── components/            ← UI + the AI ChatWidget
│   ├── data/                  ← typed content (profile, projects, experience, skills) — REAL DATA
│   ├── lib/                   ← api client, helpers
│   └── public/                ← images, resume PDF, og-image (see ASSETS_NEEDED.md)
│
└── backend/                   ← FastAPI + RAG service
    ├── app/
    │   ├── main.py            ← FastAPI entrypoint
    │   ├── config.py          ← env-driven settings
    │   ├── api/routes/        ← chat + health endpoints
    │   ├── rag/               ← chunking, embeddings, vector store, retriever, ingestion
    │   ├── llm/               ← Claude client (streaming answers)
    │   └── models/            ← request/response schemas
    ├── data/knowledge/        ← ⭐ YOUR info as markdown (the RAG source of truth) — PRE-FILLED
    └── scripts/ingest.py      ← build the vector index from data/knowledge/*.md
```

---

## Quick start

### 1. Backend (RAG API)
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows  (macOS/Linux: source .venv/bin/activate)
pip install -r requirements.txt
copy .env.example .env          # then add your ANTHROPIC_API_KEY and VOYAGE_API_KEY
python scripts/ingest.py        # build the vector index from data/knowledge/*.md
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend (website)
```bash
cd frontend
npm install
copy .env.local.example .env.local
npm run dev                     # http://localhost:3000
```

---

## What to do next
1. Read **[ASSETS_NEEDED.md](ASSETS_NEEDED.md)** — it's short; mostly photos, links, and screenshots.
2. Skim the pre-filled `backend/data/knowledge/*.md` and `frontend/data/*.ts` (built from your resume
   + ATS CRP guide) and correct anything.
3. Add the remaining projects from your past internships / personal work.
4. Drop your `DaivikSinhaResume.pdf` and images into `frontend/public/`.
5. Get API keys (Anthropic + Voyage), run `ingest.py`, start both servers.
