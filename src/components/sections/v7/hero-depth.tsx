"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hero option B v2, "the product, in depth" (Alec, 2026-09-28: "the physics
 * have to be flawless and we have to look expensive").
 *
 * Built on what the expensive product sites actually do (Linear, Cursor,
 * Attio, Mercury, Superhuman, screenshots in the session): ONE large, dense,
 * real-looking app window on a framed backdrop, with depth coming from two
 * satellite panels that overlap its edges, not from tilting a pile of cards.
 * The main window barely moves (it has to stay readable); the satellites carry
 * the parallax.
 *
 * Physics: a damped spring per axis, integrated with the real frame time
 * (clamped), so it behaves the same at 60 and 120 Hz and after a tab switch.
 * The loop sleeps when the hero is off screen or the tab is hidden.
 * Entrance is CSS on an outer wrapper; pointer motion is JS on an inner one,
 * so the two never fight over one transform. Reduced motion: final state.
 */

const QUERY = "patient running late";

const FEED = [
  { t: "9:14", what: "Patient running late", out: "Answered" },
  { t: "9:31", what: "Medical supply invoice, $1,284.60", out: "In QuickBooks" },
  { t: "10:02", what: "Friday, half day", out: "Approved" },
];

export function DepthHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [typed, setTyped] = useState(0);
  const [answer, setAnswer] = useState(false);
  const [feed, setFeed] = useState(0);
  const [bills, setBills] = useState(0);
  const [toast, setToast] = useState(false);

  // entrance + the one-time story inside the window
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    if (reduce) {
      at(0, () => { setOn(true); setTyped(QUERY.length); setAnswer(true); setFeed(3); setBills(3); setToast(true); });
      return () => timers.forEach(clearTimeout);
    }
    at(60, () => setOn(true));
    for (let i = 1; i <= QUERY.length; i++) at(900 + i * 42, () => setTyped(i));
    at(300, () => setAnswer(true));
    const typedAt = 900 + QUERY.length * 42;
    at(typedAt + 250, () => setToast(true));
    [0, 1, 2].forEach((i) => at(typedAt + 700 + i * 480, () => setFeed(i + 1)));
    [0, 1, 2].forEach((i) => at(typedAt + 1300 + i * 380, () => setBills(i + 1)));
    return () => timers.forEach(clearTimeout);
  }, []);

  // pointer physics
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = wrap.current;
    if (!el) return;
    const K = 90;                       // stiffness
    const C = 2 * Math.sqrt(K) * 0.82;  // damping, a touch under critical: weight without wobble
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
        const s = (now - t0) / 1000;
        st.tx = Math.sin(s * 0.31) * 0.28;
        st.ty = Math.cos(s * 0.23) * 0.2;
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
    <figure className="m-0 w-full">
      <div
        ref={wrap}
        className={cn("dx", on && "is-on")}
        role="img"
        aria-label="Front desk results: about 5 hours back since Monday, 20 questions answered without the office manager, 12 bills entered in QuickBooks, 3 time off requests approved. A search for 'patient running late' opens the policy."
      >
        <div className="dx-backdrop" aria-hidden="true" />
        <div className="dx-stage" aria-hidden="true">
          <div className="dx-enter dx-enter-win">
            <div ref={win} className="dx-win">
              <aside className="dx-side">
                <div className="dx-brand"><span className="dx-av">FD</span>Front Desk</div>
                <p className="dx-nav-h">Front desk</p>
                {[["Home", ""], ["Answers", "35"], ["Prices", "41"], ["Doctors", "4"], ["Insurance", "12"]].map(([n, c]) => (
                  <p key={n} className={cn("dx-nav", n === "Home" && "is-on")}><span>{n}</span>{c && <em>{c}</em>}</p>
                ))}
                <p className="dx-nav-h">Office</p>
                {[["Bills", ""], ["Time off", ""], ["Payroll report", ""]].map(([n]) => (
                  <p key={n} className="dx-nav"><span>{n}</span></p>
                ))}
                <div className="dx-me"><span className="dx-av dx-av-sm">OM</span>Office manager</div>
              </aside>
              <main className="dx-main">
                <div className="dx-top">
                  <div className="dx-search">
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.6" /><path d="M10.6 10.6 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
                    <span>{QUERY.slice(0, typed)}</span><span className="dx-caret" />
                  </div>
                </div>
                <div className={cn("dx-page", answer && "is-in")}>
                  <p className="dx-h">Front desk results</p>
                  <p className="dx-meta">Updated as it happens</p>
                  <div className="dx-stats">
                    <div className="dx-stat dx-stat-big">
                      <p className="dx-stat-n">About 5 hours</p>
                      <p className="dx-stat-l">back since Monday</p>
                    </div>
                    <div className="dx-stat"><p className="dx-stat-n">20</p><p className="dx-stat-l">questions answered without the office manager</p></div>
                    <div className="dx-stat"><p className="dx-stat-n">12</p><p className="dx-stat-l">bills entered in QuickBooks</p></div>
                    <div className="dx-stat"><p className="dx-stat-n">3</p><p className="dx-stat-l">time off requests approved</p></div>
                  </div>
                  <p className="dx-rel-h">Today</p>
                  <ol className="dx-feed">
                    {FEED.map((f, i) => (
                      <li key={f.what} className={cn("dx-feed-row", i < feed && "is-in")}>
                        <span className="dx-feed-t">{f.t}</span>
                        <span className="dx-feed-w">{f.what}</span>
                        <span className="dx-feed-o">{f.out}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </main>
            </div>
          </div>

          <div className="dx-enter dx-enter-s1">
            <div ref={s1} className="dx-sat dx-bills">
              <div className="dx-sat-bar"><span className="dx-qb">qb</span>QuickBooks · bills entered today</div>
              {[["Medical supplies", "$1,284.60"], ["Janitorial service", "$642.00"], ["Office supplies", "$89.47"]].map(([v, a], i) => (
                <p key={v} className={cn("dx-bill", i < bills && "is-done")}>
                  <span className="dx-tick"><svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 7.4 5.7 10 11 4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <span>{v}</span><span className="dx-amt">{a}</span>
                </p>
              ))}
            </div>
          </div>

          <div className={cn("dx-enter dx-enter-s2", toast && "is-in")}>
            <div ref={s2} className="dx-sat dx-pop">
              <p className="dx-pop-q">Patient is late. Can we still see them?</p>
              <p className="dx-pop-r"><span>Under 15 min</span>Check them in.</p>
              <p className="dx-pop-r"><span>Over 15 min</span>Offer the next open slot.</p>
              <p className="dx-pop-f">Found in one search. Nobody walked over to ask.</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="t-fine mt-5 text-center">
        Drawn from the tools we built for a Kansas eye clinic. Names and amounts are examples.
      </figcaption>
    </figure>
  );
}
