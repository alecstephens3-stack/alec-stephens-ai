#!/usr/bin/env python3
"""Assemble a Lens-v3 .dc.html artboard from a content fragment.

The kit forbids hand-writing its CSS, so the fragment carries only content in
.sai-* markup and this splices in the real stylesheet, fonts, scene and logo.
"""
import pathlib, sys, re

HERE = pathlib.Path(__file__).resolve().parent
P = lambda n: (HERE / f"_{n}.part").read_text().strip()

TPL = """<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{fonts}
{kit}
<style>
/* The kit payload above is already a complete <style> element, so this is a
   second one, never a wrapper. The scene is position:fixed in the kit, which
   pins it to the iframe viewport rather than the artboard, so re-anchor it. */
.sai-scene {{ position: absolute; }}
html, body {{ background: #F5E9DE; }}
a {{ color: #8F3616; }} a:hover {{ color: #B04A26; }}
</style>
</helmet>
{scene}
{content}
</x-dc>
<script data-dc-script data-props='{{}}'>
class Component extends DCLogic {{
  renderVals() {{ return {{}}; }}
}}
</script>
</body>
</html>
"""

def main(argv):
    frag, out = pathlib.Path(argv[1]), pathlib.Path(argv[2])
    content = frag.read_text()
    content = content.replace("<!-- SAI:LOGO -->", P("LOGO"))
    html = TPL.format(fonts=P("FONTS"), kit=P("KIT"), scene=P("SCENE"), content=content)
    out.write_text(html)
    print(f"  built {out.name}  {len(html)//1024}KB")
    for bad, why in (("<!-- SAI:", "unexpanded marker"), ("{{", "stray brace")):
        if bad in content:
            print(f"    WARN {why}")
    return 0

if __name__ == "__main__":
    sys.exit(main(sys.argv))
