"""Best-effort logging of chatbot questions — so you can see what recruiters ask most.

Appends one JSON line per question to data/analytics/chat_log.jsonl. Never raises into the
request path. The visitor IP is hashed (not stored raw) for light privacy.
"""
from __future__ import annotations

import hashlib
import json
import threading
from datetime import datetime, timezone
from pathlib import Path

_lock = threading.Lock()
_LOG_PATH = Path("./data/analytics/chat_log.jsonl")


def log_question(ip: str, message: str, sources: list[str]) -> None:
    try:
        _LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
        row = {
            "ts": datetime.now(timezone.utc).isoformat(),
            "ip_hash": hashlib.sha256(ip.encode()).hexdigest()[:12],
            "q": message[:500],
            "sources": sources,
        }
        with _lock:
            with _LOG_PATH.open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(row, ensure_ascii=False) + "\n")
    except Exception:
        pass  # analytics must never break the chat
