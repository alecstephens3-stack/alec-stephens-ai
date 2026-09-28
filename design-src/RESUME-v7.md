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

## Next, in order
1. Apply the two reviewers' findings.
2. Ask Alec: is each company OK with its logo shown (Tri-Valley, Medari, Workthentic especially)?
3. Noindex preview deploy on Alec's go, then port to main.
