"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import s from "./claimstride.module.css";
import { instrument } from "./font";

/**
 * The /claimstride hero (rebuilt 2026-11-08 from the portfolio makeover). The
 * homepage's depth frame (the .dx entrance and spring physics from hero-depth.tsx)
 * now holds the current ClaimStride board: the live "claimstride-board" scene on
 * wide screens with a fine pointer, its still poster everywhere else (phones,
 * touch, reduced motion). Two satellites carry the two sourced numbers from
 * context/portfolio.md §4 (the 1,140-claim report, 16 Oct; the 97-claim first
 * live run, 21 Oct) and roll in after the window lands.
 * Sample clinic, made-up patients: the scene is the software's own sample data.
 */

const SCENE = { src: "/animations/claimstride-board/index.html", w: 720, h: 420 };
/** The app window inside the scene (the scene paints its own backdrop around it): we show only the window. */
const CROP = { x: 36, y: 18, w: 648 };
const LIVE_Q = "(min-width: 901px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function Mark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M46 15 A20 20 0 1 0 34 52" fill="none" stroke="#2FA7D6" strokeWidth="9" strokeLinecap="round" />
      <path d="M34 52 L58 18" fill="none" stroke="#3FD69B" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}

/** A number that rolls up from 9 to its digits; commas and spaces stay put. */
export function Roll({ value, go }: { value: string; go: boolean }) {
  return (
    <span className={s.roll} aria-hidden="true">
      {value.split("").map((ch, i) =>
        /\d/.test(ch) ? (
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
        ) : (
          <span key={i}>{ch}</span>
        ),
      )}
    </span>
  );
}

export function ClaimStrideHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const win = useRef<HTMLDivElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const s1 = useRef<HTMLDivElement>(null);
  const s2 = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [counts, setCounts] = useState(false);
  const [toast, setToast] = useState(false);
  const [live, setLive] = useState(false);
  const [scale, setScale] = useState(1);
  const [glow, setGlow] = useState<{ x: string; y: string } | null>(null);

  // entrance: window rises, the ink card rolls its count, the run card lands
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    if (reduce) {
      at(0, () => { setOn(true); setCounts(true); setToast(true); });
      return () => timers.forEach(clearTimeout);
    }
    at(60, () => setOn(true));
    at(1200, () => setCounts(true));
    at(2100, () => setToast(true));
    return () => timers.forEach(clearTimeout);
  }, []);

  // the live scene only where it reads well; it draws at 720x420 and is scaled to the box
  useEffect(() => {
    const mq = window.matchMedia(LIVE_Q);
    const sync = () => setLive(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const el = box.current;
    if (!live || !el) return;
    const fit = () => setScale(el.clientWidth / CROP.w);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [live]);

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
        aria-label="The ClaimStride board for a sample eye clinic: unpaid claims sorted by what each one needs, a denied Cigna claim opened with its reason, two numbered steps and the appeal deadline."
      >
        <div className="dx-backdrop" aria-hidden="true" />
        <div className="dx-stage" aria-hidden="true">
          <div className="dx-enter dx-enter-win">
            <div ref={win} className={cn("dx-win", s.win)}>
              <div ref={box} className={s.scene}>
                {live ? (
                  <iframe
                    src={SCENE.src}
                    title="The ClaimStride board sorting a sample clinic's unpaid claims"
                    width={SCENE.w}
                    height={SCENE.h}
                    tabIndex={-1}
                    className={s.sceneFrame}
                    style={{ width: SCENE.w, height: SCENE.h, transform: `translate(${-CROP.x * scale}px, ${-CROP.y * scale}px) scale(${scale})` }}
                  />
                ) : (
                  <picture>
                    <source media="(max-width: 640px)" srcSet="/claimstride/hero-phone.webp" />
                    <source srcSet="/claimstride/step-2-insurers-800.webp 800w, /claimstride/step-2-insurers.webp 1296w" sizes="(max-width: 900px) 92vw, 960px" />
                    <img
                      src="/claimstride/step-2-insurers.webp"
                      alt=""
                      width={1296}
                      height={804}
                      className={s.poster}
                      fetchPriority="high"
                    />
                  </picture>
                )}
              </div>
            </div>
          </div>

          <div className="dx-enter dx-enter-s1">
            <div
              ref={s1}
              className={cn("dx-sat", s.ink)}
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
              <span className={s.inkN}><Roll value="1,140" go={counts} /></span>
              <span className={s.inkT}>
                <b>claims read</b>
                <span>from a biller&apos;s real aging report, every total matching her own</span>
              </span>
            </div>
          </div>

          <div className={cn("dx-enter dx-enter-s2", toast && "is-in")}>
            <div ref={s2} className={cn("dx-sat", s.run)}>
              <p className={s.runH}>
                <span className={s.runTick}><Mark size={18} /></span>
                First live run
              </p>
              <p className={s.runN}>97 claims</p>
              <p className={s.runT}>checked with their insurers in about 2 minutes</p>
            </div>
          </div>
        </div>
      </div>
      <figcaption className="t-fine mt-5 text-center">
        ClaimStride on a sample eye clinic&apos;s claims. Made-up patients, the software&apos;s own screens.
      </figcaption>
    </figure>
  );
}
