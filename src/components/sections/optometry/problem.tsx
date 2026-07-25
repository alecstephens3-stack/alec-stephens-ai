import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Porthole } from "@/components/ui/lens-primitives";
import { OPTOMETRY_PROBLEM_CLOSER, OPTOMETRY_PROBLEM_STATS } from "@/lib/optometry";

export function OptometryProblem() {
  return (
    <section
      id="problem"
      className="py-24 md:py-32"
      aria-label="The problem"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <div className="mb-10 md:mb-12">
            <Porthole>01 · The problem</Porthole>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={60}>
          <div className="sai-pane sai-streak rounded-panel p-8 md:p-12">
            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-0 md:divide-x md:divide-rule">
              {OPTOMETRY_PROBLEM_STATS.map((stat, i) => (
                <AnimateOnScroll
                  key={stat.value}
                  delay={80 + i * 80}
                  className="md:px-8 md:first:pl-0 md:last:pr-0"
                >
                  <div
                    className="font-label font-bold text-ink-90"
                    style={{
                      fontSize: "clamp(1.9rem, 3.4vw, 2.5rem)",
                      lineHeight: 1.08,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    {stat.valueAccent && stat.value.includes(stat.valueAccent) ? (
                      <>
                        {stat.value.slice(0, stat.value.indexOf(stat.valueAccent))}
                        <span className="text-accent">{stat.valueAccent}</span>
                        {stat.value.slice(
                          stat.value.indexOf(stat.valueAccent) + stat.valueAccent.length,
                        )}
                      </>
                    ) : stat.accent ? (
                      <span className="text-accent">{stat.value}</span>
                    ) : (
                      stat.value
                    )}
                  </div>
                  <p className="mt-5 max-w-[32ch] text-base leading-relaxed text-ink-2">
                    {stat.highlight && stat.caption.includes(stat.highlight) ? (
                      <>
                        {stat.caption.slice(0, stat.caption.indexOf(stat.highlight))}
                        <span className="font-medium text-ink-90">
                          {stat.highlight}
                        </span>
                      </>
                    ) : (
                      stat.caption
                    )}
                  </p>
                </AnimateOnScroll>
              ))}
            </div>

            <p className="relative mt-12 max-w-[60ch] border-t border-rule pt-10 text-lg leading-relaxed text-ink-90">
              {OPTOMETRY_PROBLEM_CLOSER}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
