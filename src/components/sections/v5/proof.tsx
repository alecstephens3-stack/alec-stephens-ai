import Image from "next/image";
import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ButtonLink } from "@/components/ui/button";
import { CASE_STUDIES, PROOF } from "@/lib/content";
import { cn } from "@/lib/utils";

type ToolIconName = (typeof PROOF.mock.tools)[number]["icon"];

/** Line icons for the four decision tools, drawn to match the live app. */
function ToolIcon({ name }: { name: ToolIconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "doctor":
      return (
        <svg {...common}>
          <circle cx="10" cy="6.5" r="3" />
          <path d="M4 17c.9-3.3 3.2-5.2 6-5.2s5.1 1.9 6 5.2" />
        </svg>
      );
    case "price":
      return (
        <svg {...common}>
          <path d="M3 10.2V4a1 1 0 0 1 1-1h6.2l6.8 6.8a1 1 0 0 1 0 1.4l-5.8 5.8a1 1 0 0 1-1.4 0L3 10.2Z" />
          <circle cx="7" cy="7" r="1.2" />
        </svg>
      );
    case "bill":
      return (
        <svg {...common}>
          <path d="M5 2.8h10v14.4l-2.1-1.3-1.9 1.3-2-1.3-1.9 1.3L5 15.9V2.8Z" />
          <path d="M7.8 7h4.4M7.8 10h4.4" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...common}>
          <path d="M2 10.5h3.4l2-5 3.2 9.5 2.1-4.5H18" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * The front desk app, drawn in its own colors: the clinic's sage green, a
 * search box with the situation typed in, the answer page with its exception
 * called out, and the four decision tools. The live app holds the clinic's real
 * prices and rules, so this shows the interaction, not their data.
 */
function Depiction() {
  const m = PROOF.mock;
  return (
    <figure className="relative m-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 rounded-[44px] bg-[radial-gradient(55%_50%_at_78%_18%,rgba(220,104,67,0.26),transparent_70%),radial-gradient(50%_45%_at_16%_88%,rgba(47,93,79,0.20),transparent_72%)] blur-2xl"
      />
      <div
        role="img"
        aria-label={`Illustration of the front desk app. The search box reads "${m.query}". The answer page, "${m.resultTitle}", says: ${m.resultBody} Exception: ${m.resultRule} Below it are four tools: ${m.tools.map((t) => t.label).join(", ")}.`}
        className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white shadow-[0_32px_70px_rgba(60,35,20,0.22),0_2px_8px_rgba(60,35,20,0.06)]"
      >
        <div className="flex items-center gap-3 border-b border-[#E6ECE9] bg-white px-4 py-3">
          <div className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#E96B5D]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#E9B949]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#6DB36F]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-[#2F5D4F] text-white" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 5h12M4 10h12M4 15h7" />
              </svg>
            </span>
            <span className="text-[14px] font-semibold tracking-[-0.01em] text-[#1F3A32]">{m.app}</span>
          </div>
          <div className="ml-auto hidden items-center gap-1 sm:flex">
            {m.nav.map((n, i) => (
              <span
                key={n}
                className={cn(
                  "rounded-full px-2.5 py-1 text-[12.5px]",
                  i === 0 ? "bg-[#E4EDE8] font-medium text-[#2F5D4F]" : "text-[#5B6B66]"
                )}
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-[linear-gradient(160deg,#35695A_0%,#2F5D4F_55%,#264C41_100%)] px-5 pb-12 pt-5">
          <p className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-white md:text-[20px]">{m.heading}</p>
          <div className="mt-3 flex items-center gap-2.5 rounded-[12px] bg-white px-3.5 py-2.5 shadow-[0_8px_20px_rgba(10,30,24,0.28)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
              <circle cx="7" cy="7" r="4.75" stroke="#2F5D4F" strokeWidth="1.6" />
              <path d="M10.6 10.6 14 14" stroke="#2F5D4F" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="text-[15px] text-[#1C2B27]">{m.query}</span>
            <span aria-hidden="true" className="-ml-1.5 h-[18px] w-[1.5px] bg-[#2F5D4F] motion-safe:animate-pulse" />
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {m.chips.map((c) => (
              <span key={c} className="rounded-full border border-white/25 bg-white/10 px-2.5 py-1 text-[12.5px] font-medium text-white">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative -mt-8 px-4">
          <div className="rounded-[16px] border border-[#E3EAE7] bg-white p-4 shadow-[0_16px_36px_rgba(31,58,50,0.16)] md:p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[17px] font-semibold leading-tight tracking-[-0.01em] text-[#1C2B27]">{m.resultTitle}</p>
              <span className="shrink-0 rounded-full bg-[#E4EDE8] px-2.5 py-1 font-label text-[11.5px] font-bold uppercase leading-none tracking-[0.08em] text-[#2F5D4F]">
                {m.resultTag}
              </span>
            </div>
            <p className="mt-2 text-[14.5px] leading-[1.55] text-[#46554F]">{m.resultBody}</p>
            <div className="mt-3 rounded-[10px] border-l-[3px] border-accent bg-[#FDF0E8] px-3.5 py-2.5">
              <p className="font-label text-[11.5px] font-bold uppercase tracking-[0.1em] text-accent-deep">Exception</p>
              <p className="mt-1 text-[14.5px] font-medium leading-[1.5] text-ink">{m.resultRule}</p>
            </div>
            <p className="mt-3 text-[13px] leading-[1.5] text-[#5E6E68]">{m.resultMeta}</p>
          </div>
        </div>

        <div className="px-4 pb-4 pt-4 md:px-5 md:pb-5">
          <p className="font-label text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#5B6B66]">Tools</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {m.tools.map((t) => (
              <div key={t.label} className="flex items-center gap-2.5 rounded-[12px] border border-[#E3EAE7] bg-[#F7FAF8] px-3 py-2.5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[9px] bg-[#E4EDE8] text-[#2F5D4F]">
                  <ToolIcon name={t.icon} />
                </span>
                <span className="text-[13px] font-medium leading-snug text-[#1C2B27]">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <figcaption className="relative mt-4 px-1 text-[13.5px] leading-[1.55] text-ink-2">{m.caption}</figcaption>
    </figure>
  );
}

/** The PDF shelf: the other case studies, one page each. */
function Shelf() {
  return (
    <div className="mt-14 border-t border-rule pt-10 md:mt-16 md:pt-12">
      <AnimateOnScroll>
        <h3 className="font-heading text-[24px] font-medium leading-tight tracking-[-0.02em] text-ink md:text-[28px]">
          {CASE_STUDIES.title}
        </h3>
        <p className="mt-2 max-w-[60ch] text-[16px] leading-[1.6] text-ink-2">{CASE_STUDIES.lede}</p>
      </AnimateOnScroll>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {CASE_STUDIES.items.map((c, i) => (
          <AnimateOnScroll key={c.pdf} delay={i * 70} className="h-full">
            <a
              href={c.pdf}
              target="_blank"
              rel="noopener"
              aria-label={`${c.title} case study, one-page PDF`}
              className="group sai-pane flex h-full flex-col overflow-hidden rounded-card transition-[transform,box-shadow] duration-200 ease-[var(--ease-brand)] hover:-translate-y-1 hover:shadow-[var(--shadow-pane-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-deep"
            >
              <div className="relative aspect-[760/549] overflow-hidden border-b border-rule-soft bg-[#F5ECE4]">
                <Image
                  src={c.thumb}
                  alt=""
                  fill
                  sizes="(min-width: 1080px) 330px, (min-width: 768px) 31vw, 92vw"
                  className="object-cover object-top transition-transform duration-500 ease-[var(--ease-brand)] group-hover:scale-[1.03]"
                />
                <span className="absolute bottom-3 right-3 rounded-full bg-ink/85 px-2.5 py-1 font-label text-[11.5px] font-bold uppercase leading-none tracking-[0.1em] text-cream shadow-[0_4px_12px_rgba(23,19,16,0.25)]">
                  PDF
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="font-label text-[12.5px] font-bold uppercase tracking-[0.08em] text-accent-deep">{c.context}</p>
                <h4 className="mt-1.5 font-heading text-[20px] font-medium leading-tight tracking-[-0.01em] text-ink">{c.title}</h4>
                <p className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-heading leading-none tracking-[-0.02em]">
                  {c.from ? (
                    <span className="text-[15px] text-ink-2 line-through decoration-accent decoration-2">{c.from}</span>
                  ) : null}
                  <span className="text-[26px] font-medium text-accent-deep">{c.to}</span>
                  <span className="text-[14.5px] text-ink">{c.unit}</span>
                </p>
                <p className="mt-3 text-[14.5px] leading-[1.55] text-ink-2">{c.summary}</p>
                <div className="mt-auto pt-5">
                  <span className="flex items-center gap-2 text-[13.5px] text-ink-2">
                    <span
                      aria-hidden="true"
                      className={cn("h-2 w-2 rounded-full", c.tone === "good" ? "bg-status-good" : "bg-status-warn")}
                    />
                    {c.status}
                  </span>
                  <span className="mt-2 block text-[14px] font-medium text-ink transition-colors group-hover:text-accent-deep">
                    {CASE_STUDIES.linkLabel} &#8599;
                  </span>
                </div>
              </div>
            </a>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
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

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-2 lg:gap-8">
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
        <div className="sai-pane mt-8 rounded-tile px-6 py-5">
          <p className="text-[14.5px] leading-[1.6] text-ink-2">
            <span className="font-medium text-ink">{PROOF.footnote.lead}</span> {PROOF.footnote.body}
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ButtonLink href={PROOF.ctaPrimary.href} external>
            {PROOF.ctaPrimary.label} &rarr;
          </ButtonLink>
          <ButtonLink href={PROOF.ctaSecondary.href} variant="ghost" download>
            {PROOF.ctaSecondary.label}
          </ButtonLink>
        </div>
      </AnimateOnScroll>

      <Shelf />
    </Section>
  );
}
