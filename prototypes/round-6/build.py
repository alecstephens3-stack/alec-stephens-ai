#!/usr/bin/env python3
"""Build an artifact-ready page from a round 6 content fragment.

Round 5 differs from round 4 in one way that matters: the widgets Jusheen
picked are SHARED. Prototype 21's knowledge base and questions accordion are
the reference implementations, so they live in _parts/ and get spliced into
every page. Ten copies of the same widget would drift on the first edit.

Markers a fragment may use:
    SAI:LOGO      the canonical mark
    SAI6:KB       the knowledge base widget      (_parts/kb.html)
    SAI6:REEXAM   the 6 touch sequence           (_parts/reexam.html)
    SAI6:TIMEOFF  the time off request           (_parts/timeoff.html)
    SAI6:FAQ      the questions accordion        (_parts/faq.html)

The kit stylesheet, the shared widget CSS and the widget script are inserted
automatically. Artifact publishing wraps the file in its own doctype/head/body,
so this emits PAGE CONTENT ONLY.
"""
import pathlib, sys, re, importlib.util

HERE = pathlib.Path(__file__).resolve().parent
PARTS = HERE / "_parts"
KIT = HERE.parents[1] / "brand-assets" / "stephens-ai-lens-v3" / "inline_kit.py"

SHARED = {
    "KB": "kb.html",
    "REEXAM": "reexam.html",
    "TIMEOFF": "timeoff.html",
    "FAQ": "faq.html",
}


def _payloads():
    if not KIT.exists():
        raise SystemExit(f"missing the kit package: {KIT}")
    spec = importlib.util.spec_from_file_location("inline_kit", KIT)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod.build_payloads()


_P = None


def P(n):
    global _P
    if _P is None:
        _P = _payloads()
    return _P[n].strip()


def part(name):
    p = PARTS / name
    if not p.exists():
        raise SystemExit(f"missing shared part: {p}")
    # Strip the leading explanatory comment; it is for whoever edits the part,
    # not for the shipped page.
    return re.sub(r"^\s*<!--.*?-->\s*", "", p.read_text(), count=1, flags=re.DOTALL).strip()


HEAD = """<title>{title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
{fonts}
{kit}
<style>
/* Published as artifact page content: paint the ground explicitly so the
   viewer's dark mode cannot bleed through a system that is light by design. */
:root {{ color-scheme: light; }}
body {{ background: #F5E9DE; color: #171310; }}
{shared_css}
</style>
"""


def main(argv):
    if len(argv) < 3:
        print(__doc__.strip())
        return 2
    frag = pathlib.Path(argv[1])
    out = pathlib.Path(argv[2])
    out.parent.mkdir(parents=True, exist_ok=True)
    src = frag.read_text()

    m = re.search(r"<!--\s*TITLE:\s*(.+?)\s*-->", src)
    title = m.group(1) if m else frag.stem
    src = re.sub(r"<!--\s*TITLE:.*?-->\s*", "", src, count=1)

    used = []
    for name, filename in SHARED.items():
        marker = f"<!-- SAI6:{name} -->"
        if marker in src:
            src = src.replace(marker, part(filename))
            used.append(name)
    src = src.replace("<!-- SAI:LOGO -->", P("LOGO"))

    page = (
        HEAD.format(title=title, fonts=P("FONTS"), kit=P("KIT"),
                    shared_css=(PARTS / "widgets.css").read_text().strip())
        + P("SCENE") + "\n" + src
        + "\n<script>\n" + (PARTS / "widgets.js").read_text().strip() + "\n</script>\n"
    )
    out.write_text(page)

    warn = []
    for bad, why in ((r"<!DOCTYPE", "doctype"), (r"<html", "html tag"),
                     (r"<head[ >]", "head tag"), (r"<body", "body tag")):
        if re.search(bad, src, re.I):
            warn.append(why)
    if "<!-- SAI" in src:
        warn.append("unexpanded marker")
    for name in SHARED:
        if name not in used:
            warn.append(f"no SAI6:{name}")
    if "<script" in src:
        warn.append("fragment ships its own script; the shared one is added automatically")

    print(f"  built {out.name}  {len(page)//1024}KB  title={title!r}  shared={'+'.join(used) or 'none'}"
          + (f"  WARN {warn}" if warn else ""))
    return 1 if warn else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
