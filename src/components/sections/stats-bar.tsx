import { STATS } from "@/lib/constants";
import { Metric } from "@/components/ui/metric";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function StatsBar() {
  return (
    <section className="bg-dark-stone py-16" aria-label="Key metrics">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {STATS.map((stat) => (
              <Metric key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
