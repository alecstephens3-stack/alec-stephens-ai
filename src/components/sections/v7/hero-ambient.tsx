"use client";

import { useEffect, useRef, useState } from "react";
import s from "./hero-ambient.module.css";

/**
 * The hero's side strips: threads (Alec and Jusheen's pick, 2026-09-29, from
 * seven built options; the others are in git history at ae8b019). After
 * Impilo's hero, found by the web design scout on Lapa Ninja.
 *
 * Real things from a practice, drawn in one fine line: a tooth, a claim form
 * and an appointment book on the left; a trial lens frame, a vendor bill and
 * an intake clipboard on the right. Each has a thread that plugs into the top
 * edge of the product window at a small socket. The threads draw themselves in
 * once on load; after that a short piece of light travels one thread at a time
 * (Impilo's move: quick, then a long rest) and the socket pulses when it
 * arrives. Everything scattered ends in one place. Paused off screen.
 *
 * The threads are measured to the product window's frame, so they land on it
 * at any width. An exception to the Lens v4 motion rule (nothing on a timer
 * except the hero window), made at Alec's request, kept honest by: nothing
 * under the header pill or behind glass; hidden under 1100px; CSS animations
 * only; reduced motion shows the drawn threads, still.
 */

type Thing = { x: number; y: number; w: number; h: number; draw: React.ReactNode };
type Geo = { w: number; top: number; left: number; right: number };

export function HeroAmbient() {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geo | null>(null);
  const [live, setLive] = useState(true);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const io = new IntersectionObserver(([e]) => setLive(e.isIntersecting));
    io.observe(root);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const root = ref.current;
    const hero = root?.parentElement;
    const frame = hero?.querySelector<HTMLElement>(".dx");
    if (!root || !hero || !frame) return;
    // ResizeObserver fires once on observe, so this also takes the first reading
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect();
      const f = frame.getBoundingClientRect();
      setGeo({ w: r.width, top: Math.round(f.top - r.top), left: Math.round(f.left - r.left), right: Math.round(r.right - f.right) });
    });
    ro.observe(hero);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${s.amb} ${live ? "" : s.paused}`} style={geo ? { height: geo.top + 24 } : undefined} aria-hidden="true">
      {geo && geo.w >= 1100 && (
        <>
          <Strand side={0} things={LEFT} half={geo.w / 2} top={geo.top} edge={geo.left} />
          <Strand side={1} things={RIGHT} half={geo.w / 2} top={geo.top} edge={geo.right} />
        </>
      )}
    </div>
  );
}

/** One side. Drawn in the left strip's own coordinates (x = 0 at the outer
    screen edge); the right strip is the same drawing mirrored. */
function Strand({ side, things, half, top, edge }: { side: 0 | 1; things: Thing[]; half: number; top: number; edge: number }) {
  const h = top + 24;
  const paths = things.map((t, i) => {
    const sx = t.x + t.w + 10;
    const sy = t.y + t.h / 2;
    // the top thing takes the outermost socket, so the threads nest, never cross
    const k = things.length - 1 - i;
    const ex = edge + 42 + k * 46;
    return { d: `M${sx} ${sy}C${sx + 70} ${sy + 6} ${ex} ${top - 170 + k * 26} ${ex} ${top}`, ex };
  });
  return (
    <div className={`${s.strand} ${side ? s.right : s.left}`} style={{ width: half, height: h }}>
      <svg className={s.svg} width={half} height={h} viewBox={`0 0 ${half} ${h}`}>
        {paths.map((p, i) => (
          <path key={`t${i}`} className={s.thread} d={p.d} pathLength={1} style={{ animationDelay: `${1.1 + i * 0.22 + side * 0.11}s` }} />
        ))}
        {paths.map((p, i) => (
          <path
            key={`c${i}`}
            className={s.comet}
            d={p.d}
            pathLength={1}
            style={{ animationDuration: `${dur(i)}s`, animationDelay: `${start(i, side)}s` }}
          />
        ))}
        {things.map((t, i) => (
          <g key={`o${i}`} className={s.obj} style={{ animationDelay: `${0.5 + i * 0.15 + side * 0.08}s` }}>
            <g transform={`translate(${t.x} ${t.y})`}>{t.draw}</g>
          </g>
        ))}
        {paths.map((p, i) => (
          <g key={`s${i}`} className={s.socket} style={{ animationDelay: `${1.9 + i * 0.22 + side * 0.11}s` }}>
            <circle
              className={s.ping}
              cx={p.ex}
              cy={top}
              r={3.5}
              style={{ animationDuration: `${dur(i)}s`, animationDelay: `${start(i, side)}s` }}
            />
            <circle className={s.port} cx={p.ex} cy={top} r={3.5} />
          </g>
        ))}
      </svg>
    </div>
  );
}

// each thread keeps its own calm rhythm, so the pieces never march in step
const dur = (i: number) => 11 + i * 2.3;
const start = (i: number, side: number) => 3 + i * 3.4 + side * 1.7;

/* ── The drawings: one line weight, no fills, no text. ────────────────── */

function ticks(cx: number, cy: number, r1: number, r2: number, n: number) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    d += `M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}L${(cx + Math.cos(a) * r2).toFixed(1)} ${(cy + Math.sin(a) * r2).toFixed(1)}`;
  }
  return d;
}

const MOLAR = (
  <>
    <path d="M14 28C12 12 28 6 37 13C41 9 49 9 53 13C62 6 78 12 76 28C75 40 69 46 67 58C65 71 63 84 57 84C51 84 50 70 45 62C40 70 39 84 33 84C27 84 25 71 23 58C21 46 15 40 14 28Z" />
    <path d="M25 31C35 37 55 37 65 31" opacity=".55" />
  </>
);
const CLAIM = (
  <>
    <rect x="0.5" y="0.5" width="68" height="86" rx="5" />
    <path d="M10 14H44" strokeWidth="2" />
    <path d="M10 28H58M10 38H58M10 48H40" opacity=".7" />
    <rect x="10" y="60" width="9" height="9" rx="2" />
    <path d="M25 64.5H50" opacity=".7" />
    <rect x="10" y="73" width="9" height="9" rx="2" />
    <path d="M12.5 77.5l2 2 4-4.5" />
    <path d="M25 77.5H46" opacity=".7" />
  </>
);
const BOOK = (
  <>
    <path d="M48 10C36 4 16 4 4 8V60C16 56 36 56 48 62C60 56 80 56 92 60V8C80 4 60 4 48 10Z" />
    <path d="M48 10V62" />
    <path d="M12 20H40M12 30H40M12 40H40M12 50H32M56 20H84M56 30H84M56 40H74" opacity=".7" />
  </>
);
const TRIAL_FRAME = (
  <>
    <circle cx="24" cy="26" r="18" />
    <circle cx="76" cy="26" r="18" />
    <path d={ticks(24, 26, 20.5, 23.5, 24)} opacity=".6" />
    <path d={ticks(76, 26, 20.5, 23.5, 24)} opacity=".6" />
    <circle cx="24" cy="26" r="9" opacity=".5" />
    <path d="M42 23C46 17 54 17 58 23" />
    <path d="M6 20L1 15M94 20L99 15" />
  </>
);
const BILL = (
  <>
    <path d="M0.5 0.5H60.5V80l-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6Z" />
    <path d="M10 14H38" strokeWidth="2" />
    <path d="M10 28H50M10 38H50M10 48H50" opacity=".7" />
    <path d="M10 62H26M36 62H50" />
  </>
);
const CLIPBOARD = (
  <>
    <rect x="0.5" y="6.5" width="64" height="80" rx="6" />
    <rect x="20" y="1" width="24" height="12" rx="3" />
    <path d="M12 30H52M12 42H52M12 54H52M12 66H38" opacity=".7" />
  </>
);

const LEFT: Thing[] = [
  { x: 40, y: 104, w: 90, h: 88, draw: MOLAR },
  { x: 58, y: 262, w: 69, h: 87, draw: CLAIM },
  { x: 30, y: 420, w: 96, h: 64, draw: BOOK },
];
const RIGHT: Thing[] = [
  { x: 30, y: 124, w: 100, h: 50, draw: TRIAL_FRAME },
  { x: 60, y: 256, w: 61, h: 88, draw: BILL },
  { x: 40, y: 408, w: 65, h: 87, draw: CLIPBOARD },
];
