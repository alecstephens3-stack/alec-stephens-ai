'use client';

import { STATS } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { useCountUp } from "@/hooks/use-count-up";
import type { Stat } from "@/types";

function parseStatValue(value: string): { numeric: number; suffix: string } {
  const match = value.match(/^(\d+)(.*)/);
  return match
    ? { numeric: parseInt(match[1]), suffix: match[2] }
    : { numeric: 0, suffix: value };
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const { numeric, suffix } = parseStatValue(stat.value);
  const { ref, count } = useCountUp(numeric);

  return (
    <div
      ref={ref}
      className={`py-8 text-center sm:py-4 ${
        index === 0
          ? "sm:pr-8 sm:pl-0"
          : index === STATS.length - 1
          ? "sm:pl-8 sm:pr-0"
          : "sm:px-8"
      }`}
    >
      <div
        className="font-heading font-bold text-white"
        style={{
          fontSize: "clamp(3.5rem, 7vw, 5.5rem)",
          lineHeight: 1,
          letterSpacing: "-0.03em",
        }}
      >
        {count}{suffix}
      </div>
      <div className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-terracotta">
        {stat.label}
      </div>
    </div>
  );
}

export function StatsBar() {
  return (
    <section className="bg-dark-stone py-20" aria-label="Key metrics">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="grid grid-cols-1 divide-y divide-white/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {STATS.map((stat, i) => (
              <StatItem key={stat.label} stat={stat} index={i} />
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
