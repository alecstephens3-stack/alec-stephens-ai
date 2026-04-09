import { SOLUTIONS } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const ICONS: Record<string, React.ReactNode> = {
  bolt: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  refresh: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
    </svg>
  ),
  database: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  ),
};

export function Solutions() {
  return (
    <section
      id="solutions"
      className="py-28 md:py-40"
      aria-label="Solutions"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-terracotta">
            Solutions
          </p>
          <h2
            className="max-w-3xl font-heading font-bold tracking-tight text-black"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
          >
            Simple systems that save time, save money, and remove mistakes.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-warm-gray">
            Built for real businesses. These are the workflows that actually
            move the needle.
          </p>
        </AnimateOnScroll>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution, index) => (
            <AnimateOnScroll key={solution.title} delay={index * 80}>
              <div className="group flex h-full flex-col rounded-2xl border border-border bg-sand/30 p-7 transition-all duration-300 hover:border-terracotta/20 hover:bg-white hover:shadow-lg hover:shadow-terracotta/5">
                {/* Icon */}
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sand text-terracotta transition-colors group-hover:bg-terracotta/10">
                  {ICONS[solution.icon]}
                </div>

                {/* Title */}
                <h3 className="font-heading text-lg font-semibold text-black">
                  {solution.title}
                </h3>

                {/* ROI hook */}
                <p className="mt-3 text-sm font-medium leading-relaxed text-charcoal">
                  {solution.roiHook}
                </p>

                {/* Industries */}
                <div className="mt-auto pt-5">
                  <div className="flex flex-wrap gap-1.5">
                    {solution.industries.map((industry) => (
                      <span
                        key={industry}
                        className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-medium text-warm-gray"
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
          <AnimateOnScroll delay={SOLUTIONS.length * 80}>
            <a
              href="#contact"
              className="group flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-border p-7 text-center transition-all duration-300 hover:border-terracotta/30 hover:bg-sand/30"
            >
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-sand text-warm-gray transition-colors group-hover:bg-terracotta/10 group-hover:text-terracotta">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </div>
              <p className="font-heading text-sm font-semibold text-black">
                Not sure which one you need?
              </p>
              <p className="mt-1.5 text-sm text-warm-gray">
                Book a free consultation and I&apos;ll diagnose it.
              </p>
            </a>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
