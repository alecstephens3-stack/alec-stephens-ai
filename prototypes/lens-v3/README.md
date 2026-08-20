# Lens v3 rebuild

Seven site directions rebuilt on the canonical kit in `brand-assets/stephens-ai-lens-v3`,
after an audit found the earlier seventeen scored zero on `.sai-*` classes, zero on the
six explainer widgets, zero on the canonical logo, and zero on the real glass recipe.

- `NN-*.frag.html` — content fragments. `.sai-*` markup only, no CSS. This is the
  editable source.
- `assemble.py` — splices the kit, fonts, scene and logo into a fragment to produce a
  design-canvas artboard. `preview.py` does the same as a plain page, for screenshots.
- `canvas.json` — artboard layout for the design canvas.

The fragments carry no stylesheet on purpose. The kit forbids hand-writing its CSS, so
changing a token means editing `brand-assets/stephens-ai-lens-v3/kit/lens-kit.css` once
and re-running the scripts.

```bash
cd prototypes/lens-v3
python3 preview.py 11-catalogue.frag.html /tmp/p.html && open /tmp/p.html
```

Recall content is governed by `../BRIEF-RECALL-REEXAM.md`, not by the recall section of
`../BRIEF.md`, which is superseded.
