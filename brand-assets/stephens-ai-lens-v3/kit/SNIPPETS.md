# Lens v3 — markup snippets

**Read this instead of `lens-kit.css` or `gallery.html`.** The CSS gets inlined by
the script, so reading it costs ~25k tokens and buys nothing. This file is the
class index and the copy-paste source in one. Open `gallery.html` in a browser
when you need to *see* a widget; read this when you need to *write* one.

## Build an artifact

```bash
cp brand-assets/stephens-ai-design-system/kit/starter.html artifacts/my-thing.html
# write content, then:
python3 scripts/inline_kit.py artifacts/my-thing.html
open artifacts/my-thing.html
```

Markers the script expands: `SAI:FONTS` · `SAI:KIT` · `SAI:SCENE` · `SAI:LOGO` · `SAI:LOGO-NIGHT`.
Idempotent — re-run any time to pick up kit changes. Never hand-write the CSS.

## Class index

**Surfaces** `.sai-page` `.sai-pane` `.sai-streak` (one per pane) `.sai-tile` `.sai-widget` `.sai-callout` `.sai-table`
**Scene** `.sai-scene` `.sai-tint.t1/.t2/.t3` `.sai-lens.near/.mid/.far` + `.l1`–`.l5`
**Markers** `.sai-port` `.sai-stamp` (`.corner`) `.sai-flag` `ul.sai-bullets` `.sai-status.good/.warn/.bad`
**Chrome** `.sai-dock` `.sai-btn.primary/.ghost` `.sai-footer` `.sai-float-stat`
**Type** `.sai-display` `.sai-lede` `.sai-w-title` `.sai-w-sub` `.sai-w-note`
**Modes** `section.sai-night` + `.sai-ember` · `.sai-day-window`
**Widgets** `.sai-split` `.sai-ledger` `.sai-path` `.sai-vitals` `.sai-track` `.sai-claims`
**Motion** `.sai-rise` on each top-level section (auto-staggers to 8 children)

Add `.on-night` to `.sai-port` / `.sai-stamp` inside a night section. Every widget
has a night variant automatically via `section.sai-night` descendant rules.

---

## Section shell

```html
<section class="sai-widget sai-pane sai-streak sai-rise">
  <span class="sai-port"><span class="disc"></span><span class="ptext">01 · Eyebrow</span></span>
  <h3>Headline</h3>
  <div class="sai-w-sub">One line of setup.</div>
  <!-- widget goes here -->
  <div class="sai-w-note"><strong>Note:</strong> optional footer line.</div>
</section>
```

Night version (**one per light page, maximum**):

```html
<section class="sai-night sai-rise">
  <span class="sai-ember"></span>
  <span class="sai-stamp corner on-night">Label</span>
  <span class="sai-port on-night"><span class="disc"></span><span class="ptext">Eyebrow</span></span>
  <h3 class="sai-w-title">Headline</h3>
  <div class="sai-w-sub">Setup.</div>
</section>
```

## 1 · Before / after split

The `before` column is deliberately flat and dashed, not glass. That asymmetry is the argument — don't "fix" it.

```html
<div class="sai-split">
  <div class="col before">
    <div class="col-head"><h4>Before</h4><span class="tag old">Manual</span></div>
    <div class="row"><span class="k">Key</span><span class="v">The painful way</span></div>
  </div>
  <span class="sai-turn" aria-hidden="true">
    <svg viewBox="0 0 24 24" fill="none" stroke="#B4502C" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>
    </svg>
  </span>
  <div class="col after">
    <div class="col-head"><h4>After</h4><span class="tag new">The system</span></div>
    <div class="row"><span class="k">Key</span><span class="v">The built way</span></div>
  </div>
</div>
```

4–6 rows, same keys both sides.

## 2 · Ledger math

```html
<div class="sai-ledger">
  <div class="line"><span class="op blank">×</span><span class="k">Volume per year</span><span class="lead"></span><span class="v">312</span></div>
  <div class="line"><span class="op">×</span><span class="k">Minutes each</span><span class="lead"></span><span class="v">9<span class="unit">min</span></span></div>
  <div class="basis">Where this number came from. Always fill this in.</div>
  <div class="line subtotal"><span class="op">=</span><span class="k">Subtotal</span><span class="lead"></span><span class="v">46.8<span class="unit">hrs</span></span></div>
  <div class="line"><span class="op">+</span><span class="k">Another cost</span><span class="lead"></span><span class="v">34.7<span class="unit">hrs</span></span></div>
  <div class="total"><span class="k">What they get back</span><span class="v">100<span class="unit">hrs</span></span></div>
  <div class="restate">That is <b>two and a half weeks</b> of one person's year.</div>
</div>
```

`.op.blank` reserves the gutter on the first line. Close with `.restate` — translate the total into something human.

## 3 · Decision path

```html
<div class="sai-path">
  <div class="step">
    <span class="num">STEP 01</span>
    <h4>Do the thing</h4>
    <p>Why it matters.</p>
  </div>
  <div class="step fork">
    <span class="num">STEP 02 · DECISION</span>
    <h4>What's the condition?</h4>
    <p>Why this answer changes everything downstream.</p>
    <div class="branches">
      <div class="branch">
        <span class="cond">If A</span>
        <div class="out">Do <b>this</b>.</div>
      </div>
      <div class="branch win">
        <span class="cond">If B</span>
        <div class="out">Do <b>that</b> instead.</div>
        <span class="sai-status warn"><span class="kw">Confirm</span><span class="detail">Pending sign-off</span></span>
      </div>
    </div>
  </div>
  <div class="step end">
    <span class="num">STEP 03 · DONE</span>
    <h4>Terminal step</h4>
  </div>
</div>
```

Drop the `.fork` steps and it's a clean linear process rail.

## 4 · Vitals readout

```html
<div class="sai-vitals">
  <div class="sai-vital">
    <div class="label">Metric name</div>
    <div class="value">18<span class="unit">%</span></div>
    <div class="gauge has-label">
      <div class="fill" style="--at: 36%;"></div>
      <div class="mark-t" style="--target: 68%;" data-label="Peer 34%"></div>
    </div>
    <div class="verdict">
      <span class="sai-status bad"><span class="kw">Under</span><span class="detail">16 pts below peer</span></span>
    </div>
  </div>
</div>
```

`--at` and `--target` are percentages **of the bar width**, not of the metric — set them so the visual gap matches the real gap. Bars stay terracotta; good/warn/bad live only in the verdict chip. Drop `.has-label` if there's no benchmark caption.

## 5 · Source track

```html
<div class="sai-track">
  <div class="when">02:14</div>
  <div class="entry">
    <h4>What happened here</h4>
    <p>Why it matters.</p>
  </div>

  <div class="when">12:40</div>
  <div class="entry key">
    <h4>The moment it turns</h4>
    <p>Use .key once, maybe twice.</p>
    <span class="sai-status good"><span class="kw">Steal</span><span class="detail">Reusable</span></span>
  </div>
</div>
```

Timestamps for sources, dates for projects. Same gutter either way.

## 6 · Claim card

```html
<div class="sai-claims">
  <div class="sai-claim">
    <div class="body">
      <div class="quote">"The claim, with <em>the phrase that carries it</em> in accent."</div>
      <div class="attrib"><span class="who">Who said it</span> · Source · <span class="at">12:40</span></div>
    </div>
    <div class="verdict">
      <div class="cap">What it means for us</div>
      <p>The actionable read. <b>Never leave this empty</b> — a claim without a "so what" is a screenshot.</p>
    </div>
  </div>
</div>
```

One `<em>` per quote. Cards auto-equalize so verdict strips align across a row.

---

## Smaller pieces

```html
<!-- callout: registration crop marks, never a left-border bar -->
<div class="sai-callout">
  <div class="cap">Label</div>
  <p>The point.</p>
</div>

<!-- status chip -->
<span class="sai-status good"><span class="kw">Live</span><span class="detail">Detail</span></span>

<!-- bubble bullets -->
<ul class="sai-bullets"><li><b>Lead-in.</b> The rest.</li></ul>

<!-- tick flag (chart annotation) -->
<span class="sai-flag"><span class="tick"></span>Jun 3 · Payroll automated</span>

<!-- floating stat layer: parent pane needs >=72px bottom padding -->
<div class="sai-float-stat">
  <div><div class="n">60<em>+</em></div><div class="l">hours back / yr</div></div>
</div>

<!-- table: hairline rows, no zebra -->
<table class="sai-table">
  <tr><th>Col</th><th>Col</th></tr>
  <tr><td class="num">01</td><td>Value</td></tr>
</table>
```

## Hard rules that bite

- **No dot-pills.** Rounded pill + leading colored dot is the retired AI tell.
- **Gradients in the scene only.** Never on text, buttons, chips, bars, or fills.
- **One night window per light page.** One `.sai-streak` per pane.
- **13px absolute floor**, body 17px, Schibsted labels ≥13.5px. Display weight 500, never 700.
- **No mono font**, ever. Schibsted Grotesk does labels and numerals.
- **Never hand-draw the logo.** `SAI:LOGO` handles it; a guard hook blocks non-canonical marks.
- **Screenshot-QA before delivering.** Non-negotiable.
