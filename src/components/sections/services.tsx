import { SERVICES, PRICING_TIERS } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function Services() {
  return (
    <>
      {/* ── Services ── */}
      <section
        id="services"
        className="bg-sand/50 py-28 md:py-40"
        aria-label="Services"
      >
        <div className="mx-auto max-w-5xl px-6">
          <AnimateOnScroll>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-salmon">
              How I work
            </p>
            <h2
              className="max-w-2xl font-heading font-medium tracking-tight text-black"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Diagnose, build, and support.
            </h2>
          </AnimateOnScroll>

          <div className="mt-20 space-y-0">
            {SERVICES.map((service, index) => (
              <AnimateOnScroll key={service.title} delay={index * 80}>
                <div className="grid gap-6 border-t border-border py-14 md:grid-cols-[auto_1fr_1fr] md:gap-12 items-start">
                  {/* Number */}
                  <span className="font-heading text-5xl font-medium text-sand tracking-tight select-none hidden md:block">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Title + details */}
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-black">
                      {service.title}
                    </h3>
                    <ul className="mt-4 space-y-2">
                      {service.details.map((detail) => (
                        <li
                          key={detail}
                          className="flex items-center gap-2.5 text-sm text-ink-60"
                        >
                          <span className="h-1 w-1 rounded-full bg-salmon shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Description */}
                  <p className="text-base leading-[1.8] text-ink-60">
                    {service.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        id="pricing"
        className="py-28 md:py-40"
        aria-label="Pricing"
      >
        <div className="mx-auto max-w-5xl px-6">
          <AnimateOnScroll>
            <div className="text-center">
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-salmon">
                Pricing
              </p>
              <h2
                className="mx-auto max-w-2xl font-heading font-medium tracking-tight text-black"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                Simple, value-based pricing.
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-lg text-ink-60">
                Every engagement starts with understanding your business. Pick the depth that fits.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {PRICING_TIERS.map((tier, index) => (
              <AnimateOnScroll key={tier.name} delay={index * 100}>
                <div
                  className={`relative flex h-full flex-col rounded-lg border p-8 transition-all duration-300 ${
                    tier.highlighted
                      ? "border-salmon/30 bg-white shadow-lg shadow-salmon/5 ring-1 ring-salmon/10"
                      : "border-border bg-sand/30 hover:border-border hover:bg-sand/50"
                  }`}
                >
                  {tier.highlighted && (
                    <span className="absolute -top-3 left-8 rounded-full bg-salmon px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                      Most popular
                    </span>
                  )}

                  {/* Header */}
                  <div className="mb-6">
                    <h3 className="font-heading text-lg font-semibold text-black">
                      {tier.name}
                    </h3>
                    <div className="mt-3 flex items-baseline gap-1.5">
                      <span
                        className={`font-heading font-medium tracking-tight ${
                          tier.highlighted ? "text-salmon" : "text-black"
                        }`}
                        style={{ fontSize: "clamp(1.6rem, 2.5vw, 2rem)" }}
                      >
                        {tier.price}
                      </span>
                    </div>
                    <span className="text-sm text-ink-60">{tier.basis}</span>
                  </div>

                  {/* Description */}
                  <p className="mb-6 text-sm leading-relaxed text-ink-60">
                    {tier.description}
                  </p>

                  {/* Divider */}
                  <div className="mb-6 h-px bg-border" />

                  {/* Features */}
                  <ul className="mb-8 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-sm text-ink-90"
                      >
                        <svg
                          className={`mt-0.5 h-4 w-4 shrink-0 ${
                            tier.highlighted ? "text-salmon" : "text-ink-60"
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <a
                    href="#contact"
                    className={`block rounded-full py-3.5 text-center font-heading text-sm font-medium transition-all ${
                      tier.highlighted
                        ? "bg-salmon text-white hover:bg-salmon-deep"
                        : "border border-border text-black hover:border-ink-90 hover:bg-sand/50"
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
