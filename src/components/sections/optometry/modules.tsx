import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { OPTOMETRY_MODULES } from "@/lib/optometry";

export function OptometryModules() {
  return (
    <section
      id="modules"
      className="py-24 md:py-36"
      aria-label="The rest of the system"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <div className="mb-10 flex items-center gap-5">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-60">
              <span className="text-ink-40">03</span> · The rest of the system
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>
          <h2
            className="max-w-[22ch] font-heading font-medium text-black"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            Four more engines that compound.
          </h2>
        </AnimateOnScroll>

        <div className="mt-14 grid gap-px bg-border md:mt-20 md:grid-cols-2">
          {OPTOMETRY_MODULES.map((module, i) => (
            <AnimateOnScroll key={module.number} delay={i * 100}>
              <article className="flex h-full flex-col bg-paper p-8 md:p-10">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-xs uppercase tracking-[0.08em] text-salmon">
                    {module.number}
                  </span>
                  <span className="h-px flex-1 bg-border" aria-hidden="true" />
                </div>

                <h3 className="mt-5 font-heading text-2xl font-medium tracking-tight text-black md:text-[1.75rem]">
                  {module.title}
                </h3>

                <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-60">
                  <p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-40">
                      Problem &nbsp;&middot;&nbsp;{" "}
                    </span>
                    {module.problem}
                  </p>
                  <p>
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-40">
                      What we build &nbsp;&middot;&nbsp;{" "}
                    </span>
                    {module.solution}
                  </p>
                </div>

                <ul className="mt-6 space-y-2">
                  {module.howItWorks.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-base text-ink-90"
                    >
                      <span aria-hidden="true" className="mt-[2px] text-salmon">
                        &rarr;
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-auto pt-8 text-[15px] font-medium leading-snug text-black md:text-base">
                  {module.roi.lead}
                  <span className="font-semibold text-salmon">
                    {module.roi.highlight}
                  </span>
                  {module.roi.trail}
                </p>
              </article>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
