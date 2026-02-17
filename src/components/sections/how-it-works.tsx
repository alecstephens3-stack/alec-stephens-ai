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
                {/* Connector line (hidden on mobile, shown on md+) */}
                {index < PROCESS_STEPS.length - 1 && (
                  <div className="absolute top-8 left-[60%] hidden h-0.5 w-[calc(100%-20%)] bg-border md:block" />
                )}

                <div className="font-heading text-5xl font-bold text-terracotta/20">
                  {step.number}
                </div>
                <h3 className="mt-2 font-heading text-xl font-semibold text-black">
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
