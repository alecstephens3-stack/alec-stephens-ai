import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ButtonLink } from "@/components/ui/button";
import { V7_PRICING, V7_CTA, FAQ } from "@/lib/content";
import s from "./lower-c.module.css";

/**
 * The price card as one itemised bill (the "flat price in writing" that step
 * two of How we work promises), with the owner's own questions beneath it,
 * one answer open at a time (Gusto). The questions and answers are the FAQ's
 * approved wording, picked by question so they cannot drift from /faq.
 */
const ASKED = [
  "How long until staff are using it?",
  "Who keeps it up to date after launch?",
  "Does it matter what practice software we use?",
  "Does our IT company have to do anything?",
];
const QUESTIONS = ASKED.map((q) => FAQ.find((f) => f.q === q)).filter(
  (f): f is (typeof FAQ)[number] => Boolean(f),
);

export function Pricing() {
  return (
    <Section id="pricing" kicker={V7_PRICING.kicker} title={V7_PRICING.title} titleMax="max-w-[24ch]">
      <AnimateOnScroll>
        <div className={cn("sai-pane-strong", s.bill)}>
          <div className={s.billBar}>
            <span>Price card</span>
            <span>No hourly billing</span>
          </div>
          <ol className={s.billRows}>
            {V7_PRICING.tiers.map((t) => {
              const note = "note" in t ? t.note : undefined;
              return (
                <li key={t.name} className={cn(s.billRow, note && s.billHot)}>
                  <div className={s.billTop}>
                    <h3 className={s.billName}>{t.name}</h3>
                    <span className={s.billLead} aria-hidden="true" />
                    <p className={s.billPrice}>{t.price}</p>
                  </div>
                  <div className={s.billSub}>
                    <div>
                      {note && <p className={s.billNote}>{note}</p>}
                      <p className={s.billBody}>{t.body}</p>
                    </div>
                    <p className={s.billMonthly}>{t.monthly}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className={s.billFine}>{V7_PRICING.fine}</p>
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={60}>
        <div className={s.qs}>
          {QUESTIONS.map((f) => (
            <details key={f.q} name="lc-price-questions" className={s.q}>
              <summary className={s.qSum}>
                {f.q}
                <span className={s.qChev} aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </summary>
              <p className={s.qA}>{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-9">
          <ButtonLink href={V7_CTA.href} external>
            {V7_CTA.label}
          </ButtonLink>
        </div>
      </AnimateOnScroll>
    </Section>
  );
}
