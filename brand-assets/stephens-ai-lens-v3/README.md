# Stephens AI — "Lens" design system (v3)

The brand system for anything we ship: client deliverables, audits, proposals,
internal docs, prototypes. One CSS file, one class vocabulary (`.sai-*`), no
build step. Every artifact is a single self-contained `.html`.

Locked 2026-07-20. Widgets added 2026-07-25.

## Quickstart (60 seconds)

```bash
cp kit/starter.html my-thing.html
# write your content, then:
python3 inline_kit.py my-thing.html
open my-thing.html
```

`starter.html` has five marker comments in it. `inline_kit.py` swaps each one
for the real thing:

| Marker | What it becomes |
|---|---|
| `SAI:FONTS` | the Google Fonts links (Inter Tight + Schibsted Grotesk) |
| `SAI:KIT` | the whole stylesheet, inlined in a `<style>` tag |
| `SAI:SCENE` | the background: warm sky, 3 tint pools, 5 drifting lenses |
| `SAI:LOGO` | the canonical logo mark, dark stroke (light backgrounds) |
| `SAI:LOGO-NIGHT` | the canonical mark, cream stroke (dark backgrounds) |

It is idempotent. Each expansion is fenced, so re-running replaces the old
block instead of stacking a new one. Change the CSS once, re-run the script
across every artifact, they all update.

**Do not hand-write the CSS into a file.** The lens gradients are dense and an
approximated one renders as a grey smudge.

## What to read, in order

1. **`kit/gallery.html`** — open it in a browser. Every component and all six
   widgets, live, with the markup next to each one. Start here.
2. **`kit/SNIPPETS.md`** — the class index plus copy-paste markup for
   everything. This is the file to keep open while building.
3. **`DESIGN-SYSTEM.md`** — the rules, the color table, and the gotchas we
   already paid for. Worth one read before your first build.

You should not need to open `kit/lens-kit.css`. It is ~50k of CSS and the
script inlines it for you.

Using Claude Code or Codex? Point it at `DESIGN-SYSTEM.md` and `kit/SNIPPETS.md`
and it will build on-system. Those two files are written for an agent to read.

## The system in one breath

Frosted glass panes floating over a warm studio sky (cream to blush to peach),
drifting glass lenses in the background, terracotta `#DC6843` as the only
accent, Inter Tight for prose with Schibsted Grotesk for caps labels and
numerals, and dark mode embedded as "windows" rather than a separate theme.

Light is the default for reports and audits. One dark "night window" may embed
in a light page for the highest-drama moment. Full-dark pages are for decks,
heroes, and video frames.

## The six explainer widgets

Reach for one of these before writing a plain list or table. All demoed in the
gallery, all with automatic night variants.

| Widget | Class | Use it for |
|---|---|---|
| Before / after split | `.sai-split` | audits, proposals, case studies |
| Ledger math | `.sai-ledger` | ROI, pricing, time saved |
| Decision path | `.sai-path` | SOPs, training docs, triage rules |
| Vitals readout | `.sai-vital` | scorecards, metric vs benchmark |
| Source track | `.sai-track` | call notes, video breakdowns, phases |
| Claim card | `.sai-claim` | research synthesis, teardowns |

## Rules that actually bite

Each of these has a failure mode that makes the output look AI-generated.

1. **No dot-pills.** A rounded pill with a leading colored dot is the retired
   tell. Use portholes, bracket stamps, tick flags, or bubble bullets.
2. **Gradients live in the scene only.** Never on text, buttons, chips, bars,
   or component fills.
3. **Terracotta is punctuation, not paint.** Kickers, ticks, portholes, hovers.
   Never flood it. On dark surfaces it lifts to `#FF8E76`.
4. **Legibility floor:** body 17px, nothing below 13px ever, caps labels
   13.5px minimum. Our audience skews older. Readable beats clever.
5. **Display weight is 500, never 700.**
6. **No mono font.** Schibsted Grotesk handles labels and numerals.
7. **Never hand-draw the logo.** `SAI:LOGO` handles it. Source of truth is
   `logo-inline-snippet.html`; raw files in `assets/`. Minimum size 22px.
8. **No emoji in UI, no stock photography.**
9. **One night window per light page. One `.sai-streak` per pane.**
10. **Screenshot it before you send it.** Every page, every time.

## PDF output

The print rules solidify the frosted glass automatically, so a page that looks
right on screen prints correctly. Any headless-Chrome HTML-to-PDF path works.

## What's in here

```
README.md                  this file
DESIGN-SYSTEM.md           the full rules, color table, and earned gotchas
inline_kit.py              the build script
kit/starter.html           copy this to start a new artifact
kit/SNIPPETS.md            class index + copy-paste markup
kit/gallery.html           live demo of every component and widget
kit/lens-kit.css           source of truth for the CSS (the script inlines it)
logo-inline-snippet.html   the canonical logo SVGs, light and night
assets/                    logo files (svg + 2x png), favicon
tokens/                    tokens as css / json / ts
```

`tokens/` is a convenience export if you want the raw values in JS or a build
pipeline. `kit/lens-kit.css` is a superset of it and is the source of truth.

Questions, or something reads wrong on a real client page: tell Alec, we fix it
in `lens-kit.css` once and re-run the script everywhere.
