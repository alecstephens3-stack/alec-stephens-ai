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
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-60">
              <span className="text-ink-40">01</span> · The problem
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 border-y border-ink-20 md:grid-cols-3 md:divide-x md:divide-border">
          {OPTOMETRY_PROBLEM_STATS.map((stat, i) => (
            <AnimateOnScroll key={stat.value} delay={i * 120}>
              <div className="px-2 py-10 md:px-8 md:py-12">
                <div
                  className={`font-heading font-medium ${stat.accent ? "text-salmon" : "text-black"}`}
                  style={{
                    fontSize: "clamp(2.8rem, 5vw, 4.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.035em",
                  }}
                >
                  {stat.value}
                </div>
                <p className="mt-5 max-w-[28ch] font-mono text-[11px] uppercase leading-relaxed tracking-[0.06em] text-ink-60">
                  {stat.caption}
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
