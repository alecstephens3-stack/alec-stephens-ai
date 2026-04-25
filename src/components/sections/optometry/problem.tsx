import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { OPTOMETRY_PROBLEM_CLOSER, OPTOMETRY_PROBLEM_STATS } from "@/lib/optometry";

export function OptometryProblem() {
  return (
    <section
      id="problem"
      className="py-24 md:py-36"
      aria-label="The problem"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <div className="mb-12 flex items-center gap-5 md:mb-16">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-60">
              <span className="text-ink-60">01</span> · The problem
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
          {OPTOMETRY_PROBLEM_STATS.map((stat, i) => (
            <AnimateOnScroll key={stat.value} delay={i * 120}>
              <div className="px-2 py-10 md:px-8 md:py-12">
                <div
                  className="font-heading font-medium text-black"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stat.valueAccent && stat.value.includes(stat.valueAccent) ? (
                    <>
                      {stat.value.slice(0, stat.value.indexOf(stat.valueAccent))}
                      <span className="text-salmon">{stat.valueAccent}</span>
                      {stat.value.slice(
                        stat.value.indexOf(stat.valueAccent) + stat.valueAccent.length,
                      )}
                    </>
                  ) : stat.accent ? (
                    <span className="text-salmon">{stat.value}</span>
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="mt-5 max-w-[32ch] text-base leading-snug text-ink-90 md:text-lg">
                  {stat.highlight && stat.caption.includes(stat.highlight) ? (
                    <>
                      {stat.caption.slice(0, stat.caption.indexOf(stat.highlight))}
                      <span className="font-medium text-salmon-deep">
                        {stat.highlight}
                      </span>
                    </>
                  ) : (
                    stat.caption
                  )}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={300}>
          <p className="mt-14 max-w-[60ch] text-lg leading-relaxed text-ink-90 md:text-xl">
            {OPTOMETRY_PROBLEM_CLOSER}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
