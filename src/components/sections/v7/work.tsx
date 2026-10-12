"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../v6/shell";
import { HOME_EN, type HomeCopy } from "@/lib/content";
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
type WorkCopy = HomeCopy["work"];

export function Work({ copy = HOME_EN.work }: { copy?: WorkCopy }) {
  const [active, setActive] = useState(0);
  const items = copy.items;
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
    <Section id="work" kicker={copy.kicker} title={copy.title} titleMax="max-w-[22ch]">
      <div className="sv">
        <ul ref={listRef} className="sv-list" role="tablist" aria-label={copy.tablistLabel}>
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
                    <Preview i={i} p={copy.previews} />
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
                <Preview i={i} p={copy.previews} />
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

function Preview({ i, p }: { i: number; p: WorkCopy["previews"] }) {
  if (i === 0)
    return (
      <div className="sv-app">
        <div className="sv-search">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.6" /><path d="M10.6 10.6 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          {p.answers.query}
        </div>
        <p className="sv-h">{p.answers.question}</p>
        <div className="sv-cases">
          {p.answers.cases.map((c, n) => (
            <div key={c.k} className={n === 1 ? "is-hot" : undefined}><p className="sv-k">{c.k}</p><p>{c.v}</p></div>
          ))}
        </div>
        <p className="sv-meta">{p.answers.meta}</p>
      </div>
    );
  if (i === 1)
    return (
      <div className="sv-app">
        <div className="sv-bar"><span className="sv-qb">qb</span>{p.bills.bar}</div>
        {p.bills.rows.map(([v, a, n]) => (
          <p key={v} className="sv-row"><Tick /><span>{v}</span><span className="sv-dim">{a}</span><span className="sv-amt">{n}</span></p>
        ))}
        <p className="sv-meta">{p.bills.meta}</p>
      </div>
    );
  if (i === 2)
    return (
      <div className="sv-app">
        <p className="sv-h">{p.timeoff.title}</p>
        <div className="sv-dl">
          {p.timeoff.rows.map(([k, v]) => (
            <p key={k}><span>{k}</span>{v}</p>
          ))}
        </div>
        <div className="sv-steps">
          {p.timeoff.steps.map((st) => (
            <p key={st}><Tick />{st}</p>
          ))}
        </div>
      </div>
    );
  return (
    <div className="sv-app">
      <div className="sv-flow">
        {p.systems.nodes.map((nd, n) => (
          <Fragment key={nd.k}>
            {n > 0 && <span className="sv-arrow">&rarr;</span>}
            <div className={n === 1 ? "sv-node is-hot" : "sv-node"}><p className="sv-k">{nd.k}</p><p>{nd.v}</p></div>
          </Fragment>
        ))}
      </div>
      <p className="sv-meta">{p.systems.meta}</p>
    </div>
  );
}
