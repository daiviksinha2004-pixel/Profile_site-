"""LLM client — streams context-grounded answers via OpenAI-compatible providers.

Works with any OpenAI-compatible chat endpoint (Groq, Gemini's OpenAI shim, OpenRouter, …).
`settings.chat_providers` is a fallback chain: each provider is tried in order, and the first
one that successfully starts streaming is used. If a provider fails *before* emitting any
token, we move on to the next; if it fails mid-stream, we stop (the user already saw text).
"""
from __future__ import annotations

from collections.abc import Iterator

from openai import OpenAI

from app.config import settings
from app.models.schemas import Message

PERSONA = """You are the AI assistant embedded on {name}'s personal portfolio website.
You answer questions from visitors — mostly recruiters and engineers — about {name}: his
experience, projects, skills, and background.

Rules:
- Answer ONLY using the provided context about {name}. The context is authoritative.
- If the context doesn't cover something, say you don't have that detail and suggest they ask
  about his projects, experience, or skills — never invent facts, employers, dates, or numbers.
- Speak about {name} in the third person ("Daivik built...", "He used..."), warm and professional.
- Be concise and specific. Prefer concrete details (tech, numbers, decisions) over fluff.
- When relevant, point to the specific project or role the answer comes from.
- If asked to contact or hire him, encourage them to use the contact links on the site.
"""


def _system_prompt(context: str) -> str:
    return (
        PERSONA.format(name=settings.owner_name)
        + f"\n\nContext about {settings.owner_name} (authoritative):\n\n{context}"
    )


def stream_answer(question: str, context: str, history: list[Message]) -> Iterator[str]:
    """Yield answer text chunks, falling back across configured providers."""
    providers = settings.chat_providers
    if not providers:
        raise RuntimeError(
            "No LLM providers configured. Set AI_PROVIDERS (or GROQ_API_KEY) in backend/.env."
        )

    messages = [{"role": "system", "content": _system_prompt(context)}]
    messages += [{"role": m.role, "content": m.content} for m in history]
    messages.append({"role": "user", "content": question})

    last_error: Exception | None = None

    for provider in providers:
        client = OpenAI(api_key=provider["api_key"], base_url=provider["base_url"])
        try:
            stream = client.chat.completions.create(
                model=provider["model"],
                messages=messages,
                max_tokens=settings.max_output_tokens,
                temperature=0.3,
                stream=True,
            )
        except Exception as exc:  # creation failed — try the next provider
            last_error = exc
            continue

        yielded = False
        try:
            for chunk in stream:
                if not chunk.choices:
                    continue
                token = chunk.choices[0].delta.content
                if token:
                    yielded = True
                    yield token
        except Exception as exc:  # mid-stream failure
            last_error = exc
            if yielded:
                return  # already answered partially — don't restart on another provider
            continue

        if yielded:
            return  # success

    raise RuntimeError(f"All LLM providers failed. Last error: {last_error}")
