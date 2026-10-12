import { ButtonLink } from "@/components/ui/button";
import { DepthHero } from "./hero-depth";
import { HeroAmbient } from "./hero-ambient";
import { HOME_EN, type HomeCopy } from "@/lib/content";

/**
 * The v7 hero, Orgo's order: who it is for, a short headline, one sentence,
 * two buttons, the proof line, then the work itself in one window.
 * The copy never animates; the window is the one moving thing.
 */
export function Hero({
  visual,
  copy = HOME_EN.hero,
  cta = HOME_EN.cta,
  windowCopy = HOME_EN.heroWindow,
}: {
  visual?: React.ReactNode;
  copy?: HomeCopy["hero"];
  cta?: HomeCopy["cta"];
  windowCopy?: HomeCopy["heroWindow"];
}) {
  return (
    <section className="v7-hero" style={{ position: "relative", isolation: "isolate" }}>
      <HeroAmbient />
      <div className="v7-hero-copy">
        <p className="t-label">{copy.kicker}</p>
        <h1 className="v7-head">
          {copy.headline.lead}{" "}
          <span className="text-accent-display">{copy.headline.accent}</span>
        </h1>
        <p className="v7-sub">{copy.sub}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href={cta.href} external>
            {cta.label}
          </ButtonLink>
          <ButtonLink href={copy.secondary.href} variant="ghost">
            {copy.secondary.label}
          </ButtonLink>
        </div>
      </div>
      <div className="v7-hero-window">{visual ?? <DepthHero copy={windowCopy} />}</div>
    </section>
  );
}
