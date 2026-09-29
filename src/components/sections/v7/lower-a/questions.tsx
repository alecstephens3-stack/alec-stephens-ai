"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FAQ } from "@/lib/content";
import s from "./pricing.module.css";

/**
 * The owner's own questions under the price (after Gusto's pricing page), one
 * answer open at a time. Word for word from the approved FAQ; only the two
 * that are about what the money buys.
 */
const PICK = ["Who keeps it up to date after launch?", "How long until staff are using it?"];
const ITEMS = PICK.map((q) => FAQ.find((f) => f.q === q)).filter((f): f is (typeof FAQ)[number] => Boolean(f));

export function OwnerQuestions() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className={s.qs}>
      {ITEMS.map((f, i) => {
        const on = open === i;
        return (
          <li key={f.q} className={cn(s.q, on && s.qOn)}>
            <button
              type="button"
              className={s.qHead}
              aria-expanded={on}
              aria-controls={`a-q-${i}`}
              onClick={() => setOpen(on ? null : i)}
            >
              <span>{f.q}</span>
              <span className={s.qChev} aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </button>
            <div id={`a-q-${i}`} className={s.qBody} role="region" aria-label={f.q}>
              <div className={s.qBodyIn}>
                <p className={s.qA}>{f.a}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
