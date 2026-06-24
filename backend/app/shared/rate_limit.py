"""In-process rate limiting + abuse guard for the public chat endpoint.

Single-process, in-memory (resets on restart) — appropriate for a small portfolio bot.
Three layers:
  - per-IP sliding window (burst control)
  - per-IP daily cap (one visitor can't drain the LLM budget)
  - global daily cap (hard ceiling on total spend)
"""
from __future__ import annotations

import threading
import time
from collections import defaultdict, deque
from datetime import date

from app.config import settings

_lock = threading.Lock()
_hits: dict[str, deque[float]] = defaultdict(deque)
_daily: dict[str, tuple[str, int]] = {}  # ip -> (yyyy-mm-dd, count)
_global: dict[str, int] = {"day": "", "count": 0}


def _today() -> str:
    return date.today().isoformat()


def check(ip: str) -> tuple[bool, int]:
    """Return (allowed, retry_after_seconds). retry_after is 0 when allowed."""
    now = time.monotonic()
    window = float(settings.chat_rate_window_seconds)
    today = _today()

    with _lock:
        # Global daily ceiling
        if _global["day"] != today:
            _global["day"] = today
            _global["count"] = 0
        if _global["count"] >= settings.chat_global_per_day:
            return False, 3600

        # Per-IP daily cap
        day, count = _daily.get(ip, ("", 0))
        if day != today:
            day, count = today, 0
        if count >= settings.chat_rate_per_day:
            return False, 3600

        # Per-IP sliding window
        bucket = _hits[ip]
        cutoff = now - window
        while bucket and bucket[0] < cutoff:
            bucket.popleft()
        if len(bucket) >= settings.chat_rate_per_min:
            retry = int(window - (now - bucket[0])) + 1
            return False, max(retry, 1)

        # Allowed — record the hit
        bucket.append(now)
        _daily[ip] = (today, count + 1)
        _global["count"] += 1
        return True, 0
