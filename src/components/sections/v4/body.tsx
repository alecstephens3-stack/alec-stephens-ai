import Image from "next/image";
import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { NightWindow } from "@/components/ui/lens-primitives";
import {
  PROBLEMS,
  PRODUCT_FEATURES,
  PROOF,
  TIMELINE,
  OWNERSHIP,
  FAQ,
  FOUNDERS,
  OTHER_WORK,
  SYSTEMS,
} from "@/lib/content";

/* --------------------------------------------------------------- problem */

export function Problem() {
  return (
    <Section
      id="problem"
      kicker="The gap"
      title="The front desk runs on what a few people remember"
      lede="When those people are busy or gone, the answers get hard to find, and that gap shows up as uncollected charges and slow onboarding."
    >
      <div className="gap-4 md:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {PROBLEMS.map((p, i) => (
          <AnimateOnScroll key={p.title} delay={i * 70}>
            <Card>
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

/* -------------------------------------------------------------- product */

export function Product() {
  return (
    <Section
      id="product"
      kicker="What we build"
      title="A searchable knowledge base for the front desk"
      lede="The difference from a shared drive is that answers are findable mid-call, and the exceptions that cost money are hard to miss."
    >
      {/* Columns, not a grid. A grid stretches every card to the tallest in its
          row, and these six vary by a factor of four in length, so half of them
          carried a large empty area. In columns each card hugs its own content
          and the copy is what sets the rhythm. */}
      <div className="gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {PRODUCT_FEATURES.map((f, i) => (
          <AnimateOnScroll key={f.title} delay={(i % 3) * 60}>
            <Card>
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
    <Section id="proof" title={PROOF.title}>
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
          </Card>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80}>
          <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {PROOF.stats.map((s) => (
              <Card key={s.label} className="flex flex-col justify-center !p-5">
                <p className="font-heading text-[28px] font-medium leading-none tracking-[-0.02em] text-accent-display md:text-[32px]">
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


/* --------------------------------------------------------------- systems */

/**
 * ReExam and the time-off build.
 *
 * The first version put each product in a Card, each Card containing a bordered
 * panel, each panel containing chips: three levels of box, which reads as fussy
 * before anyone has read a word. Two equal cards side by side also read as a
 * comparison, which invites the reader to choose one, and these are not
 * alternatives.
 *
 * So: one product per row, separated by a rule rather than boxed, with the
 * words on one side and the mechanism drawn as an actual picture on the other.
 * No surface anywhere in the section. The section it follows, Proof, already
 * carries cards, so the change of texture is doing work too.
 */

/**
 * The two mechanisms are drawn in deliberately different languages. They were
 * both vertical dotted rails, which made two unrelated products look like the
 * same diagram twice.
 *
 * ReExam is a schedule, so it keeps the rail: a thing that happens over time,
 * read top to bottom, with one marked exception.
 * Time off is a state machine, so it becomes a horizontal track: one request
 * moving left to right through three states, ending in a number.
 */

/** ReExam: six touches over six weeks, read down. */
function SequencePicture({
  steps,
}: {
  steps: readonly { day: string; channel?: string; key?: boolean }[];
}) {
  return (
    <ol className="relative grid gap-0" role="list">
      <span
        aria-hidden="true"
        className="absolute left-[7px] top-3 bottom-3 w-[2px] rounded bg-rule"
      />
      {steps.map((s) => (
        <li key={s.day} className="relative flex items-baseline gap-4 py-2.5 pl-8">
          <span
            aria-hidden="true"
            className={
              "absolute rounded-full " +
              (s.key
                ? "left-0 top-[9px] h-4 w-4 bg-accent shadow-[0_0_0_5px_var(--color-accent-soft)]"
                : "left-[3px] top-[11px] h-2.5 w-2.5 bg-white ring-1 ring-rule")
            }
          />
          <span
            className={
              "w-[54px] shrink-0 font-label text-[12px] tracking-[0.06em] uppercase " +
              (s.key ? "text-accent-deep" : "text-ink-2")
            }
          >
            {s.day}
          </span>
          <span
            className={
              "text-[14.5px] leading-[1.5] " +
              (s.key ? "font-medium text-ink" : "text-ink-2")
            }
          >
            {s.channel}
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Time off. Third attempt at making this NOT look like the ReExam schedule.
 *
 * Both earlier versions used dots on a line, vertical then horizontal, which is
 * the same idea rotated. This drops the dots entirely and goes typographic: the
 * three states are a numbered procedure, set as large ordinals with the label
 * beside them, and the number the loop bought back closes the block.
 *
 * A schedule and a procedure are different kinds of thing, so they should not
 * be drawn with the same vocabulary. ReExam is when things happen. This is what
 * happens.
 */
function FlowPicture({
  steps,
  stat,
}: {
  steps: readonly { day: string }[];
  stat?: { value: string; label: string };
}) {
  return (
    <div>
      <ol className="grid gap-0" role="list">
        {steps.map((s, i) => (
          <li
            key={s.day}
            className="flex items-baseline gap-5 border-t border-rule-soft py-4 first:border-t-0 first:pt-0"
          >
            <span
              aria-hidden="true"
              className="font-heading text-[30px] font-medium leading-none tracking-[-0.02em] text-accent opacity-30"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[16px] leading-[1.45] text-ink">{s.day}</span>
          </li>
        ))}
      </ol>

      {stat ? (
        <div className="mt-8 border-t border-rule pt-6">
          <p className="font-heading text-[40px] font-medium leading-none tracking-[-0.02em] text-accent-display md:text-[48px]">
            {stat.value}
          </p>
          <p className="mt-2.5 max-w-[28ch] text-[13.5px] leading-[1.5] text-ink-2">
            {stat.label}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function Systems() {
  return (
    <Section
      id="systems"
      kicker={SYSTEMS.kicker}
      title={SYSTEMS.title}
      lede={SYSTEMS.lede}
    >
      <div className="grid gap-0">
        {SYSTEMS.items.map((s, i) => {
          const flip = i % 2 === 1;
          return (
            <AnimateOnScroll key={s.name} delay={i * 80}>
              <div
                className={
                  // centred, not top aligned: the two columns are never the same
                  // height, and top aligning dumped all the slack at the bottom
                  // of the shorter one as a void
                  "grid items-center gap-10 py-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 " +
                  (i > 0 ? "border-t border-rule-soft" : "pt-2")
                }
              >
                <div className={flip ? "lg:order-2" : ""}>
                  <span aria-hidden="true" className="block h-[3px] w-9 rounded bg-accent" />
                  <h3 className="mt-4 font-heading text-[25px] font-medium leading-[1.15] tracking-[-0.01em] text-ink md:text-[28px]">
                    {s.name}
                  </h3>
                  <p className="mt-1.5 text-[16px] font-medium leading-[1.4] text-accent-deep">
                    {s.summary}
                  </p>
                  <p className="mt-5 max-w-[52ch] text-[15.5px] leading-[1.62] text-ink-2">
                    {s.body}
                  </p>
                  <p className="mt-6 border-t border-rule-soft pt-4 text-[15.5px] leading-[1.55] text-ink">
                    {s.price}
                  </p>
                  {s.limit ? (
                    <p className="mt-2 max-w-[52ch] text-[14px] leading-[1.55] text-ink-2">
                      {s.limit}
                    </p>
                  ) : null}
                </div>

                <div className={flip ? "lg:order-1" : ""}>
                  <p className="font-label text-[11.5px] uppercase tracking-[0.08em] text-ink-2">
                    {s.mechanism.label}
                  </p>
                  <div className="mt-5">
                    {s.mechanism.kind === "sequence" ? (
                      <SequencePicture steps={s.mechanism.steps} />
                    ) : (
                      <FlowPicture steps={s.mechanism.steps} stat={s.mechanism.stat} />
                    )}
                  </div>
                  <p className="mt-5 max-w-[38ch] text-[13.5px] leading-[1.6] text-ink-2">
                    {s.mechanism.note}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          );
        })}
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
    >
      <AnimateOnScroll>
        <div className="sai-pane grid gap-0 divide-y divide-rule-soft rounded-card p-1 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {TIMELINE.map((t) => (
            <div key={t.week} className="p-5">
              <p className="font-label text-[13px] font-semibold uppercase tracking-[0.07em] text-accent-deep">
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

/**
 * The dark band. It previously ran a title in a 0.72fr column against four
 * tiles in a 1.28fr column, which left the left third of a very wide dark
 * rectangle empty and made the whole thing read as a tube dropped onto the
 * page, with the tiles floating in the remaining space.
 *
 * Now the heading sits across the top and the four answers run as a single
 * four column band beneath it, divided by hairlines rather than boxed. The
 * band fills its own width, which is what stops it looking arbitrary.
 */
export function Ownership() {
  return (
    <Section id="ownership" className="!pt-1 md:!pt-2">
      <AnimateOnScroll>
        <NightWindow
          ariaLabel="What you own"
          className="px-6 py-9 md:px-10 md:py-11"
        >
          <div className="border-b border-nglass-edge pb-7">
            <h2 className="font-heading text-[27px] font-medium leading-[1.12] tracking-[-0.02em] text-cream md:text-[32px]">
              What you own
            </h2>
          </div>

          <dl className="grid gap-x-10 gap-y-7 pt-7 sm:grid-cols-2 lg:grid-cols-4">
            {OWNERSHIP.map((o) => (
              <div key={o.q} className="min-w-0">
                <dt className="font-heading text-[15.5px] font-medium leading-tight text-cream">
                  {o.q}
                </dt>
                <dd className="mt-2 text-[13.5px] leading-[1.6] text-cream-2">
                  {o.a}
                </dd>
              </div>
            ))}
          </dl>
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
      title="Common questions"
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
                <p className="mt-0.5 font-label text-[13px] font-semibold uppercase tracking-[0.06em] text-accent-deep">
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
            <span className="font-label text-[13px] font-semibold uppercase tracking-[0.06em] text-accent-deep">
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
