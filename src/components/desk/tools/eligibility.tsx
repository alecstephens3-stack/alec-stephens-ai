"use client";

import "./tools-a.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { ToolFrame } from "@/components/desk/tool-frame";
import { Porthole } from "@/components/ui/lens-primitives";

/**
 * Insurance eligibility, the lead build from the Tri-Valley call. A prototype
 * on sample data: the form is real, the 900ms wait stands in for the portal,
 * and the result shows exactly the fields Lori and Dr. Jo named. Which
 * portals can be read automatically is decided by the login test, not here.
 */

const INSURERS = [
  "Delta Dental PPO",
  "Delta Care USA",
  "Cigna PPO",
  "Aetna PPO",
  "MetLife PPO",
  "Mutual of Omaha PPO",
] as const;
type Insurer = (typeof INSURERS)[number];

type Form = {
  first: string;
  last: string;
  dob: string;
  insurer: Insurer;
  dependent: boolean;
  subFirst: string;
  subLast: string;
  subDob: string;
};

const SAMPLE: Form = {
  first: "Maria",
  last: "Delgado",
  dob: "1986-04-12",
  insurer: "Cigna PPO",
  dependent: false,
  subFirst: "",
  subLast: "",
  subDob: "",
};

type Result = {
  active: string;
  subscriberId: string;
  group: string;
  provider: "in-network" | "your-facility" | "other-facility";
  annualMax: string;
  remaining: string;
  deductible: string;
  /** PPO plans: coverage by category. Delta Care USA: a copay schedule instead. */
  coverage: { label: string; value: string; note?: string }[];
  coverageKind: "percent" | "copay";
};

// Per-insurer sample data. Deterministic on purpose so the demo reads the same
// way every time. Delta Care USA is the office-assignment case: a dependent can
// be assigned to a different office than the subscriber, which is how the
// "other facility" answer shows up.
function lookup(form: Form): Result {
  const ppoCoverage = (major: string) => [
    { label: "Preventive", value: "100%", note: "exams, cleanings, X-rays" },
    { label: "Basic", value: "80%", note: "fillings, simple extractions" },
    { label: "Major", value: major, note: "crowns, bridges, root canals" },
  ];
  switch (form.insurer) {
    case "Delta Care USA":
      return {
        active: "Active · Jan 1, 2026 to present",
        subscriberId: "DCU 4471 0928 3",
        group: "07214",
        provider: form.dependent ? "other-facility" : "your-facility",
        annualMax: "None on this plan",
        remaining: "Not applicable",
        deductible: "None",
        coverageKind: "copay",
        coverage: [
          { label: "Exam and cleaning", value: "$0", note: "D0120, D1110" },
          { label: "Filling, two surfaces", value: "$25", note: "D2392" },
          { label: "Crown, porcelain", value: "$295", note: "D2740" },
        ],
      };
    case "Delta Dental PPO":
      return {
        active: "Active · Jan 1, 2025 to present",
        subscriberId: "013 486 2210",
        group: "21980-0001",
        provider: "in-network",
        annualMax: "$2,000",
        remaining: "$1,712",
        deductible: "$50 of $50 met",
        coverageKind: "percent",
        coverage: ppoCoverage("50%"),
      };
    case "Aetna PPO":
      return {
        active: "Active · Mar 1, 2024 to present",
        subscriberId: "W 2247 61903",
        group: "868112-010",
        provider: "in-network",
        annualMax: "$1,500",
        remaining: "$1,500",
        deductible: "$0 of $50 met",
        coverageKind: "percent",
        coverage: ppoCoverage("50%"),
      };
    case "MetLife PPO":
      return {
        active: "Active · Jan 1, 2023 to present",
        subscriberId: "80 2233 9105",
        group: "0155440",
        provider: "in-network",
        annualMax: "$2,000",
        remaining: "$940",
        deductible: "$50 of $50 met",
        coverageKind: "percent",
        coverage: ppoCoverage("60%"),
      };
    case "Mutual of Omaha PPO":
      return {
        active: "Active · Jul 1, 2025 to present",
        subscriberId: "MOO 66 0192 447",
        group: "G000512883",
        provider: "in-network",
        annualMax: "$1,000",
        remaining: "$1,000",
        deductible: "$0 of $75 met",
        coverageKind: "percent",
        coverage: ppoCoverage("50%"),
      };
    case "Cigna PPO":
    default:
      return {
        active: "Active · Jan 1, 2024 to present",
        subscriberId: "U 6120 3389 01",
        group: "3341052",
        provider: "in-network",
        annualMax: "$1,500",
        remaining: "$1,180",
        deductible: "$50 of $50 met",
        coverageKind: "percent",
        coverage: ppoCoverage("50%"),
      };
  }
}

function longDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function plainText(form: Form, r: Result): string {
  const provider =
    r.provider === "in-network"
      ? "In network"
      : r.provider === "your-facility"
        ? "Your facility"
        : "Other facility (patient must call Delta Care to move to this office)";
  const lines = [
    `Patient: ${form.first} ${form.last}`,
    `Date of birth: ${longDate(form.dob)}`,
    `Insurer: ${form.insurer}`,
    form.dependent
      ? `Subscriber: ${form.subFirst} ${form.subLast} (${longDate(form.subDob)})`
      : "Subscriber: patient",
    `Coverage: ${r.active}`,
    `Subscriber ID: ${r.subscriberId}`,
    `Group number: ${r.group}`,
    `Provider status: ${provider}`,
    `Annual maximum: ${r.annualMax}`,
    `Remaining: ${r.remaining}`,
    `Deductible: ${r.deductible}`,
    r.coverageKind === "percent" ? "Coverage:" : "Copays:",
    ...r.coverage.map((c) => `  ${c.label}: ${c.value}`),
    `Checked: ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`,
  ];
  return lines.join("\n");
}

export function EligibilityTool({
  demo = false,
}: {
  /** Self-running tour: submits the pre-filled form on its own. */
  demo?: boolean;
} = {}) {
  const [form, setForm] = useState<Form>(SAMPLE);
  const [phase, setPhase] = useState<"idle" | "checking" | "done">("idle");
  const [result, setResult] = useState<Result | null>(null);
  const [checked, setChecked] = useState<Form | null>(null);
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);
  const resultRef = useRef<HTMLElement>(null);

  // Bring the answer into view when it lands (it sits below the fold on a phone).
  useEffect(() => {
    if (phase === "done") resultRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [phase]);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  // Editing the form after a check clears the answer, so a result on screen
  // always belongs to the patient in the fields above it.
  const set = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (phase === "done") {
      setPhase("idle");
      setResult(null);
      setCopied(false);
    }
  };

  const canSubmit =
    form.first.trim() &&
    form.last.trim() &&
    form.dob &&
    (!form.dependent || (form.subFirst.trim() && form.subLast.trim() && form.subDob));

  // Stable across renders: only state setters and a ref.
  const run = useCallback((snapshotOf: Form) => {
    setPhase("checking");
    setResult(null);
    setCopied(false);
    const snapshot = { ...snapshotOf };
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setResult(lookup(snapshot));
      setChecked(snapshot);
      setPhase("done");
    }, 900);
  }, []);

  // The tour: the sample patient is already filled in; check her on our own.
  useEffect(() => {
    if (!demo) return;
    const t = window.setTimeout(() => run(SAMPLE), 700);
    return () => window.clearTimeout(t);
  }, [demo, run]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || phase === "checking") return;
    run(form);
  }

  async function copy() {
    if (!result || !checked) return;
    try {
      await navigator.clipboard.writeText(plainText(checked, result));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <ToolFrame
      label="Eligibility"
      title="Name and birthday in, coverage out"
      note='Dr. Jo, on the call: "type in patient&apos;s name and birthday and it will spit out the correct information. This is a subscriber ID, this is a group number, this is the coverage, this is effective date."'
      status="sample"
      footer={
        <p>
          This reads the same insurer portals the desk logs into today. How automatic it can be,
          and for which of the five plans, is decided by the login test: whether each portal asks
          for a texted code, a tap on a phone, or nothing.
        </p>
      }
    >
      <form onSubmit={submit} noValidate>
        <div className="dta-grid">
          <div>
            <label className="dta-label" htmlFor="el-first">
              First name
            </label>
            <input
              id="el-first"
              className="dta-input"
              value={form.first}
              onChange={(e) => set("first", e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="dta-label" htmlFor="el-last">
              Last name
            </label>
            <input
              id="el-last"
              className="dta-input"
              value={form.last}
              onChange={(e) => set("last", e.target.value)}
              autoComplete="off"
            />
          </div>
          <div>
            <label className="dta-label" htmlFor="el-dob">
              Date of birth
            </label>
            <input
              id="el-dob"
              className="dta-input"
              type="date"
              value={form.dob}
              onChange={(e) => set("dob", e.target.value)}
            />
          </div>
          <div>
            <label className="dta-label" htmlFor="el-insurer">
              Insurer
            </label>
            <select
              id="el-insurer"
              className="dta-input"
              value={form.insurer}
              onChange={(e) => set("insurer", e.target.value as Insurer)}
            >
              {INSURERS.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="dta-span pt-1">
            <label className="dta-switch">
              <input
                type="checkbox"
                checked={form.dependent}
                onChange={(e) => set("dependent", e.target.checked)}
              />
              <span className="track" aria-hidden="true" />
              <span>Patient is a dependent (on a spouse&apos;s or parent&apos;s plan)</span>
            </label>
          </div>
          {form.dependent ? (
            <>
              <div>
                <label className="dta-label" htmlFor="el-sub-first">
                  Subscriber first name
                </label>
                <input
                  id="el-sub-first"
                  className="dta-input"
                  value={form.subFirst}
                  onChange={(e) => set("subFirst", e.target.value)}
                  placeholder="Who carries the plan"
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="dta-label" htmlFor="el-sub-last">
                  Subscriber last name
                </label>
                <input
                  id="el-sub-last"
                  className="dta-input"
                  value={form.subLast}
                  onChange={(e) => set("subLast", e.target.value)}
                  autoComplete="off"
                />
              </div>
              <div>
                <label className="dta-label" htmlFor="el-sub-dob">
                  Subscriber date of birth
                </label>
                <input
                  id="el-sub-dob"
                  className="dta-input"
                  type="date"
                  value={form.subDob}
                  onChange={(e) => set("subDob", e.target.value)}
                />
              </div>
              <p className="dta-runin self-end pb-1">
                Without the subscriber&apos;s name and birthday the insurer will not talk to you.
              </p>
            </>
          ) : null}
        </div>

        <div className="dta-el-actions">
          <button
            type="submit"
            className="sai-btn primary"
            disabled={!canSubmit || phase === "checking"}
          >
            Check coverage
          </button>
          {phase === "checking" ? (
            <span className="dta-el-checking" aria-live="polite">
              <span className="disc" aria-hidden="true" />
              Checking the {form.insurer.replace(/ PPO$/, "")} portal...
            </span>
          ) : null}
        </div>
      </form>

      {phase === "done" && result && checked ? (
        <section ref={resultRef} className="sai-tile dta-result" aria-live="polite">
          <div className="dta-result-head">
            <div>
              <div className="dta-result-name">
                {checked.first} {checked.last}
              </div>
              <div className="dta-result-plan">
                {longDate(checked.dob)} · {checked.insurer}
                {checked.dependent
                  ? ` · dependent of ${checked.subFirst} ${checked.subLast}`
                  : " · subscriber"}
              </div>
            </div>
            <span className="dta-chip good">Active</span>
          </div>

          <dl className="dta-facts">
            <div className="dta-fact wide">
              <dt>Coverage</dt>
              <dd>{result.active}</dd>
            </div>
            <div className="dta-fact">
              <dt>Subscriber ID</dt>
              <dd>
                <span className="num">{result.subscriberId}</span>
              </dd>
            </div>
            <div className="dta-fact">
              <dt>Group number</dt>
              <dd>
                <span className="num">{result.group}</span>
              </dd>
            </div>
            <div className="dta-fact wide">
              <dt>Provider status</dt>
              <dd>
                {result.provider === "in-network" ? (
                  <>
                    <span className="dta-chip good">In network</span>
                    Tri-Valley Dental is a contracted provider on this plan.
                  </>
                ) : result.provider === "your-facility" ? (
                  <>
                    <span className="dta-chip good">Your facility</span>
                    The patient is assigned to this office. The claim will pay.
                  </>
                ) : (
                  <>
                    <span className="dta-chip bad">Other facility</span>
                    The patient is assigned to a different office and this visit cannot be paid.
                    <span className="sub">
                      Tell the patient: &ldquo;Please call Delta Care at the number on your card
                      and ask them to move you to our office. Our facility number is on the card
                      at the desk.&rdquo; Dependents can be assigned to a different office than
                      the subscriber, which is what happened here.
                    </span>
                  </>
                )}
              </dd>
            </div>
          </dl>

          <div className="dta-sub-head">
            <Porthole>Eligibility and benefits</Porthole>
          </div>
          <dl className="dta-facts three">
            <div className="dta-fact">
              <dt>Annual maximum</dt>
              <dd>{result.annualMax}</dd>
            </div>
            <div className="dta-fact">
              <dt>Remaining this year</dt>
              <dd>{result.remaining}</dd>
            </div>
            <div className="dta-fact">
              <dt>Deductible</dt>
              <dd>{result.deductible}</dd>
            </div>
          </dl>

          <table className="dta-table">
            <caption className="sr-only">
              {result.coverageKind === "percent"
                ? "Coverage by category"
                : "Patient copay by procedure"}
            </caption>
            <thead>
              <tr>
                <th scope="col">
                  {result.coverageKind === "percent" ? "Category" : "Procedure"}
                </th>
                <th scope="col" className="num">
                  {result.coverageKind === "percent" ? "Plan pays" : "Patient pays"}
                </th>
              </tr>
            </thead>
            <tbody>
              {result.coverage.map((row) => (
                <tr key={row.label}>
                  <td>
                    {row.label}
                    {row.note ? <span className="sub">{row.note}</span> : null}
                  </td>
                  <td className="num">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="dta-runin dta-result-note">
            {result.coverageKind === "percent"
              ? "This is how the copay is decided: the fee, less what the plan pays, plus any deductible not yet met. "
              : "On this plan the patient pays the listed copay and nothing else for that procedure. "}
            Per-procedure coverage is not shown by every portal. A crown may still be reviewed
            after the claim.
          </p>

          <div className="dta-result-actions">
            <button type="button" className="sai-btn ghost dta-btn-sm" onClick={copy}>
              Copy to Dentrix
            </button>
            {copied ? <span className="dta-copied">Copied. Paste it into the insurance tab.</span> : null}
          </div>
        </section>
      ) : null}
    </ToolFrame>
  );
}
