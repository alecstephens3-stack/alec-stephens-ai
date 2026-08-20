# Prototype brief: multi-product site for cold outreach to eyecare practices

Shared source of truth for the ten prototype landing pages in this folder.
Everything a prototype says must be traceable to this file.

---

## 1. Why we are redesigning

The current site (v4, live) sells **one** thing: the front desk knowledge base.
We now want to show a **catalogue of products**, because the site is the landing
page at the end of a cold email to an independent eyecare practice, and different
practices bite on different problems.

The page has about sixty seconds to do four things:

1. Prove in the first paragraph that we have actually stood at an optometry front desk.
2. Show the products, plainly, with prices.
3. Answer the two objections every practice owner has: *is this HIPAA trouble* and
   *does this connect to my practice management system*.
4. Make "book a 20 minute call" the obvious next step.

Audience: owners and office managers of independent optometry practices in the US,
roughly one to three locations and ten to forty staff. Non-technical, busy, and
pitched by vendors constantly. They are reading this on a phone between patients.

---

## 2. The three products

### P1. Front desk knowledge base (the flagship, live today)

A searchable knowledge base holding the insurance rules, prices, and protocols the
front desk currently keeps in their heads. Live in a 27 person practice with 6 to 7
doctors at one location.

- Situation pages the team can find mid call, one search box.
- Decision lookups for the calls that cost money: how soon a caller needs to be seen,
  which doctor can see them, whether to collect or bill the refraction, and this
  year's price.
- The office manager edits it in the app. Every edit is saved and reversible.
- Google sign in, restricted to the practice domain. Installs from the browser on the
  front desk computers, no admin rights. Pages already opened keep working if the
  internet drops.
- One click for staff to flag a page that is wrong.
- **Holds no patient records.**

### P2. Recall done for you (the new one, the reason for this redesign)

We run the practice's monthly patient recall for them, using the practice's own recall
protocol and its own systems.

What the job actually is today, from a real practice's written protocol:

- Run the scleral letters.
- Run the medical recall letters, across roughly ten separate medical recall reason
  codes, output as postcards.
- Run the calls list and the routine postcards, **once per doctor, individually**.
  At a practice with eight providers that is eight separate runs.
- Then, only after every call and postcard is finished, go back and run the update
  step so the same patients are not pulled again next month.

Two things make it fragile. The update step is a checkbox that has to be left
unchecked on one run and checked on another, and getting it backwards either
double contacts patients or drops them. And it is a monthly job sitting on the same
checklist as the daily work, so it is the first thing to slip when the phones are busy.

What the practice gets:

- The run happens on a schedule instead of when someone finds an afternoon.
- The call list arrives ready to work, in priority order, with the answers to the
  questions patients ask when they call back.
- A monthly report: who was contacted, by which channel, and who booked.
- The update step gets done, every time, in the right order.

**Honest limits, and these must appear on the page.** It does not plug into the
practice management system. We work from a list the practice's own team runs, or
inside their system with a limited login the practice creates and can revoke.
Unlike the knowledge base, recall does involve patient contact information, so it
runs inside the practice's own accounts under a signed BAA, and we never touch
charts. Do not repeat the flagship's "no patient data" line across the whole site.
**Data posture is now per product.** Say it per product.

### P3. Practice operations automation

Time off and payroll, automated and scoped to the practice. Returns 60 to 100 admin
hours a year at the practice we built it for. Plus a quarterly practice snapshot and
monthly working time with both founders.

---

## 3. Facts you may use. Nothing else.

Do not invent a number. If a number is not on this list, do not put it on the page.

| Fact | Value |
| --- | --- |
| Live practice size | 27 people, 6 to 7 doctors, one location |
| Front desk situations mapped | 76 |
| Decision lookups built | 4 |
| Admin hours returned by the time off build | 60 to 100 a year |
| Patient records in the knowledge base | 0 |
| Time to live | 30 days |
| Tier 1, front desk knowledge base | $2,500 setup, $299 a month |
| Tier 2, whole practice knowledge base | $3,500 setup, $250 a month (this is where we would start you) |
| Tier 3, knowledge base plus operations | $4,500 setup, $350 a month |
| Extra sections beyond a tier cap | $600 each |
| Second location | $1,500 setup, $149 a month |
| Training platform comparison | Trainual and Whale run about $249 to $300 a month at this size and still hand you an empty system |
| Recall runs per month at an eight provider practice | 8 separate call and postcard runs, plus scleral, plus medical, plus the update run |
| Medical recall reason codes in the real protocol | about 10 |
| Founders | Alec Stephens and Jusheen Kim. Jusheen was a lead software engineer at J.P. Morgan. Alec spent the last year inside a 27 person eyecare practice |
| Support reality | Both founders are based in Asia. Urgent issues answered by the next business morning, US time |
| Contract | Month to month, no term, keep every page on cancellation, export any time |

**Pricing for recall done for you has not been set.** Do not print a price for it.
Show it as "priced per practice, on the call" or fold it into tier 3. Never guess.

**Do not name the client practice.** The reference has not signed off yet. Say
"a 27 person practice" or "the practice we built this for".

---

## 4. Voice rules. These are house rules and they are not negotiable.

- Plain language. Short sentences. Write like a person who has done the job.
- **No em dashes anywhere in visible copy.** Use a comma, a full stop, or a colon.
- No invented numbers, ever.
- No tool or vendor names in buyer facing lines. Not the practice management system
  we build against, not the framework, not the AI model. The one exception is the
  competitor comparison in the facts table.
- **Never gender a staff role.** Not "she at the front desk", not "his office manager".
  Use they, or the role name.
- The product is a **knowledge base**. Never call it a playbook, a wiki, or a portal.
- No hype adjectives: no revolutionary, seamless, cutting edge, game changing, unlock,
  supercharge, empower.
- No fake urgency, no countdown, no "limited spots".
- Do not promise revenue outcomes for recall. We have no recovery rate to quote.
  Sell the mechanism and the reliability, not a dollar figure.

---

## 5. Brand: "Lens" v3

The current design system. Some prototypes stay inside it, some deliberately break it.
Your assigned direction says which.

**Palette**
```
Sky (page bg)      linear-gradient(180deg,#F3EEE8 0%,#F7E7DA 42%,#F7DCC9 74%,#F2CFB8 100%)
Sky fallback       #F5E9DE
Night              radial-gradient(130% 130% at 22% -12%,#241B15 0%,#150F0B 58%,#0D0A08 100%)
Ink (body text)    #171310
Ink secondary      #5A4F46   <- the lightest secondary allowed on light. Never lighter.
Cream (on dark)    #F5F1E8
Cream secondary    #B3AB9E
Accent             #DC6843   MARK ONLY: bullets, rules, bars, dots. 2.36:1, never carries text.
Accent display     #C55532   accent-coloured text at 24px and above
Accent deep        #8F3616   accent-coloured text below 24px on light
Accent on night    #FF8E76
Status good/warn/bad on light   #2E7A56 / #946A12 / #B23A2F
Hairline rule      rgba(23,19,16,0.10)
Glass pane         rgba(255,255,255,0.55) + backdrop-filter: blur(20px) saturate(1.35)
Glass edge         rgba(255,255,255,0.85)
Pane shadow        0 14px 44px rgba(112,62,40,0.13), inset 0 1px 0 rgba(255,255,255,0.95)
```

**Type**
- Inter Tight for headings and body. Schibsted Grotesk for uppercase labels and eyebrows.
- Body 17px minimum. Nothing below 13px. Labels 13.5px minimum.
- Headings: medium weight (500), tight tracking (-0.025em), line height about 1.08.

**Radii**: 8 / 10 / 18 / 22 / 26 / 30px. Buttons are pills (999px).

**Motion**: cubic-bezier(0.2, 0.8, 0.2, 1), 150/220/350ms. Honour prefers-reduced-motion.

**Contrast is a hard gate.** Body and secondary text must clear 4.5:1 against whatever
is actually behind it, including gradient backgrounds at their darkest point. Large
text (24px+ or 19px+ bold) must clear 3:1. If you are unsure, go darker.

---

## 6. Technical rules for the prototype file

Each prototype is **one self-contained HTML file** that gets published as an Artifact.

- **Write page content only.** No `<!DOCTYPE>`, no `<html>`, no `<head>`, no `<body>`
  tags. The publisher wraps the file. Start with `<title>`, then `<meta name="viewport"
  content="width=device-width, initial-scale=1">`, then `<style>`, then the content.
- **Self-contained.** All CSS inline in a `<style>` block, all JS inline in a `<script>`
  block. No external files. A strict CSP blocks every external host **except Google
  Fonts** (`fonts.googleapis.com` and `fonts.gstatic.com`), which you may link. Always
  give a real fallback font stack.
- **No images from anywhere.** No remote URLs, no placeholder services. Draw everything
  you need as inline SVG or CSS. Headshots become initials in a circle. Screenshots
  become hand-built HTML mock ups (this is more convincing anyway, see the existing
  `src/components/sections/v4/product-depiction.tsx`).
- **No emoji as icons.** This is a healthcare B2B page. Inline SVG only, currentColor,
  1.6 stroke width, 16 to 24px.
- **Commit to one look.** Set `color-scheme` on `:root` and paint `body` background and
  colour explicitly, so the viewer's dark mode cannot bleed through. Do not write
  `prefers-color-scheme` blocks. Style form controls explicitly for the same reason.
- **Responsive.** Must be usable at 360px wide. No horizontal page scroll ever. Wide
  things (tables, code, diagrams) scroll inside their own `overflow-x:auto` container.
  Tap targets 44px minimum.
- **Accessible.** Real landmarks and heading order, `alt`/`aria-label` on meaningful
  SVG, `aria-hidden` on decorative SVG, visible focus rings, keyboard operable
  interactions.
- Any JS must be vanilla, defensive, and degrade to a readable page if it throws.
- Target under 90KB.

### The prototype banner

Every prototype opens with this exact strip, above everything else, so Alec knows what
he is looking at. It is review furniture, not part of the design. Keep it visually
separate from the page below it.

```html
<div class="proto-bar">
  <span class="proto-n">Prototype 03 of 10</span>
  <span class="proto-name">The name of the direction</span>
  <span class="proto-bet">The one line bet this design is making.</span>
</div>
```

Style it neutrally: dark grey `#1c1c1e` background, `#f2f2f2` text, 13px, small caps
label, full width, about 44px tall, sticky at the top. It should read as a tool chrome
bar, not as part of the site.

---

## 7. Required content coverage

Whatever the concept, the page must cover all of this somewhere, in whatever form the
concept dictates:

1. A hero that names the audience (independent eyecare practices) in the first breath.
2. **All three products**, each with what it is, who it is for, and a depiction.
3. At least one hand built product depiction with real looking content, not a grey box.
4. Proof: 27 person practice, live, 76 situations, 4 lookups, the founders.
5. Prices for the three tiers, and the honest note that recall is priced on the call.
6. The two objections answered: patient data posture (per product), and the fact that
   it does not connect to the practice management system, and why that is on purpose.
7. Both CTAs: book a 20 minute call (`https://calendly.com/alecpstephens/30min`) and
   email `alec@stephensai.co`.
8. A footer with Stephens AI, both founder names, and the email.

Every prototype ships all seven. What changes between prototypes is the **order, the
emphasis, and the argument**, not the completeness.
