import { SERVICES, PRICING_TIERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ButtonLink } from "@/components/ui/button";
import {
  BracketStamp,
  BubbleList,
  Porthole,
} from "@/components/ui/lens-primitives";

/**
 * Services + Pricing. Each service gets its own pane; pricing is a hairline
 * ledger inside one pane (no boxes per row, no zebra) with Schibsted numerals
 * in terracotta doing the accounting.
 */
export function Services() {
  return (
    <>
      {/* ── Services ── */}
      <section id="services" className="py-24 md:py-32" aria-label="Services">
        <div className="mx-auto max-w-5xl px-6">
          <AnimateOnScroll>
            <Porthole>How we work</Porthole>
            <h2
              className="mt-5 max-w-2xl font-heading font-medium tracking-tight text-ink-90"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Diagnose, build, and support.
            </h2>
          </AnimateOnScroll>

          <div className="mt-14 space-y-6 md:mt-16">
            {SERVICES.map((service, index) => (
              <AnimateOnScroll key={service.title} delay={index * 70}>
                <div className="sai-pane grid gap-7 rounded-panel p-8 md:grid-cols-[auto_1fr_1fr] md:items-start md:gap-12 md:p-11">
                  {/* Number */}
                  <span className="select-none font-label text-[26px] font-bold leading-none text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title + details */}
                  <div>
                    <h3 className="font-heading text-xl font-medium text-ink-90">
                      {service.title}
                    </h3>
                    {/* ul.sai-bullets zeroes its own margin (unlayered CSS
                        beats a Tailwind mt-* utility), so the gap lives here. */}
                    <div className="mt-4">
                      <BubbleList
                        items={service.details}
                        className="text-[15px] text-ink-90"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-base leading-[1.8] text-ink-2">
                    {service.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 md:py-32" aria-label="Pricing">
        <div className="mx-auto max-w-5xl px-6">
          <AnimateOnScroll>
            <div className="text-center">
              <div className="flex justify-center">
                <Porthole>Pricing</Porthole>
              </div>
              <h2
                className="mx-auto mt-5 max-w-2xl font-heading font-medium tracking-tight text-ink-90"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Simple, value-based pricing.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-ink-2">
                Every engagement starts with understanding your business. Pick the depth that fits.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={70}>
            <div className="sai-pane mt-14 rounded-panel p-8 md:mt-16 md:p-11">
              {PRICING_TIERS.map((tier, index) => (
                <div
                  key={tier.name}
                  className={cn(
                    "grid gap-7 py-9 md:grid-cols-[1.1fr_0.9fr_206px] md:items-start md:gap-10",
                    index === 0 && "pt-0",
                    index === PRICING_TIERS.length - 1
                      ? "pb-0"
                      : "border-b border-rule-soft",
                  )}
                >
                  {/* Tier + description */}
                  <div>
                    {tier.highlighted && (
                      <div className="-ml-3.5 mb-2">
                        <BracketStamp>Most popular</BracketStamp>
                      </div>
                    )}
                    <h3 className="font-heading text-xl font-medium text-ink-90">
                      {tier.name}
                    </h3>
                    <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
                      {tier.description}
                    </p>
                  </div>

                  {/* Features */}
                  <BubbleList
                    items={tier.features}
                    className="text-[15px] text-ink-90"
                  />

                  {/* Price + CTA */}
                  <div className="md:text-right">
                    <div className="font-label text-[21px] font-bold leading-tight text-accent md:text-[22px]">
                      {tier.price}
                    </div>
                    <div className="mt-1.5 text-[15px] text-ink-2">
                      {tier.basis}
                    </div>
                    <ButtonLink
                      href="#contact"
                      variant={tier.highlighted ? "primary" : "ghost"}
                      className="mt-5"
                    >
                      {tier.cta}
                    </ButtonLink>
                  </div>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
