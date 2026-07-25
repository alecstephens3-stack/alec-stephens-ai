import Image from "next/image";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

/**
 * Hero: one glass pane with a single specular streak, and the proof numbers
 * lifted onto a floating stat layer that overlaps the pane's bottom edge
 * (depth is hierarchy). The pane keeps >=120px bottom padding on desktop so
 * the floating layer never collides with the text underneath it.
 */

const STATS: {
  value: string;
  label: string;
  accent: boolean;
  word?: boolean;
}[] = [
  { value: "5+", label: "years on Upwork", accent: false },
  { value: "100%", label: "Job Success Score", accent: true },
  { value: "3", label: "countries served", accent: false },
  { value: "Top Rated", label: "on Upwork", accent: true, word: true },
];

export function Hero() {
  return (
    <section
      className="relative pt-32 md:mb-16 md:pt-44"
      aria-label="Hero"
    >
      <div className="relative mx-auto max-w-5xl px-6">
        {/* The hero pane — extra bottom padding only where the stat layer
            floats over the edge (md+); on mobile the stats sit in flow */}
        <div className="sai-pane sai-streak rounded-window p-8 sm:p-10 md:p-14 md:pb-[120px]">
          <div className="relative grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
            {/* Left: text */}
            <div>
              {/* Headline */}
              <h1
                className="sai-rise max-w-3xl font-heading font-medium leading-[1.05] tracking-tight text-ink-90"
                style={{
                  fontSize: "clamp(2.8rem, 5.5vw, 5rem)",
                  animationDelay: "0ms",
                }}
              >
                We build systems that give business owners their{" "}
                <em className="not-italic text-accent">time back</em>.
              </h1>

              {/* Body */}
              <p
                className="sai-rise mt-7 max-w-xl text-lg leading-relaxed text-ink-2"
                style={{ animationDelay: "60ms" }}
              >
                We map out where the time goes, and build the system that takes
                it back. Sometimes that&apos;s AI, sometimes it&apos;s just good
                software.
              </p>

              {/* CTA */}
              <div
                className="sai-rise mt-9"
                style={{ animationDelay: "120ms" }}
              >
                <ButtonLink href="#contact" variant="primary">
                  Book a free consultation
                  <span aria-hidden="true">&rarr;</span>
                </ButtonLink>
              </div>
            </div>

            {/* Right: founders — tiles flex to fit the narrow mobile pane,
                fixed widths return from sm up */}
            <div
              className="sai-rise flex min-w-0 justify-center gap-3 md:justify-end"
              style={{ animationDelay: "180ms" }}
            >
              <div className="sai-tile min-w-0 flex-1 rounded-tile p-1.5 sm:flex-none">
                <div className="relative aspect-[11/14] w-full overflow-hidden rounded-[14px] sm:w-[165px] md:w-[170px]">
                  <Image
                    src="/images/headshot.png"
                    alt="Alec Stephens"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 640px) 40vw, 170px"
                    priority
                  />
                </div>
              </div>
              <div className="sai-tile min-w-0 flex-1 rounded-tile p-1.5 sm:flex-none">
                <div className="relative aspect-[11/14] w-full overflow-hidden rounded-[14px] sm:w-[165px] md:w-[170px]">
                  <Image
                    src="/images/headshot-jusheen.png"
                    alt="Jusheen Kim"
                    fill
                    className="object-cover"
                    style={{ objectPosition: "center 22%" }}
                    sizes="(max-width: 640px) 40vw, 170px"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stat layer — static in flow on mobile (kit pattern: floating
            layers ground themselves on small screens), floating over the
            pane's bottom edge from md up */}
        <div
          className="sai-rise sai-pane-strong mt-6 rounded-card md:absolute md:inset-x-14 md:-bottom-12 md:mt-0"
          style={{ animationDelay: "240ms" }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                className={cn(
                  "px-5 py-6 text-center md:px-6 md:py-7",
                  index % 2 === 1 && "border-l border-rule-soft",
                  index >= 2 && "border-t border-rule-soft",
                  index > 0 && "md:border-l md:border-rule-soft",
                  "md:border-t-0",
                )}
              >
                <div
                  className={cn(
                    "flex min-h-[34px] items-center justify-center font-label font-bold leading-none md:min-h-[38px]",
                    stat.word
                      ? "text-[22px] md:text-[24px]"
                      : "text-[30px] md:text-[34px]",
                    stat.accent ? "text-accent" : "text-ink-90",
                  )}
                >
                  {stat.value}
                </div>
                <div className="mt-2.5 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
