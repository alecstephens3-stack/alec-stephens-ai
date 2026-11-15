#!/usr/bin/env python3
"""
Turns the stephensai.co site into the Syntegrity site (syntegrityai.com).

Lives on the `syntegrity` branch. To bring a later stephensai.co change across:
merge main into this branch, run this script, rebuild, run the leftover check
at the bottom (it prints every brand mention still in the code).

What it changes: the name (Stephens AI -> Syntegrity), the web address
(stephensai.co -> syntegrityai.com), the logo word, the Japanese company line.

What it leaves alone on purpose:
- email addresses other than Alec's (@stephensai.co). alec@ moved to
  alec@syntegrityai.com on 2026-11-11 (mail verified arriving); the old address
  still works as an alias. Ju Sheen's moved the same day (Alec confirmed it works).
- the QuickBooks connection address (stephensai.co/qb/callback): Intuit only
  knows that one, and Mary's File Invoices app uses stephensai.co.
- the LinkedIn company page link (linkedin.com/company/stephensai).
- the former legal name: Kansas approved the name change on 2026-11-12, so
  both sites now name the company Syntegrity LLC, and the legal lines on main
  already say it with "(formerly Stephens AI LLC)" beside it. Every
  "formerly Stephens AI" phrase (and its Korean and Japanese forms) is kept
  as written. --kansas-approved is still accepted and does nothing.

Idempotent: running it twice changes nothing the second time.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
ENTITY = "Syntegrity LLC"  # Kansas approved the rename 2026-11-12

TEXT_EXT = {".ts", ".tsx", ".js", ".mjs", ".css", ".html", ".txt", ".svg", ".md", ".json"}
SCAN = ["src", "public", "next.config.ts"]
# Files where only the display name changes, never the web address (their
# comments are about the stephensai.co email-sending domain).
NAME_ONLY = {"src/app/api/contact/route.ts"}
# Files where Alec's old address stays: the contact route's notes and the
# QuickBooks callback page Mary's File Invoices app opens.
KEEP_ALEC_EMAIL = {"src/app/api/contact/route.ts", "src/app/qb/callback/connection-code.tsx"}

ENT = "\x00ENTITY\x00"
OLD = "\x00OLDNAME\x00"  # the old name, kept where it must stay
PROTECT = [
    r"\b(?!alec@|jusheen@)[\w.+-]+@stephensai\.co",  # email addresses, except the two founders' (moved 2026-11-11)
    r"(?:https://)?stephensai\.co/qb/callback",  # Intuit redirect address
    r"send\.stephensai\.co",
    r"stephens-ai-design-system",
    r"/dev/stephens-ai/",
    # the former legal name, kept on purpose (Kansas approved 2026-11-12)
    r"formerly Stephens AI(?: LLC)?",
    r"구 Stephens AI LLC",
    r"旧社名 Stephens AI LLC",
    r'"Syntegrity AI", "Stephens AI"',  # structured data this script already wrote
]

S = r"Stephens\s+AI"
# Legal lines: main names Syntegrity LLC itself (since 2026-11-15), so the only
# rewrite left is the structured-data alias list.
LEGAL = [
    (rf'alternateName: \["{S}\s+LLC", "stephensai\.co"\]',
     'alternateName: ["Syntegrity AI", "' + OLD + '", "syntegrityai.com"]'),
]

GENERIC = [
    (rf"{S}\s+LLC", "Syntegrity"),
    (S, "Syntegrity"),
    (r"STEPHENS AI", "SYNTEGRITY"),
    (r"STEPHENSAI\.CO", "SYNTEGRITYAI.COM"),
    (r"stephensai\\\\\.co", r"syntegrityai\\\\.com"),  # escaped, inside regex source
    (r"stephensai\\\.co", r"syntegrityai\\.com"),
    (r"stephensai\.co", "syntegrityai.com"),
    (r"スティーブンス・エーアイ", "シンテグリティ"),
]
DOMAIN_RULES = {r"STEPHENSAI\.CO", r"stephensai\\\\\.co", r"stephensai\\\.co", r"stephensai\.co"}


def convert(text: str, rel: str) -> str:
    saved: list[str] = []

    def keep(m: re.Match) -> str:
        saved.append(m.group(0))
        return f"\x00K{len(saved) - 1}\x00"

    if rel in KEEP_ALEC_EMAIL:
        text = re.sub(r"alec@stephensai\.co", keep, text)
    for pat in PROTECT:
        text = re.sub(pat, keep, text)
    for pat, rep in LEGAL:
        text = re.sub(pat, rep, text)
    for pat, rep in GENERIC:
        if rel in NAME_ONLY and pat in DOMAIN_RULES:
            continue
        text = re.sub(pat, rep, text)
    text = text.replace(ENT, ENTITY).replace(OLD, "Stephens AI")
    return re.sub(r"\x00K(\d+)\x00", lambda m: saved[int(m.group(1))], text)


def files():
    for entry in SCAN:
        p = ROOT / entry
        if p.is_file():
            yield p
        else:
            for f in p.rglob("*"):
                if f.is_file() and f.suffix in TEXT_EXT:
                    yield f


def main() -> None:
    changed = 0
    for f in files():
        rel = f.relative_to(ROOT).as_posix()
        old = f.read_text(encoding="utf-8")
        new = convert(old, rel)
        if new != old:
            f.write_text(new, encoding="utf-8")
            changed += 1
    print(f"{changed} files changed")

    # Leftover check: every remaining mention, for a person to read.
    out = subprocess.run(
        ["grep", "-rIn", "-i", "-E", r"stephens ?ai|stephensai\.co|スティーブンス・エーアイ", *SCAN],
        cwd=ROOT, capture_output=True, text=True,
    ).stdout.splitlines()
    print(f"{len(out)} mentions left (emails, QuickBooks address, legal entity, comments):")
    for line in out:
        print("  " + line[:180])


if __name__ == "__main__":
    main()
