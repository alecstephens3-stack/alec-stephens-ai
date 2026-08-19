# stephensai.co

Marketing site for Stephens AI, a two-person consultancy that builds front-desk
knowledge systems for independent eyecare practices. Next.js 16, React 19,
TypeScript, Tailwind v4, deployed on Vercel.

**Live:** https://stephensai.co

---

## Why this repo is worth a look

It is a small site, but a few decisions in here are the interesting part.

**Copy is data, not markup.** Every string on the page lives in
[`src/lib/content.ts`](src/lib/content.ts) as typed objects. Sections import what they
need and render it. Rewriting the pitch never means touching a component, and the
positioning can be reviewed as one file instead of hunted across a dozen JSX trees.
The site has been through four full copy rewrites without a layout change.

**The background is CSS, not a library.** [`scene.tsx`](src/components/ui/scene.tsx)
renders the house visual identity, a warm-sky gradient with drifting glass lenses
on three depth-of-field tiers, in pure CSS keyframes with no canvas, no WebGL,
and no animation dependency. It mounts once in the root layout behind a
`z-1` content wrapper, and `prefers-reduced-motion` is honored globally.

**A design system, not utility soup.**
[`lens-primitives.tsx`](src/components/ui/lens-primitives.tsx) exports the six
reusable explainer components the brand is built on (`Porthole`, `BracketStamp`,
`TickFlag`, `BubbleList`, `NightWindow`, `DayWindow`) so a new section composes
from named pieces instead of re-deriving the look in Tailwind classes.

**The contact form actually reports failure.** This is the bug I care most about
having caught. The Resend SDK does not throw on an API error; it returns
`{ data, error }`. The obvious implementation, `await resend.emails.send(...)`
followed by a success response, tells every visitor "Message sent" while the mail
is being rejected. On a site whose only conversion is that form, that is silent
lost revenue. [`route.ts`](src/app/api/contact/route.ts) branches on the error
explicitly, and also carries per-IP rate limiting, a honeypot field, field length
caps, and a deliberate fallback sender with the reasoning written down next to it.

Also here: generated [`sitemap.ts`](src/app/sitemap.ts) and
[`robots.ts`](src/app/robots.ts), full OpenGraph metadata driven off the same
content module, and self-hosted Google fonts through `next/font`.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router), React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4, CSS custom properties for design tokens |
| Email | Resend |
| Hosting | Vercel |
| Type | Fully static except the contact route |

## Running it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Optional environment variables. The form degrades to a clear error rather than
failing silently when they are absent:

```
RESEND_API_KEY=         # required for the contact form to send
CONTACT_FROM_EMAIL=     # verified sender; falls back to the Resend sandbox address
```

## Layout

```
src/
  app/
    layout.tsx           root layout, fonts, metadata, Scene mount
    page.tsx             single-page composition
    api/contact/route.ts form handler: validation, rate limit, honeypot, Resend
    sitemap.ts robots.ts generated from the content module
  components/
    sections/v4/         hero, body, product depiction, pricing, contact, shell
    ui/                  lens-primitives, scene, button, contact-form, animate-on-scroll
    layout/              header, footer
  lib/
    content.ts           all site copy as typed data
```

## Notes

The site is deliberately one page. The buyer is an office manager at an
independent practice who is reading on a phone between patients, so the whole
argument has to survive a single scroll.

Built by [Alec Stephens](https://stephensai.co) and Jusheen Kim.
