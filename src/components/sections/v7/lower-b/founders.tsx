"use client";

import Image from "next/image";
import { useRef, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { FOUNDERS, FOUNDERS_SECTION } from "@/lib/content";
import { CLOCKS } from "./copy";
import { useInViewOnce } from "./use-in-view";
import s from "./founders.module.css";

/**
 * The two of us, and the ocean between us and the practice, drawn: two clocks
 * in the hero's fine line, ours and Central time, joined by one terracotta arc
 * across the Pacific with the real gap on it. The clocks read the reader's own
 * clock once, when the page loads (no ticking: nothing below the hero runs on
 * a timer), so the gap is 14 or 15 hours depending on daylight saving.
 */

const US_TZ = "Asia/Tokyo"; // Korea keeps the same clock
const YOU_TZ = "America/Chicago";

type Now = { us: { h: number; m: number; t: string }; you: { h: number; m: number; t: string }; ahead: number };

function read(tz: string, d: Date) {
  const p = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", hour: "numeric", minute: "2-digit", hour12: true }).formatToParts(d);
  const get = (k: string) => p.find((x) => x.type === k)?.value ?? "";
  const h24 = Number(new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", hourCycle: "h23" }).format(d));
  const m = Number(get("minute"));
  return { h: h24, m, t: `${get("weekday")} ${get("hour")}:${get("minute")} ${get("dayPeriod")}` };
}

function offsetHours(tz: string, d: Date) {
  const local = new Date(d.toLocaleString("en-US", { timeZone: tz }));
  const utc = new Date(d.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((local.getTime() - utc.getTime()) / 3600000);
}

// one reading per page load; the server renders the clocks without hands
let cached: Now | null = null;
function snapshot(): Now {
  if (!cached) {
    const d = new Date();
    cached = { us: read(US_TZ, d), you: read(YOU_TZ, d), ahead: offsetHours(US_TZ, d) - offsetHours(YOU_TZ, d) };
  }
  return cached;
}
const noSubscribe = () => () => {};

function Clock({ cx, h, m }: { cx: number; h?: number; m?: number }) {
  const cy = 92;
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2;
    const r1 = i % 3 === 0 ? 27 : 29.5;
    return `M${(cx + Math.sin(a) * r1).toFixed(1)} ${(cy - Math.cos(a) * r1).toFixed(1)}L${(cx + Math.sin(a) * 32.5).toFixed(1)} ${(cy - Math.cos(a) * 32.5).toFixed(1)}`;
  }).join("");
  const hand = (deg: number, len: number) => {
    const a = (deg * Math.PI) / 180;
    return `M${cx} ${cy}L${(cx + Math.sin(a) * len).toFixed(1)} ${(cy - Math.cos(a) * len).toFixed(1)}`;
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r="36.5" />
      <path d={ticks} opacity=".7" />
      {h !== undefined && m !== undefined && (
        <g className={s.hands}>
          <path d={hand(((h % 12) + m / 60) * 30, 17)} strokeWidth="2" />
          <path d={hand(m * 6, 25)} />
        </g>
      )}
      <circle cx={cx} cy={cy} r="2" />
    </g>
  );
}

export function Founders() {
  const now = useSyncExternalStore(noSubscribe, snapshot, () => null);
  const ref = useRef<HTMLDivElement>(null);
  const on = useInViewOnce(ref);

  return (
    <Section id="about" kicker="Who we are" title={FOUNDERS_SECTION.title}>
      <div className={s.top}>
        <p className="t-body max-w-[44ch]">{FOUNDERS_SECTION.note}</p>
        <div ref={ref} className={cn(s.gap, on && s.on)}>
          <p className={s.ahead}>{now ? CLOCKS.ahead(now.ahead) : " "}</p>
          <svg className={s.svg} viewBox="0 0 440 132" aria-hidden="true">
            <path className={s.arc} d="M84 70C150 4 290 4 356 70" pathLength={1} />
            <circle className={s.end} cx="84" cy="70" r="3" />
            <circle className={s.end} cx="356" cy="70" r="3" />
            <g className={s.ink}>
              <Clock cx={46} h={now?.us.h} m={now?.us.m} />
              <Clock cx={394} h={now?.you.h} m={now?.you.m} />
            </g>
          </svg>
          <div className={s.zones}>
            <p>
              <span className={s.zone}>{CLOCKS.us}</span>
              <span className={s.time}>{now?.us.t ?? " "}</span>
            </p>
            <p className={s.right}>
              <span className={s.zone}>{CLOCKS.you}</span>
              <span className={s.time}>{now?.you.t ?? " "}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-14">
        {FOUNDERS.map((f) => (
          <div key={f.name} className="flex items-start gap-5">
            <Image
              src={f.image}
              alt=""
              width={160}
              height={160}
              sizes="88px"
              className="h-[76px] w-[76px] shrink-0 rounded-full object-cover md:h-[88px] md:w-[88px]"
            />
            <div>
              <h3 className="font-heading text-[21px] font-medium leading-tight text-ink">{f.name}</h3>
              <p className="t-label mt-1">{f.role}</p>
              <p className="t-body mt-3 max-w-[34ch]">{f.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
