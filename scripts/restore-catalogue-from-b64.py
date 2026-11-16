#!/usr/bin/env python3
"""Decode scripts/catalogue-payload/*.b64 into public/catalogue/."""
from __future__ import annotations

import base64
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "scripts" / "catalogue-payload"
DEST = ROOT / "public" / "catalogue"


def main() -> None:
    files = sorted(SRC.glob("*.b64"))
    if not files:
        raise SystemExit(f"No .b64 files in {SRC}")
    for f in files:
        # heritage-depth__hd-01-mist-stone-clean.jpg.b64
        rel = f.name[: -len(".b64")].replace("__", "/")
        out = DEST / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(base64.b64decode(f.read_text()))
        print(f"wrote {out} ({out.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
