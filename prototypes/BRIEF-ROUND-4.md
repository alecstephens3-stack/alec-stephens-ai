# Round 4 brief: working widgets, visual explanation, less text

Read in this order. Later files win where they differ.

1. `brand-assets/stephens-ai-lens-v3/DESIGN-SYSTEM.md` and `kit/SNIPPETS.md` — the system. Binding.
2. `BRIEF-RECALL-REEXAM.md` — the recall product. Binding, supersedes BRIEF.md's recall section.
3. `BRIEF.md` — facts table, voice rules, the other two products.
4. This file.

---

## What changed, and why

Round 3 put the seven directions on the real kit but made them static hi-fi artboards. Jusheen's
read: the earlier round's **embedded working demos** were the best thing about them, especially the
knowledge base search you could actually type into. Those come back, on the real system this time.

Five instructions from Jusheen and Alec, all of them binding:

### A. Every product gets a working widget. This is the point of the round.

Not a picture of software. A thing the visitor operates with a mouse or a keyboard.

- **Front desk knowledge base** — a search box that really filters real situation pages and really
  opens an answer. This is the one they named. Make it the best widget on the page.
- **ReExam** — the six touch sequence, drivable. Step through days 0, 3, 10, 17, 28, 42 and watch
  what sends, on which channel, and what stops it. Day 10 is email only, and the widget should make
  that visible rather than explaining it in a sentence.
- **Practice operations automation** — a time off request that gets filed, checked against coverage,
  approved, and lands in payroll.

Vanilla JS, no dependencies. Content lives in the markup and is enhanced, never generated, so the
page is complete and readable with the script removed. Keyboard operable. Honours
`prefers-reduced-motion`.

### B. Much less text. Let the design explain.

> "i dont want too much text, i want more visual explaining if you could make designs that kind of
> speak for themselves so you dont need like 10 bullets per section"

- **No section gets a 10-item bullet list. Three items is a lot. Often the right number is zero.**
- If a point can be made by the widget, a diagram, a number, or a label, make it that way.
- A section should be legible at a glance before a word of it is read.
- This is a reduction in *prose*, not in substance. The facts still have to be on the page, carried
  by labels, captions, table cells, and the widgets themselves.

### C. Cut the other-work section entirely.

The business coaching practice, the construction company in Japan, and the language test prep
company come **off every page**. They are outside the niche and they dilute a page that is trying to
prove we understand eyecare specifically. Do not replace them with anything. The page gets shorter.

### D. Objections become a compact FAQ accordion.

Replace the objections card with a **short FAQ where each question is a clickable row that expands
its answer**. Closed by default, so the section costs almost no vertical space.

- Use `<details>` and `<summary>`, styled to the system. That is keyboard accessible and works with
  the script removed, which a div-and-click-handler accordion does not.
- Five or six questions, not ten. The two that must be there: whether patient data is involved,
  answered **per product**, and whether it connects to the practice management system.
- One line of answer each where possible.

### E. Pricing present, but not shouting.

> "dont flash pricing so boldly it should be present but not all up in the readers face"

Prices stay on the page and stay honest. They stop being the loudest thing on it.

- No giant price numerals, no three-column pricing wall, no price in the hero.
- A quiet table, a footnote under each product, or a compact row near the end. The visitor who is
  looking for it finds it in a few seconds. The visitor who is not is not shouted at.
- ReExam is $600 a month flat, no contract. The knowledge base tiers are $2,500/$299, $3,500/$250,
  $4,500/$350. State them plainly, once, small.

---

## Not now, but coming

Jusheen and Alec are considering **a video of the two of them talking to the client** on the site.
**Do not build it, and do not put a video placeholder on any page.** It is recorded here so the
layouts leave a natural place for it later: a wide, calm slot near the top of the page or just before
the close is where it would go. Do not design around it, just do not paint yourself into a corner.

---

## Everything that still binds

- The kit. `.sai-*` classes, the six explainer widgets, the canonical logo via the build script, no
  hand-written CSS. Never hand-draw the mark.
- No dot-pills. Terracotta is punctuation. Gradients live in the scene only. Display weight 500,
  never 700. Body 17px, nothing under 13px. No mono. No emoji. One night window per page maximum.
  One streak per pane. Panes never nest. Whitespace is content.
- The hero carries at most one contained element and the headline is never inside it.
- ReExam per `BRIEF-RECALL-REEXAM.md`: $600 flat, the guarantee quoted character for character, the
  six touch sequence, the compliance posture. No trace of the old Compulink story.
- Testimonials use only the verbatim quotes in `BRIEF-ROUND-2.md` section 2, attributed by role, no
  name, no practice, no city. The adoption quote gets an answer.
- Only facts from the briefs' tables. Nothing from the vendor-math list printed as fact.
- No em dashes. Never gender a staff role.
- Both CTAs: `https://calendly.com/alecpstephens/30min` and `alec@stephensai.co`.

## What a page contains now

Shorter than round 3, because C and D took two sections out and E shrank a third.

1. Hero. Bare, no pane.
2. The three products, each with its working widget.
3. Proof: the 27 person practice, 76 situations, 4 lookups, both founders.
4. Testimonials.
5. FAQ accordion.
6. Pricing, quiet.
7. Close with both CTAs, and the footer.
