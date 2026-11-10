import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Section } from "@/components/sections/v6/shell";
import { ClaimStrideHero } from "@/components/sections/claimstride/claimstride-hero";
import { ClaimStrideSteps } from "@/components/sections/claimstride/claimstride-steps";
import { TimeCalculator, FilingDeadline } from "@/components/sections/claimstride/claimstride-tools";
import t from "@/components/sections/claimstride/claimstride-tools.module.css";
import { SITE_URL, V7_CTA } from "@/lib/content";
import { instrument } from "@/components/sections/claimstride/font";
import s from "@/components/sections/claimstride/claimstride.module.css";

/**
 * ClaimStride (rebuilt 2026-11-08, from the portfolio makeover of the same day).
 * The page is Stephens AI's (header, footer, type, buttons, the services switcher);
 * the product frames wear ClaimStride's own look. Every number traces to
 * context/portfolio.md §4 in the vault; the build copy is the portfolio's
 * (artifacts/scrollcraft/builds/alec-portfolio/cases.yaml, claimstride).
 */

const TITLE = "ClaimStride";
const DESCRIPTION =
  "ClaimStride checks each unpaid claim with its insurer and writes the next step, nearest timely filing deadline first. Claims software for eye care and dental practices, by Stephens AI.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/claimstride` },
  openGraph: { title: `${TITLE} by Stephens AI`, description: DESCRIPTION, url: `${SITE_URL}/claimstride` },
  twitter: { title: `${TITLE} by Stephens AI`, description: DESCRIPTION },
};

const FEATURES = [
  {
    k: "Each biller's own board",
    v: "Everyone who works claims sets their own layout and colours, so the board opens the way they work.",
  },
  {
    k: "Notes on every claim",
    v: "A status, a follow-up date and a note sit on each claim, right where the biller works it.",
  },
  {
    k: "Payment files read too",
    v: "ERAs and scanned EOBs are read as well, so a denial shows its codes and what they mean in plain words.",
  },
  {
    k: "Private by design",
    v: "We sign a BAA with the practice before any patient data moves. Only the practice's own people can sign in.",
  },
];

const UNDER = [
  { k: "How it fits together", v: "A FastAPI service. Plain code parses the report and every insurer answer; Claude on AWS Bedrock reads scanned EOBs. Same claim, same status, every run." },
  { k: "Tested", v: "2,596 automated tests." },
  { k: "Cost to run", v: "About 30 cents a check." },
];

const STACK = ["Claude on AWS Bedrock", "Python", "FastAPI", "Stedi API", "X12 276/277", "X12 270/271", "AWS", "pytest"];

function Lockup() {
  return (
    <span className={`${s.lockup} ${instrument.className}`}>
      <svg width="30" height="30" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M46 15 A20 20 0 1 0 34 52" fill="none" stroke="#0E7FA8" strokeWidth="9" strokeLinecap="round" />
        <path d="M34 52 L58 18" fill="none" stroke="#1FB57A" strokeWidth="9" strokeLinecap="round" />
      </svg>
      <span className={s.lockupName}>ClaimStride</span>
      <span className={s.lockupBy}>by Stephens AI</span>
    </span>
  );
}

export default function ClaimStridePage() {
  return (
    <div className={s.page}>
      <section className="v7-hero" style={{ position: "relative", isolation: "isolate" }}>
        <div className="v7-hero-copy">
          <Lockup />
          <h1 className="v7-head">
            Your stuck claims, with the reason and <span className={s.accent}>the next step</span>.
          </h1>
          <p className="v7-sub">
            ClaimStride checks each unpaid claim with its insurer through a clearinghouse, then puts them in front of
            your biller with the next step, nearest timely filing deadline first. For eye care and dental practices.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={V7_CTA.href} external>
              {V7_CTA.label}
            </ButtonLink>
            <ButtonLink href="#how" variant="ghost">
              See how it works
            </ButtonLink>
          </div>
          <p className="v7-proof">Works from your Compulink or Dentrix reports, on a private server under a signed BAA.</p>
        </div>
        <div className="v7-hero-window">
          <ClaimStrideHero />
        </div>
      </section>

      <Section id="how" kicker="How it works" title="From the report you already run to the next step on each claim." titleMax="max-w-[24ch]">
        <ClaimStrideSteps />
      </Section>

      <Section id="try" kicker="Try it" title="Two quick answers, with your own numbers." titleMax="max-w-[22ch]">
        <div className={t.wrap}>
          <FilingDeadline />
          <TimeCalculator />
        </div>
      </Section>

      <Section kicker="On the board" title="Everything the biller needs to work a claim, in one place." titleMax="max-w-[22ch]">
        <div className={s.features}>
          {FEATURES.map((f, i) => (
            <AnimateOnScroll key={f.k} delay={i * 80} className={s.feature}>
              <p className={s.featureK}>{f.k}</p>
              <p className={s.featureV}>{f.v}</p>
            </AnimateOnScroll>
          ))}
        </div>
        <AnimateOnScroll className={s.quote}>
          <figure>
            <blockquote className={s.quoteT}>
              &ldquo;This all reads very accurate&hellip; it really truly gives you everything that you would need at a
              quick glance.&rdquo;
            </blockquote>
            <figcaption className={s.quoteW}>The biller at a Kansas eye clinic, reviewing the board on her own claims</figcaption>
          </figure>
        </AnimateOnScroll>
      </Section>

      <Section kicker="How it's built" title="It works from exported reports, so there's no vendor integration to wait for." titleMax="max-w-[26ch]">
        <AnimateOnScroll className={s.under}>
          <p className={s.underLead}>No electronic answer means a call, never a guess.</p>
          <dl className={s.underGrid}>
            {UNDER.map((u) => (
              <div key={u.k} className={s.underRow}>
                <dt>{u.k}</dt>
                <dd>{u.v}</dd>
              </div>
            ))}
          </dl>
          <ul className={s.chips} aria-label="Built with">
            {STACK.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </AnimateOnScroll>
      </Section>

      <Section>
        <AnimateOnScroll className={s.cta}>
          <p className={s.ctaH}>Now in early access for eye care and dental practices.</p>
          <p className={s.ctaT}>
            It starts with a free 30-minute call, and you keep the written map of what we find.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={V7_CTA.href} external>
              {V7_CTA.label}
            </ButtonLink>
            <ButtonLink href="/alec" variant="ghost">
              See what else we&apos;ve built
            </ButtonLink>
          </div>
        </AnimateOnScroll>
      </Section>
    </div>
  );
}
