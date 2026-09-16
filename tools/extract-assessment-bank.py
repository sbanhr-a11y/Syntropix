#!/usr/bin/env python3
"""Extract the legacy assessmentBank source without executing application code.

This is intentionally a source-level tool: it locates the assessmentBank object
with a quote/comment-aware brace scanner and writes a byte-for-byte snapshot.
No production HTML is modified. The snapshot gives the refactor a deterministic
artifact that can be hashed and compared before individual instruments move.
"""
from __future__ import annotations
import argparse
import hashlib
from pathlib import Path

MARKERS = ("const assessmentBank =", "let assessmentBank =", "var assessmentBank =")

def find_object_start(text: str) -> int:
    positions = [(text.find(m), m) for m in MARKERS if text.find(m) >= 0]
    if not positions:
        raise ValueError("assessmentBank declaration not found")
    pos, marker = min(positions)
    brace = text.find("{", pos + len(marker))
    if brace < 0:
        raise ValueError("assessmentBank opening brace not found")
    return brace

def scan_object(text: str, start: int) -> str:
    depth = 0
    quote = None
    escaped = False
    line_comment = False
    block_comment = False
    i = start
    while i < len(text):
        ch = text[i]
        nxt = text[i + 1] if i + 1 < len(text) else ""
        if line_comment:
            if ch == "\n": line_comment = False
        elif block_comment:
            if ch == "*" and nxt == "/": block_comment = False; i += 1
        elif quote:
            if escaped: escaped = False
            elif ch == "\\": escaped = True
            elif ch == quote: quote = None
        else:
            if ch == "/" and nxt == "/": line_comment = True; i += 1
            elif ch == "/" and nxt == "*": block_comment = True; i += 1
            elif ch in ("'", '"', '`'): quote = ch
            elif ch == "{": depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0: return text[start:i + 1]
                if depth < 0: raise ValueError("assessmentBank brace underflow")
        i += 1
    raise ValueError("assessmentBank closing brace not found")

def main() -> None:
    p = argparse.ArgumentParser()
    p.add_argument("--source", default="index.html")
    p.add_argument("--output", default="build/assessment-bank.snapshot.js")
    args = p.parse_args()
    source = Path(args.source)
    text = source.read_text(encoding="utf-8")
    obj = scan_object(text, find_object_start(text))
    digest = hashlib.sha256(obj.encode("utf-8")).hexdigest()
    out = Path(args.output); out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("/* generated from legacy assessmentBank; do not hand-edit */\n" +
                   f"/* sha256:{digest} */\nwindow.__SYNTROPIX_LEGACY_ASSESSMENT_BANK__ = " + obj + ";\n",
                   encoding="utf-8")
    print(f"assessmentBank snapshot: {len(obj)} bytes sha256={digest}")

if __name__ == "__main__":
    main()
