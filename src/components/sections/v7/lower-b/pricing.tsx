"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { ButtonLink } from "@/components/ui/button";
import { V7_PRICING, V7_CTA } from "@/lib/content";
import { useInViewOnce } from "./use-in-view";
import s from "./pricing.module.css";

/**
 * The price card as a ruled ledger rather than three glass tiles: calm, open,
 * read across like a bill. The rules draw themselves in once; each price
 * carries the accounting double rule that marks a total. The suggested tier's
 * double rule is the one terracotta figure in the group.
 */
export function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInViewOnce(ref);

  return (
    <Section id="pricing" kicker={V7_PRICING.kicker} title={V7_PRICING.title} titleMax="max-w-[24ch]">
      <div ref={ref} className={cn(s.ledger, on && s.on)}>
        <span className={s.top} aria-hidden="true" />
        {V7_PRICING.tiers.map((t, i) => {
          const pick = "note" in t && Boolean(t.note);
          return (
            <div
              key={t.name}
              className={cn(s.tier, pick && s.pick)}
              style={{ "--d": `${200 + i * 160}ms` } as React.CSSProperties}
            >
              {i > 0 && <span className={s.rule} aria-hidden="true" />}
              <h3 className={s.name}>{t.name}</h3>
              <p className={s.price}>
                <span className={s.fig}>
                  {t.price}
                  <svg className={s.total} viewBox="0 0 100 6" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 1H100" pathLength={1} />
                    <path d="M0 5H100" pathLength={1} />
                  </svg>
                </span>
              </p>
              <p className="t-fine mt-3">{t.monthly}</p>
              {"note" in t && t.note && <p className={s.note}>{t.note}</p>}
              <p className="t-body mt-5">{t.body}</p>
            </div>
          );
        })}
      </div>
      <p className="t-fine mt-9 max-w-[70ch]">{V7_PRICING.fine}</p>
      <div className="mt-8">
        <ButtonLink href={V7_CTA.href} external>
          {V7_CTA.label}
        </ButtonLink>
      </div>
    </Section>
  );
}
