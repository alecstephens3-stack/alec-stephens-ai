import { cn } from "@/lib/utils";
import { V7_PRICING } from "@/lib/content";
import s from "./work-with-us.module.css";

/**
 * What each step of a project leaves on the table, drawn in the hero's
 * product-window style. One story runs through all four: the audit finds the
 * front desk questions, we watch that job, build the answers with the office
 * manager, and hand over a page she edits herself. Example content only; the
 * caption under the frame says so (same rule as the hero).
 */

const MAP = [
  { where: "Questions that go to the office manager", fix: "Front desk answers, one search away" },
  { where: "Vendor bills typed into QuickBooks", fix: "Read and entered, for your bookkeeper to check" },
  { where: "Time off on paper slips", fix: "Requests, calendar and payroll in one place" },
  { where: "Hiring paperwork done by hand", fix: "Claude or ChatGPT, set up for it" },
];

const NOTES = [
  { k: "Late policy", v: "Not written down. Answered from memory." },
  { k: "Prices", v: "A spreadsheet, plus an older copy on the desktop." },
  { k: "Insurance rules", v: "Spread across several documents." },
  { k: "Which doctor sees whom", v: "Only the office manager knows." },
];

const PAGES = [
  { page: "Patient running late", state: "Checked", good: true },
  { page: "Prices", state: "Checked", good: true },
  { page: "Insurance cards", state: "In review", good: false },
  { page: "Which doctor sees whom", state: "Drafting", good: false },
];

const ONE_FIX = V7_PRICING.tiers[0];

export function Satellite({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className={s.sat}>
        <p className={s.satK}>Sent after the call</p>
        <p className={s.satT}>Yours to keep, whether you work with us or not.</p>
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
  if (i === 2)
    return (
      <div className={s.sat}>
        <p className={s.who}><span className={s.av}>OM</span>Office manager</p>
        <p className={s.satT}>Offer the next open slot before rebooking.</p>
        <p className={s.satF}>Added to the page</p>
      </div>
    );
  return (
    <div className={s.sat}>
      <p className={s.satK}>Month to month</p>
      <p className={s.satT}>Everything keeps doing its job. If it stops, we fix it.</p>
    </div>
  );
}

export function StepWindow({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className={s.app}>
        <div className={s.appBar}><span>Opportunity Map</span><span>Free time audit</span></div>
        <div className={s.appBody}>
          <p className={s.appH}>Where your staff lose the most hours</p>
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
        <div className={s.appBar}><span>Screen share notes</span></div>
        <div className={s.appBody}>
          <p className={s.appH}>Front desk questions</p>
          <p className={s.appMeta}>Watched with the office manager</p>
          <div className={s.rows}>
            {NOTES.map((n) => (
              <p key={n.k} className={cn(s.row, s.note)}>
                <span className={s.noteK}>{n.k}</span>
                <span className={s.noteV}>{n.v}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  if (i === 2)
    return (
      <div className={s.app}>
        <div className={s.appBar}><span>Front desk answers</span><span>Draft</span></div>
        <div className={s.appBody}>
          <p className={s.appH}>Pages checked with your office manager</p>
          <div className={s.rows}>
            {PAGES.map((p) => (
              <p key={p.page} className={cn(s.row, s.page)}>
                <span>{p.page}</span>
                <span className={cn(s.chip, p.good && s.chipGood)}>{p.state}</span>
              </p>
            ))}
          </div>
          <p className={s.appFoot}>Opens in a browser, next to your practice software.</p>
        </div>
      </div>
    );
  return (
    <div className={s.app}>
      <div className={s.appBar}><span>Front desk answers</span><span>Export</span></div>
      <div className={s.appBody}>
        <div className={s.editHead}>
          <p className={s.appH}>Patient is late. Can we still see them?</p>
          <span className={s.editBtn}>Edit</span>
        </div>
        <div className={s.cases}>
          <p className={s.case}><span className={s.caseK}>Under 15 minutes</span>Check them in.</p>
          <p className={cn(s.case, s.caseEdit)}><span className={s.caseK}>Over 15 minutes</span>Offer the next open slot.</p>
        </div>
        <div className={s.hist}>
          <p className={s.histH}>Page history</p>
          <div className={s.rows}>
            <p className={cn(s.row, s.histRow)}><span>Edited by the office manager<em>Today</em></span></p>
            <p className={cn(s.row, s.histRow)}><span>Edited by the office manager<em>Last month</em></span><span className={s.linkish}>Restore</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
