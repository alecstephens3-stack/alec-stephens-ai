import { ButtonLink } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Porthole, TickFlag } from "@/components/ui/lens-primitives";
import { HERO, QUOTE } from "@/lib/content";

export function Hero() {
  return (
    <section className="relative px-5 pb-6 pt-[104px] md:px-8 md:pb-10 md:pt-[150px]">
      <div className="mx-auto grid w-full max-w-[1080px] items-center gap-10 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:gap-14">
        <div>
          <AnimateOnScroll>
            <Porthole className="mb-5">{HERO.kicker}</Porthole>
            <h1 className="font-heading text-[36px] font-medium leading-[1.06] tracking-[-0.028em] text-ink sm:text-[44px] md:text-[56px]">
              {HERO.headline.lead}{" "}
              <span className="text-accent-display">{HERO.headline.accent}</span>
            </h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={80}>
            <p className="mt-6 max-w-[58ch] text-[17px] leading-[1.62] text-ink-2 md:text-lg">
              {HERO.sub}
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll delay={160}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href={HERO.primaryCta.href} external>
                {HERO.primaryCta.label}
              </ButtonLink>
              <ButtonLink href={HERO.secondaryCta.href} variant="ghost">
                {HERO.secondaryCta.label} &rarr;
              </ButtonLink>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={220}>
            <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-heading text-[30px] font-medium leading-none tracking-[-0.03em] text-accent-deep md:text-[34px]">
                {HERO.result.big}
              </span>
              <span className="text-[15px] leading-[1.5] text-ink-2">{HERO.result.rest}</span>
            </p>
            <p className="mt-4 flex items-start gap-2.5 text-[14.5px] leading-[1.5] text-ink-2">
              <span
                aria-hidden="true"
                className="mt-[3px] h-[15px] w-[3px] shrink-0 rounded bg-accent"
              />
              {HERO.trustLine}
            </p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll delay={120}>
          <figure className="sai-pane-strong m-0 rounded-card p-7 md:p-8">
            <Porthole className="mb-4">{QUOTE.kicker}</Porthole>
            <blockquote className="m-0">
              <p className="font-heading text-[21px] font-medium leading-[1.35] tracking-[-0.012em] text-ink md:text-[24px]">
                <span className="text-accent-display">&ldquo;</span>
                {QUOTE.text}
                <span className="text-accent-display">&rdquo;</span>
              </p>
            </blockquote>
            <figcaption className="mt-5 flex items-start gap-3 text-[15px] leading-[1.5] text-ink-2">
              <span aria-hidden="true" className="mt-[11px] h-[2px] w-7 shrink-0 rounded bg-accent" />
              <span>
                <span className="font-medium text-ink">{QUOTE.who}</span>, {QUOTE.role}
                <br />
                {QUOTE.where}
              </span>
            </figcaption>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-rule-soft pt-5">
              {QUOTE.chips.map((c) => (
                <TickFlag key={c}>{c}</TickFlag>
              ))}
            </div>
          </figure>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
