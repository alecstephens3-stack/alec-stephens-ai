# Round 6

Three directions, built on the real Lens v3 kit, carrying the fact-checked copy from
`06-FINAL-COPY.md`. Phone first, scroll only.

## What changed from round 5

**The copy is now fixed and audited.** Every string traces to `05-FACTS-AND-FORBIDDEN.md`. The
round 5 widgets carried several claims that did not survive the audit and have been corrected
here:

| Round 5 said | Why it went |
| --- | --- |
| `Most vision plans cover an exam every 12 months` | An industry benchmark printed as fact. |
| `SMS` / `Email` per touch | Only day 10's channel is on record. Now `SMS or email`. |
| `Benefits talk never goes by SMS` | The rationale is not sourced. Only "compliance rule" is. |
| `Care framed nudge` | Campaign vocabulary, not house voice. Now `A short check in`. |
| `Patient data stays in your systems` | Contradicts the BAA concession in the same answer. |
| `Patient records in the system` | Unscoped. ReExam touches contact details. Now `in the knowledge base`. |
| `Book a 20 minute call` | Points at a 30 minute Calendly. Now `Book a call`. |

**The page no longer asks anything of the visitor.** Round 5's ReExam widget had `Send next
touch` / `Patient books` / `Start over` buttons and the knowledge base needed a click. Per client
direction the page is scroll only: the knowledge base demo plays itself, and the FAQ is the only
thing anyone clicks.

## Layout

```
_parts/          shared widgets, edit once and rebuild all three
  kb.html          the self playing demo. THE one moving element.
  reexam.html      six touches as one picture. Still, not a stepper.
  timeoff.html     the operations loop and its stat.
  faq.html         native <details>, drawn closed.
  widgets.css      tokens only. No hard coded colour.
  widgets.js       self play + intersection gating. Respects reduced motion.
build.py         expands SAI6:* markers and inlines the kit. Never hand write the kit.
qa.mjs           screenshot QA at 390px: overflow, height, demo reaches its answer.
```

## Build

```
python3 build.py 41-search-first.frag.html built/41.html
node qa.mjs built/*.html
```

## Rules the fragments must hold

1. Page content only. No doctype, html, head, body or script tag: the build adds those.
2. One or two content panes on the whole page, maximum. Client's words: "don't overwrap content
   in bubbles it looks too much."
3. Fewer things to read, not fewer words. More than about 3 competing objects in a section is a
   failure even if it looks clean.
4. The demo goes high. Headline, then demo. No sub-paragraph, no buttons between them.
5. Accent is punctuation. At most one terracotta mark per screen.
6. Testimonials is an empty slot. No quotes, no bracketed placeholder.
