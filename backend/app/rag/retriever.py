"""Retrieve the most relevant knowledge chunks for a question."""
from __future__ import annotations

from app.config import settings
from app.rag.embeddings import embed_query
from app.rag.vector_store import get_vector_store


def retrieve(query: str, top_k: int | None = None) -> list[tuple[str, dict, float]]:
    """Return [(text, metadata, score)] sorted by relevance (best first)."""
    k = top_k or settings.top_k
    embedding = embed_query(query)
    return get_vector_store().query(embedding, top_k=k)


def build_context(results: list[tuple[str, dict, float]]) -> str:
    """Format retrieved chunks into a single context block for the LLM."""
    blocks = []
    for text, meta, _score in results:
        src = meta.get("source", "knowledge")
        blocks.append(f"(from {src})\n{text}")
    return "\n\n---\n\n".join(blocks)
