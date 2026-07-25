import Image from "next/image";
import { CASE_STUDIES } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { BracketStamp, NightWindow } from "@/components/ui/lens-primitives";

/**
 * Night window #1 of the two permitted on the home page (Alec, 2026-07-25).
 * The work is the drama: dark module, glass tiles, terracotta numerals.
 */
export function CaseStudies() {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <NightWindow ariaLabel="Case studies" className="p-8 md:p-12">
          <AnimateOnScroll>
            <h2
              className="font-heading font-medium tracking-tight text-cream"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
            >
              Selected work
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-cream-2">
              A few things we&apos;ve built. Each one solved a real problem.
            </p>
          </AnimateOnScroll>

          <div className="mt-12 space-y-6 md:mt-16 md:space-y-8">
            {CASE_STUDIES.map((study, index) => {
              const hasImage = study.images && study.images.length > 0;
              return (
                <AnimateOnScroll key={study.title} delay={index * 70}>
                  <article className="sai-nglass-tile rounded-tile p-6 transition-all duration-[220ms] ease-brand hover:-translate-y-1 hover:shadow-npane md:p-8">
                    <div
                      className={`grid items-center gap-8 ${
                        hasImage
                          ? `md:grid-cols-2 md:gap-12 ${index % 2 === 1 ? "md:[direction:rtl] md:[&>*]:[direction:ltr]" : ""}`
                          : "md:grid-cols-[3fr_2fr]"
                      }`}
                    >
                      {/* Text side */}
                      <div>
                        {/* Metric */}
                        <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                          <span
                            className="font-label font-bold text-accent-night"
                            style={{ fontSize: "clamp(1.9rem, 3.2vw, 2.6rem)" }}
                          >
                            {study.metric}
                          </span>
                          <span className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-cream-2">
                            {study.metricLabel}
                          </span>
                        </div>

                        <h3
                          className="font-heading font-medium text-cream"
                          style={{ fontSize: "clamp(1.35rem, 2.4vw, 1.7rem)" }}
                        >
                          {study.title}
                        </h3>

                        <p className="mt-4 text-[15.5px] leading-[1.75] text-cream-2">
                          {study.description}
                        </p>

                        {/* Tags */}
                        <div className="mt-7 flex flex-wrap gap-x-5 gap-y-3">
                          {study.tags.map((tag) => (
                            <BracketStamp key={tag} onNight>
                              {tag}
                            </BracketStamp>
                          ))}
                        </div>
                      </div>

                      {/* Image side — or decorative block for text-only entries */}
                      {hasImage ? (
                        <div className="overflow-hidden rounded-[14px] border border-nrule bg-white/[0.06]">
                          <div className="relative flex aspect-[4/3] items-center justify-center p-4">
                            <Image
                              src={study.images![0].src}
                              alt={study.images![0].alt}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 420px"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className="hidden aspect-[4/3] rounded-[14px] border border-nrule bg-white/[0.04] md:block"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                  </article>
                </AnimateOnScroll>
              );
            })}
          </div>
        </NightWindow>
      </div>
    </section>
  );
}
