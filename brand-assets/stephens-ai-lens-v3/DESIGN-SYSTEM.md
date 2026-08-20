# Stephens AI — Brand & Design System · "Lens" (v3)

Instructions for Claude Code. Read this file first; it takes precedence over
stylistic defaults from any framework you're about to reach for.

**Adopted 2026-07-20** (Alec's call, Final H "Lens" from the liquid-glass
exploration), replacing the flat paper system (v2).

**Source of truth is `kit/lens-kit.css`** (2026-07-25). One file, one
vocabulary (`.sai-*`): tokens, primitives, and the six explainer widgets.
Never hand-copy it into an artifact — see "Building a deliverable" below.

- `kit/gallery.html` — live demo of every widget with copy-paste markup. **Start here.**
- `explorations/2026-07-20-liquid-glass/final-h-lens.html` — the original
  visual reference. Note it predates the kit and uses unprefixed class names
  (`pane`, `lens`, `port`); read it for the *look*, take the *code* from the kit.
- `tokens/tokens.css` — superseded by `kit/lens-kit.css`, which is a superset.
  Kept only until nothing imports it.

## The system in one breath

Frosted glass panes floating over a warm studio sky (cream to blush to peach),
drifting glass lenses in the scene, the logo dot's terracotta as the only
accent, Inter Tight prose with Schibsted Grotesk labels, and dark mode
embedded as "windows" instead of a separate theme. Warm, spatial,
Apple-adjacent, and readable by a 55-year-old practice owner.

## Non-negotiable rules

Every one has a failure mode that produces "AI slop." Do not violate them.

1. **Whitespace is content.** Wide gutters, generous spacing. Do not pack UI.
2. **Terracotta is the accent** (`#DC6843`, the logo dot). Use it like
   punctuation: kickers, portholes, tick flags, numerals, hover states, the
   win outline. On night surfaces it lifts to `#FF8E76`. Never flood it.
   Salmon (`#F47B6B`) is a **scene color** (tint pools), not a component color.
3. **Gradients live in the scene only** (sky, tint pools, lenses, night
   radial). Never on text, buttons, chips, bars, or component fills.
4. **Glass is the surface language.** Every card, panel, and header is a
   `.sai-pane`: translucent white, `backdrop-filter: blur(30px) saturate(1.5)`
   (always with the `-webkit-` twin), 1px near-white border, the canonical
   shadow stack (soft depth + specular top edge). Never a flat opaque card on
   the bare sky.
5. **Radii are generous.** 8px chips, 10px flags, 18px tiles, 22px floating
   cards, 30px panels/windows, 999px pills (buttons, tags, the dock).
6. **Two typefaces, mono retired.** Inter Tight (400/500/600) for prose and
   headings — display weight is **500, never 700**. **Schibsted Grotesk**
   (600/700) for every caps label, chip keyword, stamp, and numeral. IBM Plex
   Mono is gone; do not reintroduce any mono face.
7. **NO dot-pills, ever.** A rounded pill with a leading colored dot is the
   retired AI tell (killed 2026-06-08, re-killed 2026-07-20). Markers are:
   **portholes** (tiny lens discs), **bracket stamps** (registration crop
   marks), **tick flags** (accent bar, not dot), **bubble bullets** (miniature
   lens list markers), and **ledger status chips**.
8. **Dual-mode by design.** Light is the default for reports and audits. A
   **night window** (`section.sai-night`) may embed in a light page — one per
   page maximum, reserved for the highest-drama moment. A **day window**
   (light sheet) embeds the action item inside dark decks. Full-dark pages are
   for decks, heroes, and video frames only.
9. **Legibility floor.** Body 17px. Nothing renders below **13px**, ever.
   Schibsted labels are 13.5px minimum (14.5px default). Secondary text never
   lighter than `--sai-ink-2` on light or `--sai-cream-2` on dark. The
   audience skews older — readable beats clever.
10. **Depth is hierarchy, not decoration.** Floating layers (the stat card
    over the hero pane) mean "most important." One specular streak per major
    pane, maximum. Motion is the slow lens drift and one staggered 700ms
    entrance rise; nothing else moves without a reason.
11. **No emoji in UI. No stock photography.** Type and glass do the work.

## Color usage

| Token | What it's for | What it's NOT for |
|---|---|---|
| `ink` / `ink-90` | Text and headings on light glass | Backgrounds |
| `ink-2` | Secondary text on light — the LIGHTEST allowed | Primary text |
| `cream` / `cream-2` | Text on night surfaces (primary / secondary floor) | Use on light surfaces |
| `accent` (#DC6843) | THE accent: kickers, ticks, portholes, hovers | Fills, floods, body text |
| `accent-night` (#FF8E76) | The accent on dark surfaces | Light surfaces |
| `salmon` (#F47B6B) | Scene tint pools only | Any component |
| `sky` / `night` | The two scene gradients | Component fills |
| `status-good/warn/bad` (+`-night`) | Ledger chip keywords only | Decorative accents, buttons |

## Signature components (specs in tokens.css, live demo in final-h-lens.html)

- **Pane** (`.sai-pane`) — the one glass recipe. Optional `.sai-streak`.
- **Lens** (`.sai-lens`) — the scene bubbles: specular catch, refracted sky
  belly, ember caustic, rim light. Three focus tiers (`near/mid/far`) for
  depth of field; each drifts on its own 11-24s clock. 3-5 per page, placed
  to peek behind panes.
- **Porthole** (`.sai-port`) — section marker: a tiny lens disc + Schibsted
  caps. `on-night` variant has the ember night inside.
- **Bracket stamp** (`.sai-stamp`) — mode/label marker held by two
  registration crop marks (the brand's surviving print DNA).
- **Tick flag** (`.sai-flag`) — chart annotation pill leading with a 4px
  accent bar.
- **Bubble bullets** (`ul.sai-bullets`) — list markers as miniature lenses.
- **Ledger status chip** (`.sai-status`) — two-cell chip, Schibsted keyword
  on a functional tint + fact in Inter Tight. Good/warn/bad only.
- **Night window / day window** — the dual-mode embeds (rule 8).
- **Dock** — the floating pill header (logo + Schibsted nav pills). Fixed,
  centered, top 22px.
- **Floating stat layer** — 2-4 big numerals on a `glass-strong` card
  overlapping its parent pane's bottom edge (leave >=72px bottom padding in
  the parent so text never collides).
- **Story chart** — SVG line/area in solid accent, dashed accent verticals at
  events, tick flags explaining every spike. Charts answer "why" first.
- **Table** — hairline rows, Inter Tight 600 13.5px uppercase column heads,
  Schibsted numerals in accent for IDs/rungs. No zebra striping.
- **Callout** — the registration-bracket decision box survives from v2: salmon→
  terracotta crop marks on opposite corners of a glass pane. Never a left-bar.

## Explainer widgets — the information structures

Added 2026-07-25. The system had surfaces and markers but nothing that could
*show* an argument. These six are the structures. All demoed with real markup
in `kit/gallery.html`; every one has a night variant.

| Widget | Class | Use it for |
|---|---|---|
| **Before / after split** | `.sai-split` | Audits, proposals, case studies. The `before` column is deliberately NOT glass (flat, recessed, dashed) and `after` is lifted glass with the win outline. The asymmetry is the argument — don't "fix" it by making both columns glass. |
| **Ledger math** | `.sai-ledger` | ROI, pricing, time-saved. Dotted leaders, operators in the gutter, accounting double-rule under the total. Always fill `.basis` with the assumption's source; close with `.restate`. |
| **Decision path** | `.sai-path` | Training knowledge bases, SOPs, triage rules, "how the build runs." A rail with lens beads; `.step.fork` + `.branches` for conditional routing. Drop the forks and it's a linear process rail. |
| **Vitals readout** | `.sai-vital` | Practice Intelligence Snapshot, scorecards. `--at` is where they are, `--target` is the benchmark tick — both are percentages of the *bar width*, not of the metric. Bars stay terracotta; good/warn/bad live only in the verdict chip. |
| **Source track** | `.sai-track` | Video and podcast breakdowns, call write-ups, engagement phases. Schibsted numerals in the gutter. `.entry.key` marks the moment that matters. |
| **Claim card** | `.sai-claim` | Video breakdowns, research synthesis, teardowns. Quote + attribution + the `.verdict` strip. **Never ship one with an empty verdict** — a claim without a "so what" is a screenshot. |

## Building a deliverable

1. Single self-contained `.html`, no build step.
2. **Do not hand-write the system.** Put these markers in the file and run
   `python3 scripts/inline_kit.py <file.html>`:
   `SAI:FONTS` (Google Fonts), `SAI:KIT` (the whole stylesheet), `SAI:SCENE`
   (sky + tint pools + 5 drifting lenses), `SAI:LOGO` / `SAI:LOGO-NIGHT`
   (the canonical mark). Each expands inside a fence, so the script is
   idempotent: change the kit, re-run it, every artifact picks up the update.
   Hand-copying costs ~3,200 output tokens per file and an approximated lens
   gradient renders as a grey smudge.
3. Page anatomy: scene (fixed) → dock or glass header → hero (porthole
   eyebrow, display headline with accent em words, optional floating stat
   layer) → glass panes → at most one night window → footer.
4. Entrance: staggered 700ms rise, ~60ms steps. Then only the lenses move.
5. For PDF: `python3 reports/html_to_pdf.py <file>` — the print rules in
   tokens.css solidify the frost automatically.
6. **Screenshot-QA every page before delivering** (branding, layout,
   readability). Non-negotiable.

## Logo

Unchanged from v2 — and guarded. **Never hand-draw the mark.** Inline the
canonical SVG verbatim from `logo-inline-snippet.html` (dark stroke `#0D0C0B`
for light backgrounds, cream stroke `#F5F1E8` for night; the dot stays
`#DC6843` in both). A PostToolUse hook (`scripts/check_brand_logo.py`) blocks
non-canonical inline marks. Files in `assets/`. Min size 22px.

## Voice

Unchanged. Short. Concrete. Numbered. Zero corporate filler. Numerals not
spelled-out numbers. No em dashes in anything published or sent.

## Earned gotchas (encoded so they can't recur)

- **`night` is a section-scoped class.** Style dark windows via
  `section.sai-night`, never a bare `.night` (a bare modifier on a marker span
  once inherited the whole section's padding/border — phantom boxes).
- `backdrop-filter` always ships with `-webkit-backdrop-filter`.
- Scene is `position: fixed` for single-mode pages; for scroll-through
  day-to-night scenes use `position: absolute; inset: 0; overflow: hidden`
  (unclipped tint pools once widened the page and drew a black band).
- Full-page screenshots paint fixed elements (dock, vote bars) mid-page;
  that's a capture artifact, not a bug — verify in a live viewport.
- One night window per light page. One streak per pane. If a surface has two
  gradients on it that aren't scene objects, one is wrong.
- **SVGs shipped as `<img>` cannot load web fonts** — only the fallback chain
  renders for visitors (a dev machine with the font installed masks it). Every
  font-family in image-SVG artwork must degrade sans→sans (end in
  `'Inter Tight','Helvetica Neue',Arial,sans-serif`), and a font rebrand is
  verified by RENDERING the file via `<img>`, never by grep (caught by the
  website QA gate, 2026-07-25).
- **Never write a marker string literally inside `lens-kit.css`.** It nests a
  fence inside its own fence and `inline_kit.py` stacks a second copy of the
  kit on the next run instead of replacing the first. The script now hard-fails
  on this, but write markers as bare `SAI:KIT` in prose, never as the comment.
- `.sai-vital .label` carries a 2-line `min-height` on purpose: without it a
  wrapping metric name knocks its card's gauge out of line with its neighbours.
  `.sai-claim` is a flex column with `.body { flex: 1 }` for the same reason —
  it keeps verdict strips aligned across a row.

## What changed from v2 (for anyone with stale memory)

v2 (retired 2026-07-20): flat white paper, salmon-as-punctuation, Inter Tight
+ IBM Plex Mono, 8px radius cap, no gradients, no shadows, no glass, light
mode only. If you see those patterns in a template under `reference/`, it
predates Lens — rebuild on sight before reusing. The v2 tear sheets in
`reference/` and `brand-guidelines.md` are **pending rebuild** on the new
system; until then this file + tokens.css + final-h-lens.html are the only
authoritative sources.
