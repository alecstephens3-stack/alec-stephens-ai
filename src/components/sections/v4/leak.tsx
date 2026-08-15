"use client";

import { useMemo, useState } from "react";
import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { LEAK } from "@/lib/content";

const usd = (n: number) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/**
 * The leak model, made adjustable. The defaults reproduce the conservative
 * baseline in the internal pricing playbook exactly (a $30,760 first year at
 * 30 patients a day, a $200 slot, and 2 front desk hires a year).
 *
 * Everything here is modeled, and the page says so out loud. An owner can
 * spot an invented number faster than any other reader, and one fake figure
 * discredits the real ones next to it.
 */
export function Leak() {
  const [perDay, setPerDay] = useState(30);
  const [slot, setSlot] = useState(200);
  const [hires, setHires] = useState(2);

  const model = useMemo(() => {
    const scale = perDay / 30;
    const lines = [
      { label: LEAK.lines[0].label, note: LEAK.lines[0].note, amount: 2 * 52 * 75 * scale },
      { label: LEAK.lines[1].label, note: LEAK.lines[1].note, amount: 52 * slot },
      { label: LEAK.lines[2].label, note: LEAK.lines[2].note, amount: 3360 * scale },
      { label: LEAK.lines[3].label, note: LEAK.lines[3].note, amount: hires * 2400 },
      { label: LEAK.lines[4].label, note: LEAK.lines[4].note, amount: 4400 * scale },
    ];
    const total = lines.reduce((sum, l) => sum + l.amount, 0);
    const yearOne = 4500 + 299 * 12;
    return { lines, total, yearOne, multiple: total / yearOne };
  }, [perDay, slot, hires]);

  const controls = [
    {
      label: "Patients seen a day",
      value: perDay,
      set: setPerDay,
      min: 10,
      max: 80,
      step: 1,
      format: (v: number) => String(v),
    },
    {
      label: "Value of one appointment slot",
      value: slot,
      set: setSlot,
      min: 75,
      max: 600,
      step: 25,
      format: (v: number) => usd(v),
    },
    {
      label: "Front desk hires a year",
      value: hires,
      set: setHires,
      min: 0,
      max: 6,
      step: 1,
      format: (v: number) => String(v),
    },
  ];

  return (
    <Section id="cost" kicker="The math" title={LEAK.title} lede={LEAK.intro}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        {/* controls */}
        <AnimateOnScroll>
          <div className="sai-pane h-full rounded-card p-5 md:p-6">
            <p className="font-label text-[12.5px] font-semibold uppercase tracking-[0.06em] text-accent">
              Your practice
            </p>
            <div className="mt-4 flex flex-col gap-5">
              {controls.map((c) => (
                <div key={c.label}>
                  <div className="flex items-baseline justify-between gap-3">
                    <label
                      htmlFor={`leak-${c.label}`}
                      className="text-[14.5px] leading-tight text-ink-2"
                    >
                      {c.label}
                    </label>
                    <span className="font-heading text-[19px] font-medium tabular-nums text-ink">
                      {c.format(c.value)}
                    </span>
                  </div>
                  <input
                    id={`leak-${c.label}`}
                    type="range"
                    min={c.min}
                    max={c.max}
                    step={c.step}
                    value={c.value}
                    onChange={(e) => c.set(Number(e.target.value))}
                    className="sai-range mt-3 w-full"
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimateOnScroll>

        {/* the ledger */}
        <AnimateOnScroll delay={80}>
          <div className="sai-pane h-full rounded-card p-5 md:p-6">
            <ul className="m-0 list-none p-0">
              {model.lines.map((l) => (
                <li
                  key={l.label}
                  className="border-b border-rule-soft py-2.5 first:pt-0"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-[15px] leading-snug text-ink">
                      {l.label}
                    </span>
                    <span className="shrink-0 font-heading text-[17px] font-medium tabular-nums text-ink">
                      {usd(l.amount)}
                    </span>
                  </div>
                  <p className="mt-1 pr-16 text-[13.5px] leading-[1.5] text-ink-2">
                    {l.note}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-baseline justify-between gap-3 border-t-2 border-rule-strong pt-4">
              <span className="font-heading text-[18px] font-medium text-ink">
                Modeled first year cost of the gap
              </span>
              <span className="font-heading text-[32px] font-medium leading-none tabular-nums tracking-[-0.02em] text-accent md:text-[38px]">
                {usd(model.total)}
              </span>
            </div>

            <div className="mt-4 rounded-tile border border-[rgba(255,255,255,0.9)] bg-white/70 p-4">
              <p className="text-[14.5px] leading-[1.6] text-ink">
                The Front Desk Playbook costs{" "}
                <strong className="font-medium">{usd(model.yearOne)}</strong> in
                year one, setup plus twelve months. Against the figure above
                that is{" "}
                <strong className="font-medium text-accent">
                  {model.multiple.toFixed(1)}x
                </strong>{" "}
                back, and it closes the gap permanently rather than once.
              </p>
            </div>

            <p className="mt-4 text-[13px] leading-[1.55] text-ink-2">
              {LEAK.footnote}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}
