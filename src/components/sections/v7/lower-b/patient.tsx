"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { PATIENT } from "@/lib/content";
import { MAP_LABELS as L, PATIENT_KICKER, PATIENT_TABS } from "./copy";
import { useInViewOnce } from "./use-in-view";
import s from "./patient.module.css";

/**
 * The lower half's one standout: where a practice's data goes, drawn.
 *
 * A fine-line map in the hero's hand. Left, the practice's own things (its
 * rules, prices and protocols; its patient charts). Middle, where the work
 * runs. Right, us. A three-state switch redraws it:
 *
 *  Most builds       rules, prices, protocols flow into the front desk answers;
 *                    the line from the charts stops short: "not your charts"
 *  Billing or claims the charts flow into an account in the practice's name
 *                    (the object, framed in terracotta), which shows its owner;
 *                    the line on to our servers stops short
 *  The BAA           the agreement between the two sides, signed first
 *
 * Every word is PATIENT's approved wording or a short label cut from it (see
 * copy.ts). No new claims. The switch is a tablist (arrow keys work); the
 * drawing's accessible name is the approved sentence for the state shown.
 * Nothing moves until the reader switches; reduced motion swaps instantly.
 */

type St = 0 | 1 | 2;
type Obj = "binder" | "charts" | "answers" | "account" | "servers" | "baa";

const ACTIVE: Record<St, Obj[]> = {
  0: ["binder", "charts", "answers"],
  1: ["charts", "account", "servers"],
  2: ["baa"],
};
/** the one object each state is about, framed in terracotta */
const SUBJECT: Record<St, Obj> = { 0: "answers", 1: "account", 2: "baa" };

const [HEAD_BAA, HEAD_MOST] = PATIENT.headline.split(/(?<=\.)\s+/);
const [FINE_ANSWERS, FINE_ACCOUNT] = PATIENT.fine.split(/(?<=\.)\s+/);
const SAYS: Record<St, string> = { 0: `${HEAD_MOST} ${FINE_ANSWERS}`, 1: FINE_ACCOUNT, 2: HEAD_BAA };

/* ── The objects, in local coordinates. One fine line, no fills. ───────── */

function Binder() {
  return (
    <>
      <rect x=".5" y=".5" width="92" height="76" rx="5" />
      <path d="M16 .5V76.5" />
      <rect x="10" y="13" width="12" height="6" rx="3" />
      <rect x="10" y="35" width="12" height="6" rx="3" />
      <rect x="10" y="57" width="12" height="6" rx="3" />
      <path d="M28 18H80" strokeWidth="1.8" />
      <path d="M28 32H80M28 44H74M28 56H80M28 66H64" opacity=".7" />
    </>
  );
}

function Charts() {
  return (
    <>
      <path d="M.5 18.5H58L64 10.5H92L98 18.5H103.5V26.5" opacity=".7" />
      <path d="M.5 26.5H10L16 18.5H44L50 26.5H103.5V87.5H.5Z" />
      <rect x="12" y="40" width="32" height="9" rx="2" />
      <path d="M12 62H90M12 72H70" opacity=".7" />
    </>
  );
}

function Answers({ frame }: { frame: string }) {
  return (
    <>
      <rect className={frame} x=".5" y=".5" width="219" height="99" rx="8" />
      <path d="M.5 20.5H219.5" />
      <rect x="14.5" y="32.5" width="150" height="18" rx="5" />
      <circle cx="25" cy="41.5" r="4" />
      <path d="M28 44.5L31 47.5" />
      <path d="M16 66H196M16 78H170M16 90H184" opacity=".7" />
    </>
  );
}

function Account({ frame, hatch, inner }: { frame: string; hatch: string; inner: string }) {
  return (
    <>
      <path d="M.5 22.5V8.5a8 8 0 0 1 8-8H231.5a8 8 0 0 1 8 8V22.5Z" fill={`url(#${hatch})`} stroke="none" className={inner} />
      <rect className={frame} x=".5" y=".5" width="239" height="99" rx="8" />
      <path d="M.5 22.5H239.5" />
      <g className={inner}>
        <text className={s.k} x="16" y="52">{L.owner}</text>
        <text className={s.v} x="96" y="52">{L.ownerValue}</text>
        <path d="M16 64H186" opacity=".45" />
        <text className={s.k} x="16" y="84">{L.setUp}</text>
        <text className={s.v} x="96" y="84">{L.setUpValue}</text>
      </g>
      {/* the job itself, a claim, running inside the account */}
      <rect x="198.5" y="36.5" width="28" height="40" rx="3" />
      <path d="M203 46H221M203 53H221" opacity=".7" />
      <rect x="203" y="61" width="6" height="6" rx="1.5" />
      <path d="M212 64H221" opacity=".7" />
    </>
  );
}

function Servers() {
  return (
    <>
      <rect x=".5" y=".5" width="99" height="34" rx="5" />
      <rect x=".5" y="39.5" width="99" height="34" rx="5" />
      <path d="M14 17.5H56M14 56.5H56" opacity=".7" />
      <circle cx="80" cy="17.5" r="3" />
      <circle cx="80" cy="56.5" r="3" />
    </>
  );
}

function Baa({ frame }: { frame: string }) {
  return (
    <>
      <rect className={frame} x=".5" y=".5" width="71" height="87" rx="4" />
      <text className={s.doc} x="36" y="24" textAnchor="middle">{L.baa}</text>
      <path d="M12 38H60M12 47H60M12 56H50" opacity=".7" />
      <path d="M8 76H30M42 76H64" />
    </>
  );
}

/* ── Two compositions of the same map: wide, and a phone column. ───────── */

type Place = { x: number; y: number; k?: number };
type Label = { lines: string[]; x: number; y: number; anchor?: "start" | "middle" | "end" };
type Line = { d: string; st: St; kind: "acc" | "stop"; bar?: string };
type Layout = {
  w: number;
  h: number;
  place: Record<Obj, Place>;
  labels: Record<Obj, Label>;
  parties: { practice: Label; us: Label };
  notes: Record<St, Label>;
  lines: Line[];
};

const WIDE: Layout = {
  w: 880,
  h: 452,
  place: {
    baa: { x: 404, y: 8 },
    binder: { x: 64, y: 146 },
    charts: { x: 58, y: 296 },
    answers: { x: 330, y: 148 },
    account: { x: 320, y: 306 },
    servers: { x: 740, y: 250 },
  },
  labels: {
    baa: { lines: [], x: 0, y: 0 },
    binder: { lines: [L.binder], x: 110, y: 248 },
    charts: { lines: [L.charts], x: 110, y: 410 },
    answers: { lines: [L.answers], x: 440, y: 274 },
    account: { lines: [L.account], x: 440, y: 432 },
    servers: { lines: [L.servers], x: 790, y: 350 },
  },
  parties: { practice: { lines: [L.practice], x: 110, y: 43 }, us: { lines: [L.us], x: 790, y: 43 } },
  notes: {
    0: { lines: [L.notCharts], x: 262, y: 280 },
    1: { lines: [L.neverOurs], x: 648, y: 390 },
    2: { lines: [L.signed], x: 440, y: 120 },
  },
  lines: [
    { st: 0, kind: "acc", d: "M158 184C240 184 262 198 328 198" },
    { st: 0, kind: "stop", d: "M164 336C210 336 236 318 257 301", bar: "M252 293L263 307" },
    { st: 1, kind: "acc", d: "M164 346C230 346 262 356 318 356" },
    { st: 1, kind: "stop", d: "M562 356C630 356 650 298 700 292", bar: "M705 282V302" },
    { st: 2, kind: "acc", d: "M178 38C272 38 330 84 410 84" },
    { st: 2, kind: "acc", d: "M770 38C640 38 548 84 470 84" },
  ],
};

const PHONE: Layout = {
  w: 360,
  h: 596,
  place: {
    baa: { x: 148, y: 4, k: 0.9 },
    binder: { x: 8, y: 138, k: 0.8 },
    charts: { x: 8, y: 300, k: 0.8 },
    answers: { x: 150, y: 134, k: 0.88 },
    account: { x: 128, y: 296, k: 0.9 },
    servers: { x: 190, y: 498, k: 0.8 },
  },
  labels: {
    baa: { lines: [], x: 0, y: 0 },
    binder: { lines: ["Rules, prices,", "protocols"], x: 8, y: 222, anchor: "start" },
    charts: { lines: [L.charts], x: 8, y: 392, anchor: "start" },
    answers: { lines: [L.answers], x: 245, y: 246 },
    account: { lines: ["An account in your", "practice's name"], x: 236, y: 408 },
    servers: { lines: [L.servers], x: 230, y: 580 },
  },
  parties: { practice: { lines: [L.practice], x: 66, y: 31 }, us: { lines: [L.us], x: 306, y: 31 } },
  notes: {
    0: { lines: [L.notCharts], x: 152, y: 278, anchor: "start" },
    1: { lines: [L.neverOurs], x: 250, y: 472, anchor: "end" },
    2: { lines: [L.signed], x: 180, y: 106 },
  },
  lines: [
    { st: 0, kind: "acc", d: "M83 168C110 168 124 178 148 178" },
    { st: 0, kind: "stop", d: "M93 322C120 322 128 282 140 262", bar: "M133 258L147 266" },
    { st: 1, kind: "acc", d: "M93 340C108 340 116 342 126 342" },
    { st: 1, kind: "stop", d: "M330 388C334 430 300 460 262 482", bar: "M258 475L266 489" },
    { st: 2, kind: "acc", d: "M134 27C150 27 144 72 154 72" },
    { st: 2, kind: "acc", d: "M290 27C236 27 222 72 206 72" },
  ],
};

function Text({ l, className }: { l: Label; className: string }) {
  return (
    <text className={className} x={l.x} y={l.y} textAnchor={l.anchor ?? "middle"}>
      {l.lines.map((t, i) => (
        <tspan key={t} x={l.x} dy={i ? 18 : 0}>
          {t}
        </tspan>
      ))}
    </text>
  );
}

function PatientMap({ lay, st, uid, className }: { lay: Layout; st: St; uid: string; className: string }) {
  const hatch = `${uid}-hatch`;
  const act = (o: Obj) => ACTIVE[st].includes(o);
  const obj = (o: Obj) => cn(s.obj, act(o) && s.act);
  const frame = (o: Obj) => cn(SUBJECT[st] === o && s.subject);
  const at = (o: Obj) => {
    const p = lay.place[o];
    return `translate(${p.x} ${p.y})${p.k ? ` scale(${p.k})` : ""}`;
  };
  const draw: Record<Obj, React.ReactNode> = {
    binder: <Binder />,
    charts: <Charts />,
    answers: <Answers frame={frame("answers")} />,
    account: <Account frame={frame("account")} hatch={hatch} inner={s.inner} />,
    servers: <Servers />,
    baa: <Baa frame={frame("baa")} />,
  };
  const order: Obj[] = ["baa", "binder", "charts", "answers", "account", "servers"];

  return (
    <svg className={cn(s.svg, className)} viewBox={`0 0 ${lay.w} ${lay.h}`} role="img" aria-label={SAYS[st]}>
      <defs>
        <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M0 0V6" className={s.hatch} />
        </pattern>
        {lay.lines.map((ln, i) =>
          ln.kind === "stop" ? (
            <mask key={i} id={`${uid}-m${i}`} maskUnits="userSpaceOnUse" x="0" y="0" width={lay.w} height={lay.h}>
              <path d={ln.d} pathLength={1} className={cn(s.reveal, ln.st === st && s.act)} />
            </mask>
          ) : null
        )}
      </defs>

      {order.map((o, i) => (
        <g key={o} className={obj(o)} style={{ "--i": i } as React.CSSProperties}>
          <g transform={at(o)}>{draw[o]}</g>
        </g>
      ))}

      {lay.lines.map((ln, i) =>
        ln.kind === "acc" ? (
          <path key={i} className={cn(s.thread, ln.st === st && s.act)} d={ln.d} pathLength={1} />
        ) : (
          <g key={i} className={cn(s.stop, ln.st === st && s.act)}>
            <path className={s.dash} d={ln.d} mask={`url(#${uid}-m${i})`} />
            <path className={s.bar} d={ln.bar} />
          </g>
        )
      )}

      <Text l={lay.parties.practice} className={cn(s.party, st === 2 && s.act)} />
      <Text l={lay.parties.us} className={cn(s.party, st === 2 && s.act)} />
      {order
        .filter((o) => lay.labels[o].lines.length)
        .map((o) => (
          <Text key={o} l={lay.labels[o]} className={cn(s.label, act(o) && s.act)} />
        ))}
      {([0, 1, 2] as St[]).map((n) => (
        <Text key={n} l={lay.notes[n]} className={cn(s.note, n === st && s.act)} />
      ))}
    </svg>
  );
}

export function Patient() {
  const [st, setSt] = useState<St>(0);
  const fig = useRef<HTMLDivElement>(null);
  const on = useInViewOnce(fig);
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    const to = e.key === "Home" ? 0 : e.key === "End" ? 2 : step ? (((st + step + 3) % 3) as St) : null;
    if (to === null) return;
    e.preventDefault();
    setSt(to as St);
    tabs.current[to]?.focus();
  };

  return (
    <Section
      id="patient-data"
      kicker={PATIENT_KICKER}
      titleMax="max-w-[27ch]"
      title={
        <>
          {HEAD_BAA} <span className="text-accent-display">{HEAD_MOST}</span>
        </>
      }
    >
      <div className={s.tabs} role="tablist" aria-label={PATIENT_KICKER} onKeyDown={onKey}>
        {PATIENT_TABS.map((t, i) => (
          <button
            key={t}
            ref={(el) => {
              tabs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`${uid}-tab${i}`}
            aria-selected={st === i}
            aria-controls={`${uid}-panel`}
            tabIndex={st === i ? 0 : -1}
            className={cn(s.tab, st === i && s.tabOn)}
            onClick={() => setSt(i as St)}
          >
            {t}
          </button>
        ))}
      </div>

      <div
        ref={fig}
        id={`${uid}-panel`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab${st}`}
        className={cn(s.fig, on && s.on)}
      >
        <PatientMap lay={WIDE} st={st} uid={`${uid}w`} className={s.wide} />
        <PatientMap lay={PHONE} st={st} uid={`${uid}p`} className={s.phone} />
      </div>
      <p className="t-fine mt-7 max-w-[64ch]">{PATIENT.fine}</p>
    </Section>
  );
}
