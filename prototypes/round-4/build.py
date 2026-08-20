#!/usr/bin/env python3
"""Build an artifact-ready page from a Lens v3 content fragment.

Artifact publishing wraps the file in its own doctype/head/body, so this emits
PAGE CONTENT ONLY. The kit payload is already a complete <style> element, so it
is inserted as-is and never wrapped in another one (that bug shipped once: it
closed the stylesheet at the inner tag and dropped the whole system).
"""
import pathlib, sys, re, importlib.util

HERE = pathlib.Path(__file__).resolve().parent
KIT = HERE.parents[1] / "brand-assets" / "stephens-ai-lens-v3" / "inline_kit.py"


def _payloads():
    """Source the kit, fonts, scene and logo from inline_kit.py itself.

    These used to be read from uncommitted _NAME.part sidecar files, so a fresh
    clone could not build anything: build.py died on a missing _LOGO.part. The
    payloads have exactly one authoritative source, so read that one instead of
    keeping a generated copy next to the fragments.
    """
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

HEAD = """<title>{title}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
{fonts}
{kit}
<style>
/* Published as artifact page content: paint the ground explicitly so the
   viewer's dark mode cannot bleed through a system that is light by design. */
:root {{ color-scheme: light; }}
body {{ background: #F5E9DE; color: #171310; }}
</style>
"""

def main(argv):
    frag = pathlib.Path(argv[1])
    out = pathlib.Path(argv[2])
    src = frag.read_text()

    m = re.search(r'<!--\s*TITLE:\s*(.+?)\s*-->', src)
    title = m.group(1) if m else frag.stem
    src = re.sub(r'<!--\s*TITLE:.*?-->\s*', '', src, count=1)
    src = src.replace("<!-- SAI:LOGO -->", P("LOGO"))

    page = HEAD.format(title=title, fonts=P("FONTS"), kit=P("KIT")) + P("SCENE") + "\n" + src
    out.write_text(page)

    warn = []
    for bad, why in ((r'<!DOCTYPE', 'doctype'), (r'<html', 'html tag'),
                     (r'<head[ >]', 'head tag'), (r'<body', 'body tag')):
        if re.search(bad, src, re.I):
            warn.append(why)
    if '<!-- SAI:' in src:
        warn.append('unexpanded marker')
    print(f"  built {out.name}  {len(page)//1024}KB  title={title!r}" + (f"  WARN {warn}" if warn else ""))
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv))
