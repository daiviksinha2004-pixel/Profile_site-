# Deployment Guide — Vercel (frontend) + Render (backend)

This deploys the two services and wires them together. Do it in this order:
**GitHub → Render (backend) → Vercel (frontend) → connect them.**

---

## 0. Push to GitHub (one time)

```bash
git init
git add .
git commit -m "Initial commit"
# Create an empty repo at https://github.com/new (e.g. "portfolio"), then:
git branch -M main
git remote add origin https://github.com/<your-username>/portfolio.git
git push -u origin main
```

---

## 1. Backend → Render

1. Go to <https://dashboard.render.com> → **New +** → **Blueprint**.
2. Connect your GitHub and pick the `portfolio` repo. Render reads [`render.yaml`](render.yaml) automatically.
3. It will prompt for the secret env vars (marked `sync: false`). Enter:

   | Key            | Value |
   |----------------|-------|
   | `AI_PROVIDERS` | JSON array, e.g. `[{"name":"groq-8b","base_url":"https://api.groq.com/openai/v1","api_key":"gsk_...","model":"llama-3.1-8b-instant"}]` |
   | `GROQ_API_KEY` | `gsk_...` (free key from <https://console.groq.com>) — used if `AI_PROVIDERS` is empty |
   | `AI_API_KEY`   | Gemini API key (free from <https://aistudio.google.com/apikey>) — for embeddings |
   | `CORS_ORIGINS` | leave as `http://localhost:3000` for now; you'll update it in step 3 |

   > You only strictly need: one chat key (`GROQ_API_KEY` **or** `AI_PROVIDERS`) **and** `AI_API_KEY` for embeddings.

4. Click **Apply**. First deploy takes a few minutes (it builds the Docker image and the vector index).
5. When live, copy the URL — it looks like `https://portfolio-backend-xxxx.onrender.com`.
6. Verify: open `https://portfolio-backend-xxxx.onrender.com/api/health` — should return JSON.

> **Free tier note:** the backend sleeps after ~15 min idle; the first request after that takes ~30–60s to wake (and rebuilds the index). Fine for a portfolio.

---

## 2. Frontend → Vercel

1. Go to <https://vercel.com/new> → import the same `portfolio` repo.
2. **Root Directory:** set to `frontend`. (Framework auto-detects as Next.js.)
3. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `NEXT_PUBLIC_API_BASE_URL` | your Render URL from step 1.5, e.g. `https://portfolio-backend-xxxx.onrender.com` |
   | `NEXT_PUBLIC_SITE_URL`     | your Vercel URL (you can fill this after first deploy, e.g. `https://portfolio.vercel.app`) |
   | `RESEND_API_KEY`           | `re_...` (your existing key) |
   | `CONTACT_FROM`             | `Portfolio <onboarding@resend.dev>` |
   | `CONTACT_TO`               | `daiviksinha2004@gmail.com` |

4. Click **Deploy**. Copy the resulting URL (e.g. `https://portfolio.vercel.app`).

---

## 3. Connect them (CORS)

1. Back in Render → your backend service → **Environment** → set:
   - `CORS_ORIGINS` = your Vercel URL, e.g. `https://portfolio.vercel.app`
     (comma-separate if you add a custom domain later).
2. Save → Render redeploys automatically.
3. (Optional) In Vercel, set `NEXT_PUBLIC_SITE_URL` to the real URL and redeploy.

Done. Visit your Vercel URL and try the chat widget + contact form.

---

## Custom domain (optional)
- **Vercel:** Project → Settings → Domains → add your domain, follow DNS steps.
- Then add that domain to `CORS_ORIGINS` on Render and `NEXT_PUBLIC_SITE_URL` on Vercel.
- For the contact form to send to *any* address (not just your Resend account), verify the
  domain at <https://resend.com/domains>, set `CONTACT_FROM` to an address on it, and remove `CONTACT_TO`.
