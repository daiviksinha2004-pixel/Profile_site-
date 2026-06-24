"""Health/status endpoint — also handy to confirm the index was built."""
from __future__ import annotations

from fastapi import APIRouter

from app.config import settings
from app.models.schemas import HealthResponse
from app.rag.vector_store import get_vector_store

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    try:
        count = get_vector_store().count()
    except Exception:
        count = 0
    return HealthResponse(
        status="ok",
        indexed_chunks=count,
        chat_model=settings.chat_model,
        embedding_model=settings.embedding_model,
    )
