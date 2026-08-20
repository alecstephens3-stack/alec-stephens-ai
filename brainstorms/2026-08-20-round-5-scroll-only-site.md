# Round 5: scroll-only, mobile-first site — Brainstorm / Discovery Notes
Date: 2026-08-20 · Goal: settle what round 5 actually is, now that interactivity is off the table

## Summary / key decisions

- **Scroll-only.** No switches, toggles, tabs, or steppers. The page is read by scrolling.
- **One exception:** the front desk knowledge base may be interactive. Nothing else.
- **Mobile first.** Assume a phone, not a laptop. That is the primary design target now.
- **Pricing: ignore.** Jusheen: "I don't care about the pricing, just ignore it." The
  $299 vs $250 inversion the owner panel flagged 8 times is explicitly NOT to be solved here.
- **Testimonials: placeholder.** Known, ignore for now.
- **"Who pulls the export":** maybe one sentence, maybe not on the page at all. Undecided.
- Prototype 21 "Search First" remains the reference for the knowledge base section and the
  questions/FAQ section.

### What this kills from round 4
Three of the ten were interaction-led and lose their premise entirely:
- 24 The Switch (one toggle flips the page)
- 25 The Desk (one screen, three tabs)
- 29 Do I Qualify (visitor sets a control)
Partially affected: 23 The Sequence (drivable timeline), 26 Scroll Reveal (scroll-driven,
survives), 27 The Practice Diagram (clickable nodes).

## Q&A log

### Q1 — what carries the knowledge base section if the page cannot do anything
- Asked: is the knowledge base interactive because typing is the demo, or because it should
  feel alive without demanding work? Offered tap-first / typing-is-the-point / static picture.
- Captured: **none of the three. Jusheen chose a self-playing demo.** In his words: "on both
  laptop and mobile it can just be an interactive, dynamic replaying animation where it's like
  someone's typing into it. It's automatically typing something into the search bar, and then
  it opens up different documents in the wiki. It shows someone clicking it, and then it opens
  up a new page."
- Decision: **the product demos itself.** A ghost cursor types a query, results filter, a
  situation page opens. The visitor is never asked to do anything.
- Secondary: a real text field MAY exist on laptop as a different version, but nothing depends
  on it. Mobile does not need one.
- Why this is better than what was offered: it satisfies scroll-only literally (no input
  required) while still showing the software behaving, and it answers the designer panel's
  complaint that #21 buried its own premise in a small ghost pill below the fold.

## Open flags (pending input)


### Q2 — do the other two products self-play as well
- Asked: all three products self-play (A), or only the knowledge base moves and ReExam and
  operations become still pictures (B), or B plus ReExam as the one exception.
- Captured: **B. Only the knowledge base moves.** ReExam and practice operations become
  well-drawn static depictions.
- Consequence: exactly ONE moving thing on the page, so it takes all the attention by default.
  ReExam's six touch sequence, which the designer panel called "the best single piece of
  explanation in the whole set", has to work as a still image. That is now a design constraint
  rather than an oversight.
- Rationale on the record: the designer read of 26 Scroll Reveal was that motion everywhere
  made the resting state a liability, and the audience skews older, on a phone, possibly on
  clinic wifi.

### Q3 — still exploring, or converging
- Asked: one page and iterate (A), three directions on one axis then converge (B), or another
  ten (C).
- Captured: **A. Converge.** Round 5 is ONE page, built properly and iterated on, not another
  spread.
- Base: prototype 21's knowledge base section and its questions/FAQ section, with the panel
  notes applied where they survive the scroll-only rule.
- Implication for process: feedback now compounds on a single file instead of scattering. The
  ten round 4 pages become reference material, not candidates.

### Q4 — what is in the first phone screen
- Asked: demo in the first screen with a one line hero (A), hero and sub with the demo on
  screen two (B), or lead with the "live in a 27 person practice" proof number (C).
- Captured: **C is rejected, and for a reason worth keeping.** Jusheen: "as the main header or
  line, it gives off the impression that we only have one client." He is right, and it is a
  risk nobody had flagged: it is our only client, and leading with it advertises that.
- Decision: the 27 person fact **stays on the page but moves down**, into the proof or
  testimonial area where it reads as credibility rather than as our entire book of business.
- First screen: **A, decided on my judgement at Jusheen's direction.** One line of headline,
  then the self-playing knowledge base demo, immediately. No sub-paragraph and no button row
  above the demo; the call to action comes after the visitor has watched the thing work.
- Rationale: a cold visitor believes a moving product faster than a sentence, and it fixes the
  designer note that 21 buried its own premise below its own hero.

### Q5 — page length on a phone, and the order
- Asked: proposed order plus a ~4,500px phone height ceiling.
- Captured: **approved as proposed.**
- Order:
  1. One headline line, then the demo already playing (first screen)
  2. Knowledge base, explained by the demo continuing, INCLUDING the "flag this page as wrong"
     moment. That was the single strongest founder reaction across all 20 reviews: "the first
     time a vendor has admitted their content will be wrong."
  3. ReExam, still picture, the six touch sequence as one image
  4. Practice operations, still picture
  5. Proof: 27 person practice, 76 situations, both founders. The credibility number lives here
     now, not in the hero.
  6. Testimonials, placeholder
  7. FAQ accordion, carrying data posture, systems, term, and who you are hiring
  8. Quiet pricing
  9. Close
- Length ceiling: **about 4,500px on a phone**, roughly the shortest of the round 4 ten. Forces
  products 3 and 4 to be one screen each.
- Pre-agreed cuts if it will not fit: fold testimonials into proof, and let operations be the
  smallest of the three products rather than an equal.

### Q6 — how Claude Design fits round 5
- Asked: canvas first then build (A), or build the real page with the canvas as a side view (B).
- Captured: **B**, and an important clarification of intent. Jusheen does NOT want to hand-edit
  designs: "I don't want to be touching the design." His actual concern is about MY process:
  "I don't want you just freestyling the design when there's a better Claude tool to use."
- Honest note recorded for the next session: the /design skill's distinctive output is a canvas
  the USER edits. If Jusheen will not edit it, that specific value does not apply, and the page's
  centrepiece (the self playing demo) cannot render on a static artboard at all.
- What actually prevents freestyling, in order of force:
  1. **The Lens v3 kit.** A real design system with rules, plus inline_kit.py / build.py which
     make hand-writing the CSS impossible by construction. This is the strongest guarantee and
     it is already in place.
  2. **The artifact-design skill**, loaded before building any artifact. Also Anthropic-built,
     and it carries the design-plan discipline and craft review.
  3. **The /design skill's method**, which is worth following even without publishing a canvas:
     resolve the existing system precisely before drawing, state a design plan (colour, type,
     layout) before writing code, and review it against the subject.
- Standing instruction going forward: state the design plan explicitly before building, work
  from the kit, and never hand-write the system. Rounds 1 and 2 genuinely were freestyled and
  scored zero on kit fidelity; that is the failure mode being guarded against.

### Q7 — export sentence, video, and where the design work continues
- Export sentence: **yes, one sentence, in the FAQ, not the body.** Collapsed by default so it
  costs no height, and it converts a doubt into a differentiator: we work from a list your team
  exports, which is why we never touch your practice management system.
- Video: slot left deliberately after the proof block. Build nothing. It is the one thing most
  likely to blow the 4,500px ceiling.
- **Claude Design.** Jusheen wants to continue design iteration in Claude Design as the
  specialist tool. Correction recorded: /design DOES run here and publishes a canvas artifact;
  what is not available from here is syncing into a claude.ai/design project. So the portable
  handoff is a self-contained design brief, `prototypes/CLAUDE-DESIGN-BRIEF.md`, written to be
  pasted into Claude Design in one go.

## Session close

Covered: what carries the KB section, whether other products move, converge vs explore, the
first phone screen, page order and length, how design tooling is used, the export sentence,
and the video slot. Not covered because Jusheen wrapped: exact headline copy, tone specifics,
and what "done" means for this page. Those are first up next session.
