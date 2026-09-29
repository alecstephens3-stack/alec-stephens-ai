"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { V7_HOW } from "@/lib/content";
import { Satellite, StepWindow } from "./objects";
import s from "./work-with-us.module.css";

/**
 * Work with us (Alec's pick of the three builder versions, 2026-09-29: Builder
 * C's Granola-style steps, reworked). Three steps, no numbers: Discover,
 * Deliver, Optimize. The chosen step sits on a highlight that glides between
 * steps, each step says what it will show, and hovering switches it (the same
 * as Services above). The window below has a notch in its top edge, centred
 * under the chosen step, that glides with it (Alec did not like a thread hung
 * from the card's left edge). Click, tap and arrow keys work too. Nothing
 * moves on its own.
 *
 * The rail keeps the global .draft-rail, because the page thread in
 * page-threads.tsx stitches through `#how .draft-rail`. Under 900px the chosen
 * step's window opens inside the list instead.
 */

const Arrow = ({ down }: { down?: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className={down ? s.down : undefined}>
    <path d="M3 8h9.5M8.5 4 12.5 8l-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function WorkWithUs() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const steps = V7_HOW.steps;
  const n = steps.length;

  const onKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const next: Record<string, number> = {
      ArrowRight: (i + 1) % n,
      ArrowDown: (i + 1) % n,
      ArrowLeft: (i - 1 + n) % n,
      ArrowUp: (i - 1 + n) % n,
      Home: 0,
      End: n - 1,
    };
    if (!(e.key in next)) return;
    e.preventDefault();
    setActive(next[e.key]);
    tabs.current[next[e.key]]?.focus();
  };

  return (
    <Section id="how" kicker={V7_HOW.kicker} title={V7_HOW.title}>
      <AnimateOnScroll>
        <div className={s.how} style={{ "--i": active, "--n": n } as CSSProperties}>
          <div className={s.railWrap}>
            <span className={s.glide} aria-hidden="true" />
            <ol className={cn("draft-rail", s.rail)} role="tablist" aria-label="Working with us, step by step">
              {steps.map((st, i) => (
                <li
                  key={st.n}
                  role="presentation"
                  className={cn(s.step, i === 0 && s.first, i === active && s.on)}
                  onMouseEnter={() => setActive(i)}
                >
                  <span className={s.top}>
                    {i === 0 && <span className={s.start}>Start here</span>}
                    <span className={s.chev} aria-hidden="true">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </span>
                  </span>
                  <button
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`wwu-tab-${i}`}
                    aria-selected={i === active}
                    aria-controls={`wwu-panel-${i} wwu-inline-${i}`}
                    tabIndex={i === active ? 0 : -1}
                    className={s.tab}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onKeyDown={(e) => onKey(e, i)}
                  >
                    {st.title}
                  </button>
                  <p className={s.body}>{st.body}</p>
                  <span className={s.shows} aria-hidden="true">
                    {i === active ? (
                      <>
                        Shown below <Arrow down />
                      </>
                    ) : (
                      <>
                        {st.shows} <Arrow />
                      </>
                    )}
                  </span>

                  {/* phones: the window opens under its own step */}
                  <div
                    id={`wwu-inline-${i}`}
                    role="tabpanel"
                    aria-labelledby={`wwu-tab-${i}`}
                    hidden={i !== active}
                    className={s.inline}
                  >
                    <div className={cn(s.frame, s.inlineFrame)}>
                      <div className={s.shotIn}>
                        <StepWindow i={i} />
                        <Satellite i={i} />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* wide screens: one frame under the steps; a notch in its top edge points at the chosen one */}
          <div className={s.stage}>
            <span className={s.notch} aria-hidden="true" />
            <div className={cn(s.frame, s.stageFrame)}>
              <div className={s.shots}>
                {steps.map((st, i) => (
                  <div
                    key={st.n}
                    id={`wwu-panel-${i}`}
                    role="tabpanel"
                    aria-labelledby={`wwu-tab-${i}`}
                    className={cn(s.shot, i === active && s.isOn)}
                  >
                    <StepWindow i={i} />
                    <Satellite i={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className={s.caption}>Names and amounts are examples.</p>
        </div>
      </AnimateOnScroll>
    </Section>
  );
}
