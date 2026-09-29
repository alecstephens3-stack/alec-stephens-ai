"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { V7_HOW } from "@/lib/content";
import { Satellite, StepWindow } from "./how-objects";
import s from "./lower-c.module.css";

/**
 * How a project goes, Granola style: a small index of the four steps, and
 * the real thing each step produces. The steps run left to right as a
 * timeline (Services above is a vertical list with a window beside it, so the
 * two never read as the same widget). Pick a step and a pin carries its object
 * down into the frame. Nothing moves on its own: click, tap or arrow keys.
 *
 * The rail keeps the global .draft-rail, because the page thread and the
 * Services stitch in page-threads.tsx both measure `#how .draft-rail`.
 * Under 900px the chosen step's object opens inside the list instead.
 */
export function How() {
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
    <Section id="how" kicker="How we work" title={V7_HOW.title}>
      <AnimateOnScroll>
        <div className={s.how}>
          <ol className={cn("draft-rail", s.rail)} role="tablist" aria-label="Steps of a project">
            {steps.map((st, i) => (
              <li
                key={st.n}
                role="presentation"
                className={cn(s.step, i === 0 && s.first, i === active && s.on)}
              >
                <span className={s.num}>
                  {st.n}
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
                  id={`lc-how-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls={`lc-how-panel-${i} lc-how-inline-${i}`}
                  tabIndex={i === active ? 0 : -1}
                  className={s.tab}
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKey(e, i)}
                >
                  {st.title}
                </button>
                <span className={s.titleMark} aria-hidden="true" />
                <p className={s.body}>{st.body}</p>

                {/* phones: the object opens under its own step */}
                <div
                  id={`lc-how-inline-${i}`}
                  role="tabpanel"
                  aria-labelledby={`lc-how-tab-${i}`}
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

          {/* wide screens: one frame under the timeline, the pin marks which step it belongs to */}
          <div className={s.stage} style={{ "--i": active } as CSSProperties}>
            <span className={s.pin} aria-hidden="true"><span className={s.pinLine} /></span>
            <div className={cn(s.frame, s.stageFrame)}>
              <div className={s.shots}>
                {steps.map((st, i) => (
                  <div
                    key={st.n}
                    id={`lc-how-panel-${i}`}
                    role="tabpanel"
                    aria-labelledby={`lc-how-tab-${i}`}
                    className={cn(s.shot, i === active && s.isOn)}
                  >
                    <StepWindow i={i} />
                    <Satellite i={i} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className={s.caption}>Pick a step to see what it produces. Names and amounts are examples.</p>
        </div>
      </AnimateOnScroll>
    </Section>
  );
}
