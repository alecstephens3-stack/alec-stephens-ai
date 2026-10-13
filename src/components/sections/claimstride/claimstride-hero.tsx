"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import s from "./claimstride.module.css";
import { instrument } from "./font";

/**
 * The /claimstride hero (2026-10-13): the homepage's depth hero (hero-depth.tsx,
 * the same .dx frame, entrance and spring physics) with ClaimStride's worklist in
 * the window instead of the knowledge base. Alec: "same hero style as
 * stephensai.co, moving parts".
 *
 * The page around it is Stephens AI's; the window wears ClaimStride's own look
 * (direction 8, "C-check": ink, ocean, mint, Instrument Sans), because the
 * product has its own brand. Every word in the window is the claims tool's own
 * output for its sample eye clinic (made-up patients), not copy written for the
 * page: claim EC-3017 from `/api/monitor/sample?practice=eye-care`, Oct 13.
 *
 * The story runs once: the window rises, the tile counts roll, the claim's steps
 * come in one by one, the days-left counter rolls to 18, the Payor Note toast lands.
 * Only what the app does: its steps are a numbered list, so they never tick.
 * Reduced motion: the final state, still.
 */

const TILES = [
  { label: "Needs action", n: "8", sub: "$1,536.00 unpaid", tone: "bad" },
  { label: "Not on file at payer", n: "1", sub: "$148.00 unpaid", tone: "bad" },
  { label: "No electronic status", n: "2", sub: "$634.00 unpaid", tone: "mute" },
  { label: "Paid", n: "5", sub: "$443.17 paid", tone: "good" },
] as const;

const STEPS = [
  "Post the $118.30 payment from Cigna in Compulink if it is not already posted.",
  "Check the chart to confirm the visit was a separate, significant service with its own documentation.",
  "If the visit was separate and significant, add modifier 25 to 99213 and send Cigna an appeal with the corrected claim by Oct 30, 2026.",
];

const NOTE =
  "Denied. Cigna counts the office visit (99213, $128.00) as part of another service it paid (CO-97). Next: Check the chart to confirm the visit was a separate, significant service with its own documentation. Appeal due 10/30/2026.";

function Mark({ size, onInk = true }: { size: number; onInk?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M46 15 A20 20 0 1 0 34 52" fill="none" stroke={onInk ? "#2FA7D6" : "#0E7FA8"} strokeWidth="9" strokeLinecap="round" />
      <path d="M34 52 L58 18" fill="none" stroke={onInk ? "#3FD69B" : "#1FB57A"} strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

/** A number that rolls from 9 down to its digits, like the app's tile counts. */
function Roll({ value, go }: { value: string; go: boolean }) {
  return (
    <span className={s.roll} aria-hidden="true">
      {value.split("").map((ch, i) => (
        <span key={i} className={s.rollDigit}>
          <span
            className={s.rollStrip}
            style={{ transform: `translateY(-${(go ? Number(ch) : 9) * 10}%)`, transitionDelay: `${i * 70}ms` }}
          >
            {"0123456789".split("").map((d) => (
              <span key={d}>{d}</span>
            ))}
          </span>
        </span>
      ))}
    </span>
  );
}

export function ClaimStrideHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [counts, setCounts] = useState(false);
  const [card, setCard] = useState(false);
  const [ticked, setTicked] = useState(0);
  const [days, setDays] = useState(false);
  const [toast, setToast] = useState(false);
  const [glow, setGlow] = useState<{ x: string; y: string } | null>(null);

  // entrance + the one-time story inside the window
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    if (reduce) {
      at(0, () => { setOn(true); setCounts(true); setCard(true); setTicked(STEPS.length); setDays(true); setToast(true); });
      return () => timers.forEach(clearTimeout);
    }
    at(60, () => setOn(true));
    at(700, () => setCounts(true));
    at(1100, () => setCard(true));
    at(1500, () => setDays(true));
    STEPS.forEach((_, i) => at(1700 + i * 420, () => setTicked(i + 1)));
    at(1700 + STEPS.length * 420 + 500, () => setToast(true));
    return () => timers.forEach(clearTimeout);
  }, []);

  // pointer physics: the homepage's damped spring (hero-depth.tsx), unchanged
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrap.current;
    if (!el) return;
    const K = 90;
    const C = 2 * Math.sqrt(K) * 0.82;
    const st = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    let pointer = false, raf = 0, last = 0, visible = true;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      pointer = true;
      st.tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      st.ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
    };
    const onLeave = () => { pointer = false; };

    const frame = (now: number) => {
      const dt = Math.min(0.033, last ? (now - last) / 1000 : 0.016);
      last = now;
      if (!pointer) {
        const t = (now - t0) / 1000;
        st.tx = Math.sin(t * 0.31) * 0.28;
        st.ty = Math.cos(t * 0.23) * 0.2;
      }
      st.vx += (K * (st.tx - st.x) - C * st.vx) * dt;
      st.vy += (K * (st.ty - st.y) - C * st.vy) * dt;
      st.x += st.vx * dt;
      st.y += st.vy * dt;
      const { x, y } = st;
      if (win.current) win.current.style.transform = `rotateX(${(-y * 1.4).toFixed(3)}deg) rotateY(${(x * 2).toFixed(3)}deg)`;
      if (s1.current) s1.current.style.transform = `translate3d(${(-x * 16).toFixed(2)}px, ${(-y * 11).toFixed(2)}px, 0) rotate(${(x * 0.6).toFixed(3)}deg)`;
      if (s2.current) s2.current.style.transform = `translate3d(${(x * 22).toFixed(2)}px, ${(y * 14).toFixed(2)}px, 0) rotate(${(-x * 0.5).toFixed(3)}deg)`;
      raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };
    const wake = () => { if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); } };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; wake(); });
    io.observe(el);
    document.addEventListener("visibilitychange", wake);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure className={cn("m-0 w-full", instrument.className)}>
      <div
        ref={wrap}
        className={cn("dx", s.dx, on && "is-on")}
        role="img"
        aria-label="ClaimStride's claims worklist for a sample eye clinic. A denied Cigna claim shows the reason, three steps to fix it and 18 days left to appeal, with a note ready to paste into Compulink."
      >
        <div className="dx-backdrop" aria-hidden="true" />
        <div className="dx-stage" aria-hidden="true">
          <div className="dx-enter dx-enter-win">
            <div ref={win} className={cn("dx-win", s.win)}>
              <div className={s.bar}>
                <span className={s.brand}><Mark size={24} />ClaimStride</span>
                <span className={s.navPill}>Claims worklist</span>
                <span className={s.office}><b>Sample Eye Clinic</b> · made-up patients</span>
              </div>
              <div className={s.body}>
                <p className={s.kick}>Claims worklist</p>
                <p className={s.h}>Claims that need action this week</p>
                <div className={s.tiles}>
                  {TILES.map((t) => (
                    <div key={t.label} className={s.tile}>
                      <span className={cn(s.chip, s[t.tone])}>{t.label}</span>
                      <span className={s.n}><Roll value={t.n} go={counts} /></span>
                      <span className={s.sub}>{t.sub}</span>
                    </div>
                  ))}
                </div>
                <div className={cn(s.card, card && s.cardIn)}>
                  <div className={s.who}>
                    <span className={s.id}>EC-3017</span>
                    <b>Joanna Pruitt</b>
                    <span>Cigna</span>
                  </div>
                  <div className={s.mid}>
                    <p className={s.lead}>Appeal by Oct 30, 2026 (18 days left)</p>
                    <span className={cn(s.chip, s.bad)}>Denied</span>
                    <p className={s.why}>Cigna counts the office visit (99213, $128.00) as part of another service it paid (CO-97).</p>
                    <ol className={s.steps}>
                      {STEPS.map((t, i) => (
                        <li key={t} className={cn(i < ticked && s.shown)}>{t}</li>
                      ))}
                    </ol>
                  </div>
                  <div className={s.amt}>
                    <b>$298.00</b>
                    <span>billed</span>
                    <span>$128.00 unpaid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="dx-enter dx-enter-s1">
            <div
              ref={s1}
              className={cn("dx-sat", s.days)}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setGlow({ x: `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`, y: `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%` });
              }}
              onPointerLeave={() => setGlow(null)}
            >
              <span
                className={s.glow}
                style={{ opacity: glow ? 1 : 0, background: `radial-gradient(220px circle at ${glow?.x ?? "50%"} ${glow?.y ?? "0%"}, rgba(92,200,236,.3), rgba(92,200,236,.09) 38%, transparent 62%)` }}
              />
              <span className={s.daysN}><Roll value="18" go={days} /></span>
              <span className={s.daysT}>
                <b>days left</b>
                <span>Appeal by Oct 30</span>
              </span>
            </div>
          </div>

          <div className={cn("dx-enter dx-enter-s2", toast && "is-in")}>
            <div ref={s2} className={cn("dx-sat", s.note)}>
              <p className={s.noteH}>
                <span className={s.noteTick}><Mark size={18} onInk={false} /></span>
                Copied
              </p>
              <p className={s.noteT}>{NOTE}</p>
              <p className={s.noteF}>Status: Appeal. Follow Up: 10/19/2026. Paste the line into the Payor Note in Compulink.</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="t-fine mt-5 text-center">
        ClaimStride on a sample eye clinic&apos;s claims. Made-up patients, the software&apos;s own words.
      </figcaption>
    </figure>
  );
}
