import Image from "next/image";
import { CASE_STUDIES } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function CaseStudies() {
  return (
    <section
      id="work"
      className="py-28 md:py-44"
      aria-label="Case studies"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <h2
            className="font-heading font-medium tracking-tight text-black"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Selected work
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-ink-60">
            A few things I&apos;ve built. Each one solved a real problem.
          </p>
        </AnimateOnScroll>

        <div className="mt-24 space-y-28 md:space-y-40">
          {CASE_STUDIES.map((study, index) => {
            const hasImage = study.images && study.images.length > 0;
            return (
              <AnimateOnScroll key={study.title} delay={80}>
                <div
                  className={`grid items-center gap-12 ${
                    hasImage
                      ? `md:grid-cols-2 md:gap-20 ${index % 2 === 1 ? "md:[direction:rtl] md:[&>*]:[direction:ltr]" : ""}`
                      : "md:grid-cols-[3fr_2fr]"
                  }`}
                >
                  {/* Text side */}
                  <div>
                    {/* Metric */}
                    <div className="mb-5 flex items-baseline gap-3">
                      <span
                        className="font-heading font-medium text-salmon"
                        style={{ fontSize: "clamp(2rem, 3.5vw, 2.8rem)" }}
                      >
                        {study.metric}
                      </span>
                      <span className="text-sm text-ink-60">
                        {study.metricLabel}
                      </span>
                    </div>

                    <h3
                      className="font-heading font-medium text-black"
                      style={{ fontSize: "clamp(1.4rem, 2.5vw, 1.75rem)" }}
                    >
                      {study.title}
                    </h3>

                    <p className="mt-4 text-base leading-[1.75] text-ink-60">
                      {study.description}
                    </p>

                    {/* Tags */}
                    <div className="mt-6 flex flex-wrap gap-2">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-border px-3.5 py-1.5 text-xs font-medium text-ink-60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Image side — or decorative block for text-only entries */}
                  {hasImage ? (
                    <div className="overflow-hidden rounded-lg border border-border bg-sand/50 shadow-sm">
                      <div className="relative aspect-[4/3] flex items-center justify-center p-4">
                        <Image
                          src={study.images![0].src}
                          alt={study.images![0].alt}
                          fill
                          className="object-contain transition-transform duration-700 hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 480px"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="hidden md:block rounded-lg bg-sand/60 border border-border aspect-[4/3]" aria-hidden="true" />
                  )}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
