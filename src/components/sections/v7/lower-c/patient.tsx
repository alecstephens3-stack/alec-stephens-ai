import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { PATIENT } from "@/lib/content";
import s from "./lower-c.module.css";

/**
 * The patient-data answer (approved wording, unchanged) proved by a small
 * window rather than a badge: the account in the practice's name, with the
 * practice as the owner. Every line in the window restates PATIENT.
 */
export function Patient() {
  return (
    <section id="patient-data" className="draft-section scroll-mt-28">
      <div className="draft-wrap">
        <div className={s.pd}>
          <AnimateOnScroll>
            <div className="draft-crop is-block">
              <p className="t-title !text-[clamp(1.35rem,1.05rem+1.1vw,1.8rem)] !leading-[1.35]">
                {PATIENT.headline}
              </p>
              <p className="t-fine mt-6 max-w-[60ch]">{PATIENT.fine}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={80}>
            <figure className={cn(s.frame, s.pdFrame, "m-0")}>
              <div className={s.app}>
                <div className={s.appBar}>
                  <span>Cloud account</span>
                  <span className={cn(s.chip, s.chipGood)}>BAA signed</span>
                </div>
                <div className={s.appBody}>
                  <div className={s.acct}>
                    <span className={s.av}>YP</span>
                    <span>
                      <span className={cn(s.acctName, "block")}>Your practice</span>
                      <span className={cn(s.acctSub, "block")}>Account owner</span>
                    </span>
                  </div>
                  <div className={s.kv}>
                    <p className={s.kvRow}><span className={s.kvK}>Set up by</span><span className={s.kvV}>Stephens AI</span></p>
                    <p className={s.kvRow}><span className={s.kvK}>Patient data on our servers</span><span className={s.kvV}>Never</span></p>
                  </div>
                  <p className={s.kvH}>Patient data, by job</p>
                  <div className={s.kv}>
                    <p className={s.kvRow}><span className={s.kvK}>Billing and claims</span><span className={s.kvV}>Stays in this account</span></p>
                    <p className={s.kvRow}><span className={s.kvK}>Front desk answers</span><span className={s.kvV}>None needed</span></p>
                  </div>
                </div>
              </div>
            </figure>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
