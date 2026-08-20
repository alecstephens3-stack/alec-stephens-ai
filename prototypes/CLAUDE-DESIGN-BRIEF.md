# Stephens AI site, round 5 — design brief

Self-contained. Paste the whole thing into Claude Design. It assumes no prior context.

---

## The job

One marketing page for **Stephens AI**, a two-person software and service practice selling to
**independent US optometry practices**. It is the landing page at the end of a **cold email**.
The reader is a practice owner or office manager, non-technical, sceptical, already sold to by
vendors, reading **on a phone between patients**.

**Design for the phone first.** Desktop is the secondary case.

## Hard constraints

1. **Scroll only.** No switches, toggles, tabs, steppers, or accordion-driven layout changes.
   The visitor reads by scrolling and is never asked to operate anything.
2. **Exactly one moving element on the page**, described below. Everything else is still.
3. **Target height about 4,500px at phone width.** Shorter is better.
4. **No video**, but leave a deliberate wide slot after the proof block for one later.
5. The FAQ is the one place a click is allowed, because it is a native disclosure list that
   collapses to almost no height.

## The one moving element

The front desk knowledge base section contains a **self-playing demo that loops**:

- a ghost cursor types a real front desk query into a search field
- results filter as it types
- the cursor clicks a result
- a situation page opens showing a real answer
- it rests, then replays

Nothing is required of the visitor. On desktop a real text field may additionally accept
typing, but nothing depends on it. Honour `prefers-reduced-motion` with a still frame that
shows the opened answer.

## Page order

Built from how the target buyer actually prioritises, not from marketing convention.

1. **First screen.** One line of headline, then the demo already playing. No sub-paragraph and
   no buttons above the demo.
2. **Front desk knowledge base.** The demo continues to carry it. Must include a *flag this
   page as wrong* affordance, which is the single strongest thing on the page.
3. **ReExam**, patient reactivation. Still picture: a six-touch sequence over six weeks as one image.
4. **Practice operations**, time off and payroll. Still picture. Smallest of the three.
5. **Proof.** Live in a 27 person practice with 6 to 7 doctors, 76 front desk situations mapped,
   4 decision lookups built, and the two founders.
6. **Testimonials.** Placeholder for now; design the slot, do not write quotes.
7. **FAQ**, a collapsed disclosure list. Carries data posture per product, whether it connects to
   their practice management system, contract terms, and who they are hiring.
8. **Pricing**, quiet. Present, never the loudest thing, never in the hero.
9. **Close** with a booking link and an email address.

## Things not to do, each learned the hard way

- **Do not lead with "live in a 27 person practice."** It is true and it is the only client, so
  leading with it advertises having exactly one client. Keep it, but in the proof block.
- **Do not turn bullet lists into chips, tick flags, spec rows or status pills and call it
  visual explanation.** A design review of the previous round found this on 9 of 10 pages. The
  goal is fewer things to read, not the same things wearing costumes.
- **Do not bury the demo below its own hero.** The previous version's search box arrived below
  the fold as a small ghost pill and the review called it the weakest at delivering its own premise.
- **Do not promise a live sync into a practice management system.** Those systems do not give
  outside vendors database access. Everything works from an export the practice's own team runs.
- Do not use emoji, stock photography, or a monospace font.

## The design system: "Lens" v3

Frosted glass panes floating over a warm studio sky, drifting glass lenses in the scene,
terracotta as the only accent used like punctuation, and dark used only as an embedded window
rather than a separate theme.

**Colour**
```
sky (page ground)   linear-gradient(180deg,#F3EEE8,#F7E7DA 42%,#F7DCC9 74%,#F2CFB8)
night (embed only)  radial-gradient(130% 130% at 22% -12%,#241B15,#150F0B 58%,#0D0A08)
ink                 #171310      primary text
ink secondary       #5A4F46      the lightest secondary allowed on light
cream / cream-2     #F5F1E8 / #B3AB9E    text on night surfaces
accent              #DC6843      MARKS ONLY: bullets, bars, rules, dots. Never carries text.
accent text <24px   #8F3616
accent text 24px+   #C55532
accent on night     #FF8E76
glass pane          rgba(255,255,255,0.55) + backdrop-filter blur(30px) saturate(1.5)
glass edge          rgba(255,255,255,0.85), 1px
hairline rule       rgba(23,19,16,0.10)
```

**Type.** Inter Tight (400/500) for prose and headings. Schibsted Grotesk (600/700) for caps
labels and numerals. **Display weight is 500, never 700.** Body 17px, nothing below 13px, caps
labels 13.5px minimum. The audience skews older, so readable beats clever.

**Shape.** Radii 8 / 10 / 18 / 22 / 30px, buttons are pills. Tap targets 44px minimum.

**Rules that bite.** Gradients live in the scene only, never on text, buttons, chips, bars or
fills. No rounded pill with a leading coloured dot, that pattern is retired. One night window
per page maximum. Panes never nest inside panes. The hero carries at most one contained element
and the headline is never inside it. Whitespace is content: wide gutters, do not pack the UI.

## Facts that may appear. Nothing else.

27 person practice, 6 to 7 doctors, one location, live today · 76 front desk situations mapped ·
4 decision lookups · 0 patient records in the knowledge base · live in 30 days · ReExam is $600
a month flat, no contract, no setup fee · knowledge base tiers $2,500 setup / $299 a month,
$3,500 / $250, $4,500 / $350 · practice operations returned 60 to 100 admin hours a year ·
founders Alec Stephens and Jusheen Kim, both based in Asia, urgent issues answered by the next
business morning US time.

Invent no other number. Do not state a recovered-revenue or ROI figure.

## Voice

Short. Concrete. Numerals not spelled-out numbers. No corporate filler. **No em dashes**, use
commas, colons and full stops. **Never gender a staff role**, use they or the role name. Call it
a knowledge base, never a playbook, wiki or portal.
