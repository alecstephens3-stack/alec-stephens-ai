"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../v6/shell";
import { V7_WORK } from "@/lib/content";

/**
 * Services, shown instead of listed (Alec, 2026-09-28: "we don't want it too
 * busy but right now its too boring. the copy is perfect though.").
 * Left: the four services; the chosen one opens to show its copy (verbatim)
 * and link. Right: that service working, drawn in the hero's app style.
 * Nothing moves on its own: it changes only on hover, focus or click.
 */
export function Work() {
  const [active, setActive] = useState(0);
  const items = V7_WORK.items;

  return (
    <Section id="work" title={V7_WORK.title} accent={V7_WORK.accent}>
      <div className="sv">
        <ul className="sv-list" role="tablist" aria-label="Services">
          {items.map((w, i) => (
            <li key={w.title} className={cn("sv-item", i === active && "is-on")}>
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
                      className="mt-3 inline-block font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent-deep"
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
          <div className="sv-frame">
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
