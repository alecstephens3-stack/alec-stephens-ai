import { PROCESS_STEPS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function HowItWorks() {
  return (
    <section id="process" className="bg-cream py-24" aria-label="How it works">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Process"
          heading="How It Works"
          description="A simple, collaborative process. You stay in the loop the whole time."
        />

        <div className="grid gap-8 md:grid-cols-4">
          {PROCESS_STEPS.map((step, index) => (
            <AnimateOnScroll key={step.number} delay={index * 150}>
              <div className="relative text-center md:text-left">
                {/* Connector line */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="absolute top-10 left-[58%] hidden h-px w-[calc(100%-18%)] bg-border md:block" />
                )}

                {/* Large faded step number */}
                <div
                  aria-hidden="true"
                  className="font-heading font-bold leading-none text-black/[0.055]"
                  style={{ fontSize: "clamp(5rem, 9vw, 7rem)" }}
                >
                  {step.number}
                </div>

                {/* Small indicator dot */}
                <div className="mt-1 mb-3 flex items-center gap-2 justify-center md:justify-start">
                  <div className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">
                    Step {step.number}
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-black">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-warm-gray">
                  {step.description}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
