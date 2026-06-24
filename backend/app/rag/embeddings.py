"""Embeddings via an OpenAI-compatible endpoint (Gemini's text-embedding-004 by default).

The same model must be used for indexing and querying, so re-run `python scripts/ingest.py`
whenever you change EMBEDDING_MODEL or the embedding provider.
"""
from __future__ import annotations

from functools import lru_cache

from openai import OpenAI

from app.config import settings


@lru_cache(maxsize=1)
def _client() -> OpenAI:
    return OpenAI(api_key=settings.ai_api_key, base_url=settings.ai_base_url)


def embed_documents(texts: list[str], batch_size: int = 32) -> list[list[float]]:
    out: list[list[float]] = []
    for i in range(0, len(texts), batch_size):
        batch = texts[i : i + batch_size]
        resp = _client().embeddings.create(model=settings.embedding_model, input=batch)
        out.extend(item.embedding for item in resp.data)
    return out


def embed_query(text: str) -> list[float]:
    resp = _client().embeddings.create(model=settings.embedding_model, input=[text])
    return resp.data[0].embedding
