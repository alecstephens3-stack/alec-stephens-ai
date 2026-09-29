"use client";

import "./tools-a.css";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ToolFrame } from "@/components/desk/tool-frame";
import { Porthole } from "@/components/ui/lens-primitives";
import { cn } from "@/lib/utils";

/**
 * Claims watch. From the call: denials arrive weeks later as letters, unpaid
 * claims only surface on the Dentrix aging report, and chasing one means
 * calling each insurer, which Dr. Jo puts off. This is the aging report read
 * for her, with the call and the appeal letter ready. Sample data.
 */

type Status = "paid" | "waiting" | "quiet" | "denied";

type Claim = {
  id: string;
  claimNo: string;
  sent: string; // "Jul 29"
  serviceDate: string; // "Jul 28, 2026"
  patient: string;
  insurer: string;
  procedure: string;
  code: string;
  tooth?: string;
  amount: number;
  daysOut: number;
  status: Status;
  denialReason?: string;
  xrays?: string;
  clinical?: string;
};

// Days out are counted from the day this sample was written (Sep 23, 2026).
const CLAIMS: Claim[] = [
  {
    id: "c1",
    claimNo: "CG-2026-0729-4471",
    sent: "Jul 29",
    serviceDate: "Jul 28, 2026",
    patient: "Rosa Almeida",
    insurer: "Cigna PPO",
    procedure: "Crown, porcelain",
    code: "D2740",
    tooth: "#30",
    amount: 590,
    daysOut: 56,
    status: "denied",
    denialReason: "not dentally necessary; a filling would have been sufficient",
    xrays: "Jul 14, 2026 (bitewing) and Jul 28, 2026 (periapical)",
    clinical:
      "a fractured mesiolingual cusp on a tooth already carrying a large three-surface amalgam placed in 2011, with less than half of the natural tooth structure remaining above the gum line",
  },
  {
    id: "c2",
    claimNo: "CG-2026-0806-2210",
    sent: "Aug 6",
    serviceDate: "Aug 5, 2026",
    patient: "Daniel Okafor",
    insurer: "Cigna PPO",
    procedure: "Crown, porcelain",
    code: "D2740",
    tooth: "#19",
    amount: 612,
    daysOut: 48,
    status: "quiet",
  },
  {
    id: "c3",
    claimNo: "ML-2026-0813-0915",
    sent: "Aug 13",
    serviceDate: "Aug 12, 2026",
    patient: "Priya Natarajan",
    insurer: "MetLife PPO",
    procedure: "Filling, two surfaces",
    code: "D2392",
    tooth: "#14",
    amount: 164,
    daysOut: 41,
    status: "quiet",
  },
  {
    id: "c4",
    claimNo: "AE-2026-0819-7733",
    sent: "Aug 19",
    serviceDate: "Aug 18, 2026",
    patient: "Tom Whitaker",
    insurer: "Aetna PPO",
    procedure: "Root canal, molar",
    code: "D3330",
    tooth: "#3",
    amount: 418,
    daysOut: 35,
    status: "quiet",
  },
  {
    id: "c5",
    claimNo: "DD-2026-0826-3102",
    sent: "Aug 26",
    serviceDate: "Aug 25, 2026",
    patient: "Ben Carrow",
    insurer: "Delta Dental PPO",
    procedure: "Filling, one surface",
    code: "D2391",
    tooth: "#29",
    amount: 118,
    daysOut: 28,
    status: "paid",
  },
  {
    id: "c6",
    claimNo: "DD-2026-0902-5580",
    sent: "Sep 2",
    serviceDate: "Sep 1, 2026",
    patient: "Grace Lindqvist",
    insurer: "Delta Dental PPO",
    procedure: "Scaling, one quadrant",
    code: "D4341",
    amount: 212,
    daysOut: 21,
    status: "waiting",
  },
  {
    id: "c7",
    claimNo: "MO-2026-0909-1187",
    sent: "Sep 9",
    serviceDate: "Sep 8, 2026",
    patient: "Miguel Serrano",
    insurer: "Mutual of Omaha PPO",
    procedure: "Crown, porcelain",
    code: "D2740",
    tooth: "#4",
    amount: 340,
    daysOut: 14,
    status: "waiting",
  },
  {
    id: "c8",
    claimNo: "AE-2026-0915-9024",
    sent: "Sep 15",
    serviceDate: "Sep 14, 2026",
    patient: "Hana Ishikawa",
    insurer: "Aetna PPO",
    procedure: "Exam and cleaning",
    code: "D0120, D1110",
    amount: 96,
    daysOut: 8,
    status: "waiting",
  },
];

// Provider lines as printed on the back of the card. Confirm against the card
// before dialing; the desk keeps the real ones on the phone list.
const PROVIDER_LINES: Record<string, string> = {
  "Cigna PPO": "1-800-244-6224",
  "MetLife PPO": "1-877-638-3379",
  "Aetna PPO": "1-800-451-7715",
  "Delta Dental PPO": "1-800-765-6003",
  "Mutual of Omaha PPO": "1-800-927-9197",
};

const STATUS_LABEL: Record<Status, string> = {
  paid: "Paid",
  waiting: "Waiting",
  quiet: "Quiet 30+ days",
  denied: "Denied",
};
const STATUS_CHIP: Record<Status, string> = {
  paid: "quiet",
  waiting: "",
  quiet: "warn",
  denied: "bad",
};

function money(n: number): string {
  return "$" + n.toLocaleString("en-US");
}

function shortInsurer(name: string): string {
  return name.replace(/ PPO$/, "");
}

function appealLetter(c: Claim): string {
  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return [
    `${today}`,
    ``,
    `${c.insurer} Dental Claims Review`,
    `Re: Appeal of claim ${c.claimNo}`,
    `Patient: ${c.patient}`,
    `Date of service: ${c.serviceDate}`,
    `Procedure: ${c.procedure} (${c.code}), tooth ${c.tooth ?? ""}`,
    ``,
    `To the dental review team,`,
    ``,
    `I am writing to ask you to look again at this claim. It was denied as ${c.denialReason}. I placed this crown myself, and I would not have recommended it if a filling could have done the job.`,
    ``,
    `The X-rays on file, taken ${c.xrays}, show ${c.clinical}. A filling in that situation does not hold. The remaining wall would fracture under normal chewing within months, and the patient would be back for the same crown, or worse, an extraction. A crown was the conservative choice here, not the aggressive one.`,
    ``,
    `I have attached both X-rays again, the intraoral photograph from the day of treatment, and my clinical notes. If a reviewing dentist would like to discuss the case, I am glad to take the call at the practice number below.`,
    ``,
    `Please reprocess the claim for ${money(c.amount)}, the contracted amount. The patient has already paid their portion and should not carry the rest of this bill because of a paper review.`,
    ``,
    `Thank you for your time.`,
    ``,
    `Dr. Jo, DDS`,
    `Tri-Valley Dental Care`,
  ].join("\n");
}

function callScript(c: Claim): string {
  return `Hi, this is Lori from Tri-Valley Dental Care. I'm checking on a claim sent ${c.sent} for ${c.patient}, date of service ${c.serviceDate}, ${c.procedure.toLowerCase()} ${c.code}${c.tooth ? ` on tooth ${c.tooth}` : ""}, billed at ${money(c.amount)}. Can you tell me whether it was received, and where it is now?`;
}

export function ClaimsTool({
  demo = false,
}: {
  /** Self-running tour: shows the table for a beat, then opens the appeal. */
  demo?: boolean;
} = {}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const [letter, setLetter] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState<string | null>(null);

  // The tour: let the table read for a beat, then open the appeal.
  useEffect(() => {
    if (!demo) return;
    const denied = CLAIMS.find((c) => c.status === "denied");
    if (!denied) return;
    const t = window.setTimeout(() => setOpenId(denied.id), 1600);
    return () => window.clearTimeout(t);
  }, [demo]);

  const rows = useMemo(() => [...CLAIMS].sort((a, b) => b.daysOut - a.daysOut), []);

  const quietCount = rows.filter((c) => c.status === "quiet").length;
  const waitingTotal = rows
    .filter((c) => c.status === "quiet" || c.status === "waiting")
    .reduce((sum, c) => sum + c.amount, 0);
  const deniedTotal = rows
    .filter((c) => c.status === "denied")
    .reduce((sum, c) => sum + c.amount, 0);

  function toggle(id: string) {
    setOpenId((cur) => (cur === id ? null : id));
    setCopied(null);
  }

  function letterFor(c: Claim): string {
    return letter[c.id] ?? appealLetter(c);
  }

  async function copyLetter(c: Claim) {
    try {
      await navigator.clipboard.writeText(letterFor(c));
      setCopied(c.id);
      window.setTimeout(() => setCopied((cur) => (cur === c.id ? null : cur)), 1800);
    } catch {
      setCopied(null);
    }
  }

  return (
    <ToolFrame
      label="Claims watch"
      title="The aging report, before it becomes a letter"
      note='Dr. Jo, on the call: "I&apos;m just kind of lazy to go back and call the insurance, because I literally have to call each insurance." So the report is read for her, and the call is ready.'
      status="sample"
      footer={
        <p>
          The rows come from the same Dentrix aging report the desk already runs. Nothing is sent
          anywhere from here: the call is still a call, and the letter goes out on the
          practice&apos;s paper once Dr. Jo has read it.
        </p>
      }
    >
      <p className="dta-cl-summary">
        <span className="num">{quietCount}</span> claims quiet for more than 30 days ·{" "}
        <span className="num">{money(waitingTotal)}</span> waiting
        {deniedTotal ? (
          <>
            {" "}
            · <span className="num">{money(deniedTotal)}</span> denied, appeal ready
          </>
        ) : null}
      </p>

      <div className="dta-cl-wrap">
        <table className="dta-cl-table">
          <thead>
            <tr>
              <th scope="col">Patient</th>
              <th scope="col">Insurer</th>
              <th scope="col" className="num">
                Amount
              </th>
              <th scope="col" className="num">
                Days out
              </th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const isOpen = openId === c.id;
              const actionable = c.status === "quiet" || c.status === "denied";
              return (
                <Fragment key={c.id}>
                  <tr className={cn(isOpen && "is-open")}>
                    <td data-label="Patient">
                      {c.patient}
                      <span className="sub">
                        {c.procedure}, {c.code}
                      </span>
                    </td>
                    <td data-label="Insurer">{c.insurer}</td>
                    <td className="num" data-label="Amount">
                      {money(c.amount)}
                    </td>
                    <td className="num" data-label="Days out">
                      {c.daysOut}
                      <span className="unit"> days out</span>
                      <span className="sub">sent {c.sent}</span>
                    </td>
                    <td data-label="Status">
                      <div className="dta-cl-status">
                        <span className={cn("dta-chip", STATUS_CHIP[c.status])}>
                          {STATUS_LABEL[c.status]}
                        </span>
                        {actionable ? (
                          <button
                            type="button"
                            className="dta-cl-link"
                            onClick={() => toggle(c.id)}
                            aria-expanded={isOpen}
                          >
                            {isOpen
                              ? "Hide"
                              : c.status === "denied"
                                ? "Draft the appeal"
                                : `Call ${shortInsurer(c.insurer)}`}
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                  {isOpen && c.status === "quiet" ? (
                    <tr className="dta-cl-detail">
                      <td colSpan={5}>
                        <div className="sai-tile dta-cl-call">
                          <Porthole>Call {shortInsurer(c.insurer)}</Porthole>
                          <div className="line">
                            {PROVIDER_LINES[c.insurer] ? (
                              <a href={`tel:+${PROVIDER_LINES[c.insurer].replace(/\D/g, "")}`}>
                                {PROVIDER_LINES[c.insurer]}
                              </a>
                            ) : (
                              "Provider line on the back of the card"
                            )}
                          </div>
                          <p className="dta-runin script">
                            <strong>Say:</strong> {callScript(c)}
                          </p>
                          <p className="dta-runin mt-3">
                            Have ready: subscriber ID and group number from the patient&apos;s
                            insurance tab, and the practice tax ID. Write the answer and the
                            reference number into the claim note in Dentrix so nobody calls twice.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                  {isOpen && c.status === "denied" ? (
                    <tr className="dta-cl-detail">
                      <td colSpan={5}>
                        <div className="sai-tile dta-cl-appeal">
                          <div className="dta-cl-appeal-head">
                            <Porthole>Appeal draft</Porthole>
                            <span className="dta-chip bad">Denied as not necessary</span>
                          </div>
                          <p className="dta-runin mt-3">
                            Written in Dr. Jo&apos;s voice from the claim, the X-ray dates and the
                            clinical note. Edit anything, then copy it onto the practice letterhead.
                          </p>
                          <label className="sr-only" htmlFor={`appeal-${c.id}`}>
                            Appeal letter
                          </label>
                          <textarea
                            id={`appeal-${c.id}`}
                            className="dta-input"
                            value={letterFor(c)}
                            onChange={(e) =>
                              setLetter((l) => ({ ...l, [c.id]: e.target.value }))
                            }
                            spellCheck={false}
                          />
                          <div className="dta-cl-appeal-actions">
                            <button
                              type="button"
                              className="sai-btn primary dta-btn-sm"
                              onClick={() => copyLetter(c)}
                            >
                              Copy letter
                            </button>
                            <button
                              type="button"
                              className="sai-btn ghost dta-btn-sm"
                              onClick={() => window.print()}
                            >
                              Print
                            </button>
                            {copied === c.id ? (
                              <span className="dta-copied">Copied.</span>
                            ) : null}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </ToolFrame>
  );
}
