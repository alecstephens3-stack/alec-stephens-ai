# Round 5: ten directions on prototype 21

Jusheen picked prototype 21 "Search First" as the direction and named 2 things: its
**front desk knowledge base section** and its **questions accordion**. Round 5 keeps both
and varies the argument around them.

## The shared parts are the point

`_parts/` holds the widgets that are carried forward. `build.py` splices them into every
page, so all ten run literally the same code and cannot drift.

| Marker | Part | What it is |
| --- | --- | --- |
| `SAI5:KB` | `_parts/kb.html` | The knowledge base search. 8 example pages including 2 insurance ones |
| `SAI5:REEXAM` | `_parts/reexam.html` | The 6 touch sequence. The guarantee is quoted character for character |
| `SAI5:TIMEOFF` | `_parts/timeoff.html` | The time off request that reaches payroll |
| `SAI5:FAQ` | `_parts/faq.html` | The questions accordion |
| | `_parts/widgets.js` | Behaviour for all three widgets |
| | `_parts/widgets.css` | Page level composition, including night surface buttons |

Improving a shared widget means editing it once here and rebuilding all ten. A fragment
that hand copies one of these is a bug, and `lint.py` fails on it.

## The loop

```bash
cd prototypes/round-5
python3 build.py 31-search-first.frag.html /tmp/r5/31-search-first.page.html
python3 lint.py *.frag.html                      # house rules
node verify.js /tmp/r5/31-search-first.page.html # the widgets actually work
node audit.js /tmp/r5/*.page.html                # dock overlap, type floor, clipping
node gallery.js /tmp/r5 /tmp/round-5-gallery.html
```

`shot.js` lives in `../round-4/` and still works: `node ../round-4/shot.js /tmp/r5 /tmp/qa5`.

Playwright is not vendored. `npm install playwright --no-save` first; the browser is
already at `/opt/pw-browsers`.

## Why there are four gates and not one

Each one catches a class the others pass.

- **build.py** catches document tags, unexpanded markers, a fragment shipping its own script.
- **lint.py** catches what a screenshot cannot see: em dashes, hype words, an unapproved
  testimonial quote, a wrong price, a banned number, a missing fact, a missing CTA, 2 night
  sections, a price in the hero, and overselling the insurance pages. All 10 rules were
  negative tested against a deliberately broken page.
- **verify.js** catches widgets that render but do not work.
- **audit.js** catches content under the fixed dock, type below 13px, and clipped content.
- **Screenshots** catch what all four pass. Both defects found in round 5 were found here:
  the night surface buttons and the night deck's hero. Do not skip this step.

## Insurance content, and the line that must not move

Per `research/insurance-verification-viability.md`: we write down the **lookup path** the
front desk follows, per plan. We do not check eligibility, verify benefits, pull
authorizations, or touch a payer. Direction 35 states this explicitly on the page and it is
the right model for the others. `lint.py` fails the build on the overselling phrasing.
