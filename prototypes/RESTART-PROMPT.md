# Paste this into a fresh session after /clear

Copy everything inside the fence.

---

```
We are redesigning the Stephens AI website (stephensai.co) so it showcases a catalogue
of products instead of the single offer the live v4 site sells. It is the landing page
at the end of a cold email to independent US optometry practices.

Before doing anything, read these, in this order:

1. prototypes/HANDOFF.md
   Full state: decisions already made, file map, live links, open questions, and five
   gotchas that were expensive to find. Read this first and do not relitigate what it
   marks as decided. Pay attention to the ROUND 5 block, which supersedes round 4.
2. brainstorms/2026-08-20-round-5-scroll-only-site.md
   The discovery interview behind round 5, with the reasoning for each decision.
3. brand-assets/stephens-ai-lens-v3/DESIGN-SYSTEM.md
   and brand-assets/stephens-ai-lens-v3/kit/SNIPPETS.md
   The real design system. Both files are written for an agent to read. Do NOT read
   kit/lens-kit.css, it is 50k of CSS the build script inlines for you, and never
   hand-write the system into a file.
4. prototypes/BRIEF-ROUND-4.md      round 4, still governs where round 5 is silent
   prototypes/BRIEF-RECALL-REEXAM.md  product 2, binding, supersedes BRIEF.md on recall
   prototypes/BRIEF.md               facts table and voice rules
   prototypes/BRIEF-ROUND-2.md       section 2 only: the ONLY approved testimonial quotes

Current state: round 4 produced ten prototypes, 21 to 30, in prototypes/round-4, each with
live widgets. A two-reviewer panel critiqued all ten and the findings are in HANDOFF.md 7a.

ROUND 5 CHANGES THE PREMISE and is what we are building now: the page is scroll only and
mobile first, ONE page rather than ten, with exactly one moving element, a self-playing
looping demo in the knowledge base section where a ghost cursor types a query, results
filter and a situation page opens. The other two products are still pictures. First screen
is one headline line then the demo already playing. Target about 4,500px at phone width.
Pricing is explicitly out of scope. Testimonials stay placeholder.

Start from prototype 21's knowledge base and FAQ sections, which Jusheen picked.

Build loop:
  cd prototypes/round-4
  python3 build.py 21-search-first.frag.html /tmp/p.html    # fragment to artifact page
  node thumbs.js && node full.js && python3 viewer.py       # rebuild the gallery

Non-negotiables: screenshot every page before delivering, no em dashes, never gender a
staff role, only facts from the briefs' tables, and never promise a live sync into a
hosted practice management system.

Branch: claude/optometry-website-prototypes-u3m23p. Commit and push.

What I want next: <SAY WHAT YOU WANT HERE>
```
