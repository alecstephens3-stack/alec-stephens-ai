# Round 5 brief: 21 is the direction, product 3 widens, insurance comes home

Read in this order. Later files win where they differ.

1. `brand-assets/stephens-ai-lens-v3/DESIGN-SYSTEM.md` and `kit/SNIPPETS.md`. Binding.
2. `BRIEF-RECALL-REEXAM.md`. Product 2. Binding, supersedes BRIEF.md's recall section.
3. `BRIEF.md`. Facts table, voice rules.
4. `BRIEF-ROUND-4.md`. Working widgets, less text, quiet pricing, FAQ accordion. Still binding.
5. This file.

---

## What changed, and why

Jusheen picked **prototype 21 "Search First"** as the direction, and named 2 things
specifically: its **front desk knowledge base section** and its **questions (FAQ) section
design**. Round 5 keeps both, and moves on to the parts that are still unsettled.

Three instructions, all binding.

### A. 21's knowledge base widget and FAQ are FIXED. They are not yours to redesign.

Both ship as **shared parts spliced in by the build script**, so all ten pages carry
literally the same code:

```
<!-- SAI5:KB -->    the search box, the chips, the situation pages, the note
<!-- SAI5:FAQ -->   the questions accordion
<!-- SAI5:JS -->    the widget behaviour for all three products
```

You write the **section shell** around them: the porthole eyebrow, the headline, the one
line of setup, and where the section sits in the page. You do **not** rewrite the widget
markup, the chips, the situation pages, the questions or the script. If you think one is
wrong, say so in a comment. Do not edit it.

Improving a shared part means editing it once in `round-5/_parts/` and rebuilding all ten.
That is the point of carrying something forward as a reference implementation.

### B. Product 3 stays exactly as it is: time off and payroll.

It is the only product with a live build and a real number behind it, 60 to 100 admin
hours a year returned at the practice we built it for. Its widget is prototype 21's time
off request: file it, get it checked against coverage, and watch it reach payroll.

**Dropped 2026-08-20, on Jusheen's call: the optician commission calculator.** An earlier
version of this brief made it product 3's new edge and widened the hook to "the admin that
runs on spreadsheets". Both are out. Do not reintroduce either, and do not invent a
replacement edge. Product 3 is time off and payroll, described plainly.

**Two things stay ruled out**, and HANDOFF section 7 has the reasons. No PMS to payroll
live sync, because our own FAQ calls that overselling. No shift scheduling, because it is
a behaviour problem.

### C. Insurance content comes into product 1's section.

From `research/insurance-verification-viability.md`, settled 2026-08-20: we do **not** build
an insurance verification product. We do put insurance content in the knowledge base, which
is where it already belonged. Two additions, both already in the shared KB part:

1. A situation page for **finding a patient who arrives with no card**, which is a per payer
   lookup path, not a lookup tool.
2. A decision lookup for **vision plan or medical routing**, promoted from a situation page,
   because it is where the money actually leaks and no eligibility vendor touches it.

**Do not put a verification product on any page.** Do not imply we check eligibility, pull
authorizations, or connect to a payer. We write down the rules the front desk follows. That
distinction is the whole finding and getting it wrong reverses the research.

---

## What is fixed across all ten, and what is yours

| Fixed. Spliced in, do not edit | Yours. This is the round |
| --- | --- |
| The knowledge base widget | The hero, and what it argues |
| The questions accordion | Section order and emphasis |
| The three widget scripts | Section framing copy: eyebrow, headline, setup line |
| The facts, prices and quotes | The proof section's shape |
| The time off request markup | How pricing is presented, quietly |
| | The close, and the one night window's placement |
| | Direction specific layout CSS |

## The ten directions

Your assignment names yours. Each is a different **argument**, not just a different layout.

| # | Name | The bet |
| --- | --- | --- |
| 31 | Search First | The search box is the entire pitch. Everything else is evidence it generalises |
| 32 | The Spreadsheet | The practice runs on spreadsheets and people's heads. Each product replaces one |
| 33 | The Disputed Number | Open on the argument nobody writes down, then show the 3 places we write things down |
| 34 | Three Desks | Front desk, the list nobody works, the back office. One product each |
| 35 | The Insurance Question | Lead on the insurance content. It is the sharpest thing in the catalogue now |
| 36 | Objections First | The questions accordion IS the page. Each answer opens into the product that answers it |
| 37 | The Ledger | Quiet and numeric. What the admin actually costs, counted |
| 38 | Day One | What a new hire gets handed, and what they get handed instead |
| 39 | The Night Deck | Dark led. The operator's view of the practice |
| 40 | The Console | One driveable surface. Near zero prose |

## Everything that still binds

- The kit. `.sai-*` classes, no hand written CSS beyond page level composition, the canonical
  logo via the build script. Never hand draw the mark.
- No dot-pills. Terracotta is punctuation. Gradients live in the scene only. Display weight
  500, never 700. Body 17px, nothing under 13px. No mono. No emoji. **One night window per
  page maximum.** One streak per pane. Panes never nest. Whitespace is content.
- The hero carries at most one contained element and the headline is never inside it.
- **No em dashes.** Never gender a staff role. Numerals, not spelled out numbers.
- Only facts from the briefs' tables. Nothing from the vendor math list printed as fact.
  The ~$285 figure includes optical and is not to be used.
- Testimonials: only the verbatim quotes in `BRIEF-ROUND-2.md` section 2, attributed by
  role, no name, no practice, no city. The adoption quote gets an answer.
- ReExam per `BRIEF-RECALL-REEXAM.md`. $600 flat, the guarantee quoted character for
  character, the 6 touch sequence, day 10 email only.
- Pricing present, never shouting. No price in any hero.
- Both CTAs: `https://calendly.com/alecpstephens/30min` and `alec@stephensai.co`.
- No video, and no video placeholder. Leave a wide calm slot near the top or before the close.

## What a page contains

1. Hero. Bare, no pane.
2. The three products, each with its working widget. Product 1 uses the shared KB part.
3. Proof: the 27 person practice, 76 situations, 4 lookups, both founders.
4. Testimonials.
5. The questions accordion. Shared part.
6. Pricing, quiet.
7. Close with both CTAs, and the footer.

## Build loop

```bash
cd prototypes/round-5
python3 build.py 31-search-first.frag.html /tmp/p.html
python3 lint.py *.frag.html          # house rules gate, run before every delivery
node ../round-4/shot.js <dir> <shots> # screenshot QA. Non-negotiable
```
