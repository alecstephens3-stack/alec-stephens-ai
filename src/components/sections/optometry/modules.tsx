import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { BubbleList, Porthole } from "@/components/ui/lens-primitives";
import { OPTOMETRY_MODULES } from "@/lib/optometry";

export function OptometryModules() {
  return (
    <section
      id="modules"
      className="py-24 md:py-32"
      aria-label="The rest of the system"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <Porthole>03 · The rest of the system</Porthole>
          <h2
            className="mt-6 max-w-[22ch] font-heading font-medium text-ink-90"
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
            }}
          >
            Four more engines that compound.
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80}>
          <div className="sai-pane sai-streak mt-12 rounded-panel p-6 md:mt-16 md:p-10">
            <div className="relative grid gap-6 md:grid-cols-2 md:gap-8">
              {OPTOMETRY_MODULES.map((module, i) => (
                <AnimateOnScroll key={module.number} delay={120 + i * 70} className="h-full">
                  <article className="sai-tile flex h-full flex-col rounded-tile p-7 md:p-9">
                    <div className="flex items-baseline gap-4">
                      <span className="font-label text-[14.5px] font-bold uppercase tracking-[0.05em] text-accent">
                        {module.number}
                      </span>
                      <span className="h-px flex-1 bg-rule" aria-hidden="true" />
                    </div>

                    <h3 className="mt-5 font-heading text-2xl font-medium tracking-tight text-ink-90">
                      {module.title}
                    </h3>

                    <div className="mt-5 space-y-4 text-[15.5px] leading-relaxed text-ink-2">
                      <p>
                        <span className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-90">
                          Problem &nbsp;&middot;&nbsp;{" "}
                        </span>
                        {module.problem}
                      </p>
                      <p>
                        <span className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-90">
                          What we build &nbsp;&middot;&nbsp;{" "}
                        </span>
                        {module.solution}
                      </p>
                    </div>

                    <BubbleList
                      className="mt-5 text-[15.5px] leading-relaxed text-ink-90"
                      items={module.howItWorks}
                    />

                    <p className="mt-auto pt-8 text-base leading-relaxed text-ink-90">
                      {module.roi.lead}
                      <span className="font-label font-bold text-accent">
                        {module.roi.highlight}
                      </span>
                      {module.roi.trail}
                    </p>
                  </article>
                </AnimateOnScroll>
              ))}
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
