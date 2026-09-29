"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { A_ESTIMATE as T } from "./copy";
import s from "./pricing.module.css";

/**
 * The reader's own estimate, laid out as the kit's ledger (working shown in
 * the operator gutter, a double rule above the total). Rules it keeps, from
 * Charlie (2026-09-29):
 *  - labelled as the reader's estimate from their own numbers;
 *  - defaults are 6 times a day and 5 minutes, never the case study's 4 and
 *    10 (the page states "about 200 hours" for that clinic, and this must
 *    never print a different figure for the same inputs);
 *  - days open per week is an input;
 *  - hours, never dollars; no promise wording. It measures what the job
 *    takes now, not what we would give back.
 * Controls are steppers with a typed value (tap the number to type it), so a
 * keyboard, a finger and a mouse all get a precise control. Holding a button
 * repeats, calmly.
 */

const WEEKS = 52;

function fmtHours(h: number) {
  const n = h < 10 ? Number(h.toFixed(1)) : Math.round(h);
  return `${n.toLocaleString("en-US")} ${n === 1 ? "hour" : "hours"}`;
}

export function Estimate() {
  const [times, setTimes] = useState(6);
  const [mins, setMins] = useState(5);
  const [days, setDays] = useState(5);
  const hours = (times * mins * days * WEEKS) / 60;
  const titleId = useId();

  return (
    <div className={s.inst} role="group" aria-labelledby={titleId}>
      <p id={titleId} className={s.instBar}>{T.title}</p>
      <div className={s.instBody}>
        <p className={s.prompt}>{T.prompt}</p>
        <div className={s.ledger}>
          <Stepper op="" label={T.times} value={times} set={setTimes} min={1} max={99} />
          <Stepper op="×" label={T.minutes} value={mins} set={setMins} min={1} max={90} />
          <Stepper op="×" label={T.days} value={days} set={setDays} min={1} max={7} />
          <p className={s.row}>
            <span className={s.op} aria-hidden="true">×</span>
            <span className={s.rk}>{T.weeks}</span>
            <span className={s.lead} aria-hidden="true" />
            <span className={s.fixed}>{WEEKS}</span>
          </p>
          <div className={s.total}>
            <span className={s.totalK}>{T.total}</span>
            <output className={s.totalV} aria-live="polite">{fmtHours(hours)}</output>
          </div>
          <p className={s.after}>{T.after}</p>
        </div>
      </div>
    </div>
  );
}

function Stepper({
  op,
  label,
  value,
  set,
  min,
  max,
}: {
  op: string;
  label: string;
  value: number;
  set: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const hold = useRef<{ t: number; i: number }>({ t: 0, i: 0 });
  const id = useId();
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const stop = () => {
    window.clearTimeout(hold.current.t);
    window.clearInterval(hold.current.i);
  };
  useEffect(() => stop, []);

  const bump = (d: number) => {
    setDraft(null);
    set((v) => clamp(v + d));
  };
  const press = (d: number) => (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    stop();
    bump(d);
    // a button that disables itself at the limit stops receiving pointer
    // events, so the release is also caught on the window
    window.addEventListener("pointerup", stop, { once: true });
    window.addEventListener("pointercancel", stop, { once: true });
    hold.current.t = window.setTimeout(() => {
      hold.current.i = window.setInterval(() => bump(d), 90);
    }, 450);
  };
  // pointer presses step on pointerdown; this catches keyboard activation only
  const key = (d: number) => (e: React.MouseEvent) => {
    if (e.detail === 0) bump(d);
  };

  return (
    <div className={s.row}>
      <span className={cn(s.op, !op && s.opBlank)} aria-hidden="true">{op || "×"}</span>
      <label htmlFor={id} className={s.rk}>{label}</label>
      <span className={s.lead} aria-hidden="true" />
      <span className={s.stepper}>
        <button
          type="button"
          className={s.btn}
          aria-label={`${T.less}: ${label}`}
          aria-controls={id}
          disabled={value <= min}
          onPointerDown={press(-1)}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onClick={key(-1)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
        <input
          id={id}
          className={s.num}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={1}
          value={draft ?? String(value)}
          onChange={(e) => {
            const raw = e.target.value;
            setDraft(raw);
            const n = parseInt(raw, 10);
            if (!Number.isNaN(n)) set(clamp(n));
          }}
          onBlur={() => setDraft(null)}
        />
        <button
          type="button"
          className={s.btn}
          aria-label={`${T.more}: ${label}`}
          aria-controls={id}
          disabled={value >= max}
          onPointerDown={press(1)}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onClick={key(1)}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h8M6 2v8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
        </button>
      </span>
    </div>
  );
}
