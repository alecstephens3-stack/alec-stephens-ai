import { ButtonLink } from "@/components/ui/button";
import { DepthHero } from "./hero-depth";
import { HOME_EN, type HomeCopy } from "@/lib/content";

/**
 * The v7 hero, layout C "survey split" (Alec's pick, 2026-11-10, from four
 * layered versions in artifacts/design-previews-2026-11-09/layering.html).
 *
 * Back: survey lines around the hill the window sits on, the logo's dot on
 * its top. Middle: the product window, running off the right edge. Front: the
 * words on the left, and one answer card hanging over the window's lower edge.
 * The headline is all ink so the deep terracotta button owns the colour on the
 * first screen (button colour pick, same day). The side threads (HeroAmbient)
 * are retired with this layout; they are in git history.
 *
 * Under 1100px it stacks: words first (left-aligned), then the window as before.
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
    <section className="v7-hero v7-hero--split" style={{ position: "relative", isolation: "isolate" }}>
      <div className="v7-hero-copy">
        <p className="t-label">{copy.kicker}</p>
        <h1 className="v7-head">
          {copy.headline.lead} {copy.headline.accent}
        </h1>
        <p className="v7-sub">{copy.sub}</p>
        <div className="v7-hero-btns mt-8 flex flex-wrap items-center gap-3">
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
