#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import subprocess
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES_DIR = ROOT / "files"
OUT = ROOT / "files.json"

DOCUMENTS = {"pdf", "hwp", "hwpx", "doc", "docx", "ppt", "pptx", "txt", "md", "rtf"}
TABLES = {"xls", "xlsx", "xlsm", "csv", "tsv", "ods"}
IMAGES = {"png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "tif", "tiff", "heic"}
ARCHIVES = {"zip", "7z", "rar", "tar", "gz", "bz2", "xz"}
IGNORED_NAMES = {".gitkeep", ".DS_Store", "Thumbs.db"}


def category_for(ext: str) -> str:
    if ext in DOCUMENTS:
        return "문서"
    if ext in TABLES:
        return "표"
    if ext in IMAGES:
        return "이미지"
    if ext in ARCHIVES:
        return "압축"
    return "기타"


def git_modified(relative_path: str) -> str:
    try:
        value = subprocess.check_output(
            ["git", "log", "-1", "--format=%cI", "--", relative_path],
            cwd=ROOT,
            text=True,
            stderr=subprocess.DEVNULL,
        ).strip()
        if value:
            return value
    except Exception:
        pass
    return datetime.now(timezone.utc).isoformat()


def main() -> None:
    FILES_DIR.mkdir(exist_ok=True)
    items = []

    for path in sorted(FILES_DIR.rglob("*")):
        if not path.is_file() or path.name in IGNORED_NAMES or path.name.startswith("."):
            continue
        rel = path.relative_to(ROOT).as_posix()
        ext = path.suffix.lower().lstrip(".")
        items.append(
            {
                "name": path.name,
                "path": rel,
                "extension": ext,
                "category": category_for(ext),
                "size": path.stat().st_size,
                "modified": git_modified(rel),
            }
        )

    old_payload = {}
    if OUT.exists():
        try:
            old_payload = json.loads(OUT.read_text(encoding="utf-8"))
        except Exception:
            old_payload = {}

    generated_at = old_payload.get("generatedAt") if old_payload.get("files") == items else None
    payload = {
        "generatedAt": generated_at or datetime.now(timezone.utc).isoformat(),
        "files": items,
    }
    OUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Indexed {len(items)} file(s) -> {OUT.name}")


if __name__ == "__main__":
    main()
