"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../v6/shell";
import { V7_WORK } from "@/lib/content";
import n from "./work-notch.module.css";

/**
 * Services, shown instead of listed (Alec, 2026-09-28: "we don't want it too
 * busy but right now its too boring. the copy is perfect though.").
 * Left: the four services; the chosen one opens to show its copy (verbatim)
 * and link. Right: that service working, drawn in the hero's app style.
 * Nothing moves on its own: it changes only on hover, focus or click.
 * A notch in the window's left edge points at the chosen service (replaced the
 * thread stitch, 2026-09-29). The window is sticky, so the notch is measured
 * against the chosen row on change, on scroll and on resize.
 */
export function Work() {
  const [active, setActive] = useState(0);
  const items = V7_WORK.items;
  const listRef = useRef<HTMLUListElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [notch, setNotch] = useState<{ y: number; w: number; h: number } | null>(null);

  useEffect(() => {
    const list = listRef.current;
    const frame = frameRef.current;
    if (!list || !frame) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      if (!frame.offsetParent) return setNotch(null); // phones: the side window is hidden
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
    // the chosen row opens over 420ms; follow it while it does
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
    <Section id="work" kicker={V7_WORK.kicker} title={V7_WORK.title} titleMax="max-w-[22ch]">
      <div className="sv">
        <ul ref={listRef} className="sv-list" role="tablist" aria-label="Services">
          {items.map((w, i) => (
            <li key={w.title} role="presentation" className={cn("sv-item", i === active && "is-on")}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-controls={`sv-panel-${i}`}
                className="sv-head"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
              >
                <span className="sv-title">{w.title}</span>
                <span className="sv-chev" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </span>
              </button>
              <div className="sv-body" id={`sv-panel-${i}`} role="tabpanel">
                <div className="sv-body-in">
                  <p className="t-body">{w.body}</p>
                  {"link" in w && w.link && (
                    <a
                      href={w.link.href}
                      target="_blank"
                      rel="noopener"
                      className="relative after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] mt-3 inline-block font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent-deep"
                    >
                      {w.link.label} &rarr;
                    </a>
                  )}
                  <div className="sv-stage sv-stage-inline" aria-hidden="true">
                    <Preview i={i} />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="sv-stage sv-stage-side" aria-hidden="true">
          {notch && (
            <span
              className={n.wrap}
              style={{ "--ny": `${notch.y}px`, "--fw": `${notch.w}px`, "--fh": `${notch.h}px` } as CSSProperties}
            >
              <span className={n.notch} />
            </span>
          )}
          <div ref={frameRef} className="sv-frame">
            {items.map((w, i) => (
              <div key={w.title} className={cn("sv-shot", i === active && "is-on")}>
                <Preview i={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

const Tick = () => (
  <span className="sv-tick"><svg width="11" height="11" viewBox="0 0 14 14" fill="none"><path d="M3 7.4 5.7 10 11 4" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
);

function Preview({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="sv-app">
        <div className="sv-search">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.6" /><path d="M10.6 10.6 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          patient running late
        </div>
        <p className="sv-h">Patient is late. Can we still see them?</p>
        <div className="sv-cases">
          <div><p className="sv-k">Under 15 minutes</p><p>Check them in and tell the doctor&apos;s assistant.</p></div>
          <div className="is-hot"><p className="sv-k">Over 15 minutes</p><p>Offer the next open slot today, or rebook.</p></div>
        </div>
        <p className="sv-meta">Policy · updated by the office manager</p>
      </div>
    );
  if (i === 1)
    return (
      <div className="sv-app">
        <div className="sv-bar"><span className="sv-qb">qb</span>QuickBooks · bills entered today</div>
        {[["Medical supplies", "Supplies", "$1,284.60"], ["Janitorial service", "Cleaning", "$642.00"], ["Office supplies", "Office Supplies", "$89.47"], ["Internet service", "Utilities", "$129.99"]].map(([v, a, n]) => (
          <p key={v} className="sv-row"><Tick /><span>{v}</span><span className="sv-dim">{a}</span><span className="sv-amt">{n}</span></p>
        ))}
        <p className="sv-meta">Filed into the right vendor folders. Nothing entered twice.</p>
      </div>
    );
  if (i === 2)
    return (
      <div className="sv-app">
        <p className="sv-h">Time off request</p>
        <div className="sv-dl">
          <p><span>Who</span>Front desk</p>
          <p><span>When</span>Friday, half day</p>
          <p><span>Balance</span>32 hours left this year</p>
        </div>
        <div className="sv-steps">
          <p><Tick />Approved from a phone</p>
          <p><Tick />On the office calendar</p>
          <p><Tick />In this pay period&apos;s payroll report</p>
        </div>
      </div>
    );
  return (
    <div className="sv-app">
      <div className="sv-flow">
        <div className="sv-node"><p className="sv-k">Your EHR</p><p>Patient records</p></div>
        <span className="sv-arrow">&rarr;</span>
        <div className="sv-node is-hot"><p className="sv-k">Your AWS account</p><p>Covered by a BAA</p></div>
        <span className="sv-arrow">&rarr;</span>
        <div className="sv-node"><p className="sv-k">Your team</p><p>The work, done</p></div>
      </div>
      <p className="sv-meta">Patient data stays in an account in your practice&apos;s name, never on our servers.</p>
    </div>
  );
}
