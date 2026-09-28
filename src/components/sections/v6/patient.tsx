import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { PATIENT } from "@/lib/content";

/**
 * The patient-data answer. One sentence, at reading size, in plain sight, not
 * behind an accordion. The compliance detail sits under it at fine-print size:
 * quieter, because a practice owner reads the first line and a compliance
 * reviewer reads the second, and never hidden.
 */
export function Patient() {
  return (
    <section id="patient-data" className="draft-section scroll-mt-28">
      <div className="draft-wrap">
        <AnimateOnScroll>
          <div className="max-w-[760px]">
            <p className="v7-open">
              {PATIENT.lead} <span className="text-accent-display">{PATIENT.accent}</span>
            </p>
            <p className="t-fine mt-6 max-w-[64ch]">{PATIENT.fine}</p>
          </div>
          </AnimateOnScroll>
      </div>
    </section>
  );
}
