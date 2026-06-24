"""Chat endpoint — RAG over the knowledge base, streamed back as Server-Sent Events (SSE).

Frontend reads the stream and appends each token as it arrives.
Wire format (one JSON object per SSE `data:` line):
    {"sources": ["02-project-ats-crp.md", ...]}   # sent once, first
    {"token": "He "}                               # many
    {"done": true}                                 # sent once, last
"""
from __future__ import annotations

import json
from collections.abc import Iterator

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse, StreamingResponse

from app.config import settings
from app.llm.llm_client import stream_answer
from app.models.schemas import ChatRequest
from app.rag.retriever import build_context, retrieve
from app.shared.analytics_log import log_question
from app.shared.rate_limit import check as rate_check

router = APIRouter(tags=["chat"])


def _sse(payload: dict) -> str:
    return f"data: {json.dumps(payload)}\n\n"


def _client_ip(request: Request) -> str:
    # Honor the left-most X-Forwarded-For entry behind a proxy; else the socket peer.
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


@router.post("/chat")
def chat(req: ChatRequest, request: Request):
    # Abuse guard: per-IP sliding window + per-IP/global daily caps.
    ip = _client_ip(request)
    allowed, retry_after = rate_check(ip)
    if not allowed:
        return JSONResponse(
            status_code=429,
            content={"error": "Too many requests — please wait a moment and try again."},
            headers={"Retry-After": str(retry_after)},
        )

    # Retrieval + LLM both make blocking network calls. A sync `def` lets FastAPI run it in a
    # threadpool, so the event loop is never blocked.
    results = retrieve(req.message, top_k=settings.top_k)
    context = build_context(results)
    sources = sorted({meta.get("source", "") for _t, meta, _s in results})
    history = req.history[-settings.max_history_turns :]
    log_question(ip, req.message, sources)

    def generate() -> Iterator[str]:
        yield _sse({"sources": sources})
        try:
            for token in stream_answer(req.message, context, history):
                yield _sse({"token": token})
        except Exception as exc:  # surface a clean error to the UI instead of a dead stream
            yield _sse({"error": str(exc)})
        yield _sse({"done": True})

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
