import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { ClaimStrideHero } from "@/components/sections/claimstride/claimstride-hero";
import { SITE_URL, V7_CTA } from "@/lib/content";
import { instrument } from "@/components/sections/claimstride/font";
import s from "@/components/sections/claimstride/claimstride.module.css";

/**
 * ClaimStride, short for now (Alec, 2026-10-13): the homepage's hero, nothing else.
 * The page is Stephens AI's (header, footer, type, buttons); the product window
 * wears ClaimStride's own look.
 */

const TITLE = "ClaimStride";
const DESCRIPTION =
  "ClaimStride reads your aging report, ERAs and EOBs, then puts each unpaid claim in front of your biller with the reason and the next step, soonest deadline first. For eye care and dental practices.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/claimstride` },
  openGraph: { title: `${TITLE} by Stephens AI`, description: DESCRIPTION, url: `${SITE_URL}/claimstride` },
  twitter: { title: `${TITLE} by Stephens AI`, description: DESCRIPTION },
};

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
    <section className={`v7-hero ${s.page}`} style={{ position: "relative", isolation: "isolate" }}>
      <div className="v7-hero-copy">
        <Lockup />
        <h1 className="v7-head">
          Your stuck claims, with the reason and <span className={s.accent}>the next step</span>.
        </h1>
        <p className="v7-sub">
          ClaimStride reads your aging report, ERAs and EOBs, then puts each unpaid claim in front
          of your biller, soonest deadline first. For eye care and dental practices.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={V7_CTA.href} external>
            {V7_CTA.label}
          </ButtonLink>
          <ButtonLink href="/#how" variant="ghost">
            How we work
          </ButtonLink>
        </div>
        <p className="v7-proof">Works from your Compulink or Dentrix reports, on a private server under a signed BAA.</p>
      </div>
      <div className="v7-hero-window">
        <ClaimStrideHero />
      </div>
    </section>
  );
}
