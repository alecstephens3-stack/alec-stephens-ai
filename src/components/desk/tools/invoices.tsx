"use client";

import "./tools-b.css";
import { useEffect, useRef, useState } from "react";
import { ToolFrame } from "@/components/desk/tool-frame";
import { cn } from "@/lib/utils";

/**
 * The vendor bill filer: a faithful sample of the "File Invoices" app that runs
 * on a bookkeeper's PC at an optometry clinic. The real one reads each PDF,
 * names it by date, vendor, number and total, files it into the vendor's
 * folder on the office drive, queues it for QuickBooks, flags anything it is
 * not sure about for a person, and can undo a whole batch in one click.
 * Reading a page costs about a cent (0.9 cents measured, 2026-09-16).
 *
 * Here: real file drops are read for their names only. The vendors, numbers
 * and totals are sample readings. Nothing is uploaded anywhere.
 */

type Kind = "invoice" | "statement" | "packing slip";
type RowStatus = "ready" | "look" | "filed";

type Reading = {
  vendor: string;
  number: string;
  date: string; // ISO
  total: number | null;
  kind: Kind;
  folder: string;
  category: string;
  issue?: "unknown" | "packing";
  options?: string[];
};

type Row = Reading & {
  id: string;
  file: string;
  status: RowStatus;
  rule?: string;
};

/** Six readings, the way the real app returns them. */
const READINGS: Reading[] = [
  {
    vendor: "Patterson Dental",
    number: "41877",
    date: "2026-09-08",
    total: 612.4,
    kind: "invoice",
    folder: "Patterson Dental",
    category: "Dental supplies",
  },
  {
    vendor: "Dentsply Sirona",
    number: "2291",
    date: "2026-09-11",
    total: 1284,
    kind: "invoice",
    folder: "Dentsply Sirona",
    category: "Dental supplies",
  },
  {
    vendor: "PG&E",
    number: "Sept statement",
    date: "2026-09-05",
    total: 418.27,
    kind: "statement",
    folder: "PG&E",
    category: "Utilities",
  },
  {
    vendor: "Bay Area Sterilization Services",
    number: "1093",
    date: "2026-09-10",
    total: 265,
    kind: "invoice",
    folder: "",
    category: "Repairs and maintenance",
    issue: "unknown",
    options: ["Bay Area Sterilization Services (new folder)", "Equipment service", "Office"],
  },
  {
    vendor: "Henry Schein",
    number: "7720145",
    date: "2026-09-15",
    total: null,
    kind: "packing slip",
    folder: "",
    category: "Not posted",
    issue: "packing",
    options: ["Henry Schein / Packing slips", "Henry Schein / Invoices"],
  },
  {
    vendor: "Waste Management",
    number: "5581-0926",
    date: "2026-09-12",
    total: 189.5,
    kind: "invoice",
    folder: "Waste Management",
    category: "Utilities",
  },
];

const SAMPLE_FILES = [
  "scan_0917_001.pdf",
  "Dentsply_Sirona_INV_2026-2291.pdf",
  "PGE statement.pdf",
  "IMG_4471.pdf",
  "HS_packing_slip_7720145.pdf",
  "Invoice 5581-0926.pdf",
];

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

const shortDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

function newName(r: Reading) {
  if (r.kind === "packing slip") return `${r.date} ${r.vendor} packing slip ${r.number}.pdf`;
  if (r.kind === "statement") return `${r.date} ${r.vendor} statement${r.total !== null ? ` ${money(r.total)}` : ""}.pdf`;
  return `${r.date} ${r.vendor} ${r.number}${r.total !== null ? ` ${money(r.total)}` : ""}.pdf`;
}

function buildRows(files: string[]): Row[] {
  return files.map((file, i) => {
    const r = READINGS[i % READINGS.length];
    return { ...r, id: `${i}-${file}`, file, status: r.issue ? "look" : "ready" };
  });
}

export function InvoicesTool({ demo = false }: { demo?: boolean } = {}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [source, setSource] = useState<"none" | "sample" | "dropped">("none");
  const [over, setOver] = useState(false);
  const [phase, setPhase] = useState<"review" | "filing" | "filed">("review");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const t = timers.current;
    return () => t.forEach((id) => window.clearTimeout(id));
  }, []);
  const later = (ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms));
  };
  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  const load = (files: string[], from: "sample" | "dropped") => {
    clearTimers();
    setRows(buildRows(files));
    setSource(from);
    setPhase("review");
  };

  const takeFiles = (list: FileList | null) => {
    if (!list || list.length === 0) return;
    const names = Array.from(list)
      .map((f) => f.name)
      .slice(0, 12);
    load(names, "dropped");
  };

  const pickFolder = (id: string, folder: string) => {
    setRows((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        const cleanFolder = folder.replace(/ \(new folder\)$/, "");
        const what = r.kind === "packing slip" ? "packing slips" : r.kind === "statement" ? "statements" : "invoices";
        return {
          ...r,
          folder: cleanFolder,
          status: "ready",
          rule:
            cleanFolder === r.vendor
              ? `New folder made for ${r.vendor}. Their ${what} file there from now on.`
              : `${r.vendor} ${what} file to ${cleanFolder} from now on.`,
        };
      }),
    );
  };

  const fileRows = (list: Row[]) => {
    const ready = list.filter((r) => r.status === "ready");
    if (ready.length === 0) return;
    setPhase("filing");
    ready.forEach((r, i) => {
      later(160 + i * 190, () =>
        setRows((prev) => prev.map((x) => (x.id === r.id ? { ...x, status: "filed" } : x))),
      );
    });
    later(160 + ready.length * 190 + 200, () => setPhase("filed"));
  };
  const fileBatch = () => {
    if (phase !== "review") return;
    fileRows(rows);
  };

  // The self-running tour: load the sample, answer the first amber row, file.
  useEffect(() => {
    if (!demo) return;
    const initial = buildRows(SAMPLE_FILES);
    const first = initial.find((r) => r.status === "look");
    const ids = [
      window.setTimeout(() => load(SAMPLE_FILES, "sample"), 700),
      window.setTimeout(() => {
        if (first?.options?.[0]) pickFolder(first.id, first.options[0]);
      }, 2200),
      window.setTimeout(() => {
        fileRows(initial.map((r) => (r.id === first?.id ? { ...r, status: "ready" as const } : r)));
      }, 3700),
    ];
    return () => ids.forEach((id) => window.clearTimeout(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [demo]);

  const undo = () => {
    clearTimers();
    setRows((prev) => prev.map((r) => (r.status === "filed" ? { ...r, status: "ready" } : r)));
    setPhase("review");
  };

  const startOver = () => {
    clearTimers();
    setRows([]);
    setSource("none");
    setPhase("review");
    if (inputRef.current) inputRef.current.value = "";
  };

  const filed = rows.filter((r) => r.status === "filed");
  const queued = filed.filter((r) => r.kind !== "packing slip").length;
  const keptBack = filed.length - queued;
  const waiting = rows.filter((r) => r.status === "look").length;
  const readyCount = rows.filter((r) => r.status === "ready").length;

  const dropZone = (
    <div
      className={cn("dtb-drop", over && "is-over")}
      role="button"
      tabIndex={0}
      aria-label="Drop vendor bills here or choose files"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        takeFiles(e.dataTransfer.files);
      }}
    >
      <span className="dtb-drop-title">Drop this week&rsquo;s vendor bills here</span>
      <span className="dtb-drop-sub">
        Scans from the copier, a photo from a phone, an email attachment. Or click to choose files.
      </span>
      <button
        type="button"
        className="sai-btn ghost dtb-btn dtb-drop-or"
        onClick={(e) => {
          e.stopPropagation();
          load(SAMPLE_FILES, "sample");
        }}
      >
        Use the sample batch
      </button>
    </div>
  );

  return (
    <ToolFrame
      label="Vendor bills"
      title="Drop the bill, it files itself"
      note="The bookkeeper's biggest sink was typing vendor invoices. This reads the PDF, names it, files it under the vendor and queues it for QuickBooks, and a person approves every batch before anything is posted."
      status="sample"
      footer={
        <div style={{ display: "grid", gap: 6 }}>
          <p className="dtb-fine">
            About one cent per invoice to read. Roughly two dollars a month for this desk.
          </p>
          <p className="dtb-fine">
            Files you drop here are read for their names only and never leave your browser. The vendors, numbers and totals shown are sample readings; the real app takes them off the PDF.
          </p>
        </div>
      }
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,image/*"
        hidden
        onChange={(e) => takeFiles(e.target.files)}
      />

      {rows.length === 0 ? (
        dropZone
      ) : (
        <div className="dtb-stack">
          <div className="dtb-inv-head">
            <span className="lead">
              {rows.length} {rows.length === 1 ? "file" : "files"} read
              {source === "dropped" ? " from what you dropped" : ""}
            </span>
            <span className="sub">
              {phase === "filed"
                ? "Filed. Undo puts every file back where it was."
                : waiting > 0
                  ? `${readyCount} ready, ${waiting} need${waiting === 1 ? "s" : ""} a look`
                  : `${readyCount} ready`}
            </span>
          </div>

          <div className="dtb-inv-list" role="list" aria-label="This batch">
            {rows.map((r) => (
              <div key={r.id} className={cn("dtb-inv-row", r.status === "filed" && "is-filed")} role="listitem">
                <div className="dtb-inv-main">
                  <span className="dtb-inv-vendor">{r.vendor}</span>
                  <span className="dtb-inv-meta">
                    {[
                      r.kind === "invoice"
                        ? `Invoice ${r.number}`
                        : r.kind === "statement"
                          ? "Statement"
                          : `Packing slip ${r.number}`,
                      shortDate(r.date),
                      r.kind === "packing slip" ? "Not posted to QuickBooks" : r.category,
                    ].join(" · ")}
                  </span>
                </div>
                <div className="dtb-inv-side">
                  <span className={cn("dtb-inv-total", r.total === null && "quiet")}>
                    {r.total === null ? "No total" : money(r.total)}
                  </span>
                  <span
                    className={cn("dtb-chip", r.status === "look" && "warn", r.status === "filed" && "good")}
                    aria-live="polite"
                  >
                    {r.status === "ready" ? "Ready" : r.status === "look" ? "Needs a look" : "Filed"}
                  </span>
                </div>

                <p className="dtb-inv-file">
                  <span className="from">{r.file}</span>
                  <span className="arrow" aria-hidden="true">
                    &rarr;
                  </span>
                  <span className="dtb-sr">renamed to</span>
                  <span className="to">
                    {r.folder ? <span className="folder">{r.folder} / </span> : null}
                    <span className="nb">{newName(r).slice(0, 10)}</span>
                    {newName(r).slice(10)}
                  </span>
                </p>

                {r.status === "look" ? (
                  <div className="dtb-inv-look">
                    <span className="why">
                      {r.issue === "unknown"
                        ? "First bill from this vendor. Where should it live?"
                        : "This is a packing slip, not a bill. Keep it, but where?"}
                    </span>
                    <select
                      className="dtb-select"
                      defaultValue=""
                      disabled={phase !== "review"}
                      aria-label={`Folder for ${r.vendor}`}
                      onChange={(e) => {
                        if (e.target.value) pickFolder(r.id, e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Pick a folder
                      </option>
                      {(r.options ?? []).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {r.rule ? (
                  <p className="dtb-rule">
                    <b>Rule saved</b>
                    {r.rule}
                  </p>
                ) : null}
              </div>
            ))}
          </div>

          <div className="dtb-actions">
            {phase === "filed" ? (
              <>
                <button type="button" className="sai-btn ghost dtb-btn" onClick={undo}>
                  Undo the batch
                </button>
                <button type="button" className="sai-btn ghost dtb-btn" onClick={startOver}>
                  Start over
                </button>
                <p className="dtb-result dtb-summary dtb-tally" aria-live="polite">
                  <span className="n">{filed.length}</span> filed, <span className="n">{queued}</span> queued for QuickBooks,{" "}
                  <span className="n">{keptBack + waiting}</span> kept back
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="sai-btn primary dtb-btn"
                  onClick={fileBatch}
                  disabled={phase === "filing" || readyCount === 0}
                >
                  {phase === "filing" ? "Filing" : waiting > 0 ? `File the ${readyCount} ready` : "File the batch"}
                </button>
                <button type="button" className="sai-btn ghost dtb-btn" onClick={startOver} disabled={phase === "filing"}>
                  Start over
                </button>
                <p className="dtb-summary dtb-tally">
                  {waiting > 0
                    ? `Pick a folder on the amber ${waiting === 1 ? "row" : "rows"} and the app remembers it.`
                    : "Everything here is a proposal. Nothing moves until you say so."}
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </ToolFrame>
  );
}
