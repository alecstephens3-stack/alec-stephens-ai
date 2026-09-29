# Lower-half builders: the contract (2026-09-29)

Three builders each make their own version of the homepage from **How we work down**:
How we work, Pricing, Patient data, Founders, Contact. Everything above (hero with threads,
Partners, Services with its stitch, the WFV case study) is done and approved. Do not touch it.

Alec's brief, word for word: "from how we work down theres not enough going on. we don't want
noise but we want some interactitivity and some creativity... creativity and professionality,
not noise or distraction."

## Where your work goes (no collisions)

| Builder | Your folder (create it) | Your preview route |
|---|---|---|
| A | `src/components/sections/v7/lower-a/` | `src/app/preview/lower-a/page.tsx` → http://localhost:3217/preview/lower-a |
| B | `src/components/sections/v7/lower-b/` | `src/app/preview/lower-b/page.tsx` → /preview/lower-b |
| C | `src/components/sections/v7/lower-c/` | `src/app/preview/lower-c/page.tsx` → /preview/lower-c |

The route file is exactly this shape (copy `src/app/preview/depth/page.tsx` for the metadata):

```tsx
import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { LowerA } from "@/components/sections/v7/lower-a";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function Preview() { return <HomeBody lower={<LowerA />} />; }
```

`HomeBody` already takes `lower`: it replaces How → Contact and keeps everything above.

**You may create and edit files only inside your own folder and your own route file.** Never edit
`globals.css`, `content.ts`, `home-body.tsx`, the hero, Services, the case study, `page-threads.tsx`,
shared UI components, or another builder's folder. Styles go in CSS modules inside your folder
(`*.module.css`); `globals.css` changes need a dev-server restart and would leak into everyone's page.
Other builders are working in the same repo at the same time: never run `git stash`, `git checkout`,
`git reset`, or commit. Charlie commits.

## Copy

Import the approved copy from `@/lib/content`: `V7_HOW`, `V7_PRICING`, `V7_CTA`, `PATIENT`,
`FOUNDERS_SECTION`, `FOUNDERS`, `V7_CONTACT`, `CONTACT_EMAIL`, `SECOND_EMAIL`, `CALENDLY`. Read the
current components (`v7/how.tsx`, `v7/pricing.tsx`, `v6/patient.tsx`, `v6/founders.tsx`,
`v7/contact.tsx`) to see how they use it. Do not rewrite approved copy. If your interaction needs a
few new words (a toggle label, an annotation), keep them in your folder, keep them short, and list
every new visible string in your report. Run
`python3 /Users/alecstephens/dev/stephens-ai/scripts/copy_check.py --profile artifact "<text>"`
on them. Hard rules: no em dashes, never "ramp", never "eat" figuratively, never "quietly", "about"
not "~", no invented numbers (every figure must already be in content.ts or context/portfolio.md).
No new claims about results, clients or compliance.

## The look (Lens v4; read before you build)

1. `/Users/alecstephens/dev/stephens-ai/brand-assets/stephens-ai-design-system/kit/SNIPPETS.md`,
   the "Lens v4" section at the top.
2. `/Users/alecstephens/dev/stephens-ai/brand-assets/stephens-ai-design-system/CLAUDE.md`, the
   "Lens v4" block and the non-negotiables.
3. This site's own v7 components for how v4 is done in React: `v7/hero-depth.tsx`, `v7/work.tsx`,
   `v6/proof.tsx`, `v7/hero-ambient.tsx`. Match their craft level.
4. `design-src/RESUME-v7.md` for what Alec already approved and rejected.
5. The taste ban list: `/Users/alecstephens/.claude/projects/-Users-alecstephens-dev-stephens-ai/memory/feedback-no-vibe-coded-patterns.md`.
   The test: "would a default prompt have produced this?" If yes, it is out.

Keep: section labels are the crop-mark stamp (`Section` from `v6/shell` gives it to you). Terracotta
is punctuation; one lead figure in terracotta per group. Inter Tight + Schibsted Grotesk only, body
17px+, nothing under 13px. Glass (`.sai-pane` look) only for things that really are objects. One
night window per page: the Contact panel is it.

Banned or already rejected: tickers/marquees, giant chapter numerals, colour wipes, left-bar tinted
callouts, orange caps eyebrow + side bar cards, floating blobs/spheres, dot-pills (a pill with a
leading dot), stock photos, hairline section labels, section numerals, run-in caps, § marks,
handwriting, folder tabs, a two-tone no-label section opening, emoji, icon soup, chart libraries.

## Motion and interaction

- Interactivity must change what the reader can do: compare, switch a scenario, reveal the detail
  of a step, see the thing working. Decoration is not interactivity.
- Motion is calm and triggered: load, hover, click, or a section entering view (once). Never
  scrubbed by scroll, never on a timer below the hero. Spring physics for anything that follows the
  pointer. Reduced motion (`prefers-reduced-motion`) always shows the final state.
- Nothing animates behind a glass (backdrop-filter) surface on a loop.
- Every interactive control works with a keyboard and has a visible focus state.
- Phones (390px wide) must work: no sideways scroll, tap targets 44px, hover-only reveals need a
  tap equivalent.
- The Services stitch and the How dotted thread (`page-threads.tsx`) look for `#how .draft-rail`.
  You may keep that markup so the thread appears, restyle around it, or replace How entirely (the
  thread then simply does not draw). Say which you chose.

## Browser: one at a time (hard rule on Alec's Mac)

Use ONLY `python3 /private/tmp/claude-501/-Users-alecstephens-dev-stephens-ai/30bd5959-a337-4c86-a722-3bdf29b1635b/scratchpad/qa/shoot.py`.
It takes a lock, so the three of you queue instead of opening browsers side by side. Never use the
Playwright MCP tools, never launch Chrome or Playwright any other way. Keep runs short (a plan with
several steps in one run beats many runs). Read its docstring for the plan format. It also
screenshots reference sites for inspiration. The dev server is already running on port 3217; do not
start or restart it.

## QA before you report (at least two passes)

1. `npx tsc --noEmit` and `npx eslint <your files>` clean.
2. Screenshots of your route at 1440×900 (scrolled through so on-enter effects fire) and 390×844,
   each section, plus each interaction's before/after. LOOK at them (Read the PNG) and fix what you
   see: spacing, alignment, text too close to an edge (18px minimum inset), anything that reads as
   noise. Then a second pass on the fixed version.
3. `--reduced` run: the final state shows, nothing is stuck invisible.
4. shoot.py prints console errors and sideways scroll: both must be clean.
5. copy_check clean on every new string.

## What you hand back (to Charlie, under 400 words)

- The route URL.
- Per section, one or two sentences: what you built and what the reader can now do.
- Your inspiration: which references you used (link) and what you took from each.
- Every new visible string.
- Whether you kept the How dotted thread.
- The paths of your final screenshots (1440 full page, 390 full page).
- Known issues, honestly.
