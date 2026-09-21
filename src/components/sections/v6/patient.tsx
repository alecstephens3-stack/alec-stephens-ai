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
          <div className="draft-crop is-block mx-auto max-w-[760px]">
            <p className="t-title !text-[clamp(1.35rem,1.05rem+1.1vw,1.8rem)] !leading-[1.35]">
              {PATIENT.headline}
            </p>
            <p className="t-fine mt-6 max-w-[64ch]">{PATIENT.fine}</p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
