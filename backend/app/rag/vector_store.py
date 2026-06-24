"""Vector store adapter.

A thin interface over the vector DB so the rest of the app never imports Chroma directly.
To move to Qdrant/Pinecone in production, add a class with the same 4 methods and switch on
`settings.vector_db` in `get_vector_store()`.
"""
from __future__ import annotations

from functools import lru_cache
from typing import Protocol

import chromadb

from app.config import settings


class VectorStore(Protocol):
    def add(self, ids, embeddings, documents, metadatas) -> None: ...
    def query(self, embedding, top_k) -> list[tuple[str, dict, float]]: ...
    def reset(self) -> None: ...
    def count(self) -> int: ...


class ChromaStore:
    def __init__(self) -> None:
        self._client = chromadb.PersistentClient(path=settings.chroma_path)
        self._collection = self._client.get_or_create_collection(
            name=settings.collection_name, metadata={"hnsw:space": "cosine"}
        )

    def add(self, ids, embeddings, documents, metadatas) -> None:
        self._collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)

    def query(self, embedding, top_k) -> list[tuple[str, dict, float]]:
        res = self._collection.query(query_embeddings=[embedding], n_results=top_k)
        docs = res["documents"][0]
        metas = res["metadatas"][0]
        dists = res["distances"][0]
        # cosine distance -> similarity score in [0, 1]
        return [(d, m, 1.0 - float(dist)) for d, m, dist in zip(docs, metas, dists)]

    def reset(self) -> None:
        try:
            self._client.delete_collection(settings.collection_name)
        except Exception:
            pass
        self._collection = self._client.get_or_create_collection(
            name=settings.collection_name, metadata={"hnsw:space": "cosine"}
        )

    def count(self) -> int:
        return self._collection.count()


@lru_cache(maxsize=1)
def get_vector_store() -> VectorStore:
    if settings.vector_db == "chroma":
        return ChromaStore()
    raise ValueError(
        f"Unsupported VECTOR_DB={settings.vector_db!r}. "
        "Add an adapter class (Qdrant/Pinecone) with the same interface."
    )
