"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../v6/shell";
import { ButtonLink } from "@/components/ui/button";
import { V7_MAP, V7_CTA } from "@/lib/content";

/**
 * The signature section (Alec, 2026-09-28: "whatever wows them and makes
 * Stephens AI feel high ticket"). A sample practice, drawn as an architect's
 * floor plan, then diagnosed: walls draw in when it scrolls into view, then
 * four markers land where the hours go, each tied to a build we have shipped.
 * It is the free audit's deliverable, shown instead of described.
 *
 * Motion is triggered once by visibility, never scrubbed by scroll (the lens
 * hero's scroll-driven growth read as buggy). Reduced motion: final state.
 */

// Walls: [path, delay order]. Gaps in the runs are doorways.
const WALLS = [
  "M40 40 H760", "M760 40 V480", "M40 480 H760", "M40 40 V150", "M40 210 V480",
  "M300 40 V230", "M300 285 V300",
  "M40 300 H80", "M130 300 H260", "M310 300 H420",
  "M220 300 V480", "M420 300 V480",
  "M420 300 H470", "M520 300 H640", "M690 300 H760", "M600 300 V480",
  "M420 40 V200", "M535 40 V200", "M650 40 V200",
  "M300 200 H340", "M385 200 H420",
  "M420 200 H445", "M490 200 H560", "M605 200 H675", "M720 200 H760",
];

// Door swings: quarter arcs in each gap.
const DOORS = [
  "M40 150 A60 60 0 0 1 100 210", "M80 300 A50 50 0 0 0 130 250", "M260 300 A50 50 0 0 1 310 250",
  "M300 230 A55 55 0 0 1 355 285", "M470 300 A50 50 0 0 1 520 250", "M640 300 A50 50 0 0 1 690 250",
  "M340 200 A45 45 0 0 0 385 155", "M445 200 A45 45 0 0 0 490 155", "M560 200 A45 45 0 0 0 605 155",
  "M675 200 A45 45 0 0 0 720 155",
];

const ROOMS = [
  { x: 180, y: 128, t: "Waiting room" }, { x: 360, y: 124, t: "Lab" },
  { x: 477, y: 82, t: "Exam 1" }, { x: 592, y: 82, t: "Exam 2" }, { x: 705, y: 82, t: "Exam 3" },
  { x: 130, y: 342, t: "Office manager" }, { x: 320, y: 342, t: "Back office" },
  { x: 510, y: 342, t: "Billing" }, { x: 680, y: 342, t: "Break room" }, { x: 590, y: 256, t: "Hall" },
];

const MARKERS: Record<string, { x: number; y: number }> = {
  desk: { x: 232, y: 238 },
  om: { x: 130, y: 408 },
  billing: { x: 510, y: 400 },
  office: { x: 320, y: 408 },
};

export function PracticeMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);
  const [shown, setShown] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  const [auto, setAuto] = useState(0);
  const n = V7_MAP.findings.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      setShown(n);
      return;
    }
    const timers: number[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setDrawn(true);
        for (let i = 1; i <= n; i++) timers.push(window.setTimeout(() => setShown(i), 1900 + i * 850));
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [n]);

  // Once everything is on the plan, the highlight walks the findings slowly.
  useEffect(() => {
    if (shown < n || focus) return;
    const id = window.setInterval(() => setAuto((a) => (a + 1) % n), 3200);
    return () => window.clearInterval(id);
  }, [shown, n, focus]);

  const active = focus ?? (shown >= n ? V7_MAP.findings[auto].id : V7_MAP.findings[Math.max(0, shown - 1)]?.id);

  return (
    <Section id="audit" kicker={V7_MAP.kicker} title={V7_MAP.title} titleMax="max-w-[22ch]">
      <p className="t-body -mt-4 mb-12 max-w-[56ch] md:mb-14">{V7_MAP.lead}</p>
      <div ref={ref} className={cn("pm sai-pane-strong", drawn && "is-drawn")}>
        <div className="pm-grid">
          <figure className="pm-plan m-0">
            <p className="pm-stamp">{V7_MAP.stamp}</p>
            <svg
              viewBox="0 0 800 520"
              role="img"
              aria-label="Floor plan of a sample practice: waiting room and front desk, lab, three exam rooms, office manager, back office, billing and break room, with four places marked where staff lose time."
            >
              <defs>
                <pattern id="pm-dots" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" className="pm-dot" />
                </pattern>
              </defs>
              <rect x="0" y="0" width="800" height="520" fill="url(#pm-dots)" />
              <rect x="40" y="40" width="720" height="440" className="pm-floor" />

              {/* furniture, fine line */}
              <g className="pm-furn">
                {[60, 92, 124, 156].map((x) => <rect key={x} x={x} y="58" width="22" height="22" rx="4" />)}
                {[160, 192, 224].map((y) => <rect key={y} x="58" y={y} width="22" height="22" rx="4" />)}
                <path d="M168 205 H282 V286" className="pm-counter" />
                <circle cx="232" cy="238" r="8" />
                <rect x="312" y="56" width="96" height="20" rx="3" />
                {[477, 592, 705].map((x) => (
                  <g key={x}>
                    <rect x={x - 15} y="110" width="30" height="62" rx="12" />
                    <circle cx={x + 32} cy="160" r="7" />
                  </g>
                ))}
                <rect x="70" y="400" width="96" height="40" rx="3" />
                <rect x="256" y="400" width="130" height="40" rx="3" />
                <rect x="452" y="392" width="116" height="40" rx="3" />
                <circle cx="680" cy="400" r="26" />
                {[[680, 362], [680, 438], [642, 400], [718, 400]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="7" />)}
              </g>

              <g className="pm-doors">
                {DOORS.map((d) => <path key={d} d={d} pathLength={1} />)}
              </g>
              <g className="pm-walls">
                {WALLS.map((d, i) => (
                  <path key={d} d={d} pathLength={1} style={{ transitionDelay: `${Math.round(i * 38)}ms` }} />
                ))}
              </g>

              <g className="pm-labels" aria-hidden="true">
                {ROOMS.map((r) => (
                  <text key={r.t} x={r.x} y={r.y} textAnchor="middle">{r.t}</text>
                ))}
                <text x="222" y="186" textAnchor="middle">Front desk</text>
              </g>

              {V7_MAP.findings.map((f, i) => {
                const m = MARKERS[f.id];
                return (
                  <g
                    key={f.id}
                    className={cn("pm-marker", i < shown && "is-in", active === f.id && "is-on")}
                    onMouseEnter={() => setFocus(f.id)}
                    onMouseLeave={() => setFocus(null)}
                  >
                    <circle cx={m.x} cy={m.y} r="16" className="pm-ring" />
                    <circle cx={m.x} cy={m.y} r="16" className="pm-pin" />
                    <text x={m.x} y={m.y + 6} textAnchor="middle" className="pm-num">{f.n}</text>
                  </g>
                );
              })}
            </svg>
          </figure>

          <ol className="pm-list">
            {V7_MAP.findings.map((f, i) => (
              <li
                key={f.id}
                className={cn("pm-item", i < shown && "is-in", active === f.id && "is-on")}
                onMouseEnter={() => setFocus(f.id)}
                onMouseLeave={() => setFocus(null)}
              >
                <span className="pm-badge" aria-hidden="true">{f.n}</span>
                <div>
                  <p className="pm-where">{f.where}</p>
                  <p className="pm-problem">{f.problem}</p>
                  <p className="pm-fix">
                    <span aria-hidden="true">&rarr;</span> {f.fix}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="mt-9">
        <ButtonLink href={V7_CTA.href} external>
          {V7_CTA.label}
        </ButtonLink>
      </div>
    </Section>
  );
}
