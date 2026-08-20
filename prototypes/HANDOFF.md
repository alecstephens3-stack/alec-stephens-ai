# Handoff: website redesign, state as of 2026-08-20

Written so a fresh session can pick this up cold. Branch:
`claude/optometry-website-prototypes-u3m23p`. Everything below is pushed.

---

## 1. What this project is

The live site (v4) sells ONE thing: the front desk knowledge base. We are redesigning
it to showcase a **catalogue of products**, because the site is the landing page at the
end of a cold email to an independent US optometry practice, and different practices
bite on different problems.

Two people: Alec Stephens and Jusheen Kim. Both based in Asia. The client work behind
all of it is one 27-person eyecare practice, 6 to 7 doctors, one location.

## 2. Decisions already made. Do not relitigate these.

| Decision | Detail |
| --- | --- |
| Design system | **Lens v3**, the real kit, vendored at `brand-assets/stephens-ai-lens-v3`. Never hand-write its CSS; use `inline_kit.py` or the round-4 `build.py`. |
| Product 2 | **ReExam**, not the invented "recall done for you". $600/mo flat. See `BRIEF-RECALL-REEXAM.md`. |
| Other-work section | **Cut** from every page. Coaching practice, Japan construction, test prep are out of niche. |
| Objections | A `<details>`/`<summary>` **FAQ accordion**, not a card. |
| Pricing | Present, never shouting. No price in any hero. |
| Video | Coming, deliberately NOT built and NOT stubbed. Layouts leave a wide slot near the top or before the close. |
| Format | Standalone interactive pages. The design-canvas route made them static, which was rejected. |

**Jusheen's latest, 2026-08-20:** likes **prototype 21 "Search First"**, specifically its
**front desk knowledge base section** and its **questions (FAQ) section design**. Those are
now shared parts in `round-5/_parts/`, spliced into all ten round 5 pages by `build.py`, so
carrying them forward is mechanical rather than a promise.

**Also settled 2026-08-20: the optician commission calculator is dropped.** It was briefly
product 3's new edge, it got built, and Jusheen killed it on sight. Product 3 is time off
and payroll, described plainly, with prototype 21's time off widget. Do not reintroduce it
and do not invent a replacement edge without asking.

## 3. The products

1. **Front desk knowledge base** — live at the practice. 76 situations, 4 decision
   lookups, holds 0 patient records.
2. **ReExam** — done-for-you patient reactivation. $600/mo flat, no contract. Guarantee
   wording is contractual, quote it character for character. Six touch SMS + email
   sequence over ~6 weeks, day 10 is email only for TCPA reasons.
3. **Practice operations automation** — time off and payroll, built and live, returned
   60 to 100 admin hours a year. **Settled 2026-08-20: it stays.** It is the only
   product with a live build and a real number behind it, and swapping it for an
   unbuilt connector would trade that away. Sharpen the framing instead, see section 7.

## 4. Where the work lives

```
brand-assets/stephens-ai-lens-v3/   the real kit. DESIGN-SYSTEM.md + kit/SNIPPETS.md
                                    are written for an agent to read; start there.
research/                           source documents and viability analyses. Nothing here is
                                    cleared for a public page. Start at research/README.md
prototypes/
  BRIEF.md                  facts table, voice rules, products 1 and 3
  BRIEF-RECALL-REEXAM.md    product 2. Supersedes BRIEF.md's recall section
  BRIEF-ROUND-2.md          section 2 holds the ONLY approved testimonial quotes
  BRIEF-ROUND-4.md          current instructions: widgets, less text, FAQ, quiet pricing
  01..10-*.html             round 1, off-system, historical only
  11..17-*.html + lens-v3/  round 2 and 3, superseded
  round-4/                  21..30 fragments. Superseded by round 5
  round-5/                  CURRENT. 31..40 fragments, _parts/ shared widgets,
                            build.py + lint.py + verify.js + audit.js + gallery.js
  HANDOFF.md                this file
```

Round 4 build loop:
```bash
cd prototypes/round-4
python3 build.py 21-search-first.frag.html /tmp/p.html   # fragment -> artifact page
node thumbs.js && node full.js && python3 viewer.py      # rebuild the gallery
```

## 5. Live links

- **Gallery, all ten round 5** https://claude.ai/code/artifact/ca33e084-b10f-4bf7-9adf-3eee49639f91
- 31 Search First https://claude.ai/code/artifact/7719f5bf-6ffd-4da7-a246-776bf5655e4e
- 32 The Spreadsheet https://claude.ai/code/artifact/d80aee6f-14c1-44c0-8bcb-e4169dffff50
- 33 The Year https://claude.ai/code/artifact/dbacf652-e062-4a2b-8ec7-5aa0eabce43e
- 34 Three Desks https://claude.ai/code/artifact/eb108e35-bb9f-429d-a2ab-e4a0786ef0a8
- 35 The Insurance Question https://claude.ai/code/artifact/58d6206d-ffde-44b5-8c41-548e284b789a
- 36 Objections First https://claude.ai/code/artifact/9c8d14d1-c786-491d-87b7-7b8d7c19f364
- 37 The Ledger https://claude.ai/code/artifact/3631818e-0327-4c01-93d2-ca54f39ad60e
- 38 Day One https://claude.ai/code/artifact/ddfb7771-b3c8-4252-aab1-9dd46ca1605a
- 39 The Night Deck https://claude.ai/code/artifact/faac0b57-aded-485c-9b7e-b356bd6d1b00
- 40 The Console https://claude.ai/code/artifact/32b86c68-c243-476c-a971-3c86e08241ad
- **Insurance verification, decision document** https://claude.ai/code/artifact/f238aa9f-2190-4852-b00c-300f8dd686e5
- **Gallery, all ten round 4** https://claude.ai/code/artifact/c357ee0b-3513-41ac-9543-0d490b033e47
- 21 Search First https://claude.ai/code/artifact/4bc65fd8-e6d0-4a32-8cc9-e4418b4d679a
- 22 Three Consoles https://claude.ai/code/artifact/3b00d229-f814-464b-b7f5-3620f38a4844
- 23 The Sequence https://claude.ai/code/artifact/93dbe47a-6a36-4fa9-8338-404b7ea81196
- 24 The Switch https://claude.ai/code/artifact/cbb3322f-22e4-4d55-9186-ae21513a3260
- 25 The Desk https://claude.ai/code/artifact/1f4e7dc7-c871-449c-8c1f-cee5cd235432
- 26 Scroll Reveal https://claude.ai/code/artifact/b193aa10-a78a-4e0d-b27d-a3f4759e29d6
- 27 The Practice Diagram https://claude.ai/code/artifact/50512260-ed7c-4691-aef7-4ca42f048c4b
- 28 The Quiet Catalogue https://claude.ai/code/artifact/65e8c64e-61c8-4734-88f7-7c6ca50f8291
- 29 Do I Qualify https://claude.ai/code/artifact/3c19fac2-5ac3-4f1c-aff0-31b57a43325a
- 30 The Night Deck https://claude.ai/code/artifact/609f4fcd-517c-4825-addf-3edf17478273
- **Review panel, both reviewers on all ten** https://claude.ai/code/artifact/f7540f08-da1c-469f-842e-cafda0d9fed6
- Round 1 index, historical https://claude.ai/code/artifact/a76445a8-13a2-4e86-a58b-6b931c0a6cf5
- Lens v3 canvas, superseded https://claude.ai/code/artifact/969b9c98-03fd-4fa5-9de9-0ef15dcde2c4

## 6. Gotchas already paid for. Do not rediscover these.

1. **`backdrop-filter` inside an embedded frame composites unreliably** and does not
   degrade: it takes the whole document down to a blank sheet. Every Lens pane uses it.
   Proven by isolation. This is why the gallery uses rendered captures, not ten live
   frames. Anywhere a Lens page gets embedded, expect this.
2. **The kit payload already ships its own `<style>` tags.** Wrapping it in another
   `<style>` closes the sheet at the inner tag and silently drops the entire system.
   Every page rendered as serif on bare background and passed every structural check
   while doing it. Only screenshots caught it. Screenshot-QA is non-negotiable.
3. **The kit's entrance animation holds `opacity: 0` until it plays**, and embedded
   frames throttle animations, stranding sections invisible. Neutralise for previews only.
4. **Accent contrast, fixed 2026-08-19, PROPOSED and revertable.** `lens-kit.css`
   painted raw `#DC6843` as text in 16 light-surface rules at 2.36:1, failing every
   gate including large-text. `globals.css` already had the fix and the comment.
   Added `--sai-accent-text: #8F3616`. If Alec dislikes it, revert that commit alone.
5. **Do not promise a live sync into a hosted practice management system.** The site's
   own FAQ calls that overselling, and the ReExam playbook says API access is
   partner-gated. Export-driven only.
6. **Kit rules outrank a single class.** The kit styles the night surface as
   `section.sai-night`, which is element plus class. A fragment styling its own night
   section with one class silently loses every declaration. Symptom in round 5: the night
   deck's hero padding never applied and its eyebrow ran under the fixed dock. Use
   `section.your-class`.
7. **The kit has no night variant for `.sai-btn`.** Primary is ink on the night gradient,
   which is nearly invisible, and ghost is a 62% white pill that reads as a grey lozenge.
   Round 5 fixes this once in `round-5/_parts/widgets.css`. Any new surface that puts a
   button on dark needs the same treatment.
8. **`build.py` used to read four uncommitted `_*.part` sidecars** and died on a fresh
   clone before building anything. Fixed 2026-08-20: it sources the kit, fonts, scene and
   logo from `brand-assets/stephens-ai-lens-v3/inline_kit.py`, the one authoritative
   definition. Do not reintroduce generated sidecars. `shot.js` needs `npm install
   playwright --no-save` first; the browser is already at `/opt/pw-browsers`.
9. **This environment's egress proxy blocks WebFetch and curl to every external domain.**
   Only WebSearch snippets get through, so no primary source can be read. Any research
   done here is search-summary grade and every number needs one confirming fetch from an
   unblocked machine. This is why the insurance research carries an 80% caveat.

## 7. Open questions, in priority order

1. **Product 3 framing, not replacement.** Decided: keep the time off and payroll
   build as the proof, and widen the hook to *the admin that runs on spreadsheets*:
   time off, hours, and commission. The sharpest addition is an **optician commission
   calculator** — optometry-specific, export-driven, a math problem rather than a
   behaviour problem, and commission disputes are genuinely contentious.
   Two things ruled out, with reasons:
   - **No PMS-to-payroll live sync.** Our own FAQ calls that overselling and the ReExam
     playbook says API access is partner-gated. Export-driven only, like ReExam.
   - **No shift scheduling.** It is a behaviour problem, and our whole positioning is
     that we fix information problems. Gabe is already on record that the hard part is
     getting people into the habit of using a tool they only have to open.
   Cheap validation, free: add one question to the ReExam discovery calls already being
   booked: *"walk me through how you calculate optician commission each month."* Ask it
   alongside the insurance questions in `research/insurance-verification-viability.md`
   section 7, not instead of them. Same 5 calls, both sets of questions.

   possible second vertical and does not go on the optometry site. The interview produced
   one strong signal, insurance checking, which was researched separately and answered in
   `research/insurance-verification-viability.md`.

   **The verdict: do not build an insurance verification product.** Not a tool, not a
   service, not a connector. The market is served below our price points by vendors we
   cannot outrun, including the payer's own software arm, and one of them shipped into
   RevolutionEHR in July 2026. Verification also fails silently 30 to 60 days later with a
   dollar figure attached, which is a categorically worse risk class than anything we sell,
   and it would cost us the "no patient records in it" line that is the sharpest trust asset
   on the site.

   **What to build instead, and it is cheap:** an insurance content pack inside product 1.
   Per-payer "find the patient without a member ID" pages, a 5th decision lookup for vision
   against medical routing, VSP authorization discipline as a written protocol, and a
   "what does your current software already do" inventory as an onboarding step. Zero payer
   rail, zero patient records, no architecture change. See section 4 of that document.

   **Before anything gets built, 3 free checks**, in order: the 5 discovery calls, a 20
   minute lookup of the vision payers on a free clearinghouse account (2 research lenses
   asserted opposite answers about VSP citing the same page and neither could open it), and
   one question to Gabe. The document lists the 8 call questions and the 4 conditions that
   would have to hold, all of them, to flip the answer back to build.

3. **Ask Gabe two things:** permission to name the practice, and an actual endorsement.
   Nothing on record works as a testimonial. Best question to ask him: *what does the
   front desk do differently now than in June?*
4. **Naming incumbent vendors publicly.** Real, dated, public reviews exist. Business
   call with legal texture, unresolved. Current rule: at most one quote, by role and
   date, never a vendor name in a headline.
5. **Tier caps** (30 pages tier 1, 70 pages and 6 lookups tier 2) are on the live site
   but absent from every prototype, because the brief's facts table omitted them.
   One line of copy to restore once confirmed.
6. **Custom builds pricing**, if that section ever returns: currently "scoped on the call".

## 7a. Review panel findings, 2026-08-20

Two simulated reviewers, a practice owner and a senior designer, read all ten rendered
pages. Twenty reviews, in the artifact linked above. Three findings recurred hard enough
to act on, and the first two are the real output of the exercise.

1. **8 of 10 owners stopped on the tier pricing.** Tier 1 is $2,500 setup and $299 a
   month; tier 2 is $3,500 setup and $250 a month, so the more expensive tier is cheaper
   monthly. Every owner who noticed read it as a typo, and several said it was the thing
   they would email about before agreeing to a call. **This is the real price list, not a
   prototype bug.** Either explain it in the row or reprice, but do not leave a buyer
   doubting the numbers.
2. **9 of 10 designers said the bullets came back in costume.** Prose was cut, but
   list-shaped content returned as tick flags, status chips, spec rows and table cells.
   One page carries seven status chips in a row. The "less text" instruction was
   half-honoured: words went down, things-to-read did not.
3. **3 owners asked, unprompted, who pulls the patient list each month.** Same
   export-versus-live-sync question that settled product 3, now corroborated from the
   buyer side. The answer is good; it is simply not on the page.

Treat these as a structured pass, not customer research. The reviewers are AI. The five
discovery calls still need to happen, and these findings sharpen what to ask.

## 8. Hard content rules

No em dashes. Never gender a staff role. Numerals not spelled-out numbers. Only facts
from the briefs' tables. No vendor-math benchmark printed as fact, and the ~$285
revenue-per-exam figure **includes optical** and must say so if used at all. No ROI
calculator pre-filled with our numbers. Testimonial quotes must be character-identical
to `BRIEF-ROUND-2.md` section 2, attributed by role, with no name, practice or city.
