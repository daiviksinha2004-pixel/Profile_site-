"""CLI: build the vector index from data/knowledge/*.md.

Usage (from the backend/ directory, venv active):
    python scripts/ingest.py
"""
from __future__ import annotations

import pathlib
import sys

# Make `app` importable when running this script directly.
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[1]))

from app.rag.ingest import ingest  # noqa: E402

if __name__ == "__main__":
    ingest()
