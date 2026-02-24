import { STATS } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function StatsBar() {
  return (
    <section className="bg-dark-stone py-20" aria-label="Key metrics">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="grid grid-cols-1 divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`py-8 text-center sm:py-4 ${i === 0 ? "sm:pr-8 sm:pl-0" : i === STATS.length - 1 ? "sm:pl-8 sm:pr-0" : "sm:px-8"}`}
              >
                <div
                  className="font-heading font-bold text-white"
                  style={{
                    fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {stat.value}
                </div>
                <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
