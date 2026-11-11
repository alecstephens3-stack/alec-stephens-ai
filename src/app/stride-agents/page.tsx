import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Section } from "@/components/sections/v6/shell";
import { SITE_URL, V7_CTA } from "@/lib/content";
import s from "@/components/sections/stride/stride.module.css";

/**
 * Stride Agents (2026-11-11; Alec picked a mix of the text thread and "watch it work").
 * Agents that use a practice's own software on screen. Every number traces to
 * context/portfolio.md build 9 in the vault. Hard rules: never name the practice software or
 * its vendor; no hours, dollars or speed claims; the made-up screen must not look like any
 * real product. Wichita Family Vision is named with Dr. Stephens's OK.
 */

const TITLE = "Stride Agents";
const DESCRIPTION =
  "Stride Agents do the jobs that only exist as clicks inside your practice software, on screen, the way a person does, and only after your doctor says yes. By Stephens AI.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/stride-agents` },
  openGraph: { title: `${TITLE} by Stephens AI`, description: DESCRIPTION, url: `${SITE_URL}/stride-agents` },
  twitter: { title: `${TITLE} by Stephens AI`, description: DESCRIPTION },
};

const THREAD = [
  { me: true, t: "Sign off Nov 2 to 6" },
  { me: false, t: "I'll sign the finished exams for Nov 2 to Nov 6 as you. Reply yes to start." },
  { me: true, t: "Yes" },
  { me: false, t: "Done. 67 exams signed." },
];

const DO = [
  { t: "Opens the list of unsigned charts.", on: false },
  { t: "Opens a finished exam.", on: false },
  { t: "Signs it as the doctor.", on: true },
  { t: "Moves to the next one.", on: false },
];

const ROWS = [
  { d: "Exam · Nov 2", st: "signed" },
  { d: "Exam · Nov 3", st: "now" },
  { d: "Exam · Nov 4", st: "todo" },
  { d: "Exam · Nov 5", st: "todo" },
  { d: "Exam · Nov 6", st: "todo" },
];

const STEPS = [
  "The doctor texts the days.",
  "The agent says what it will do, once.",
  "The doctor replies yes.",
  "The count comes back by text.",
];

const REAL = [
  { n: "67 exams", l: "signed off in one run, as the doctor, with his OK" },
  { n: "126 payment files", l: "collected and loaded into ClaimStride" },
];

const SAFE = [
  { k: "Nothing runs without a yes", v: "The agent says what it will do, once, and waits. The doctor's yes has to be a new message." },
  { k: "The count comes back", v: "When a run ends, the doctor gets the count by text." },
  { k: "Patient screens stay under your BAA", v: "We sign a BAA before any patient screen is opened, and the agent works on a computer set up for your practice." },
  { k: "No new system to learn", v: "The agent uses the software you already have. Your team keeps working the way it does today." },
];

function Lockup() {
  return (
    <span className={s.lockup}>
      <span className={s.mark} aria-hidden="true" />
      <span className={s.lockupName}>Stride Agents</span>
      <span className={s.lockupBy}>by Stephens AI</span>
    </span>
  );
}

function Screen() {
  return (
    <div className={s.frame}>
      <div className={s.screen} role="img" aria-label="A made-up practice screen listing five exams to sign. The first is signed and the agent's cursor is on the Sign button of the second.">
        <div className={s.bar}>
          <span className={s.dot} />
          <span className={s.dot} />
          Practice software · made-up screen
        </div>
        <div className={s.body}>
          <p className={s.screenH}>Charts to sign</p>
          {ROWS.map((r) => (
            <div key={r.d} className={r.st === "now" ? `${s.row} ${s.now}` : s.row}>
              <span>{r.d}</span>
              {r.st === "signed" ? <span className={s.ok}>Signed</span> : <span className={s.sign}>Sign</span>}
              {r.st === "now" && (
                <svg className={s.cursor} viewBox="0 0 26 26" aria-hidden="true">
                  <path d="M4 2l16 9-7 2-3 7z" fill="#0A1C26" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className={s.screenNote}>An example screen. Yours is your own practice software.</p>
    </div>
  );
}

export default function StrideAgentsPage() {
  return (
    <div className={s.page}>
      <section className={s.hero}>
        <div>
          <Lockup />
          <h1 className={s.h1}>
            One text from the doctor. <span className={s.accent}>The charts are signed.</span>
          </h1>
          <p className={s.sub}>
            A Stride Agent works inside your practice software, on screen, the way a person does. Nothing runs until
            the doctor says yes.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={V7_CTA.href} external>
              {V7_CTA.label}
            </ButtonLink>
            <ButtonLink href="#work" variant="ghost">
              See it work
            </ButtonLink>
          </div>
          <p className={s.proof}>Live at Wichita Family Vision, an eye clinic in Kansas.</p>
        </div>
        <div className={s.win}>
          <p className={`${s.who} ${s.whoR}`}>The doctor</p>
          <div className={s.thread}>
            {THREAD.map((m) => (
              <p key={m.t} className={`${s.msg} ${m.me ? s.me : s.it}`}>
                {m.t}
              </p>
            ))}
          </div>
          <p className={s.who}>The agent</p>
        </div>
      </section>

      <Section id="work" kicker="Watch it work" title="It uses your practice software the way you do." titleMax="max-w-[22ch]">
        <AnimateOnScroll className={s.work}>
          <ol className={s.do}>
            {DO.map((d) => (
              <li key={d.t} className={d.on ? s.on : undefined}>
                {d.t}
              </li>
            ))}
          </ol>
          <Screen />
        </AnimateOnScroll>
      </Section>

      <Section kicker="How a run starts" title="Four steps, and the doctor's yes is one of them." titleMax="max-w-[24ch]">
        <div className={s.steps}>
          {STEPS.map((t, i) => (
            <AnimateOnScroll key={t} delay={i * 80} className={s.step}>
              <p className={s.stepN}>{i + 1}</p>
              <p className={s.stepT}>{t}</p>
            </AnimateOnScroll>
          ))}
        </div>
      </Section>

      <Section>
        <AnimateOnScroll className={s.real}>
          <p className={s.realLead}>In real use at Wichita Family Vision</p>
          <div className={s.realNums}>
            {REAL.map((r) => (
              <div key={r.n}>
                <p className={s.realN}>{r.n}</p>
                <p className={s.realL}>{r.l}</p>
              </div>
            ))}
          </div>
        </AnimateOnScroll>
      </Section>

      <Section kicker="The jobs" title="Two jobs are live today. Tell us the next one." titleMax="max-w-[22ch]">
        <div className={s.jobs}>
          <AnimateOnScroll className={s.job}>
            <span className={s.chip}>Live</span>
            <p className={s.jobK}>Chart sign-off</p>
            <p className={s.jobV}>Signs the doctor&apos;s finished exams as him, with his OK, for the days he texts.</p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={80} className={s.job}>
            <span className={s.chip}>Live</span>
            <p className={s.jobK}>Payment files</p>
            <p className={s.jobV}>Collects the insurer payment files and loads them into ClaimStride, so nobody downloads them by hand.</p>
            <Link href="/claimstride" className={s.jobLink}>
              See ClaimStride &rarr;
            </Link>
          </AnimateOnScroll>
          <AnimateOnScroll delay={160} className={`${s.job} ${s.jobAsk}`}>
            <p className={s.jobK}>Your job, next</p>
            <p className={s.jobV}>
              If a job in your practice is only clicks in software you already own, tell us about it on a call. We&apos;ll
              say plainly whether an agent can take it.
            </p>
          </AnimateOnScroll>
        </div>
      </Section>

      <Section kicker="How it's kept safe" title="The doctor stays in charge of every run." titleMax="max-w-[22ch]">
        <dl className={s.safe}>
          {SAFE.map((r) => (
            <div key={r.k} className={s.safeRow}>
              <dt>{r.k}</dt>
              <dd>{r.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section>
        <AnimateOnScroll className={s.cta}>
          <p className={s.ctaH}>Now in early access for eye care practices.</p>
          <p className={s.ctaT}>It starts with a free 30-minute call about the job you want off your plate.</p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={V7_CTA.href} external>
              {V7_CTA.label}
            </ButtonLink>
            <ButtonLink href="/claimstride" variant="ghost">
              See ClaimStride
            </ButtonLink>
          </div>
        </AnimateOnScroll>
      </Section>
    </div>
  );
}
