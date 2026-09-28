import { ButtonLink } from "@/components/ui/button";
import { ToolWindow } from "./tool-window";
import { V7_HERO, V7_CTA } from "@/lib/content";

/**
 * The v7 hero, Orgo's order: who it is for, a short headline, one sentence,
 * two buttons, the proof line, then the work itself in one window.
 * The copy never animates; the window is the one moving thing.
 */
export function Hero({ visual }: { visual?: React.ReactNode }) {
  return (
    <section className="v7-hero">
      <div className="v7-hero-copy">
        <p className="t-label">{V7_HERO.kicker}</p>
        <h1 className="v7-head">
          {V7_HERO.headline.lead}{" "}
          <span className="text-accent-display">{V7_HERO.headline.accent}</span>
        </h1>
        <p className="v7-sub">{V7_HERO.sub}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={V7_CTA.href} external>
            {V7_CTA.label}
          </ButtonLink>
          <ButtonLink href={V7_HERO.secondary.href} variant="ghost">
            {V7_HERO.secondary.label}
          </ButtonLink>
        </div>
        <p className="v7-proof">
          {V7_HERO.proof} <span className="text-ink-2">{V7_HERO.proofCaveat}</span>
        </p>
      </div>
      <div className="v7-hero-window">{visual ?? <ToolWindow />}</div>
    </section>
  );
}
