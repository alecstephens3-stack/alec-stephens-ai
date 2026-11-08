"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import s from "./claimstride.module.css";

/**
 * How ClaimStride works, on the homepage's services switcher (.sv in globals.css,
 * work.tsx): four steps on the left, the chosen one opens; the current screen for
 * that step on the right, with the notch pointing at the chosen row. Nothing moves
 * on its own. Phones show each screen inside its open row.
 * Copy is the portfolio's vetted build copy (cases.yaml, claimstride, 8 Nov).
 * Screens are the software's own sample clinic (made-up patients).
 */

const STEPS = [
  {
    title: "Read the claims report",
    body: "ClaimStride reads the aging report your biller already exports, every format and every sheet. Nothing gets installed in your practice software, and nobody waits on a vendor integration.",
    img: "step-1-report",
    phone: "step-1-report-phone",
    w: 1440,
    h: 900,
    alt: "The ClaimStride board for a sample eye clinic: the week's aging report, open claims by age in coloured cards, and the oldest denials flagged in red",
  },
  {
    title: "Ask every insurer",
    body: "Unpaid claims go to their insurers in one run, through a healthcare clearinghouse. Where an insurer answers electronically, you get a clear status. Where it doesn't, the claim is marked for a call, never a guess. The cost shows before each run, with a monthly limit.",
    img: "step-2-insurers",
    phone: "hero-phone",
    w: 1296,
    h: 804,
    alt: "The sample clinic's claims after a run: a denied Cigna claim opened with its reason and steps, and a paid VSP claim ready to post",
  },
  {
    title: "Sort by what's needed",
    body: "Primary, secondary and tertiary claims kept apart, denials grouped by reason and age, and the nearest filing deadlines first. Press any number to see those claims.",
    img: "step-3-sort",
    phone: "step-3-sort-phone",
    w: 1440,
    h: 900,
    alt: "Denials to work for the sample clinic, filtered by deadline and by how each claim was denied, with one denied claim opened",
  },
  {
    title: "Write the next step",
    body: "Where the insurer or its payment file gives a reason, it's written in plain words with numbered steps and the filing deadline. Every claim gets a status, a follow-up date, a note and one line to paste into the practice software.",
    img: "step-4-next-step",
    phone: "step-4-next-step-phone",
    w: 1440,
    h: 900,
    alt: "A denied sample claim opened: the reason codes explained, five numbered steps, the appeal deadline in red, and buttons to set a status, a follow-up date and a note",
  },
];

function Shot({ st, eager = false, phone = false }: { st: (typeof STEPS)[number]; eager?: boolean; phone?: boolean }) {
  const img = (
    <img
      src={`/claimstride/${st.img}.webp`}
      srcSet={`/claimstride/${st.img}-800.webp 800w, /claimstride/${st.img}.webp ${st.w}w`}
      sizes="(max-width: 899px) 92vw, 600px"
      width={st.w}
      height={st.h}
      alt={st.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={s.shot}
    />
  );
  if (!phone) return img;
  // phones: a closer crop of the same screen, so its words can be read
  return (
    <picture>
      <source media="(max-width: 640px)" srcSet={`/claimstride/${st.phone}.webp`} />
      {img}
    </picture>
  );
}

export function ClaimStrideSteps() {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [notch, setNotch] = useState<{ y: number; w: number; h: number } | null>(null);

  // the notch follows the chosen row (same measuring as work.tsx)
  useEffect(() => {
    const list = listRef.current;
    const frame = frameRef.current;
    if (!list || !frame) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (!frame.offsetParent) return setNotch(null);
      const f = frame.getBoundingClientRect();
      if (f.bottom < 0 || f.top > window.innerHeight) return;
      const head = list.querySelector<HTMLElement>(".sv-item.is-on .sv-head");
      if (!head) return;
      const h = head.getBoundingClientRect();
      const y = Math.min(Math.max(h.top + h.height / 2 - f.top, 44), f.height - 44);
      setNotch({ y: Math.round(y), w: Math.round(f.width), h: Math.round(f.height) });
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    kick();
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    const ro = new ResizeObserver(kick);
    ro.observe(list);
    ro.observe(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
      ro.disconnect();
    };
  }, [active]);

  return (
    <div className={cn("sv", s.sv)}>
      <ul ref={listRef} className="sv-list" aria-label="How ClaimStride works">
        {STEPS.map((st, i) => (
          <li key={st.title} className={cn("sv-item", i === active && "is-on")}>
            <button
              type="button"
              aria-expanded={i === active}
              aria-controls={`cs-panel-${i}`}
              className="sv-head"
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
            >
              <span className="sv-title">
                <span className={s.stepN}>{i + 1}</span>
                {st.title}
              </span>
              <span className="sv-chev" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>
            <div className="sv-body" id={`cs-panel-${i}`}>
              <div className="sv-body-in">
                <p className="t-body">{st.body}</p>
                <div className={cn("sv-stage sv-stage-inline", s.inline)}>
                  <Shot st={st} phone />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="sv-stage sv-stage-side" aria-hidden="true">
        {notch && (
          <span
            className={s.notchWrap}
            style={{ "--ny": `${notch.y}px`, "--fw": `${notch.w}px`, "--fh": `${notch.h}px` } as CSSProperties}
          >
            <span className={s.notch} />
          </span>
        )}
        <div ref={frameRef} className={cn("sv-frame", s.frame)}>
          {STEPS.map((st, i) => (
            <div key={st.title} className={cn("sv-shot", i === active && "is-on")}>
              <Shot st={st} eager={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
