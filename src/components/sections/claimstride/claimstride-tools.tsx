"use client";

import { useState, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/button";
import { V7_CTA } from "@/lib/content";
import s from "./claimstride-tools.module.css";

/**
 * Two free tools on /claimstride (Alec's pick, 2026-11-10, from the four in
 * artifacts/design-previews-2026-11-09/tools.html). The visitor's own numbers,
 * no email asked, and the answer describes today, never a promise.
 *
 * Filing limits: only insurers whose rule we read on their own published page.
 * Read 9 Nov 2026 (vault: research/2026-11-09-free-sample-tools-for-practices.md).
 * Re-read them before changing the "last checked" date.
 */

const CHECKED = "9 Nov 2026";

type Payer = { name: string; months?: number; days?: number; note: string; url: string };
const PAYERS: Payer[] = [
  {
    name: "Medicare (Original)",
    months: 12,
    note: "Medicare: the claim must be filed within 1 calendar year after the date of service (42 CFR 424.44). A few exceptions apply.",
    url: "https://www.law.cornell.edu/cfr/text/42/424.44",
  },
  {
    name: "VSP",
    days: 180,
    note: "VSP: “In most cases, we process claims that are received within 180 days of the date of service.” For glasses, the claim reaches VSP when the lab finishes the order.",
    url: "https://www.vspprm.com/manuals/vsp-manual/eligibility-and-authorization/submitting-claims-timeliness.html",
  },
  {
    name: "Delta Dental (California group)",
    months: 12,
    note: "Delta Dental: “Generally, claims received more than 12 months after the date of treatment may not be paid.” Some programs are shorter.",
    url: "https://www1.deltadentalins.com/faqs/dentists.html",
  },
];

const WORKDAYS = 20;
const noSubscribe = () => () => {};
const money = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const num = (v: string) => {
  const n = parseFloat(v);
  return Number.isFinite(n) && n >= 0 ? n : 0;
};
const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

function Stepper({
  id,
  label,
  value,
  set,
  step,
  max,
}: {
  id: string;
  label: string;
  value: string;
  set: (v: string) => void;
  step: number;
  max: number;
}) {
  const bump = (d: number) => set(String(Math.min(max, Math.max(0, num(value) + d))));
  return (
    <div className={s.stepper}>
      <button type="button" onClick={() => bump(-step)} aria-label={`Lower: ${label}`}>
        &minus;
      </button>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value}
        onChange={(e) => set(e.target.value)}
      />
      <button type="button" onClick={() => bump(step)} aria-label={`Raise: ${label}`}>
        +
      </button>
    </div>
  );
}

export function TimeCalculator() {
  const [claims, setClaims] = useState("200");
  const [mins, setMins] = useState("8");
  const [rate, setRate] = useState("22");
  const cl = num(claims), mi = num(mins), ra = num(rate);
  const hrs = (cl * mi) / 60;
  const days = hrs / 8;
  const hrsTxt = Math.round(hrs).toLocaleString("en-US");

  return (
    <div className={s.tool}>
      <h3 className={s.ask}>How much of your month goes to claims follow-up?</h3>
      <p className={s.askline}>Use your best guess. You can change any number.</p>
      <div className={s.cols}>
        <div>
          <div className={s.field}>
            <label className={s.lab} htmlFor="cs-claims"><span>Unpaid claims followed up a month</span></label>
            <Stepper id="cs-claims" label="unpaid claims a month" value={claims} set={setClaims} step={10} max={5000} />
            <input
              className={s.range}
              type="range"
              min={0}
              max={1000}
              step={10}
              value={Math.min(1000, cl)}
              onChange={(e) => setClaims(e.target.value)}
              aria-label="Unpaid claims a month, slider"
            />
          </div>
          <div className={s.field}>
            <label className={s.lab} htmlFor="cs-mins"><span>Minutes per claim</span><span className={s.hint}>phone, portal, notes</span></label>
            <Stepper id="cs-mins" label="minutes per claim" value={mins} set={setMins} step={1} max={120} />
            <input
              className={s.range}
              type="range"
              min={1}
              max={30}
              step={1}
              value={Math.min(30, Math.max(1, mi))}
              onChange={(e) => setMins(e.target.value)}
              aria-label="Minutes per claim, slider"
            />
          </div>
          <div className={s.field} style={{ marginBottom: 0 }}>
            <label className={s.lab} htmlFor="cs-rate"><span>Hourly cost of that person</span><span className={s.hint}>pay plus taxes, $</span></label>
            <Stepper id="cs-rate" label="hourly cost" value={rate} set={setRate} step={1} max={200} />
          </div>
        </div>
        <div className={s.month} aria-live="polite">
          <div className={s.monthHead}>
            <b>One month of workdays</b>
            <span>{days >= 10 ? Math.round(days) : days.toFixed(1)} of {WORKDAYS} workdays</span>
          </div>
          <div className={s.cal} aria-hidden="true">
            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((d) => (
              <div key={d} className={s.dow}>{d}</div>
            ))}
            {Array.from({ length: WORKDAYS }, (_, i) => {
              const f = Math.max(0, Math.min(1, days - i));
              return (
                <div key={i} className={`${s.day} ${f >= 1 ? s.dayFull : ""}`}>
                  <i style={{ width: `${f * 100}%` }} />
                </div>
              );
            })}
          </div>
          <div className={s.bigs}>
            <div className={s.lead}><p className={s.n}>{hrsTxt}</p><p className={s.l}>hours a month</p></div>
            <div><p className={s.n}>{money(hrs * ra * 12)}</p><p className={s.l}>a year in staff time</p></div>
          </div>
          <p className={s.working}>
            <b>{cl.toLocaleString("en-US")}</b> claims × <b>{mi}</b> minutes = <b>{hrsTxt}</b> hours, at <b>{money(ra)}</b> an
            hour. A workday is 8 hours.
          </p>
        </div>
      </div>
      <div className={s.ctaRow}>
        <ButtonLink href={`${V7_CTA.href}?utm_source=syntegrityai.com&utm_medium=claimstride&utm_content=time-calculator`} external>
          {V7_CTA.label}
        </ButtonLink>
        <p>On the free call we look at which of those hours ClaimStride can take back, with your real numbers.</p>
      </div>
    </div>
  );
}

export function FilingDeadline() {
  const [picked, setDos] = useState("");
  const [payer, setPayer] = useState("1");
  const [custom, setCustom] = useState("90");
  // Today comes from the visitor's clock, never the server's, so the first render
  // has no date and the browser fills it in (no hydration mismatch).
  const todayKey = useSyncExternalStore(noSubscribe, () => iso(new Date()), () => "");
  let today: Date | null = null;
  let dos = picked;
  if (todayKey) {
    const [ty, tm, td] = todayKey.split("-").map(Number);
    today = new Date(ty, tm - 1, td);
    if (!dos) {
      const d0 = new Date(today);
      d0.setDate(d0.getDate() - 150);
      dos = iso(d0);
    }
  }

  const isCustom = payer === "c";
  let out: null | {
    left: number; used: number; total: number; dl: Date; start: Date; note: string; url: string;
  } = null;
  if (today && dos) {
    const [y, m, d] = dos.split("-").map(Number);
    const start = new Date(y, m - 1, d);
    const dl = new Date(start);
    let note: string;
    let url = "";
    if (isCustom) {
      dl.setDate(dl.getDate() + Math.max(1, num(custom)));
      note = "Using the limit you entered. Filing limits differ by plan and contract, so check yours.";
    } else {
      const p = PAYERS[Number(payer)];
      if (p.months) dl.setMonth(dl.getMonth() + p.months);
      else dl.setDate(dl.getDate() + (p.days ?? 0));
      note = `${p.note} Your contract can be shorter.`;
      url = p.url;
    }
    const total = Math.max(1, Math.round((+dl - +start) / 864e5));
    const used = Math.round((+today - +start) / 864e5);
    const left = Math.round((+dl - +today) / 864e5);
    out = { left, used, total, dl, start, note, url };
  }
  const pct = out ? Math.max(0, Math.min(100, (out.used / out.total) * 100)) : 0;

  return (
    <div className={s.tool}>
      <h3 className={s.ask}>How long do you have to file this claim?</h3>
      <p className={s.askline}>Pick the date of service and the insurer.</p>
      <div className={s.tfFields}>
        <label>
          Date of service
          <input type="date" value={dos} onChange={(e) => setDos(e.target.value)} />
        </label>
        <label>
          Insurer
          <select value={payer} onChange={(e) => setPayer(e.target.value)}>
            {PAYERS.map((p, i) => (
              <option key={p.name} value={String(i)}>{p.name}</option>
            ))}
            <option value="c">Another insurer (enter the days)</option>
          </select>
        </label>
        {isCustom && (
          <label className={s.full}>
            Filing limit in days, from your contract
            <input type="number" inputMode="numeric" min={1} max={1095} value={custom} onChange={(e) => setCustom(e.target.value)} />
          </label>
        )}
      </div>
      <div className={s.tfOut} aria-live="polite">
        <div className={s.tfTop}>
          {!out ? (
            <p className={s.tfDays}>&nbsp;</p>
          ) : out.used < 0 ? (
            <>
              <p className={s.tfDays}>Not yet</p>
              <p>That date of service is in the future.</p>
            </>
          ) : out.left < 0 ? (
            <>
              <p className={s.tfDays}>{Math.abs(out.left)}<small>days past</small></p>
              <p className={`${s.status} ${s.bad}`}><span className={s.kw}>Past</span><span>The limit was {fmt(out.dl)}</span></p>
            </>
          ) : (
            <>
              <p className={s.tfDays}>{out.left}<small>{out.left === 1 ? "day" : "days"} left</small></p>
              {out.left <= 30 ? (
                <p className={`${s.status} ${s.warn}`}><span className={s.kw}>File soon</span><span>by {fmt(out.dl)}</span></p>
              ) : (
                <p className={`${s.status} ${s.good}`}><span className={s.kw}>On time</span><span>file by {fmt(out.dl)}</span></p>
              )}
            </>
          )}
        </div>
        <div className={s.line} aria-hidden="true">
          <span className={s.warnZone} style={{ width: `${out ? Math.min(100, (30 / out.total) * 100) : 0}%` }} />
          <span className={s.used} style={{ width: `${pct}%` }} />
          <span className={s.today} style={{ left: `${Math.max(4, Math.min(96, pct))}%` }}>Today</span>
        </div>
        <div className={s.ends}>
          <span>{out ? fmt(out.start) : "Date of service"}</span>
          <span>{out ? fmt(out.dl) : "Deadline"}</span>
        </div>
        {out && (
          <p className={s.tfNote}>
            {out.note}{" "}
            {out.url && (
              <>
                <a href={out.url} target="_blank" rel="noopener noreferrer">Source</a>.{" "}
              </>
            )}
            Rules last checked {CHECKED}.
          </p>
        )}
      </div>
      <div className={s.ctaRow}>
        <ButtonLink href={`${V7_CTA.href}?utm_source=syntegrityai.com&utm_medium=claimstride&utm_content=filing-deadline`} external>
          {V7_CTA.label}
        </ButtonLink>
        <p>ClaimStride shows every unpaid claim&apos;s nearest deadline on one board. The free call is where we look at yours.</p>
      </div>
    </div>
  );
}
