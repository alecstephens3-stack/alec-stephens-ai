import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { BubbleList } from "@/components/ui/lens-primitives";
import { ButtonLink } from "@/components/ui/button";
import { PRICING_TIERS, PRICING_NOTES, CALENDLY } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Pricing() {
  return (
    <Section
      id="pricing"
      kicker="What it costs"
      title="Priced in public"
      lede="Tier one is a fixed price. Tiers two and three are quoted after we count your material, because a blind fixed price on clinic wide content is underwater before it starts. Every tier is a build fee plus a monthly that keeps the content true, cancellable any time."
      center
    >
      <div className="grid items-start gap-4 lg:grid-cols-3">
        {PRICING_TIERS.map((tier, i) => (
          <AnimateOnScroll key={tier.name} delay={i * 70} className="h-full">
            <div
              className={cn(
                "relative flex h-full flex-col rounded-card p-5 md:p-6",
                tier.highlighted
                  ? "sai-pane-strong ring-1 ring-accent-line lg:-mt-2 lg:pb-7 lg:pt-7"
                  : "sai-pane"
              )}
            >
              {tier.badge && (
                <p className="mb-3 font-label text-[13px] font-semibold uppercase tracking-[0.07em] text-accent-deep">
                  {tier.badge}
                </p>
              )}

              <h3 className="font-heading text-[21px] font-medium leading-tight text-ink">
                {tier.name}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">
                {tier.summary}
              </p>

              <div className="mt-4 border-y border-rule-soft py-3.5">
                <p className="font-heading text-[34px] font-medium leading-none tracking-[-0.025em] text-ink">
                  {tier.setup}
                </p>
                <p className="mt-1.5 font-label text-[13px] font-semibold uppercase tracking-[0.05em] text-ink-2">
                  one time build
                </p>
                <p className="mt-3 text-[15px] text-ink">
                  then{" "}
                  <span className="font-heading text-[19px] font-medium text-accent-deep">
                    {tier.monthly}
                  </span>{" "}
                  <span className="text-ink-2">{tier.monthlyBasis}</span>
                </p>
              </div>

              <BubbleList
                items={tier.features}
                className="mt-4 text-[14.5px] leading-[1.5] text-ink-2 [&>li]:py-1.5"
              />

              <div className="mt-auto pt-4">
                <ButtonLink
                  href={CALENDLY}
                  external
                  variant={tier.highlighted ? "primary" : "ghost"}
                  className="w-full justify-center"
                >
                  Book a 20 minute call
                </ButtonLink>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>

      <AnimateOnScroll delay={220}>
        <ul className="mx-auto mt-8 flex max-w-[820px] list-none flex-col gap-2 p-0 text-center text-[13.5px] leading-[1.55] text-ink-2">
          {PRICING_NOTES.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </AnimateOnScroll>
    </Section>
  );
}
