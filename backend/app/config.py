"""Environment-driven settings (12-factor). Loaded once and imported as `settings`."""
from __future__ import annotations

import json

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # --- Chat LLM (OpenAI-compatible providers) ---
    # AI_PROVIDERS is a JSON array of {name, base_url, api_key, model} tried in order (fallback chain).
    ai_providers: str = ""
    # Used to synthesise a single provider if AI_PROVIDERS is empty.
    groq_api_key: str = ""
    chat_model: str = "llama-3.1-8b-instant"  # display only; real model comes from a provider entry
    max_output_tokens: int = 1024

    # --- Embeddings (OpenAI-compatible; Gemini by default) ---
    ai_api_key: str = ""  # AI_API_KEY — key for the embedding provider
    ai_base_url: str = "https://generativelanguage.googleapis.com/v1beta/openai/"  # AI_BASE_URL
    embedding_model: str = "gemini-embedding-001"

    # --- Vector store ---
    vector_db: str = "chroma"          # chroma | qdrant | pinecone
    chroma_path: str = "./.chroma"
    collection_name: str = "portfolio"

    # --- RAG ---
    knowledge_dir: str = "./data/knowledge"
    top_k: int = 6
    max_history_turns: int = 8  # trim conversation sent to the LLM (bounds prompt size/cost)

    # --- Rate limiting / abuse guard (public chat endpoint) ---
    chat_rate_per_min: int = 12       # per-IP requests within the window
    chat_rate_window_seconds: int = 60
    chat_rate_per_day: int = 100      # per-IP daily cap
    chat_global_per_day: int = 800    # global daily ceiling (cost protection)

    # --- Identity ---
    owner_name: str = "Daivik Sinha"

    # --- CORS ---
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        # Strip whitespace and any trailing slash — browsers send the Origin header
        # without one, so "https://site.app/" would otherwise never match.
        return [o.strip().rstrip("/") for o in self.cors_origins.split(",") if o.strip()]

    @property
    def chat_providers(self) -> list[dict]:
        """Parsed fallback chain of chat providers. Falls back to a single Groq provider."""
        raw = self.ai_providers.strip()
        if raw:
            try:
                parsed = json.loads(raw)
                providers = [p for p in parsed if p.get("api_key") and p.get("base_url") and p.get("model")]
                if providers:
                    return providers
            except (json.JSONDecodeError, AttributeError, TypeError):
                pass
        if self.groq_api_key:
            return [{
                "name": "groq",
                "base_url": "https://api.groq.com/openai/v1",
                "api_key": self.groq_api_key,
                "model": self.chat_model,
            }]
        return []


settings = Settings()
