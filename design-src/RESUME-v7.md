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

## Next session: the rest of the sections, one at a time, with Alec
Order on the page after Services: Proof (Wichita Family Vision quote), How it works, Pricing,
Patient data, Founders, Contact. Rule for copy: go section by section with Alec, match the vibe
(warm, plain, patient-first), never a sentence-shape formula, flowing sentences.
Then: re-run website-qa-agent on the whole page; noindex preview deploy on Alec's go; port to main.
