#!/usr/bin/env sh
set -e

# Build the vector index from data/knowledge/*.md before serving.
# Render's free tier has ephemeral storage, so the index is rebuilt on each cold start.
# The knowledge base is tiny, so this is just a handful of embedding calls.
python scripts/ingest.py

# Render injects $PORT; fall back to 8000 for local Docker runs.
exec uvicorn app.main:app --host 0.0.0.0 --port "${PORT:-8000}"
