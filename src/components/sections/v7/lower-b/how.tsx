"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { V7_HOW } from "@/lib/content";
import { HOW_NOTES } from "./copy";
import { DRAW_H, DRAW_W, HOW_DRAWINGS, HOW_LEADERS } from "./drawings";
import { useInViewOnce } from "./use-in-view";
import s from "./how.module.css";

/**
 * How a project goes, drawn. Each step carries the real thing it produces,
 * in the hero's fine line. Pointing at a drawing (or tapping it, or tabbing to
 * it) draws a leader from the part that matters to a short note in the margin.
 * The Opportunity Map's biggest time sink is the only terracotta mark: step one
 * is the one the reader can do today.
 *
 * Keeps `#how .draft-rail > li` and the number as each step's first <p>, so
 * the dotted thread from page-threads.tsx still runs through the four steps.
 */
export function How() {
  const rail = useRef<HTMLOListElement>(null);
  const on = useInViewOnce(rail);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section id="how" kicker="How we work" title={V7_HOW.title}>
      <ol ref={rail} className={cn("draft-rail", s.rail, on && s.on)}>
        {V7_HOW.steps.map((step, i) => {
          const Drawing = HOW_DRAWINGS[i];
          const lead = HOW_LEADERS[i];
          return (
            <li key={step.n} className={s.step} style={{ "--d": `${i * 140}ms` } as React.CSSProperties}>
              <button
                type="button"
                className={cn(s.fig, open === i && s.open)}
                aria-pressed={open === i}
                aria-label={HOW_NOTES[i]}
                onClick={() => setOpen((o) => (o === i ? null : i))}
              >
                <svg className={s.svg} viewBox={`0 0 ${DRAW_W} ${DRAW_H}`} aria-hidden="true">
                  <g className={s.obj}>
                    <Drawing ringClass={s.ring} />
                  </g>
                  <path className={s.lead} d={lead.d} pathLength={1} />
                  <circle className={s.port} cx={lead.at[0]} cy={lead.at[1]} r={2.6} />
                </svg>
                <span className={s.note} aria-hidden="true">{HOW_NOTES[i]}</span>
              </button>
              <p className={s.num}>{step.n}</p>
              <div>
                <h3 className={s.title}>{step.title}</h3>
                <p className="t-body mt-3">{step.body}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </Section>
  );
}
