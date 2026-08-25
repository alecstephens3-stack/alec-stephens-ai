import Image from "next/image";
import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { NightWindow } from "@/components/ui/lens-primitives";
import {
  PROBLEMS,
  PRODUCT_FEATURES,
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
 * Time off, drawn as a week view.
 *
 * Three earlier attempts all drew a sequence: a vertical dotted rail, then a
 * horizontal dotted track, then numbered steps. All three said "there are three
 * stages", which is the least interesting thing about the product and which
 * made it rhyme with the ReExam schedule beside it.
 *
 * What the product actually does that is worth showing is the check: it knows
 * who is already off and tells you when a request would leave a day short.
 *
 * So it is built like a calendar rather than like five boxes: weekday and date
 * sit together in a header strip, the column rules run the full height, and no
 * cell is left blank. A day with nobody off says so, because an empty cell in a
 * grid reads as a missing value rather than as a quiet day.
 *
 * Roles, never names: the client has not agreed to be identified.
 */

/** One person. Small enough to sit inside a chip in a 70px column. */
function PersonGlyph() {
  return (
    <svg
      width="9"
      height="9"
      viewBox="0 0 10 10"
      fill="none"
      aria-hidden="true"
      className="mt-[1px] shrink-0 text-ink-2 opacity-70"
    >
      <circle cx="5" cy="3" r="1.95" fill="currentColor" />
      <path d="M1.5 9.4c0-1.95 1.6-3.05 3.5-3.05s3.5 1.1 3.5 3.05z" fill="currentColor" />
    </svg>
  );
}

function CalendarPicture({
  week,
  weekLabel,
  shortLabel,
  fullLabel,
}: {
  week: readonly { day: string; date?: string; off: readonly string[]; short?: boolean }[];
  weekLabel?: string;
  shortLabel?: string;
  fullLabel?: string;
}) {
  const spoken =
    "A week of time off requests, checked against coverage. " +
    week
      .map((d) =>
        d.off.length
          ? `${d.day}: ${d.off.join(", ")} off${d.short && shortLabel ? `, ${shortLabel}` : ""}`
          : `${d.day}: ${fullLabel ?? "nobody off"}`,
      )
      .join(". ") +
    ".";

  return (
    <div>
      <div
        role="img"
        aria-label={spoken}
        className="overflow-hidden rounded-tile border border-rule-soft bg-white/55 shadow-[inset_0_1px_0_#fff,0_6px_18px_rgba(112,62,40,0.05)]"
      >
        {weekLabel ? (
          <p
            aria-hidden="true"
            className="border-b border-rule-soft bg-white/55 px-3 py-2 font-label text-[10.5px] uppercase tracking-[0.08em] text-ink-2"
          >
            {weekLabel}
          </p>
        ) : null}

        {/* Weekday over date, the way a week view names its columns. */}
        <div
          aria-hidden="true"
          className="grid grid-cols-5 divide-x divide-rule-soft border-b border-rule-soft bg-white/35"
        >
          {week.map((d) => (
            <div
              key={d.day}
              className={
                // the tint runs the full column height, so the flagged day
                // reads as one column rather than as a lit cell under a plain
                // header
                "px-1 py-2 text-center " + (d.short ? "bg-accent-soft" : "")
              }
            >
              <span
                className={
                  "block font-label text-[10px] uppercase tracking-[0.07em] " +
                  (d.short ? "text-accent-deep" : "text-ink-2")
                }
              >
                {d.day}
              </span>
              {d.date ? (
                <span
                  className={
                    "mx-auto mt-1 flex h-[21px] w-[21px] items-center justify-center rounded-full font-heading text-[14px] font-medium leading-none " +
                    // the filled date pill is how a week view marks the day in
                    // question. accent-deep, not accent: white on #DC6843 is
                    // 3.0:1 and this is 14px text.
                    (d.short ? "bg-accent-deep text-white" : "text-ink")
                  }
                >
                  {d.date}
                </span>
              ) : null}
            </div>
          ))}
        </div>

        <div aria-hidden="true" className="grid grid-cols-5 divide-x divide-rule-soft">
          {week.map((d) => (
            <div
              key={d.day}
              className={
                "flex min-h-[112px] flex-col gap-1 p-1.5 " +
                // the page behind is a warm gradient, so a transparent cell
                // picks up as much tint as the flagged one does
                (d.short ? "bg-accent-soft" : "bg-white/55")
              }
            >
              {d.off.map((role) => (
                <span
                  key={role}
                  className="flex items-start justify-center gap-1 rounded-[7px] bg-white/85 px-1 py-[5px] text-center text-[10.5px] font-medium leading-[1.25] text-ink ring-1 ring-rule-soft"
                >
                  <PersonGlyph />
                  {role}
                </span>
              ))}

              {d.off.length === 0 && fullLabel ? (
                <span className="m-auto px-0.5 text-center text-[10.5px] leading-[1.3] text-ink-2 opacity-70">
                  {fullLabel}
                </span>
              ) : null}

              {d.short && shortLabel ? (
                <span className="mt-auto pt-1 text-center text-[10.5px] font-semibold leading-[1.25] text-accent-deep">
                  {shortLabel}
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>

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
                      <SequencePicture steps={s.mechanism.steps ?? []} />
                    ) : (
                      <CalendarPicture
                        week={s.mechanism.week ?? []}
                        weekLabel={s.mechanism.weekLabel}
                        shortLabel={s.mechanism.shortLabel}
                        fullLabel={s.mechanism.fullLabel}
                      />
                    )}
                  </div>
                  {s.mechanism.stat ? (
                    // one sentence, not a display number over a caption. the
                    // number alone did not say what it was counting, and the
                    // size gap made the two halves read as separate claims.
                    <p className="mt-7 border-t border-rule pt-6 font-heading text-[21px] font-medium leading-[1.35] tracking-[-0.01em] text-balance text-ink md:text-[23px]">
                      {s.mechanism.stat.lead}
                      <span className="text-accent-deep">{s.mechanism.stat.accent}</span>
                      {s.mechanism.stat.tail}
                    </p>
                  ) : null}
                  {s.mechanism.note ? (
                    <p className="mt-5 max-w-[38ch] text-[13.5px] leading-[1.6] text-ink-2">
                      {s.mechanism.note}
                    </p>
                  ) : null}
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
