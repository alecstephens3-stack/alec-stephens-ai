import { ButtonLink } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { HERO } from "@/lib/content";

/**
 * The hero: a small framed object with a lot of air around it, the headline
 * beneath it, one thing to do. In the spirit of the top of shwn.design, where
 * the visual is about 600px wide and the rest of the screen is empty.
 */
export function Hero() {
  return (
    <section className="px-5 pb-[var(--draft-air)] pt-[120px] md:px-8 md:pt-[168px]">
      <div className="mx-auto max-w-[820px] text-center">
        {/*
          HERO_SLOT — the new hero visual mounts here (artifacts/lens-hero,
          built separately). 600 x 400 on desktop, its own taller crop on a
          phone. Until then this is a neutral warm block at the right size, so
          the page's spacing is the real spacing.
        */}
        <AnimateOnScroll>
          <div className="mx-auto w-full max-w-[600px] px-1">
            <div className="draft-crop-frame">
              <div
                id="hero-slot"
                data-hero-slot="lens-hero"
                role="img"
                aria-label="Hero visual, in progress"
                className="draft-hero-slot grid aspect-[4/5] w-full place-items-center sm:aspect-[3/2]"
              >
                <span className="t-label opacity-45">{HERO.slotLabel}</span>
              </div>
            </div>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80}>
          <p className="t-label mt-[var(--draft-air-tight)]">{HERO.kicker}</p>
          <h1 className="t-display mx-auto mt-5 max-w-[15ch] text-balance">
            {HERO.headline.lead}{" "}
            <span className="text-accent-display">{HERO.headline.accent}</span>
          </h1>
        </AnimateOnScroll>

        <AnimateOnScroll delay={160}>
          <p className="t-body mx-auto mt-7 max-w-[52ch]">{HERO.sub}</p>
          <div className="mt-10 flex justify-center">
            <ButtonLink href={HERO.primaryCta.href} external>
              {HERO.primaryCta.label}
            </ButtonLink>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
