"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { PATIENT } from "@/lib/content";
import { A_PATIENT } from "./copy";
import s from "./patient.module.css";

/**
 * The patient-data answer, proved by where the data goes rather than by a
 * badge. Two states, because the approved answer has exactly two cases: the
 * front desk answers (rules, prices and protocols, not charts) and a job that
 * needs patient data (billing or claims: an account in the practice's name,
 * never our servers). Switching redraws the path: the solid line draws in to
 * where the data lives, the crossed line shows where it never goes.
 */
export function PatientA() {
  const [k, setK] = useState(0);
  const [touched, setTouched] = useState(false);
  const st = A_PATIENT.states[k];
  const cut = PATIENT.headline.indexOf(". ") + 1;
  const lead = PATIENT.headline.slice(0, cut);
  const accent = PATIENT.headline.slice(cut).trim();

  return (
    <Section
      id="patient-data"
      kicker={A_PATIENT.kicker}
      titleMax="max-w-[27ch]"
      title={
        <>
          {lead} <span className="text-accent-display">{accent}</span>
        </>
      }
    >
      <div className={s.grid}>
        <AnimateOnScroll>
          <p className={cn("t-body", s.fine)}>{PATIENT.fine}</p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80}>
          <figure className={s.card}>
            <p id="a-pd-label" className={s.bar}>{A_PATIENT.switchLabel}</p>
            <div className={s.cardBody}>
              <div className={s.seg} role="group" aria-labelledby="a-pd-label">
                {A_PATIENT.states.map((x, i) => (
                  <button
                    key={x.key}
                    type="button"
                    aria-pressed={i === k}
                    aria-controls="a-pd-flow"
                    className={cn(s.segBtn, i === k && s.segOn)}
                    onClick={() => {
                      setK(i);
                      setTouched(true);
                    }}
                  >
                    {x.tab}
                  </button>
                ))}
              </div>
              <div id="a-pd-flow" aria-live="polite" className={s.flowWrap}>
                <div key={st.key} className={cn(s.flow, touched && s.redraw)}>
                  <div className={cn(s.node, s.from)}>
                    <p className={s.nodeT}>{st.from}</p>
                  </div>
                  <div className={s.conn} aria-hidden="true">
                    <svg className={s.connSvg} width="16" height="44" viewBox="0 0 16 44" fill="none">
                      <path className={s.draw} pathLength={1} d="M8 1v38" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path className={s.head} d="M3.5 35 8 40.5 12.5 35" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div className={cn(s.node, s.home)}>
                    <p className={s.nodeT}>{st.home}</p>
                    <p className={s.nodeN}>{st.homeNote}</p>
                  </div>
                  <div className={cn(s.conn, s.connX)}>
                    <svg className={s.connSvg} width="16" height="44" viewBox="0 0 16 44" fill="none" aria-hidden="true">
                      <path d="M8 2v40" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeDasharray="1 5" />
                      <circle cx="8" cy="22" r="7" fill="#fffefc" stroke="currentColor" strokeWidth="1.3" />
                      <path className={s.x} d="M5.4 19.4 10.6 24.6M10.6 19.4 5.4 24.6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span className={s.crossT}>{st.cross}</span>
                  </div>
                  <div className={cn(s.node, s.never)}>
                    <p className={s.nodeT}>{st.never}</p>
                  </div>
                </div>
              </div>
            </div>
          </figure>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}
