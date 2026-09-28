"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Hero option A, "paper in, software out" (Alec, 2026-09-28).
 * Three pieces of real-looking office paper sit on the left. One at a time,
 * the top sheet lifts, flies into the window and comes out as finished work.
 * Then the desk is restacked and it runs again. Reduced motion: final state.
 */

const JOBS = [
  {
    id: "note",
    title: "Refraction: collect or bill?",
    detail: "Answered in one search: collect at checkout if the visit bills medical.",
    meta: "Front desk",
  },
  {
    id: "slip",
    title: "Time off, Friday half day",
    detail: "Approved, on the calendar, in this week's payroll report.",
    meta: "Office manager",
  },
  {
    id: "invoice",
    title: "Lakeview Lens Lab, $1,284.60",
    detail: "Read, filed and entered in QuickBooks.",
    meta: "Bookkeeper",
  },
] as const;

type Phase = "idle" | "flying" | "done";

export function PaperHero() {
  const stage = useRef<HTMLDivElement>(null);
  const papers = useRef<Record<string, HTMLDivElement | null>>({});
  const slots = useRef<Record<string, HTMLLIElement | null>>({});
  const [state, setState] = useState<Record<string, Phase>>({ note: "idle", slip: "idle", invoice: "idle" });
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      const id = window.setTimeout(() => setState({ note: "done", slip: "done", invoice: "done" }), 0);
      return () => clearTimeout(id);
    }
    let cancelled = false;
    const timers: number[] = [];
    const wait = (ms: number) => new Promise<void>((r) => timers.push(window.setTimeout(r, ms)));

    const fly = async (id: string) => {
      const el = papers.current[id];
      const slot = slots.current[id];
      const st = stage.current;
      if (!el || !slot || !st) return;
      const a = el.getBoundingClientRect();
      const b = slot.getBoundingClientRect();
      const dx = b.left + 40 - (a.left + a.width / 2);
      const dy = b.top + b.height / 2 - (a.top + a.height / 2);
      const base = getComputedStyle(el).transform;
      setState((s) => ({ ...s, [id]: "flying" }));
      const anim = el.animate(
        [
          { transform: base, opacity: 1, offset: 0 },
          { transform: `${base} translate(0px, -18px) scale(1.04)`, opacity: 1, offset: 0.22 },
          { transform: `translate(${dx}px, ${dy}px) rotate(0deg) scale(0.14)`, opacity: 0, offset: 1 },
        ],
        { duration: 1300, easing: "cubic-bezier(.55,0,.2,1)", fill: "forwards" }
      );
      await anim.finished.catch(() => undefined);
      if (cancelled) return;
      setState((s) => ({ ...s, [id]: "done" }));
    };

    const run = async () => {
      await wait(1200);
      for (const job of JOBS) {
        if (cancelled) return;
        await fly(job.id);
        await wait(1100);
      }
      await wait(3600);
      if (cancelled) return;
      // restack: clear the finished rows, bring the paper back
      Object.values(papers.current).forEach((el) => el?.getAnimations().forEach((an) => an.cancel()));
      setState({ note: "idle", slip: "idle", invoice: "idle" });
      setCycle((c) => c + 1);
    };
    run();
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [cycle]);

  const doneCount = Object.values(state).filter((s) => s === "done").length;

  return (
    <figure className="m-0 w-full">
      <div ref={stage} className="pp">
        <div className="pp-desk" aria-hidden="true" key={`desk-${cycle}`}>
          {/* bottom of the stack first */}
          <div ref={(el) => { papers.current.invoice = el; }} className="pp-paper pp-invoice">
            <p className="pp-lh">Lakeview Lens Lab</p>
            <p className="pp-small">Invoice 20418 · Due in 30 days</p>
            <div className="pp-lines">
              <p><span>Progressive lenses × 4</span><span>$896.00</span></p>
              <p><span>AR coating × 4</span><span>$312.00</span></p>
              <p><span>Shipping</span><span>$76.60</span></p>
            </div>
            <p className="pp-total"><span>Total</span><span>$1,284.60</span></p>
          </div>
          <div ref={(el) => { papers.current.slip = el; }} className="pp-paper pp-slip">
            <p className="pp-form">Time off request</p>
            <p className="pp-field"><span>Name</span><em>Front desk</em></p>
            <p className="pp-field"><span>Date</span><em>Fri, half day</em></p>
            <p className="pp-field"><span>Signed</span><em>J.R.</em></p>
          </div>
          <div ref={(el) => { papers.current.note = el; }} className="pp-paper pp-note">
            <p className="pp-form">While you were out</p>
            <p className="pp-hand">Refraction: collect or bill?</p>
            <p className="pp-hand pp-hand-sm">pt on line 2</p>
          </div>
        </div>

        <div className="pp-flow" aria-hidden="true">
          <span />
        </div>

        <div className="pp-window">
          <div className="pp-bar">
            <p className="pp-bar-title">Today</p>
            <p className="pp-bar-count">{doneCount} of 3 done</p>
          </div>
          <ol className="pp-list">
            {JOBS.map((j) => (
              <li
                key={j.id}
                ref={(el) => { slots.current[j.id] = el; }}
                className={cn("pp-row", state[j.id] === "done" && "is-done")}
              >
                <span className="pp-check" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M3 7.4 5.7 10 11 4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <p className="pp-row-title">{j.title}</p>
                  <p className="pp-row-detail">{j.detail}</p>
                </div>
                <p className="pp-row-meta">{j.meta}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <figcaption className="t-fine mt-4 text-center">
        Paper in, finished work out. Names and amounts are examples.
      </figcaption>
    </figure>
  );
}
