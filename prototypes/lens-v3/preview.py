#!/usr/bin/env python3
"""Build a plain standalone HTML from a fragment, purely so it can be rendered
and screenshotted. The canvas artboards are built by assemble.py; this is the QA path."""
import pathlib, sys
HERE = pathlib.Path(__file__).resolve().parent
P = lambda n: (HERE / f"_{n}.part").read_text().strip()
TPL = """<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>preview</title>
{fonts}
{kit}
<style>
.sai-scene {{ position: absolute; }}
</style></head><body>
{scene}
{content}
</body></html>"""
frag, out = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
c = frag.read_text().replace("<!-- SAI:LOGO -->", P("LOGO"))
out.write_text(TPL.format(fonts=P("FONTS"), kit=P("KIT"), scene=P("SCENE"), content=c))
print(f"  preview {out.name} {len(out.read_text())//1024}KB")
