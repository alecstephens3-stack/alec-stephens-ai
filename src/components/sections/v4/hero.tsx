import { ButtonLink } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { HERO } from "@/lib/content";
import { ProductDepiction } from "./product-depiction";

export function Hero() {
  return (
    <section className="relative px-5 pb-4 pt-[104px] md:px-8 md:pb-8 md:pt-[150px]">
      <div className="mx-auto grid w-full max-w-[1080px] items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
        <div>
          <AnimateOnScroll>
            <h1 className="font-heading text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink sm:text-[42px] md:text-[52px]">
              {HERO.headline.lead}{" "}
              <span className="text-accent-display">{HERO.headline.accent}</span>{" "}
              {HERO.headline.tail}
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={80}>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.62] text-ink-2 md:text-lg">
              {HERO.sub}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={160}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={HERO.primaryCta.href}>
                {HERO.primaryCta.label} &rarr;
              </ButtonLink>
              <ButtonLink href={HERO.secondaryCta.href} variant="ghost" external>
                {HERO.secondaryCta.label}
              </ButtonLink>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={220}>
            <p className="mt-7 flex items-start gap-2.5 text-[14.5px] leading-[1.5] text-ink-2">
              <span
                aria-hidden="true"
                className="mt-[3px] h-[15px] w-[3px] shrink-0 rounded bg-accent"
              />
              {HERO.trustLine}
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay={120}>
          <ProductDepiction />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
