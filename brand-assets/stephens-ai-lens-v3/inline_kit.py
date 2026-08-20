#!/usr/bin/env python3
"""
inline_kit.py — inline the Stephens AI "Lens" design kit into a branded HTML file.

Write the markers instead of hand-writing the system, then run this:

    <!-- SAI:FONTS -->        the Google Fonts links (Inter Tight + Schibsted Grotesk)
    <!-- SAI:KIT -->          the whole kit stylesheet, wrapped in <style>
    <!-- SAI:SCENE -->        the scene: sky, 3 tint pools, 5 drifting lenses
    <!-- SAI:LOGO -->         the canonical mark, dark stroke (light backgrounds)
    <!-- SAI:LOGO-NIGHT -->   the canonical mark, cream stroke (dark backgrounds)

    $ python3 scripts/inline_kit.py artifacts/my-thing.html

Idempotent. Each expansion is fenced with a closing sentinel, so re-running
after the kit changes replaces the old block instead of stacking a new one.
That means: edit lens-kit.css once, re-run this across artifacts, done.

Why this exists: every artifact used to hand-rewrite ~150 lines of dense
gradient CSS. That is ~3,200 output tokens per file, and an approximated lens
gradient reads as a grey smudge. This makes it one line and exact.
"""

import re
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Two supported layouts, checked in order:
#   1. this kit package  — inline_kit.py sits next to kit/ and the logo snippet
#   2. the Stephens AI vault — scripts/inline_kit.py, kit under brand-assets/
_CANDIDATES = (HERE, HERE.parent / "brand-assets" / "stephens-ai-design-system")
DS = next((c for c in _CANDIDATES if (c / "kit" / "lens-kit.css").exists()), _CANDIDATES[0])
KIT_CSS = DS / "kit" / "lens-kit.css"
LOGO_SNIPPET = DS / "logo-inline-snippet.html"

FONTS = """<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,400..600;1,400..600&family=Schibsted+Grotesk:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">"""

SCENE = """<div class="sai-scene">
  <div class="sai-tint t1"></div>
  <div class="sai-tint t2"></div>
  <div class="sai-tint t3"></div>
  <div class="sai-lens near l1"></div>
  <div class="sai-lens mid  l2"></div>
  <div class="sai-lens far  l3"></div>
  <div class="sai-lens mid  l4"></div>
  <div class="sai-lens far  l5"></div>
</div>"""


def read_logos() -> tuple[str, str]:
    """Pull both canonical marks verbatim from logo-inline-snippet.html.

    Never reconstruct the mark. A PostToolUse guard (check_brand_logo.py)
    blocks inline marks that are not these exact paths.
    """
    if not LOGO_SNIPPET.exists():
        raise SystemExit(f"missing canonical logo source: {LOGO_SNIPPET}")
    svgs = re.findall(r"<svg\b.*?</svg>", LOGO_SNIPPET.read_text(), re.DOTALL)
    if len(svgs) < 2:
        raise SystemExit(
            f"expected 2 canonical marks (light, night) in {LOGO_SNIPPET}, found {len(svgs)}"
        )
    return svgs[0], svgs[1]


def build_payloads() -> dict[str, str]:
    if not KIT_CSS.exists():
        raise SystemExit(f"missing kit stylesheet: {KIT_CSS}")
    logo_light, logo_night = read_logos()
    payloads = {
        "FONTS": FONTS,
        "KIT": "<style>\n" + KIT_CSS.read_text().rstrip() + "\n</style>",
        "SCENE": SCENE,
        "LOGO": logo_light,
        "LOGO-NIGHT": logo_night,
    }
    # A sentinel inside a payload nests a fence inside its own fence, and the
    # next run stacks a second copy instead of replacing the first. Caught the
    # hard way: the kit's header comment quoted its own marker.
    for name, body in payloads.items():
        for other in payloads:
            for sentinel in (f"<!-- SAI:{other} -->", f"<!-- /SAI:{other} -->"):
                if sentinel in body:
                    raise SystemExit(
                        f"payload {name} contains the sentinel {sentinel!r}. "
                        "Remove it — sentinels must never appear inside inlined content."
                    )
    return payloads


def expand(html: str, payloads: dict[str, str]) -> tuple[str, list[str]]:
    """Replace each marker (bare or already-expanded) with a fenced payload."""
    used = []
    # Longest names first so SAI:LOGO-NIGHT is handled before SAI:LOGO.
    for name in sorted(payloads, key=len, reverse=True):
        open_tag = f"<!-- SAI:{name} -->"
        close_tag = f"<!-- /SAI:{name} -->"
        pattern = re.compile(
            re.escape(open_tag) + r"(?:.*?" + re.escape(close_tag) + r")?",
            re.DOTALL,
        )
        if not pattern.search(html):
            continue
        replacement = f"{open_tag}\n{payloads[name]}\n{close_tag}"
        html, count = pattern.subn(lambda _m: replacement, html)
        used.append(f"{name}×{count}")
    return html, used


def main(argv: list[str]) -> int:
    targets = [Path(a) for a in argv[1:]]
    if not targets:
        print(__doc__.strip())
        return 2

    payloads = build_payloads()
    kit_lines = payloads["KIT"].count("\n")
    failed = False

    for path in targets:
        if not path.exists():
            print(f"  MISSING  {path}")
            failed = True
            continue
        original = path.read_text()
        updated, used = expand(original, payloads)
        if not used:
            print(f"  NO MARKERS  {path}  (add <!-- SAI:KIT --> to the head)")
            failed = True
            continue
        if updated == original:
            print(f"  unchanged  {path}  [{', '.join(used)}]")
            continue
        path.write_text(updated)
        print(f"  inlined    {path}  [{', '.join(used)}]  +{kit_lines} kit lines")

    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
