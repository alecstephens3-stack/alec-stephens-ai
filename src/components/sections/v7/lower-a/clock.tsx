"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { A_CLOCK as T } from "./copy";
import s from "./founders.module.css";

/**
 * Our clock against theirs. Two 24-hour lines, one for the clinic (Central
 * time) and one for us (Japan and Korea share a clock), lined up by the same
 * instant, so the reader sees that their afternoon is our early morning. The
 * marker starts at now; drag it (or use the arrow keys) to check any other
 * hour, and both readouts follow. The marker follows the pointer on a damped
 * spring, like the hero window; reduced motion moves it straight there.
 *
 * Time is read from the reader's own clock after mount (never rendered on the
 * server, so nothing mismatches), and refreshed when the section comes into
 * view or the tab returns. Nothing runs on a timer.
 */

const HOUR = 3600_000;
const SPAN = 12; // hours either side of now
const LO = -SPAN;
const STEP = 15 * 60_000; // readouts snap to the quarter hour while checking

const ZONES = [
  { key: "you", tz: "America/Chicago", label: T.you },
  { key: "us", tz: "Asia/Tokyo", label: T.us },
] as const;

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string, opts: Intl.DateTimeFormatOptions) {
  const k = tz + JSON.stringify(opts);
  let f = fmtCache.get(k);
  if (!f) {
    f = new Intl.DateTimeFormat("en-US", { timeZone: tz, ...opts });
    fmtCache.set(k, f);
  }
  return f;
}
const hourIn = (tz: string, t: number) => {
  const p = fmt(tz, { hour: "numeric", minute: "numeric", hourCycle: "h23" }).formatToParts(t);
  const h = Number(p.find((x) => x.type === "hour")?.value ?? 0);
  const m = Number(p.find((x) => x.type === "minute")?.value ?? 0);
  return h + m / 60;
};
const timeIn = (tz: string, t: number) => fmt(tz, { hour: "numeric", minute: "2-digit" }).format(t);
const dayIn = (tz: string, t: number) => fmt(tz, { weekday: "long" }).format(t);
const tickName = (h: number) => (h === 0 ? T.midnight : h === 12 ? T.noon : h < 12 ? `${h} AM` : `${h - 12} PM`);

type Geo = { day: { l: number; w: number }[]; ticks: { p: number; name: string }[] };

/** Daylight (6 AM to 6 PM local) and the four quarter-day ticks, as % of the line. */
function geometry(tz: string, now: number): Geo {
  const start = now - SPAN * HOUR;
  const end = now + SPAN * HOUR;
  const pct = (t: number) => ((t - start) / (end - start)) * 100;
  const pts = [start];
  for (let t = Math.ceil(start / HOUR) * HOUR; t < end; t += HOUR) if (t > start) pts.push(t);
  pts.push(end);
  const day: Geo["day"] = [];
  const ticks: Geo["ticks"] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const h = hourIn(tz, (pts[i] + pts[i + 1]) / 2);
    if (h >= 6 && h < 18) {
      const last = day[day.length - 1];
      const l = pct(pts[i]);
      const r = pct(pts[i + 1]);
      if (last && Math.abs(last.l + last.w - l) < 0.01) last.w = r - last.l;
      else day.push({ l, w: r - l });
    }
    if (i > 0) {
      const hb = Math.round(hourIn(tz, pts[i]));
      if (hb % 6 === 0) ticks.push({ p: pct(pts[i]), name: tickName(hb % 24) });
    }
  }
  return { day, ticks };
}

export function Clock() {
  const root = useRef<HTMLDivElement>(null);
  const scale = useRef<HTMLDivElement>(null);
  const marks = useRef<(HTMLSpanElement | null)[]>([]);
  const [now, setNow] = useState<number | null>(null);
  const [q, setQ] = useState(0); // the checked offset in ms, snapped; 0 = now
  const phys = useRef({ x: 0, v: 0, target: 0, raf: 0, last: 0 });
  const drag = useRef(false);

  // read the reader's clock: after mount, on entering view, on tab return
  useEffect(() => {
    const read = () => requestAnimationFrame(() => setNow(Date.now()));
    const id = read();
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) read(); });
    if (root.current) io.observe(root.current);
    const vis = () => { if (!document.hidden) read(); };
    document.addEventListener("visibilitychange", vis);
    return () => {
      cancelAnimationFrame(id);
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  const place = useCallback((hours: number) => {
    const left = `${((hours + SPAN) / (2 * SPAN)) * 100}%`;
    marks.current.forEach((m) => { if (m) m.style.left = left; });
  }, []);

  const settle = useCallback((hours: number) => {
    const ms = Math.round((hours * HOUR) / STEP) * STEP;
    setQ(Math.abs(hours) < 0.02 ? 0 : ms);
  }, []);

  // damped spring toward the target (hours); sleeps when settled
  const go = useCallback(
    (target: number) => {
      const p = phys.current;
      p.target = Math.max(-SPAN, Math.min(SPAN, target));
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        p.x = p.target;
        p.v = 0;
        place(p.x);
        settle(p.x);
        return;
      }
      const K = 170;
      const C = 2 * Math.sqrt(K) * 0.9;
      const frame = (t: number) => {
        const dt = Math.min(0.033, p.last ? (t - p.last) / 1000 : 0.016);
        p.last = t;
        p.v += (K * (p.target - p.x) - C * p.v) * dt;
        p.x += p.v * dt;
        place(p.x);
        settle(p.x);
        if (Math.abs(p.target - p.x) < 0.002 && Math.abs(p.v) < 0.002) {
          p.x = p.target;
          place(p.x);
          settle(p.x);
          p.raf = 0;
          p.last = 0;
          return;
        }
        p.raf = requestAnimationFrame(frame);
      };
      if (!p.raf) p.raf = requestAnimationFrame(frame);
    },
    [place, settle]
  );
  useEffect(() => () => cancelAnimationFrame(phys.current.raf), []);

  const fromPointer = (clientX: number) => {
    const r = scale.current?.getBoundingClientRect();
    if (!r) return 0;
    return ((clientX - r.left) / r.width) * 2 * SPAN - SPAN;
  };

  // a checked time reads on the quarter hour of the clock face; now reads as now
  const at = now === null ? null : q === 0 ? now : Math.round((now + q) / STEP) * STEP;
  const valueText =
    at === null ? "" : ZONES.map((z) => `${z.label}: ${timeIn(z.tz, at)}, ${dayIn(z.tz, at)}`).join(". ");
  const geos = now === null ? null : ZONES.map((z) => geometry(z.tz, now));

  return (
    <div ref={root} className={s.clock}>
      <div
        ref={scale}
        className={s.scale}
        role="slider"
        tabIndex={0}
        aria-label={T.hint}
        aria-valuemin={LO}
        aria-valuemax={SPAN}
        aria-valuenow={Math.round((q / HOUR) * 4) / 4}
        aria-valuetext={valueText}
        onPointerDown={(e) => {
          if (e.button !== 0 || now === null) return;
          drag.current = true;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            /* capture is a nicety; dragging still works inside the line */
          }
          go(fromPointer(e.clientX));
        }}
        onPointerMove={(e) => { if (drag.current) go(fromPointer(e.clientX)); }}
        onPointerUp={() => { drag.current = false; }}
        onPointerCancel={() => { drag.current = false; }}
        onKeyDown={(e) => {
          const cur = phys.current.target;
          const map: Record<string, number> = {
            ArrowRight: cur + 1, ArrowUp: cur + 1, ArrowLeft: cur - 1, ArrowDown: cur - 1,
            PageUp: cur + 6, PageDown: cur - 6, Home: 0, Escape: 0,
          };
          if (e.key in map) {
            e.preventDefault();
            go(map[e.key]);
          }
        }}
      >
        {ZONES.map((z, i) => (
          <div key={z.key} className={s.zone}>
            <div className={s.read}>
              <p className={s.zoneK}>{z.label}</p>
              <p className={s.time}>
                <span className={s.hm}>{at === null ? "--:--" : timeIn(z.tz, at)}</span>
                <span className={s.day}>{at === null ? "" : dayIn(z.tz, at)}</span>
              </p>
            </div>
            <div className={s.line}>
              <span className={s.bar}>
                {geos?.[i].day.map((d, j) => (
                  <span key={j} className={s.dayBand} style={{ left: `${d.l}%`, width: `${d.w}%` }} />
                ))}
              </span>
              <span
                ref={(el) => { marks.current[i] = el; }}
                className={cn(s.mark, now === null && s.markOff)}
                style={{ left: "50%" }}
                aria-hidden="true"
              />
            </div>
            <div className={s.ticks} aria-hidden="true">
              {geos?.[i].ticks.map((t) => (
                <span
                  key={t.p}
                  className={cn(s.tick, t.p < 7 && s.tickL, t.p > 93 && s.tickR)}
                  style={{ left: `${t.p}%` }}
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={s.foot}>
        {q === 0 ? (
          <p className={s.hint}>{T.hint}</p>
        ) : (
          <button type="button" className={s.back} onClick={() => go(0)}>
            {T.back}
          </button>
        )}
      </div>
    </div>
  );
}
