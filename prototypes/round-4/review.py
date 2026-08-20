#!/usr/bin/env python3
"""Build the review panel page from the two reviewers' results."""
import pathlib, base64, json, sys

HERE = pathlib.Path(__file__).resolve().parent
b64f = lambda p: base64.b64encode(p.read_bytes()).decode("ascii")

META = [
    ("21","search-first","Search First","The search box is the hero.","4bc65fd8-e6d0-4a32-8cc9-e4418b4d679a"),
    ("22","three-consoles","Three Consoles","Three panels, one rhythm, no bullets.","3b00d229-f814-464b-b7f5-3620f38a4844"),
    ("23","the-sequence","The Sequence","ReExam leads. Step the run day by day.","93dbe47a-6a36-4fa9-8338-404b7ea81196"),
    ("24","before-after","The Switch","One toggle flips the whole page.","cbb3322f-22e4-4d55-9186-ae21513a3260"),
    ("25","the-desk","The Desk","One screen, three tabs.","1f4e7dc7-c871-449c-8c1f-cee5cd235432"),
    ("26","scroll-reveal","Scroll Reveal","It explains itself as you scroll.","b193aa10-a78a-4e0d-b27d-a3f4759e29d6"),
    ("27","system-diagram","The Practice Diagram","Click a part of the practice to use it.","50512260-ed7c-4691-aef7-4ca42f048c4b"),
    ("28","quiet-catalogue","The Quiet Catalogue","Restraint. Price as a footnote.","65e8c64e-61c8-4734-88f7-7c6ca50f8291"),
    ("29","do-i-qualify","Do I Qualify","Check yourself against the real gate.","3c19fac2-5ac3-4f1c-aff0-31b57a43325a"),
    ("30","night-deck","The Night Deck","One night window, demo inside it.","609f4fcd-517c-4825-addf-3edf17478273"),
]

rev = json.loads(pathlib.Path(sys.argv[1]).read_text())   # {"owner": {n: {...}}, "designer": {n: {...}}}
missing = []
data = []
for n, slug, name, bet, uid in META:
    o, d = rev["owner"].get(n), rev["designer"].get(n)
    if not o or not d:
        missing.append(n); continue
    data.append({
        "n": n, "name": name, "bet": bet,
        "url": f"https://claude.ai/code/artifact/{uid}",
        "thumb": b64f(HERE / "thumbs" / f"{n}-{slug}.jpg"),
        "owner": o["bullets"], "action": o["action"],
        "designer": d["bullets"], "verdict": d["verdict"],
    })

if missing:
    print(f"  WARNING missing reviews for: {', '.join(missing)}")

THEMES = json.loads(pathlib.Path(sys.argv[2]).read_text())
out = ((HERE / "review.tpl.html").read_text()
       .replace("__DATA__", json.dumps(data, separators=(",", ":")))
       .replace("__THEMES__", json.dumps(THEMES, separators=(",", ":"))))
dest = HERE / "review-panel.html"
dest.write_text(out)
print(f"  built {dest.name}  {len(out)//1024}KB  ({len(data)} entries)")
