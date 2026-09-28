"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { V7_WINDOW } from "@/lib/content";

type Tab = (typeof V7_WINDOW.tabs)[number];

const CYCLE_MS = 6500;

/**
 * The hero object: one app window, three real tools, one at a time.
 *
 * Calm on purpose (Alec, 2026-09-28: "a less interactive hero ... it's gotta be
 * clear"). It advances on its own every few seconds with a crossfade, and the
 * only motion inside a panel is its contents settling in once. It stops on
 * hover or keyboard focus so nobody reads against a timer, the tabs are real
 * buttons, and with reduced motion it never advances by itself.
 */
export function ToolWindow() {
  const tabs = V7_WINDOW.tabs;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const set = () => setReduced(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const id = window.setTimeout(() => setActive((i) => (i + 1) % tabs.length), CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [active, paused, reduced, tabs.length]);

  return (
    <figure className="m-0 w-full">
      <div
        ref={root}
        className="v7-window"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={(e) => {
          if (!root.current?.contains(e.relatedTarget as Node)) setPaused(false);
        }}
      >
        <div className="v7-window-bar" role="tablist" aria-label="Tools we build">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              id={`v7-tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`v7-panel-${t.id}`}
              onClick={() => setActive(i)}
              className={cn("v7-tab", i === active && "is-on")}
            >
              <span className="max-sm:hidden">{t.label}</span>
              <span className="sm:hidden">{t.short}</span>
              {i === active && !paused && !reduced && (
                <span key={`p${active}`} className="v7-tab-progress" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
        <div className="v7-window-body">
          {tabs.map((t, i) => (
            <div
              key={t.id}
              id={`v7-panel-${t.id}`}
              role="tabpanel"
              aria-labelledby={`v7-tab-${t.id}`}
              aria-hidden={i !== active}
              className={cn("v7-panel", i === active && "is-on")}
            >
              {i === active && <Panel tab={t} />}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="t-fine mt-4 text-center">{V7_WINDOW.caption}</figcaption>
    </figure>
  );
}

function Panel({ tab }: { tab: Tab }) {
  if (tab.id === "answers") {
    return (
      <div className="v7-p">
        <div className="v7-search v7-in" style={{ ["--d" as string]: "0ms" }}>
          <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="4.75" stroke="currentColor" strokeWidth="1.6" />
            <path d="M10.6 10.6 14 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="v7-typed">{tab.query}</span>
        </div>
        <div className="v7-card v7-in" style={{ ["--d" as string]: "700ms" }}>
          <p className="v7-card-title">{tab.title}</p>
          <p className="v7-card-body">{tab.body}</p>
          <p className="v7-card-rule">
            <strong>Exception.</strong> {tab.rule}
          </p>
          <p className="v7-card-meta">{tab.meta}</p>
        </div>
      </div>
    );
  }
  if (tab.id === "bills") {
    return (
      <div className="v7-p">
        <p className="v7-card-title v7-in" style={{ ["--d" as string]: "0ms" }}>{tab.title}</p>
        <div className="v7-table" role="table" aria-label={tab.title}>
          {tab.rows.map((r, i) => (
            <div key={r.vendor} role="row" className="v7-row v7-in" style={{ ["--d" as string]: `${250 + i * 260}ms` }}>
              <span role="cell" className="v7-row-vendor">{r.vendor}</span>
              <span role="cell" className="v7-row-to">{r.to}</span>
              <span role="cell" className="v7-row-amt">{r.amount}</span>
              <span role="cell" className="v7-check" aria-label="Filed">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7.4 5.7 10 11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
          ))}
        </div>
        <p className="v7-done v7-in" style={{ ["--d" as string]: "1500ms" }}>{tab.done}</p>
      </div>
    );
  }
  return (
    <div className="v7-p">
      <div className="v7-card v7-in" style={{ ["--d" as string]: "0ms" }}>
        <p className="v7-card-title">{tab.title}</p>
        <dl className="v7-dl">
          <div><dt>Who</dt><dd>{tab.who}</dd></div>
          <div><dt>When</dt><dd>{tab.when}</dd></div>
          <div><dt>Balance</dt><dd>{tab.balance}</dd></div>
        </dl>
      </div>
      <ol className="v7-steps">
        {tab.steps.map((s, i) => (
          <li key={s} className="v7-in" style={{ ["--d" as string]: `${500 + i * 380}ms` }}>
            <span className="v7-check" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7.4 5.7 10 11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
