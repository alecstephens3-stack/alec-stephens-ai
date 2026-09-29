import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ButtonLink } from "@/components/ui/button";
import { V7_PRICING, V7_CTA } from "@/lib/content";
import { A_PRICING } from "./copy";
import { Estimate } from "./estimate";
import { OwnerQuestions } from "./questions";
import s from "./pricing.module.css";

/**
 * Pricing as a statement, not three sales cards (direction "Instruments").
 * Each tier reads as an itemised bill: what it is, then the build line and
 * the monthly line on dotted leaders, figures aligned across the three so the
 * reader compares by eye. The fine print closes the statement under a double
 * rule, the way a bill states its terms. Under it, the one control of the
 * lower half: the reader's own estimate of what one job takes in a year.
 */
export function PricingA() {
  return (
    <Section id="pricing" kicker={V7_PRICING.kicker} title={V7_PRICING.title} titleMax="max-w-[24ch]">
      <AnimateOnScroll>
        <div className={s.statement}>
          {V7_PRICING.tiers.map((t) => {
            const pick = "note" in t && Boolean(t.note);
            const monthly = t.monthly.match(/\$[\d,]+/)?.[0] ?? t.monthly;
            return (
              <div key={t.name} className={cn(s.bill, pick && s.pick)}>
                <h3 className={s.name}>{t.name}</h3>
                {"note" in t && t.note && <p className={s.note}>{t.note}</p>}
                <p className={s.desc}>{t.body}</p>
                <div className={s.lines}>
                  <p className={s.line}>
                    <span className={s.k}>{A_PRICING.build}</span>
                    <span className={s.lead} aria-hidden="true" />
                    <span className={cn(s.v, s.vBig)}>{t.price}</span>
                  </p>
                  <p className={s.line}>
                    <span className={s.k}>{A_PRICING.monthly}</span>
                    <span className={s.lead} aria-hidden="true" />
                    <span className={s.v}>{monthly}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <p className={s.terms}>{V7_PRICING.fine}</p>
      </AnimateOnScroll>

      <div className={s.below}>
        <AnimateOnScroll>
          <Estimate />
        </AnimateOnScroll>
        <AnimateOnScroll delay={80}>
          <OwnerQuestions />
          <a href="/faq" className={s.more}>
            {A_PRICING.moreQuestions} <span aria-hidden="true">&rarr;</span>
          </a>
          <div className={s.cta}>
            <ButtonLink href={V7_CTA.href} external>
              {V7_CTA.label}
            </ButtonLink>
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}
