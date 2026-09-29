# Lower-half inspiration (web design scout, 2026-09-29)

Found through the 21st.dev MCP and Lapa Ninja. Screenshots:
`/Users/alecstephens/dev/stephens-ai/.playwright-mcp/inspo/` (granola-before-during-after-steps.png,
granola-private-by-default.png, gusto-owner-questions-beside-pricing.png, gusto-plans-scenario-switch.png).
21st preview images open as plain URLs (shoot.py can screenshot them, or the component pages).
Take ideas, never code or costume.

**The scout's caution (and Alec's taste rule): one clever thing per page.** Let ONE interactive idea
be the standout of the lower half; everything else stays quiet detail.

## How we work
1. **Granola, "before, during and after"** (live: https://www.granola.ai/, a third of the way down).
   A small index of the steps pinned on the left underlines the current one; beside it, the real
   thing each step produces. For us: the Opportunity Map (audit), notes from watching the job, the
   tool with your staff, the handover. Leave: its length (2,400px for 3 steps; ours must be much
   shorter), photo backdrops, anything that duplicates the Services switcher.
2. **21st "Scroll Reveal Content A"** (https://21st.dev/@abui/components/scroll-reveal-content-a): a line
   fills beside the steps as the reader moves through. Pacing check for the dotted thread only. Leave the
   numbered blocks and crossfades.
3. **21st "Process Timeline"** (https://21st.dev/@shadcnui-blocks/components/timeline-05): mark step one
   differently, as the only one the reader does today ("Free, 30 minutes. Start here"). Leave the check
   circles and numbered nodes.

## Pricing
1. **Gusto pricing** (https://gusto.com/product/pricing): the owner's own questions right under the price
   card, one answer open at a time (what the monthly fee covers: our guarantee the systems keep working;
   what happens if something breaks; can we start with one fix). Several already live in the FAQ; reuse
   that wording. Their monthly add-on sits as a quiet second line under the price: right weight for ours.
   Leave: kit plan cards, "BEST VALUE" banners, the huge serif headline.
2. **21st "Receipt Pricing"** (https://21st.dev/@n1m4mz/components/receipt-pricing): each tier read as an
   itemised bill: setup line, monthly line, what the monthly covers, dotted leaders to the figures (the
   kit's `.sai-ledger` does this natively). Leave all receipt costume: mono type, barcode, torn edges.
3. **21st "ROI Pricing Calculator"** (https://21st.dev/@diarmuradi/components/pricing-12): the reader moves
   two controls and sees their own hours a year beside the price. The one interaction that truly
   changes what the reader can do. **Charlie's rules if you build it:** it must be labelled as the
   reader's estimate from their own numbers; defaults must NOT be 4 questions and 10 minutes (the case
   study's inputs; the page already states "about 200 hours" for that clinic and a calculator must never
   print a different figure for the same inputs); include days open per week as an input; show hours,
   not dollars; no promise wording. Leave the generic slider-card look.

## Patient data
1. **Granola, "Private by default"**: one plain sentence of promise, proved by a real product window, not
   badges or a lock icon. For us: a small window showing the account in the practice's name, the practice
   as owner. Leave the photo.
2. **21st "Alqemist Security"** (https://21st.dev/@jasonmohab-ali/components/alqemist-security): a few
   switches that redraw a diagram. For us three states: never sees patient information / needs it, stays in
   your account / BAA signed. Leave the enterprise vocabulary and console look.

## Founders (thin)
1. **21st "Location Tag"** (https://21st.dev/@jatin-yadav05/components/location-tag): our local time now
   beside Sendai and Korea, plus one line that turns the gap into the promise (sent this evening, answered
   before their office opens; the approved wording is "next business morning"). Leave the pulsing dot and
   the text-swap animation. No team grids.

## Contact (thin)
1. **21st "Appointment Booking Split"** (https://21st.dev/@olewandowski1/components/booking-2): one side
   says in three plain lines what happens in the 30 minutes and what they keep (the Opportunity Map); the
   other side is the short form.
2. **21st "Appointment Booking Calendar"**: next open times on the panel. **Not allowed now:** we have no
   live feed from the booking calendar, and made-up slots are never shown.

## A thread through the lower half (Granola's page)
Every section shows one real object the practice gets, in the hero's product-window style: the
Opportunity Map, an itemised bill, the account in the practice's name, our clock against theirs.
