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
  still works as an alias. Ju Sheen's new address is not verified, so his stays.
- the QuickBooks connection address (stephensai.co/qb/callback): Intuit only
  knows that one, and Mary's File Invoices app uses stephensai.co.
- the LinkedIn company page link (linkedin.com/company/stephensai).
- the legal entity: until Kansas approves the name change (form mailed
  2026-11-05) the company is Stephens AI LLC, so the legal pages say
  "Syntegrity is the trade name of Stephens AI LLC". Once approved, run with
  --kansas-approved and every legal line becomes Syntegrity LLC.

Idempotent: running it twice changes nothing the second time.
"""
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
APPROVED = "--kansas-approved" in sys.argv
ENTITY = "Syntegrity LLC" if APPROVED else "Stephens AI LLC"

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
    r"\b(?!alec@)[\w.+-]+@stephensai\.co",  # email addresses, except Alec's (moved 2026-11-11)
    r"(?:https://)?stephensai\.co/qb/callback",  # Intuit redirect address
    r"send\.stephensai\.co",
    r"stephens-ai-design-system",
    r"/dev/stephens-ai/",
    # entity lines this script already wrote (keeps a second run a no-op)
    r"trade name of Stephens AI LLC",
    r"\(Stephens AI LLC\)",
    r"유한책임회사 Stephens AI LLC의",
    r"Stephens AI LLC・",
    r'"Syntegrity AI", "Stephens AI"',
]

S = r"Stephens\s+AI"
# Legal sentences, rewritten before the generic swap. ENT keeps the entity name.
LEGAL = [
    # "X LLC is a Kansas limited liability company that builds ..."
    (rf"{S}\s+LLC is a Kansas limited liability company",
     "Syntegrity LLC is a Kansas limited liability company" if APPROVED else
     f"Syntegrity is the trade name of {ENT}, a Kansas limited liability company"),
    # "... refer to Stephens AI LLC."
    (rf"refer to {S}\s+LLC\.", f"refer to {ENT}."),
    # contact blocks at the end of the legal pages
    (rf"<strong>{S}\s+LLC</strong>",
     f"<strong>{ENT}</strong>" if APPROVED else f"<strong>Syntegrity ({ENT})</strong>"),
    # the site footer sentence about the company
    (rf"{S}\s+LLC is a Kansas limited liability company based in Wichita, Kansas\.",
     "Syntegrity LLC is a Kansas limited liability company based in Wichita, Kansas." if APPROVED else
     f"Syntegrity is the trade name of {ENT}, a Kansas limited liability company based in Wichita, Kansas."),
    # Korean version of the same sentence
    (rf"{S}\s+LLC는 미국 캔자스주 위치토에 있는 캔자스주 유한책임회사입니다\.",
     "Syntegrity LLC는 미국 캔자스주 위치토에 있는 캔자스주 유한책임회사입니다." if APPROVED else
     f"Syntegrity는 미국 캔자스주 위치토에 있는 캔자스주 유한책임회사 {ENT}의 상호입니다."),
    # footer copyright line, built from SITE_NAME + " LLC"
    (r"getFullYear\(\)\} \{SITE_NAME\}(?! LLC)", "getFullYear()} {SITE_NAME} LLC") if APPROVED else
    (r"getFullYear\(\)\} \{SITE_NAME\} LLC", "getFullYear()} {SITE_NAME}"),
    # structured data for Google
    (rf'legalName: "{S}\s+LLC"', f'legalName: "{ENT}"'),
    (rf'alternateName: \["{S}\s+LLC", "stephensai\.co"\]',
     'alternateName: ["Syntegrity AI", "' + OLD + '", "syntegrityai.com"]'),
    # Japanese company block
    (rf"<b>{S}\s+LLC<span style=\"white-space:nowrap\">（スティーブンス・エーアイ）</span></b>米国カンザス州登記",
     "<b>Syntegrity<span style=\"white-space:nowrap\">（シンテグリティ）</span></b>"
     + ("米国カンザス州登記" if APPROVED else f"{ENT}・米国カンザス州登記")),
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
    print(f"{changed} files changed ({'Kansas approved' if APPROVED else 'trade-name wording'})")

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
