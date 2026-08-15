import Image from "next/image";
import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { NightWindow } from "@/components/ui/lens-primitives";
import {
  PROBLEMS,
  PLAYBOOK_FEATURES,
  PROOF,
  TIMELINE,
  OWNERSHIP,
  FAQ,
  FOUNDERS,
  OTHER_WORK,
} from "@/lib/content";

/* --------------------------------------------------------------- problem */

export function Problem() {
  return (
    <Section
      id="problem"
      kicker="The gap"
      title="Your practice runs on things only three people know"
      lede="None of this is a technology problem. It is a findability problem, and it shows up on the P&L in ways nobody traces back to the front desk."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {PROBLEMS.map((p, i) => (
          <AnimateOnScroll key={p.kicker} delay={i * 70}>
            <Card className="h-full">
              <p className="font-label text-[12.5px] font-semibold uppercase tracking-[0.06em] text-accent-deep">
                {p.kicker}
              </p>
              <h3 className="mt-2.5 font-heading text-[18px] font-medium leading-[1.25] text-ink">
                {p.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">
                {p.body}
              </p>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- playbook */

export function Playbook() {
  return (
    <Section
      id="playbook"
      kicker="What we build"
      title="The Front Desk Playbook"
      lede="One searchable place for every insurance rule, price, and protocol your team keeps in their heads. Your manager keeps it true. It holds no patient data at all."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PLAYBOOK_FEATURES.map((f, i) => (
          <AnimateOnScroll key={f.title} delay={(i % 3) * 60}>
            <Card className="h-full">
              <h3 className="font-heading text-[17px] font-medium leading-[1.3] text-ink">
                {f.title}
              </h3>
              <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">
                {f.body}
              </p>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
    </Section>
  );
}

/* ----------------------------------------------------------------- proof */

export function Proof() {
  return (
    <Section id="proof" kicker={PROOF.kicker} title={PROOF.title}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <AnimateOnScroll>
          <Card className="h-full">
            {PROOF.body.map((para, i) => (
              <p
                key={i}
                className="text-[15px] leading-[1.6] text-ink-2 [&:not(:first-child)]:mt-3"
              >
                {para}
              </p>
            ))}
            <figure className="mt-5 border-t border-rule pt-4">
              <blockquote className="font-heading text-[20px] font-medium leading-[1.3] text-ink md:text-[23px]">
                &ldquo;{PROOF.quote.text}&rdquo;
              </blockquote>
              <figcaption className="mt-2.5 font-label text-[12.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
                {PROOF.quote.attribution}
              </figcaption>
            </figure>
          </Card>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80}>
          <div className="grid h-full grid-cols-2 gap-4">
            {PROOF.stats.map((s) => (
              <Card key={s.label} className="flex flex-col justify-center !p-5">
                <p className="font-heading text-[28px] font-medium leading-none tracking-[-0.02em] text-accent md:text-[32px]">
                  {s.value}
                </p>
                <p className="mt-2 text-[13px] leading-[1.4] text-ink-2">
                  {s.label}
                </p>
              </Card>
            ))}
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}

/* -------------------------------------------------------------- timeline */

export function Timeline() {
  return (
    <Section
      id="timeline"
      kicker="How it goes"
      title="Live at your front desk in 30 days"
      lede="Four steps, and you can stop us at the end of the first one."
    >
      <AnimateOnScroll>
        <div className="sai-pane grid gap-0 divide-y divide-rule-soft rounded-card p-1 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {TIMELINE.map((t) => (
            <div key={t.week} className="p-5">
              <p className="font-label text-[12px] font-semibold uppercase tracking-[0.07em] text-accent-deep">
                {t.week}
              </p>
              <h3 className="mt-2 font-heading text-[16px] font-medium leading-[1.3] text-ink">
                {t.title}
              </h3>
              <p className="mt-1.5 text-[13.5px] leading-[1.55] text-ink-2">
                {t.body}
              </p>
            </div>
          ))}
        </div>
      </AnimateOnScroll>
    </Section>
  );
}

/* ------------------------------------------------------------- ownership */

export function Ownership() {
  return (
    <Section id="ownership" className="!pt-1 md:!pt-2">
      <AnimateOnScroll>
        <NightWindow
          ariaLabel="What you own"
          className="px-6 py-9 md:px-11 md:py-11"
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center">
            <div>
              <h2 className="font-heading text-[27px] font-medium leading-[1.12] tracking-[-0.02em] text-cream md:text-[34px]">
                What you own
              </h2>
              <p className="mt-3 max-w-[42ch] text-[15px] leading-[1.6] text-cream-2">
                No vendor writes this down. Read it before you sign, not
                after.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {OWNERSHIP.map((o) => (
                <div key={o.q} className="sai-nglass-tile rounded-tile p-4">
                  <h3 className="font-heading text-[15.5px] font-medium leading-tight text-cream">
                    {o.q}
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-[1.55] text-cream-2">
                    {o.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </NightWindow>
      </AnimateOnScroll>
    </Section>
  );
}

/* ------------------------------------------------------------------- faq */

export function Faq() {
  return (
    <Section
      id="faq"
      kicker="Straight answers"
      title="The questions you would ask on the call"
      center
    >
      <div className="mx-auto max-w-[760px]">
        {FAQ.map((item, i) => (
          <AnimateOnScroll key={item.q} delay={Math.min(i, 3) * 45}>
            <details className="group sai-pane mb-2.5 rounded-card px-5 md:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-heading text-[16.5px] font-medium leading-[1.35] text-ink md:text-[17.5px]">
                {item.q}
                <span
                  aria-hidden="true"
                  className="relative h-3.5 w-3.5 shrink-0"
                >
                  <span className="absolute left-0 top-1/2 h-[2px] w-3.5 -translate-y-1/2 rounded bg-accent-deep" />
                  <span className="absolute left-1/2 top-0 h-3.5 w-[2px] -translate-x-1/2 rounded bg-accent-deep transition-transform duration-200 group-open:rotate-90" />
                </span>
              </summary>
              <p className="pb-4 pr-8 text-[15px] leading-[1.6] text-ink-2">
                {item.a}
              </p>
            </details>
          </AnimateOnScroll>
        ))}
      </div>
    </Section>
  );
}

/* ------------------------------------------- founders + the work outside */

export function Founders() {
  return (
    <Section
      id="about"
      kicker="Who you are hiring"
      title="Two people, and you work with both"
    >
      <div className="grid gap-4 md:grid-cols-2">
        {FOUNDERS.map((f, i) => (
          <AnimateOnScroll key={f.name} delay={i * 70}>
            <Card className="flex h-full items-start gap-4 !p-5">
              <Image
                src={f.image}
                alt={f.name}
                width={160}
                height={160}
                sizes="72px"
                className="h-[64px] w-[64px] shrink-0 rounded-tile object-cover md:h-[72px] md:w-[72px]"
              />
              <div>
                <h3 className="font-heading text-[18px] font-medium leading-tight text-ink">
                  {f.name}
                </h3>
                <p className="mt-0.5 font-label text-[12px] font-semibold uppercase tracking-[0.06em] text-accent-deep">
                  {f.role}
                </p>
                <p className="mt-2 text-[14px] leading-[1.55] text-ink-2">
                  {f.bio}
                </p>
              </div>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>

      {/* Outside eyecare, kept to one line. A clinic buyer reads a long list
          of other industries as "generalist who will learn on my dime." */}
      <AnimateOnScroll delay={140}>
        <div className="sai-pane mt-4 rounded-card px-6 py-5">
          <p className="text-[14.5px] leading-[1.6] text-ink-2">
            <span className="font-label text-[12px] font-semibold uppercase tracking-[0.06em] text-accent-deep">
              Outside eyecare&ensp;
            </span>
            Eyecare is where we go deep. We have also shipped:
          </p>
          <div className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-3">
            {OTHER_WORK.map((w) => (
              <p key={w.title} className="text-[13.5px] leading-[1.5] text-ink-2">
                <span className="text-ink">{w.title}.</span> {w.metric}.
              </p>
            ))}
          </div>
        </div>
      </AnimateOnScroll>
    </Section>
  );
}
