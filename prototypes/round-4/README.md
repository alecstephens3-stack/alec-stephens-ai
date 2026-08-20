# Round 4: working widgets, less text

Ten prototypes built on the canonical Lens v3 kit, each carrying a widget the
visitor operates for every product.

- `NN-*.frag.html` — content fragments, `.sai-*` markup plus one script block. No
  CSS. This is the editable source.
- `build.py` — splices in the kit, fonts, scene and logo and emits artifact-ready
  page content (no document tags). `shot.js` renders and measures.

```bash
cd prototypes/round-4
python3 build.py 21-search-first.frag.html /tmp/p.html && open /tmp/p.html
```

Governed by `../BRIEF-ROUND-4.md` and `../BRIEF-RECALL-REEXAM.md`.

Changing a design token means editing `brand-assets/stephens-ai-lens-v3/kit/lens-kit.css`
once and re-running `build.py` across all ten. Never hand-write the CSS.

## The gallery

`viewer.py` + `viewer.tpl.html` assemble all ten into one browsable page:
a grid of rendered thumbnails, and a single view showing each page full length
with an opt-in live frame.

```bash
cd prototypes/round-4
node thumbs.js && node full.js   # captures, needs the .page.html files built first
python3 viewer.py                # emits round-4-gallery.html
```

Why captures rather than ten live frames: `backdrop-filter`, which every Lens pane
uses, composites unreliably inside an embedded document. When it fails it does not
degrade, it takes the whole document down to a blank sheet of sky. Proven by
isolation: identical frame, backdrop-filter disabled, renders. Captures always draw,
so the gallery is built on them, with live available per prototype and the standalone
artifact one click away.
