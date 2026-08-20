#!/usr/bin/env python3
"""Assemble the ten round-4 prototypes into one browsable artifact.

Grid uses real rendered thumbnails, which always display. Single view mounts the
live page in a frame so the widgets can be driven, with the standalone link always
one click away because heavy embedded documents composite unreliably.
"""
import pathlib, base64, json, re

HERE = pathlib.Path(__file__).resolve().parent
P = lambda n: (HERE / f"_{n}.part").read_text().strip()
b64 = lambda s: base64.b64encode(s.encode("utf-8")).decode("ascii")
b64f = lambda p: base64.b64encode(p.read_bytes()).decode("ascii")

META = [
    ("21-search-first",    "Search First",         "The search box is the hero.",              "4bc65fd8-e6d0-4a32-8cc9-e4418b4d679a"),
    ("22-three-consoles",  "Three Consoles",       "Three panels, one rhythm, no bullets.",    "3b00d229-f814-464b-b7f5-3620f38a4844"),
    ("23-the-sequence",    "The Sequence",         "ReExam leads. Step the run day by day.",   "93dbe47a-6a36-4fa9-8338-404b7ea81196"),
    ("24-before-after",    "The Switch",           "One toggle flips the whole page.",         "cbb3322f-22e4-4d55-9186-ae21513a3260"),
    ("25-the-desk",        "The Desk",             "One screen, three tabs.",                  "1f4e7dc7-c871-449c-8c1f-cee5cd235432"),
    ("26-scroll-reveal",   "Scroll Reveal",        "It explains itself as you scroll.",        "b193aa10-a78a-4e0d-b27d-a3f4759e29d6"),
    ("27-system-diagram",  "The Practice Diagram", "Click a part of the practice to use it.",  "50512260-ed7c-4691-aef7-4ca42f048c4b"),
    ("28-quiet-catalogue", "The Quiet Catalogue",  "Restraint. Price as a footnote.",          "65e8c64e-61c8-4734-88f7-7c6ca50f8291"),
    ("29-do-i-qualify",    "Do I Qualify",         "Check yourself against the real gate.",    "3c19fac2-5ac3-4f1c-aff0-31b57a43325a"),
    ("30-night-deck",      "The Night Deck",       "One night window, demo inside it.",        "609f4fcd-517c-4825-addf-3edf17478273"),
]

# The kit's entrance holds opacity 0 until it plays, and frames throttle animations.
PREVIEW_FIX = "<style>.sai-rise{animation:none!important}</style>"

shell = ('<!doctype html><html lang="en"><head><meta charset="utf-8">'
         '<meta name="viewport" content="width=device-width, initial-scale=1">'
         + P("FONTS") + P("KIT") + PREVIEW_FIX + "</head><body>" + P("SCENE"))

items = []
for stem, name, bet, uid in META:
    src = (HERE / f"{stem}.frag.html").read_text()
    src = re.sub(r'<!--\s*TITLE:.*?-->\s*', '', src, count=1)
    src = src.replace("<!-- SAI:LOGO -->", P("LOGO"))
    items.append({
        "n": stem.split("-")[0], "name": name, "bet": bet,
        "url": f"https://claude.ai/code/artifact/{uid}",
        "thumb": b64f(HERE / "thumbs" / f"{stem}.jpg"),
        "full": b64f(HERE / "full" / f"{stem}.jpg"),
        "body": b64(src),
    })

out = ((HERE / "viewer.tpl.html").read_text()
       .replace("__SHELL__", b64(shell))
       .replace("__ITEMS__", json.dumps(items, separators=(",", ":"))))
dest = HERE / "round-4-gallery.html"
dest.write_text(out)
print(f"  built {dest.name}  {len(out)//1024}KB  ({len(items)} prototypes)")
