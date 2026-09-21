import { ButtonLink } from "@/components/ui/button";
import { LensHeroStage } from "@/components/lens-hero/lens-hero-stage";
import { HERO } from "@/lib/content";

/**
 * The hero, as one pitch: the window, who it is for, the headline, the proof
 * line, then plainly what we build and one thing to do.
 *
 * No scroll behaviour. The window is an ordinary block and the page scrolls
 * past it. Sized so that at 1440 x 900 the nav, the window, the whole headline,
 * the proof line and the start of the statement are all on the first screen.
 *
 * No AnimateOnScroll in here on purpose: the hero is the one moving thing on
 * the page, and the copy beside it should be there the instant the page paints.
 */
export function Hero() {
  return (
    <section className="lh-hero">
      <LensHeroStage>
        <p className="t-label">{HERO.kicker}</p>
        <h1 className="lh-head t-display mt-3.5">
          {HERO.headline.lead}{" "}
          <span className="text-accent-display">{HERO.headline.accent}</span>
        </h1>
        <p className="lh-proof">
          {HERO.proof.lead} <span className="lh-proof-caveat">{HERO.proof.caveat}</span>
        </p>
      </LensHeroStage>

      <div className="lh-statement">
        <p className="lh-statement-big">{HERO.statement}</p>
        <p className="t-body mx-auto mt-5 max-w-[54ch]">{HERO.statementSub}</p>
        <div className="mt-9 flex justify-center">
          <ButtonLink href={HERO.primaryCta.href} external>
            {HERO.primaryCta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
