"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hero option B, "the product, in depth" (Alec, 2026-09-28).
 * The tools as four layered panes in 3D space: the app frame at the back, the
 * answer card, the bills list and the approval in front. They settle into
 * place on load, then the whole scene tilts a few degrees toward the pointer
 * and drifts gently when the pointer is away. Reduced motion: settled, still.
 */
export function DepthHero() {
  const wrap = useRef<HTMLDivElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const t = window.setTimeout(() => setSettled(true), 60);
    if (reduce) return () => clearTimeout(t);

    let tx = 0, ty = 0, cx = 0, cy = 0, pointer = false, raf = 0;
    const start = performance.now();
    const onMove = (e: PointerEvent) => {
      const r = wrap.current?.getBoundingClientRect();
      if (!r) return;
      pointer = true;
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => { pointer = false; };
    const tick = (now: number) => {
      const s = (now - start) / 1000;
      const gx = pointer ? tx : Math.sin(s * 0.35) * 0.35;
      const gy = pointer ? ty : Math.cos(s * 0.28) * 0.25;
      cx += (gx - cx) * 0.06;
      cy += (gy - cy) * 0.06;
      if (scene.current) {
        scene.current.style.transform = `rotateX(${10 - cy * 5}deg) rotateY(${-12 + cx * 7}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const w = wrap.current;
    w?.addEventListener("pointermove", onMove);
    w?.addEventListener("pointerleave", onLeave);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      w?.removeEventListener("pointermove", onMove);
      w?.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure className="m-0 w-full">
      <div ref={wrap} className="dp" role="img" aria-label="Our tools, layered: the front desk app answering 'Refraction: collect or bill?', this week's bills entered in QuickBooks, and a time off request approved.">
        <div ref={scene} className={cn("dp-scene", settled && "is-settled")}>
          {/* back: the app frame */}
          <div className="dp-layer dp-frame" style={{ ["--z" as string]: "-90px", ["--d" as string]: "0ms" }}>
            <div className="dp-bar">
              <span className="is-on">Front desk answers</span>
              <span>Vendor bills</span>
              <span>Time off</span>
            </div>
            <div className="dp-search">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10.6 10.6 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              vision plan, medical complaint
            </div>
            <div className="dp-ghost" />
            <div className="dp-ghost dp-ghost-sm" />
          </div>

          {/* middle: the answer */}
          <div className="dp-layer dp-answer" style={{ ["--z" as string]: "0px", ["--d" as string]: "120ms" }}>
            <p className="dp-title">Refraction: collect or bill?</p>
            <p className="dp-body">The vision plan covers the refraction only when the visit bills as a routine exam.</p>
            <p className="dp-rule"><strong>Exception.</strong> If the visit bills medical, collect at checkout.</p>
          </div>

          {/* front: the bills */}
          <div className="dp-layer dp-bills" style={{ ["--z" as string]: "80px", ["--d" as string]: "240ms" }}>
            <p className="dp-label">This week&apos;s bills</p>
            {[["Lens lab", "$1,284.60"], ["Frame supplier", "$642.00"], ["Office supplies", "$89.47"]].map(([v, a]) => (
              <p key={v} className="dp-bill">
                <span className="dp-tick" aria-hidden="true">
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M3 7.4 5.7 10 11 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
                <span className="dp-bill-v">{v}</span>
                <span className="dp-bill-a">{a}</span>
              </p>
            ))}
            <p className="dp-foot">In QuickBooks, ready to pay</p>
          </div>

          {/* nearest: the approval */}
          <div className="dp-layer dp-approve" style={{ ["--z" as string]: "150px", ["--d" as string]: "360ms" }}>
            <p className="dp-label">Time off request</p>
            <p className="dp-approve-who">Friday, half day</p>
            <p className="dp-chip">Approved · on the calendar</p>
          </div>
        </div>
      </div>
      <figcaption className="t-fine mt-4 text-center">
        Drawn from the tools we built for a Kansas eye clinic. Names and amounts are examples.
      </figcaption>
    </figure>
  );
}
