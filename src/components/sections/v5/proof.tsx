import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ButtonLink } from "@/components/ui/button";
import { PROOF } from "@/lib/content";

/**
 * A small, honest depiction of the front desk tool: the search box, one
 * answer page, and the four decision tools. The live instance holds a
 * client's real prices and rules, so this shows the interaction, not data.
 */
function Depiction() {
  const m = PROOF.mock;
  return (
    <figure
      className="sai-pane-strong m-0 overflow-hidden rounded-card"
      role="img"
      aria-label="Illustration of the front desk tool: a search box, an answer page, and four decision tools"
    >
      <div className="flex items-center gap-2 border-b border-rule-soft bg-white/50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.14)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.10)]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.07)]" />
        <span className="ml-2 text-[13px] font-medium text-ink-2">{m.window}</span>
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex items-center gap-2.5 rounded-[12px] border border-rule bg-white px-3.5 py-3 text-[14.5px] text-ink">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
            <circle cx="7" cy="7" r="4.75" stroke="#DC6843" strokeWidth="1.6" />
            <path d="M10.6 10.6 14 14" stroke="#DC6843" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span>{m.placeholder}</span>
        </div>
        <div className="rounded-[14px] border border-rule-soft bg-white p-4">
          <p className="font-heading text-[16px] font-medium leading-tight text-ink">{m.resultTitle}</p>
          <p className="mt-2 text-[14px] leading-[1.5] text-ink-2">{m.resultBody}</p>
          <p className="mt-2 text-[14px] font-medium leading-[1.5] text-ink">{m.resultRule}</p>
          <p className="mt-2.5 text-[12.5px] leading-[1.5] text-ink-2">{m.resultMeta}</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {m.tools.map((t) => (
            <div
              key={t}
              className="flex items-center gap-2 rounded-[12px] border border-rule-soft bg-white/70 px-3 py-2.5 text-[12.5px] font-medium text-ink"
            >
              <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-accent" />
              {t}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="border-t border-rule-soft px-4 pb-4 pt-3 text-[12.5px] leading-[1.5] text-ink-2">
        {m.caption}
      </figcaption>
    </figure>
  );
}

export function Proof() {
  return (
    <Section
      id="proof"
      kicker={PROOF.kicker}
      headMax="max-w-[30ch]"
      title={
        <>
          {PROOF.title.lead} <span className="text-accent-display">{PROOF.title.accent}</span>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PROOF.stats.map((s, i) => (
          <AnimateOnScroll key={s.unit} delay={i * 60} className="h-full">
            <Card className="h-full !p-5">
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-1 font-heading font-medium leading-none tracking-[-0.03em]">
                <span className="text-[30px] text-accent-deep md:text-[34px]">{s.value}</span>
                <span className="text-[15px] text-ink">{s.unit}</span>
              </p>
              <p className="mt-2.5 text-[13.5px] leading-[1.5] text-ink-2">{s.label}</p>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>

      <div className="mt-6 grid items-start gap-4 lg:grid-cols-2">
        <div className="grid gap-4">
          <AnimateOnScroll>
            <Card>
              <h3 className="font-heading text-[18px] font-medium leading-tight text-ink">{PROOF.before.title}</h3>
              {PROOF.before.body.map((p, i) => (
                <p key={i} className="mt-3 text-[15.5px] leading-[1.6] text-ink-2">{p}</p>
              ))}
            </Card>
          </AnimateOnScroll>
          <AnimateOnScroll delay={70}>
            <Card>
              <h3 className="font-heading text-[18px] font-medium leading-tight text-ink">{PROOF.after.title}</h3>
              {PROOF.after.body.map((p, i) => (
                <p key={i} className="mt-3 text-[15.5px] leading-[1.6] text-ink-2">{p}</p>
              ))}
            </Card>
          </AnimateOnScroll>
        </div>
        <AnimateOnScroll delay={120}>
          <Depiction />
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll delay={60}>
        <div className="sai-pane mt-6 rounded-tile px-6 py-5">
          <p className="text-[14.5px] leading-[1.6] text-ink-2">
            <span className="font-medium text-ink">{PROOF.footnote.lead}</span> {PROOF.footnote.body}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href={PROOF.ctaPrimary.href} external>
            {PROOF.ctaPrimary.label} &rarr;
          </ButtonLink>
          <ButtonLink href={PROOF.ctaSecondary.href} variant="ghost" external>
            {PROOF.ctaSecondary.label}
          </ButtonLink>
        </div>
      </AnimateOnScroll>
    </Section>
  );
}
