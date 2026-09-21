import { ButtonLink } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { LensHeroStage } from "@/components/lens-hero/lens-hero-stage";
import { HERO } from "@/lib/content";

/**
 * The hero: the lens window, with the eyebrow and headline pinned beneath it so
 * the whole first thought sits on one screen while the lens grows and the desk
 * comes into order. The sentence and the one call to action wait until the pin
 * releases, which is the first thing you scroll into.
 *
 * The crop marks that framed the placeholder are gone: the window's edge is a
 * feather with no border, and two hard brackets against it read as a mistake
 * rather than as registration marks. They still open every other section.
 */
export function Hero() {
  return (
    <>
      <LensHeroStage>
        <p className="t-label">{HERO.kicker}</p>
        <h1 className="lh-head t-display mt-3.5">
          {HERO.headline.lead}{" "}
          <span className="text-accent-display">{HERO.headline.accent}</span>
        </h1>
      </LensHeroStage>

      <section className="px-5 pb-[var(--draft-air)] pt-0 md:px-8">
        <div className="mx-auto max-w-[820px] text-center">
          <AnimateOnScroll>
            <p className="t-body mx-auto max-w-[52ch]">{HERO.sub}</p>
            <div className="mt-10 flex justify-center">
              <ButtonLink href={HERO.primaryCta.href} external>
                {HERO.primaryCta.label}
              </ButtonLink>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
