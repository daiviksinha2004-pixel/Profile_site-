"""Build the vector index from the knowledge markdown files.

Run via `python scripts/ingest.py`. Idempotent: it resets the collection each run, so you can
re-run after editing any file in data/knowledge/.
"""
from __future__ import annotations

import glob
import os

from app.config import settings
from app.rag.chunking import chunk_text
from app.rag.embeddings import embed_documents
from app.rag.vector_store import get_vector_store


def ingest() -> int:
    files = sorted(glob.glob(os.path.join(settings.knowledge_dir, "*.md")))
    if not files:
        raise SystemExit(f"No markdown files found in {settings.knowledge_dir!r}")

    all_chunks = []
    for path in files:
        with open(path, "r", encoding="utf-8") as fh:
            text = fh.read()
        source = os.path.basename(path)
        all_chunks.extend(chunk_text(text, source=source))

    print(f"Embedding {len(all_chunks)} chunks from {len(files)} files "
          f"with {settings.embedding_model} ...")
    embeddings = embed_documents([c.text for c in all_chunks])

    store = get_vector_store()
    store.reset()
    store.add(
        ids=[f"chunk-{i}" for i in range(len(all_chunks))],
        embeddings=embeddings,
        documents=[c.text for c in all_chunks],
        metadatas=[{"source": c.source, "heading": c.heading} for c in all_chunks],
    )
    print(f"Done. Indexed {store.count()} chunks into '{settings.collection_name}'.")
    return store.count()


if __name__ == "__main__":
    ingest()
