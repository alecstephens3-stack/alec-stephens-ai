# Homepage v7: where it stands (2026-09-28)

Branch `draft/homepage-v7-2026-09-28`, worktree `~/dev/alec-stephens-ai-v7`, built on
`draft/homepage-trim-2026-09-21` (the v6 draft without spheres). Not merged, not deployed.
Run it: `npx next dev -p 3217` in the worktree, open localhost:3217.

## Alec's calls (2026-09-28)
- Healthcare first ("For clinics, dental and eye care practices"), not only the knowledge base.
- Hero = real tools, calm motion (Orgo as the model): one window cycling Front desk answers,
  Vendor bills, Time off every 6.5 s; pauses on hover/focus; still under reduced motion.
- Logo row = still, grayscale, "Who we work with" (Medari is a partner, not a client). NOT a
  ticker: tickers are on the banned list (2026-09-22).
- Main button = free 30-minute time audit + Opportunity Map; the price card IS on the page
  ($4,500 / $9,500 / $18,000 + $299 / $499 / $899).
- Alec's reaction to the first render: "i love it so far."

## Built
- `src/components/sections/v7/` hero, tool-window, logos, work, how, pricing, contact.
- Copy: `V7_*` exports at the bottom of `src/lib/content.ts`. Proof line = the combined
  260 to 300 hours (approved 9/25), always with "Estimated from the clinic's own numbers."
- Logos: `public/logos/*.png` (ink silhouettes, 96px tall; sources in `design-src/logos/`).
  Kamata's drops the outdated 50年 line; WFV keeps its knockout block.
- Styles: the "DRAFT v7" block in `src/app/globals.css`. Also defines `.draft-rail`, which
  v6 used but never defined.
- Header: v7 nav (What we build, Pricing, How we work, FAQ) + "Free time audit" button.

## Done since (2026-09-28, second pass)
- Full-page QA at 1440 and 390: fixed the window's empty space, phone tab labels (Answers /
  Bills / Time off), logo row scale on phones (now 3 + 2), price tiers aligned (middle tier
  renamed "Two fixes"; "Where most practices start." moved under its price, no caps eyebrow),
  form prompt now "What takes up the most time in your week?", SITE_TAGLINE / DESCRIPTION.
- copy_check (artifact profile) clean; site lint + left-bar guard clean; layout_lint clean
  (its one hit is the contact form's off-screen honeypot, on purpose). ~760 visible words.
- Sent to website-qa-agent and optometrist-reviewer (results go in the next pass).

## QA (2026-09-28)
- website-qa-agent: REJECTED round 1 (render/code mismatch + real fixes), APPROVED round 2 at
  4481d8e. Clinic-owner (optometrist-reviewer) copy fixes applied. Post-approval nits applied:
  link labels "One-page summary", work links aligned, "next business morning".

## Alec's answers (2026-09-28, evening)
- Monthly fee = our guarantee that the systems keep doing their job (now on the card fine print + FAQ).
- No family disclosure ("literally no reason to"). No reference call with Jill. Headline stays for now.
- Logos: OK to show all five.
- Open: hosting after cancel (Charlie explained; fine print now promises only "your content stays yours").

## Hero decision (2026-09-28, late)
- Floor plan: built, rejected ("no idea what this is supposed to convey"), removed.
- Two options built: /preview/paper (paper in, software out) and /preview/depth. Depth v1
  rejected ("physics have to be flawless, we have to look expensive"); rebuilt from a study of
  Linear, Stripe, Raycast, Attio, Mercury, Cursor, Vercel, Superhuman heroes: one dense app
  window on a framed warm backdrop, two satellites carry the parallax, damped-spring physics.
  Measured 60fps, zero dropped frames. Alec: "that one is good. i like it."
- Depth is now the main hero (hero.tsx default). Window copy moved from the eye-care refraction
  question to the universal "Patient is late. Can we still see them?" (Alec's pick).
- The old ToolWindow (tabs) is no longer used on / but kept in the repo.

## Done 2026-09-28 (evening), in Alec's order
- Hero: depth window shows results ("Front desk results": about 5 hours back since Monday, 20
  questions without the office manager, bills in QuickBooks, time off approved, live feed); the
  search types "patient running late" and the answer pops out as a card. No "week" wording (Alec
  dislikes it). Hours line removed from the hero. Subline = the Medari partners-page line, word for
  word: "We diagnose where practices can save time and increase profit, then build the solutions
  that get them there." Kicker "For independent healthcare practices", no bracket marks.
- "What we build" renamed Services (nav, label, hero button "See our services"). Headline, Alec's
  words: "Your staff can focus on patients. We handle the rest."
- Service copy is FINAL (Alec: "the copy is perfect"), incl. card 4 "Systems built around your
  practice" (EHR + patient records via AWS under a BAA, custom builds; ends "We stay on to keep
  things running as your practice changes."). "HIPAA compliant" wording flagged to Alec, kept.
- Services display: pick-a-service switcher (list left, that service working on the right in the
  hero's app style; nothing moves on its own). Alec: "good work".
- One-pagers: all four rebuilt on Lens v3 and replaced on the LIVE site too (sources in the vault,
  artifacts/case-studies/*-2026-09-28/). PDF grey-box defect now blocked by the converters.

## Session 2026-09-28/29 (continued), state at handoff
DONE and approved by Alec, word for word unless noted:
- Hero caption: "Based on our systems in production. Names and amounts are examples."
- Case study section (WFV): label "Case Study · Wichita Family Vision" (crop-mark stamp stays);
  headline "Every question used to go through one person." + terracotta "Now anyone working at the
  front desk finds the answer in seconds."; lead "…Questions like these came up all day, and each
  one meant putting a patient on hold and pulling the office manager away from their own work.";
  "In daily use since August 2026" replaced by payoff figures (About 200 hours / About $4,500, the
  first in terracotta) + a green "Live in production" tinted chip (NO dot) + "Estimated from the
  clinic's own numbers."
- Services card 4 final: "Systems built around your practice" … ends "We stay on to keep things
  running as your practice changes." Services headline and all service copy are final.
- Case study PAGE (/case-studies/front-desk-knowledge-base) redesigned on Lens v4 and LIVE on
  stephensai.co (main 2cf4ce6): client logo lockup header (Alec's pick), crop-mark section stamps,
  framed product shot, payoff figures, "about" not "~". Source: vault
  artifacts/case-studies/front-desk-knowledge-base-page/index.html (inlined kit; edit then
  inline_kit.py, then copy to BOTH repos' public/case-studies/front-desk-knowledge-base/index.html).
- Four one-pagers rebuilt on v4 and LIVE (vault artifacts/case-studies/*-2026-09-28/).
- Design system is Lens v4 (kit/lens-kit.css "LENS v4" block, SNIPPETS.md top section, CLAUDE.md).

TRIED AND REVERTED (do not re-propose): a two-tone "no label" section opening across the page,
kit and case study (Alec: "revert"). Also rejected for section labels: hairline rules, terracotta
line + name, margin note, run-in caps, § section marks, handwriting, folder tabs. The crop-mark
`.sai-stamp` label STAYS. The floor-plan "practice map", the paper-in hero and the tab window were
all dropped earlier.

## In progress 2026-09-29: moving hero side strips (Alec's ask)
Four draft options, switched by URL: /?amb=rings (Placido rings, two ring sets drifting, terracotta
where they cross), /?amb=light (light through blinds), /?amb=contours (topography lines redrawn),
/?amb=day (appointment book drifting up; paperwork blocks turn into patient time at the "now"
line). No parameter = unchanged page. Code: v7/hero-ambient.tsx + .module.css. An exception to
the v4 "nothing on a timer" rule, at Alec's request; strips never sit under glass (header pill,
product window), hidden under 1100px, sleep off screen, reduced motion = still.
Alec: contours and the appointment book were "good starts"; asked for healthcare relevance. Round two
(scout: 21st + Lapa Ninja): /?amb=anatomy (contours around a molar, left, and an eye, right),
/?amb=claims (insurance ledger drifting up, unpaid to paid at the "now" line; the claims offer),
/?amb=threads (after Impilo's hero: fine-line tooth, claim form, appointment book / trial frame,
vendor bill, clipboard, each with a terracotta thread carrying a dot into the product window).
Waiting on his pick. Gotcha: contours INSIDE a molar pinch into a face; outline + outside only.
Gotcha: never loseContext() in a WebGL effect cleanup; React's dev double-mount reuses the canvas.

## Next, in order (section by section WITH Alec; show, don't describe; he picks)
1. Case study section: the links row ("Read the full case study", "More, one page each: Time off
   and payroll, Vendor bills").
2. How it works (label "How we work", "How a project goes.", four steps).
3. Pricing (three tiers; monthly fee line = "our guarantee…"; FAQ already matches).
4. Patient data (BAA line). 5. Founders ("It's the two of us." + Japan/Korea note).
6. Contact (night panel, free time audit). 7. Re-run website-qa-agent on the whole page.
8. Noindex preview link on Alec's go, then port v7 to main (the live homepage).
Working rules: flowing warm sentences, never a sentence-shape formula; build 3-4 visual options
when he asks for options and look at them before showing; check `copy_check.py`; restart the dev
server after CSS changes (`rm -rf .next`), it does not pick up globals.css edits in this worktree.
