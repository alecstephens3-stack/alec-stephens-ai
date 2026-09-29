"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { FOUNDERS, FOUNDERS_SECTION } from "@/lib/content";
import s from "./lower-c.module.css";

/**
 * The two of us, a face and a line each, beside our clock against theirs:
 * the real time now in Central time and in Japan and Korea, read from the
 * visitor's own clock. No ticking: it reads the time when the page renders
 * and again when the tab comes back into focus (nothing below the hero runs
 * on a timer). The server renders blanks, so nothing ever shows a wrong time.
 */

const subscribe = (cb: () => void) => {
  document.addEventListener("visibilitychange", cb);
  window.addEventListener("focus", cb);
  return () => {
    document.removeEventListener("visibilitychange", cb);
    window.removeEventListener("focus", cb);
  };
};
const minuteNow = () => Math.floor(Date.now() / 60000);
const onServer = () => 0;

function readClock(minute: number, timeZone: string) {
  const d = new Date(minute * 60000);
  const time = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone }).format(d);
  const day = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone }).format(d);
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit",
    }).formatToParts(d).map((x) => [x.type, x.value]),
  );
  const wall = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute);
  return { time, day, offset: (wall - d.getTime()) / 3600000 };
}

export function Founders() {
  const minute = useSyncExternalStore(subscribe, minuteNow, onServer);
  const known = minute > 0;
  const them = known ? readClock(minute, "America/Chicago") : null;
  const us = known ? readClock(minute, "Asia/Tokyo") : null;
  const gap = them && us ? us.offset - them.offset : null;

  return (
    <Section id="about" kicker="Who we are" title={FOUNDERS_SECTION.title}>
      <div className={s.fd}>
        <div>
          <AnimateOnScroll>
            <p className="t-body -mt-4 mb-10 max-w-[52ch]">{FOUNDERS_SECTION.note}</p>
          </AnimateOnScroll>
          <div className={s.people}>
            {FOUNDERS.map((f, i) => (
              <AnimateOnScroll key={f.name} delay={i * 80}>
                <div className="flex items-start gap-5">
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
                    <p className="t-body mt-3 max-w-[38ch]">{f.bio}</p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>

        <AnimateOnScroll delay={120}>
          <div className={cn("sai-pane-strong", s.clock)}>
            <p className={s.clockH}>Time now</p>
            <div className={s.zone}>
              <span>
                <span className={s.zoneK}>Central time</span>
                <span className={s.zoneD}>{them?.day ?? " "}</span>
              </span>
              <span className={s.zoneT}>{them?.time ?? " "}</span>
            </div>
            <div className={cn(s.zone, s.zoneUs)}>
              <span>
                <span className={s.zoneK}>Japan and Korea</span>
                <span className={s.zoneD}>{us?.day ?? " "}</span>
              </span>
              <span className={s.zoneT}>{us?.time ?? " "}</span>
            </div>
            <p className={s.clockF}>{gap !== null ? `We're ${gap} hours ahead of Central time.` : " "}</p>
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}
