import { cn } from "@/lib/utils";
import { V7_PRICING } from "@/lib/content";
import s from "./work-with-us.module.css";

/**
 * What each of the three steps produces, in the hero's product-window style.
 * The problems are the big, practice-wide ones any healthcare practice will
 * recognise (Alec, 2026-09-29: "high ticket and general"): unpaid claims,
 * unfinished treatment and recalls, a front desk stopped by the phone, bills
 * typed by hand. Example content only; the caption under the frame says so.
 * Statuses stay honest: only what is really live is marked live.
 */

const MAP = [
  { where: "Insurance claims left unpaid", fix: "Every claim tracked and followed up until it's paid" },
  { where: "Unfinished treatment and overdue recalls", fix: "Patients reminded and booked back in" },
  { where: "Phones and questions that stop the front desk", fix: "Answers your whole team can find in seconds" },
  { where: "Bills and forms typed in by hand", fix: "Read, entered and ready for review" },
];
const BUILD = [
  { what: "Front desk answers", state: "Live", good: true },
  { what: "Bills into QuickBooks", state: "Testing with your team", good: false },
  { what: "Treatment follow-up", state: "Building", good: false },
];
const MONTH = [
  { what: "New insurance rules added", state: "Done", good: true },
  { what: "Follow-up timing adjusted to your schedule", state: "Done", good: true },
  { what: "Monthly check-in with your office manager", state: "Booked", good: false },
];

const ONE_FIX = V7_PRICING.tiers[0];

export function Satellite({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className={s.sat}>
        <p className={s.satK}>Sent after the call</p>
        <p className={s.satT}>Yours to keep, regardless of the next steps.</p>
      </div>
    );
  if (i === 1)
    return (
      <div className={s.sat}>
        <p className={s.satK}>Flat price, in writing</p>
        <p className={s.priceLine}>
          <b>{ONE_FIX.name}</b>
          <span className={s.priceLead} aria-hidden="true" />
          <span className={s.priceN}>{ONE_FIX.price}</span>
        </p>
        <p className={s.satF}>{ONE_FIX.monthly}</p>
      </div>
    );
  return (
    <div className={s.sat}>
      <p className={s.satK}>Month to month</p>
      <p className={s.satT}>Everything keeps doing its job. If it stops, we fix it.</p>
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

export function StepWindow({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className={s.app}>
        <div className={s.appBar}><span>Opportunity Map</span><span>Discovery</span></div>
        <div className={s.appBody}>
          <p className={s.appH}>Where your practice loses the most</p>
          <p className={s.appMeta}>Ranked, with what we&apos;d do about each</p>
          <ol className={s.rows}>
            {MAP.map((m, n) => (
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
  if (i === 1)
    return (
      <div className={s.app}>
        <div className={s.appBar}><span>Your build</span><span>Delivery</span></div>
        <div className={s.appBody}>
          <p className={s.appH}>What we&apos;re building for you</p>
          <p className={s.appMeta}>From the Opportunity Map, in the order it pays off</p>
          <StatusRows rows={BUILD} />
          <p className={s.appFoot}>Runs next to your practice software, not inside it.</p>
        </div>
      </div>
    );
  return (
    <div className={s.app}>
      <div className={s.appBar}><span>This month</span><span>Month to month</span></div>
      <div className={s.appBody}>
        <p className={s.appH}>Kept running, and getting better</p>
        <p className={s.appMeta}>What changed since last month</p>
        <StatusRows rows={MONTH} />
      </div>
    </div>
  );
}
