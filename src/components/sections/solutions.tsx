import { SOLUTIONS } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Porthole } from "@/components/ui/lens-primitives";

/**
 * Solutions: glass tiles nested inside one pane. Icon glyphs are gone — the
 * card leads with its title, and the industries read as plain pills (never a
 * pill with a leading dot).
 */
export function Solutions() {
  return (
    <section id="solutions" className="py-24 md:py-32" aria-label="Solutions">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <Porthole>Solutions</Porthole>
          <h2
            className="mt-5 max-w-3xl font-heading font-medium tracking-tight text-ink-90"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Simple systems that save time, save money, and remove mistakes.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-2">
            Built for real businesses. These are the workflows that actually
            change the numbers.
          </p>
        </AnimateOnScroll>

        <div className="sai-pane mt-14 rounded-panel p-8 md:mt-16 md:p-10">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SOLUTIONS.map((solution, index) => (
              <AnimateOnScroll
                key={solution.title}
                delay={index * 70}
                className="h-full"
              >
                <div className="sai-tile flex h-full flex-col rounded-tile p-7 transition-transform duration-[var(--duration-base)] ease-brand hover:-translate-y-0.5">
                  {/* Title */}
                  <h3 className="font-heading text-lg font-medium text-ink-90">
                    {solution.title}
                  </h3>

                  {/* ROI hook */}
                  <p className="mt-3 text-[15.5px] leading-relaxed text-ink-2">
                    {solution.roiHook}
                  </p>

                  {/* Industries */}
                  <div className="mt-auto pt-6">
                    <div className="flex flex-wrap gap-2">
                      {solution.industries.map((industry) => (
                        <span
                          key={industry}
                          className="rounded-full border border-rule bg-white/60 px-3 py-1 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}

            {/* CTA card */}
            <AnimateOnScroll
              delay={SOLUTIONS.length * 70}
              className="h-full"
            >
              <a
                href="#contact"
                className="sai-tile flex h-full flex-col items-center justify-center rounded-tile p-7 text-center transition-transform duration-[var(--duration-base)] ease-brand hover:-translate-y-0.5"
              >
                <p className="font-heading text-lg font-medium text-ink-90">
                  Not sure which one you need?
                </p>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-2">
                  Book a free consultation and we&apos;ll diagnose it.
                </p>
              </a>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
