"""Request/response DTOs for the chat API."""
from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    # Prior turns so the bot has conversational memory (client-managed, stateless server).
    history: list[Message] = Field(default_factory=list)


class Source(BaseModel):
    source: str
    score: float


class HealthResponse(BaseModel):
    status: str
    indexed_chunks: int
    chat_model: str
    embedding_model: str
