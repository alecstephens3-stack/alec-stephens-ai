import { cn } from "@/lib/utils";
import type { HomeCopy } from "@/lib/content";
import s from "./work-with-us.module.css";

/**
 * What each of the three steps produces, in the hero's product-window style.
 * The problems are the big, practice-wide ones any healthcare practice will
 * recognise (Alec, 2026-09-29: "high ticket and general"): unpaid claims,
 * unfinished treatment and recalls, a front desk stopped by the phone, bills
 * typed by hand. Example content only; the caption under the frame says so.
 * Statuses stay honest: only what is really live is marked live.
 * The words live in HOME_EN.how / HOME_KO.how (content.ts, content.ko.ts).
 */

type HowCopy = HomeCopy["how"];
type Tier = HomeCopy["pricing"]["tiers"][number];

export function Satellite({ i, copy, tier }: { i: number; copy: HowCopy; tier: Tier }) {
  const sat = copy.satellites;
  if (i === 0)
    return (
      <div className={s.sat}>
        <p className={s.satK}>{sat.discover.k}</p>
        <p className={s.satT}>{sat.discover.t}</p>
      </div>
    );
  if (i === 1)
    return (
      <div className={s.sat}>
        <p className={s.satK}>{sat.deliver.k}</p>
        <p className={s.priceLine}>
          <b>{tier.name}</b>
          <span className={s.priceLead} aria-hidden="true" />
          <span className={s.priceN}>{tier.price}</span>
        </p>
        <p className={s.satF}>{tier.monthly}</p>
      </div>
    );
  return (
    <div className={s.sat}>
      <p className={s.satK}>{sat.optimize.k}</p>
      <p className={s.satT}>{sat.optimize.t}</p>
    </div>
  );
}

function StatusRows({ rows }: { rows: { what: string; state: string; good: boolean }[] }) {
  return (
    <div className={s.rows}>
      {rows.map((r) => (
        <p key={r.what} className={cn(s.row, s.page)}>
          <span>{r.what}</span>
          <span className={cn(s.chip, r.good && s.chipGood)}>{r.state}</span>
        </p>
      ))}
    </div>
  );
}

export function StepWindow({ i, copy }: { i: number; copy: HowCopy }) {
  const { map, build, month } = copy.windows;
  if (i === 0)
    return (
      <div className={s.app}>
        <div className={s.appBar}><span>{map.bar[0]}</span><span>{map.bar[1]}</span></div>
        <div className={s.appBody}>
          <p className={s.appH}>{map.title}</p>
          <p className={s.appMeta}>{map.meta}</p>
          <ol className={s.rows}>
            {map.rows.map((m, n) => (
              <li key={m.where} className={cn(s.row, s.map, n === 0 && s.mapHot)}>
                <span className={s.rank}>{n + 1}</span>
                <span>
                  <span className={cn(s.mapWhere, "block")}>{m.where}</span>
                  <span className={cn(s.mapFix, "block")}><span aria-hidden="true">&rarr;</span>{m.fix}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  const w = i === 1 ? build : month;
  return (
    <div className={s.app}>
      <div className={s.appBar}><span>{w.bar[0]}</span><span>{w.bar[1]}</span></div>
      <div className={s.appBody}>
        <p className={s.appH}>{w.title}</p>
        <p className={s.appMeta}>{w.meta}</p>
        <StatusRows rows={w.rows} />
        <p className={s.appFoot}>{w.foot}</p>
      </div>
    </div>
  );
}
