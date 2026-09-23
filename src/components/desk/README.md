# The desk engine

`desk-scene.js` is a fork of `../lens-hero/lens-hero.js` (the homepage hero) made on
2026-09-23 at the Yamagata Claude Build Day. Same WebGL optics, same Canvas2D sprites,
same idle drift. It drives two pages: `/desk` (the front desk, `desk-stage.tsx`) and
`/play` (the sandbox, `../play/play-stage.tsx`). Keep `lens-hero.js` untouched; the
homepage still uses it.

## What the fork adds

- **Objects that do things.** An item may carry `tool`, `name`, `verb`. Hover reports
  it through `onHover`, a click (press and release within 0.5s and 5 units) reports it
  through `onOpen(id, tool, {name, verb})` and lifts it (`air`).
- **Drag and throw.** A press that travels more than 5 units becomes a drag. Release
  velocity comes from the last ~90ms of pointer samples. Sliding has friction, desk-edge
  bounces, a little spin, and a hard velocity cap. Under the glass, a displaced object
  "comes home" to its pose, but only after `settleAt` (2.4s after a drop), because the
  lens follows the pointer and would otherwise snap every drop straight back.
- **The outside-the-glass copy is live.** The original hero blurred a frozen "mess"
  once. Here `S.messDirty` is set whenever anything moves, and `drawGL` recomposes
  that copy before re-blurring, so a thrown object is seen where it landed.
- **Light.** `setHour(h)` (null = the real clock) drives `uLD`, `uWarm`, `uNight` and
  the page-melt colour; after hours a lamp in the top-right corner lights the desk and
  the glass gathers it. `onLight` tells the page when to flip to Night.
- **The pen.** `addNote(text)` makes a sticky in the office manager's hand and the pen
  writes it stroke by stroke (`writeClip`), then the lens flies to it. Notes reuse four
  slots; a new note finishes any note still being written.
- **Tour hooks.** `flyTo(id, ms)`, `nudge(id)`, `open(id)`, `objects()`, `shake()`.
- **Other item sets.** `init(canvas, { items: (painters) => [...], stops, deskColor })`
  puts different objects on the same desk. `painters` exports the paint helpers
  (`paper`, `print`, `script`, `rr`, `grainAtop`, `stickyItem`, ...). See
  `../play/sandbox-items.js` for the contract in use.
- **Cool running.** When nothing is being touched the loop idles at ~30fps and DPR is
  capped at 1.5.

## Item contract (from `buildItems` / `sandbox-items.js`)

```
{ id, w, h, shadow, soft?, follow?, tool?, name?, verb?,
  wide: { m: [cx, cy, deg], t: [cx, cy, deg] }, tall: {...} | null,
  draw(ctx, F),          // the object, painted in a w x h box at the origin
  ink(ctx, m, F)? }      // its handwriting at messiness m (1 hurried, 0 calm)
```

Design space: wide 800 x 500, tall (phones) 358 x 600. Sprites get a 26-unit pad, so
anything painted outside the box (a letter poking out of its envelope) must stay within
that.

## Types

`desk-scene.d.ts` declares only the surface the pages use. Extend it when you add to the
public API object at the bottom of `init()`.
