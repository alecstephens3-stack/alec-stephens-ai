# Corrected product brief: ReExam (replaces "recall done for you")

Supersedes the recall section of `BRIEF.md` entirely. That section was
reconstructed from the client's Compulink recall protocol because the real package
was not reachable. It was wrong. This file is built from the actual product
materials and is the only source for recall content from here on.

Alec's ruling: ReExam is **product #2 on the Stephens AI site**.

---

## 1. What it actually is

A done-for-you patient reactivation service for independent optometry practices.
**A service with software inside, not software.**

Every month we pull the practice's overdue-patient list from their practice
management system, clean it, run a multi-touch SMS and email sequence on rules
tuned to that practice, watch the replies, and hand the owner a one-page report:
patients contacted, replies, exams booked, estimated revenue recovered.

The practice's team does almost nothing: approve the message templates once,
produce a monthly export, and handle the patients who book.

**Working name is ReExam.** Not final. Flag it if a page leans hard on the name.

## 2. The offer. These numbers are real, use them.

| Item | Value |
| --- | --- |
| Price | **$600 a month, flat** |
| Contract | **None. Cancel monthly. No setup fee.** |
| Beta | First 3 practices only: **$300 a month locked for 6 months**, for a testimonial and case-study rights |
| Guarantee, exact wording, never reworded | **"5+ exams booked from patients we contacted, within 30 days of the first message sent, or that month is free."** |
| Guarantee gate | Offered only at **1,000+ contactable lapsed patients**. 500 to 1,000 gets list price and no guarantee. Below 500 we decline |
| Guarantee clock | Starts at **first send**, not at signing. Onboarding and number verification take about 2 weeks |
| Live in | **10 business days** from kickoff |
| Upsell, only after recall delivers | Owner KPI dashboard **+$250/mo** |

The guarantee wording is contractual. Copy it character for character or leave it
out. Do not soften it, tighten it, or split it across two lines of copy.

## 3. How it runs, for the depiction

Onboarding: kickoff, BAA signed before any data moves, de-confliction with their
existing tool, data intake, qualification gate, list hygiene pass, rules and
templates workshop, plumbing, soft launch at 50 patients.

The default sequence, six touches over about six weeks, stopping the moment a
patient books, replies, or opts out:

| Day | Channel | What it says |
| --- | --- | --- |
| 0 | SMS | You are due for your eye exam. Book, or reply YES for a call |
| 3 | Email | Short personal note from the doctor, same ask |
| 10 | **Email only** | The benefits angle. Most vision plans cover an exam every 12 months |
| 17 | SMS | Care-framed nudge |
| 28 | SMS | Last text, and it says so |
| 42 | Email | Final note, easy opt out |

Day 10 is email only and that is a compliance rule, not a preference. See §5.

The list hygiene pass is itself a deliverable: "we found 62 duplicates and 3
people your software has been texting who were never patients."

## 4. Why custom rules are the product

The honest wedge, and the "we already have software" answer. Their tools blast
fixed templates. We build per-practice rules the vendors will not:

- exam-type intervals: comprehensive vs contact lens fitting vs medical follow up
- contact lens supply runout timing, so the reach out lands when the last box runs dry
- January benefits-reset campaigns
- family batching, so one text to a parent books three children
- exclusion logic the tools get wrong: deceased, moved, already collected glasses, do not contact
- the practice's own voice, approved by the owner

Plus the two things no tool ships: a human accountable for the outcome, and a
report the owner actually reads.

**We run alongside whatever they already have. Never require a rip-out.**
"Keep your phone system. We will work the list it ignores."

## 5. Compliance, and it belongs on the page

This is a trust product sold to a cautious buyer, so the constraints are selling
points, not fine print.

- **HIPAA:** the practice is the Covered Entity, we are the Business Associate. BAA
  signed before any patient data moves. Patient data stays in the practice's own
  systems. Our own inboxes hold counts and a link, never patient names.
- **TCPA:** SMS carries care-framed messages only. Anything benefits-flavoured or
  marketing-adjacent goes by email, which is why day 10 is email. Numbers older
  than 12 months get checked against the Reassigned Numbers Database every
  campaign. Any reasonable opt out is honoured within 10 business days, kills every
  message type, and propagates both ways with their existing tool.
- **Send window:** 10am to 7pm in the patient's local time, weekdays by default.
- One operator works from South Korea. HIPAA permits it and we disclose it plainly
  rather than waiting to be asked.

## 6. The competitive frame

Practices already pay **$249 to $407 a month** for engagement software, on one to
two year terms, with reported termination fees of **$3,200 to $3,500**, and recall
still misfires.

**The claim we must never make is "nobody does recall."** They ship recall modules.
One competitor sells patient reactivation as dedicated software. The defensible
claim is narrower and stronger: those modules run fixed rules nobody inside the
practice tunes, they misfire in documented revenue-costing ways, and nobody is
accountable for the outcome.

Real, public, dated, verbatim reviews are available as evidence. The strongest:

> "Demandforce failed to convert over 500 clients that were overdue for reminders,
> and stopped sending reminders to those clients for almost 2 years. The office lost
> a lot of income because of this."
> — Office Manager, Capterra review, 2020-02-18

> "After a decade we still have to mail postcards to patients."
> — Solutionreach customer of 10 years, BBB complaint, 2025-03-12

**Open question for Alec and Jusheen, do not decide it in a prototype:** whether to
name incumbent vendors on a public marketing page. These are public reviews and
quoting them is defensible, but it is a business call with legal texture. Until it
is answered, a prototype may use at most one such quote, attributed to the
reviewer's role, the source, and the date, and must not put a vendor name in a
headline or a comparison table.

## 7. Numbers you may NOT put on a page

The evidence dossier flags these itself. Respect the flags.

- Recall benchmarks (average recall rate, share of the patient book overdue, patient
  lifetime value, attrition) come from vendor content marketing. **Directionally
  consistent, individually soft. Do not print them as fact.**
- Revenue per exam of about $285 **includes optical and contact lens revenue from
  the visit**. Exam fees alone are far lower. If a page uses it at all it must say
  "including optical", never "per exam". Owners know the difference and will catch it.
- No-show percentages and conversion-lift percentages are vendor math. Same rule.
- **Do not build an ROI calculator that ships with our numbers pre-filled.** The
  business plan is explicit that the ROI story gets built from the practice's own
  numbers on the call. A calculator is fine only if every input starts empty or is
  visibly the visitor's to set.

## 8. What replaces the old recall copy

Delete on sight, from every prototype:

- the Compulink report-running story: scleral letters, medical letters, the ten
  reason codes, the per-provider runs, the update step that has to go last
- "priced per practice, on the call" and "no list price yet". **It has a price. $600.**
- any suggestion that the practice runs the reports and we watch

Keep, because it is still true: recall touches patient contact details, so ReExam
runs under a BAA, and the data posture differs from the knowledge base. That is
now a compliance section with real substance rather than a hedge.
