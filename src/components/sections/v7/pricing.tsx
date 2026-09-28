import { Section } from "../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ButtonLink } from "@/components/ui/button";
import { V7_PRICING, V7_CTA } from "@/lib/content";

/**
 * The price card, on the page (the blind review's biggest miss was "no price").
 * Three glass tiles; the middle one is marked as where most practices start.
 */
export function Pricing() {
  return (
    <Section id="pricing" kicker={V7_PRICING.kicker} title={V7_PRICING.title} titleMax="max-w-[24ch]">
      <AnimateOnScroll>
        <div className="grid gap-5 md:grid-cols-3">
          {V7_PRICING.tiers.map((t) => (
            <div
              key={t.name}
              className={
                "note" in t && t.note
                  ? "sai-pane-strong flex flex-col rounded-card p-7 outline outline-2 outline-accent/60"
                  : "sai-pane flex flex-col rounded-card p-7"
              }
            >
              <h3 className="font-heading text-[22px] font-medium leading-[1.25] text-ink">{t.name}</h3>
              <p className="mt-5 font-heading text-[40px] font-medium leading-none tracking-[-0.02em] text-ink">{t.price}</p>
              <p className="t-fine mt-2">{t.monthly}</p>
              {"note" in t && t.note && <p className="mt-3 text-[16px] font-medium text-accent-deep">{t.note}</p>}
              <p className="t-body mt-5">{t.body}</p>
            </div>
          ))}
        </div>
        <p className="t-fine mt-7">{V7_PRICING.fine}</p>
        <div className="mt-8">
          <ButtonLink href={V7_CTA.href} external>
            {V7_CTA.label}
          </ButtonLink>
        </div>
      </AnimateOnScroll>
    </Section>
  );
}
