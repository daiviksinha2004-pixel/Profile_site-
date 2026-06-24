"""Markdown-aware chunking.

We split each knowledge file on its `##` headings, then pack paragraphs into chunks of
~`max_chars` with a small overlap so a retrieved chunk keeps enough surrounding context.
Each chunk remembers its source file and nearest heading for citations.
"""
from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class Chunk:
    text: str
    source: str        # file name, e.g. "02-project-ats-crp.md"
    heading: str       # nearest "##"/"#" heading


_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*)$")


def _split_sections(text: str) -> list[tuple[str, str]]:
    """Return [(heading, body)] splitting on markdown headings."""
    sections: list[tuple[str, str]] = []
    current_heading = "Overview"
    buf: list[str] = []
    for line in text.splitlines():
        m = _HEADING_RE.match(line.strip())
        if m:
            if buf:
                sections.append((current_heading, "\n".join(buf).strip()))
                buf = []
            current_heading = m.group(2).strip()
        else:
            buf.append(line)
    if buf:
        sections.append((current_heading, "\n".join(buf).strip()))
    return [(h, b) for h, b in sections if b]


def chunk_text(text: str, source: str, max_chars: int = 1100, overlap: int = 150) -> list[Chunk]:
    chunks: list[Chunk] = []
    for heading, body in _split_sections(text):
        paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
        buf = ""
        for para in paragraphs:
            if len(buf) + len(para) + 2 <= max_chars:
                buf = f"{buf}\n\n{para}".strip()
            else:
                if buf:
                    chunks.append(Chunk(_with_heading(heading, buf), source, heading))
                # carry a tail of the previous chunk as overlap
                tail = buf[-overlap:] if buf else ""
                buf = f"{tail}\n\n{para}".strip() if tail else para
        if buf:
            chunks.append(Chunk(_with_heading(heading, buf), source, heading))
    return chunks


def _with_heading(heading: str, body: str) -> str:
    # Prefix the heading so the embedding (and Claude) know the topic of the chunk.
    return f"[{heading}]\n{body}"
