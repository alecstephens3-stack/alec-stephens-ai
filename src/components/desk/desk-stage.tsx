"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CALENDLY } from "@/lib/content";
import type { DeskScene, DeskHover, DeskLight } from "./desk-scene";
import { DeskWindow } from "./desk-window";
import { PlaybookTool } from "./tools/playbook";
import { EligibilityTool } from "./tools/eligibility";
import { ClaimsTool } from "./tools/claims";
import { RemindersTool } from "./tools/reminders";
import { ReviewCardTool } from "./tools/review-card";
import { InvoicesTool } from "./tools/invoices";
import "./desk.css";

/**
 * The front desk: the whole page. A desk seen from above, painted and lit in
 * WebGL, with the lens as the visitor's instrument. Hover brings a thing into
 * focus and into order; a click lifts it and opens its tool in a window over
 * the desk; a drag throws it. The pen writes whatever the visitor types onto a
 * fresh sticky. The light follows the real clock, and after hours the lamp
 * takes over. The tour runs the whole thing on its own.
 */

const ARIA_LABEL =
  "A dental front desk seen from above: a 2004 Dentrix manual with a notebook on it, sticky notes, an insurance card, a denial letter half out of its envelope, a phone message slip, a review card with no QR code yet, a vendor bill. A round optometrist's trial lens drifts across it, bringing whatever is under the glass into focus and into order.";

type ToolId = "playbook" | "eligibility" | "claims" | "reminders" | "review" | "invoices";

const TOUR: { id: string; tool: ToolId; caption: string }[] = [
  { id: "manual", tool: "playbook", caption: "The manual and the notebook, searchable. Everything the desk knows, one search away." },
  { id: "card", tool: "eligibility", caption: "Name and birthday in, coverage out. The lead build from the call." },
  { id: "letter", tool: "claims", caption: "The aging report before it becomes a letter, with the appeal already drafted." },
  { id: "slip", tool: "reminders", caption: "Tomorrow's patients, confirmed without the phone." },
  { id: "review", tool: "review", caption: "A review, one scan after checkout. Printable, and it works right now." },
  { id: "invoice", tool: "invoices", caption: "Drop the bill, it files itself. A person approves before anything posts." },
];

const TOOL_TITLE: Record<ToolId, string> = {
  playbook: "Front desk playbook",
  eligibility: "Eligibility check",
  claims: "Claims watch",
  reminders: "Reminders",
  review: "Review card",
  invoices: "Vendor bills",
};

const HOURS: { label: string; hour: number | null }[] = [
  { label: "Live", hour: null },
  { label: "8 am", hour: 8 },
  { label: "3 pm", hour: 15 },
  { label: "After hours", hour: 20.5 },
];

function resolveFamily(cssVar: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  const first = raw.split(",")[0]?.trim().replace(/^['"]|['"]$/g, "");
  return first || fallback;
}

function clockText(h: number) {
  const hh = Math.floor(h) % 24, mm = Math.round((h - Math.floor(h)) * 60);
  const ampm = hh >= 12 ? "pm" : "am";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${ampm}`;
}

function ToolBody({ tool, query, demo }: { tool: ToolId; query?: string; demo?: boolean }) {
  switch (tool) {
    case "playbook": return <PlaybookTool initialQuery={query} demo={demo} />;
    case "eligibility": return <EligibilityTool demo={demo} />;
    case "claims": return <ClaimsTool demo={demo} />;
    case "reminders": return <RemindersTool demo={demo} />;
    case "review": return <ReviewCardTool demo={demo} />;
    case "invoices": return <InvoicesTool demo={demo} />;
  }
}

export function DeskStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<DeskScene | null>(null);
  const [hover, setHover] = useState<DeskHover | null>(null);
  const [light, setLight] = useState<DeskLight | null>(null);
  const [hourIdx, setHourIdx] = useState(0);
  const [openTool, setOpenTool] = useState<ToolId | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [touring, setTouring] = useState(false);
  const tourRef = useRef<{ stop: boolean; timers: number[] }>({ stop: true, timers: [] });
  const [note, setNote] = useState("");
  const [lastNote, setLastNote] = useState<string | null>(null);
  const [query, setQuery] = useState<string | undefined>(undefined);
  const notesRef = useRef<Map<string, string>>(new Map());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let scene: DeskScene | null = null;
    let cancelled = false;
    (async () => {
      const { init } = await import("./desk-scene.js");
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      scene = init(canvas, {
        handFont: resolveFamily("--font-kalam", "Kalam"),
        handFont2: resolveFamily("--font-reenie", "Reenie Beanie"),
        textFont: resolveFamily("--font-inter-tight", "Inter Tight"),
        labelFont: resolveFamily("--font-schibsted", "Schibsted Grotesk"),
        pageColor: [0.957, 0.898, 0.851],
        nightPageColor: [0.086, 0.074, 0.066],
        onHover: (info) => setHover(info),
        onLight: (l) => setLight(l),
        onOpen: (id, tool) => {
          if (!tourRef.current.stop) return; // the tour drives its own windows
          setCaption(null);
          setQuery(notesRef.current.get(id));   // a note the visitor wrote opens the playbook on that question
          setOpenTool(tool as ToolId);
        },
      });
      sceneRef.current = scene;
      (window as unknown as { __desk?: DeskScene }).__desk = scene;   // for scripted QA and the console
      setReady(true);
    })();
    return () => {
      cancelled = true;
      scene?.destroy();
      sceneRef.current = null;
    };
  }, []);

  const closeWindow = useCallback(() => {
    setOpenTool(null);
    setCaption(null);
  }, []);

  const stopTour = useCallback(() => {
    tourRef.current.stop = true;
    tourRef.current.timers.forEach((t) => window.clearTimeout(t));
    tourRef.current.timers = [];
    setTouring(false);
    setOpenTool(null);
    setCaption(null);
  }, []);

  const startTour = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    stopTour();
    tourRef.current.stop = false;
    setTouring(true);
    const T = tourRef.current;
    const later = (ms: number, fn: () => void) => { T.timers.push(window.setTimeout(() => { if (!T.stop) fn(); }, ms)); };
    let t = 0;
    for (const step of TOUR) {
      later(t, () => { setOpenTool(null); setCaption(null); scene.flyTo(step.id, 2600); });
      later(t + 1500, () => { scene.nudge(step.id); setCaption(step.caption); setQuery(undefined); setOpenTool(step.tool); });
      t += 11500;
    }
    later(t, () => { setOpenTool(null); setCaption(null); setTouring(false); T.stop = true; });
  }, [stopTour]);

  const cycleHour = useCallback(() => {
    const next = (hourIdx + 1) % HOURS.length;
    setHourIdx(next);
    sceneRef.current?.setHour(HOURS[next].hour);
  }, [hourIdx]);

  const submitNote = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const scene = sceneRef.current;
    const text = note.trim();
    if (!scene || !text) return;
    const r = scene.addNote(text);
    if (r) { notesRef.current.set(r.id, text); setLastNote(text); setNote(""); }
  }, [note]);

  const night = (light?.night ?? 0) > 0.5;

  return (
    <div className={cn("desk-root", night && "is-night", ready && "is-ready")}>
      <header className="desk-dock sai-pane" role="banner">
        <Link href="/" className="desk-brand" aria-label="Stephens AI home">
          <Image src={night ? "/logo-dark.svg" : "/logo-light.svg"} alt="" width={122} height={22} priority />
        </Link>
        <span className="desk-dock-title">The front desk</span>
        <div className="desk-dock-actions">
          <button type="button" className="desk-chip" onClick={touring ? stopTour : startTour} aria-pressed={touring}>
            {touring ? "Stop the tour" : "Take the tour"}
          </button>
          <button type="button" className="desk-chip" onClick={cycleHour} aria-label="Change the time of day">
            <span className="desk-chip-k">{HOURS[hourIdx].label}</span>
            {light ? <span className="desk-chip-v">{clockText(light.hour)}</span> : null}
          </button>
          <Link href="/play" className="desk-chip">The sandbox</Link>
          <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className="sai-btn primary desk-cta">Talk to us</a>
        </div>
      </header>

      <section className="desk-main" aria-label="The front desk">
        <p className="desk-lede">
          Every job on this desk is done by hand. <span>Hover to bring one into focus. Click it to open the tool. Throw it if you like.</span>
        </p>
        <div className="desk-frame">
          <canvas ref={canvasRef} className="desk-canvas" role="img" aria-label={ARIA_LABEL} />
          {hover && !openTool ? (
            <div className="desk-label sai-pane" style={{ left: hover.x, top: hover.y }} aria-hidden="true">
              <span className="desk-label-name">{hover.name}</span>
              <span className="desk-label-verb">{hover.tool ? hover.verb : "Drag it"}</span>
            </div>
          ) : null}
        </div>

        <form className="desk-ask sai-pane" onSubmit={submitNote}>
          <label htmlFor="desk-ask-input" className="desk-ask-label">What does your desk keep asking?</label>
          <div className="desk-ask-row">
            <input
              id="desk-ask-input"
              className="desk-ask-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={90}
              placeholder="Which doctor sees kids under 5?"
              autoComplete="off"
            />
            <button type="submit" className="sai-btn primary desk-ask-btn" disabled={!ready || !note.trim()}>Put it on the desk</button>
          </div>
          <p className="desk-ask-note">
            {lastNote
              ? "On the desk, in the office manager's hand. Slide the glass over it, then click it to look it up."
              : "The pen writes it onto a sticky note. Then the lens does what it does."}
          </p>
        </form>
      </section>

      <DeskWindow open={!!openTool} title={openTool ? TOOL_TITLE[openTool] : ""} caption={caption} onClose={touring ? stopTour : closeWindow}>
        {openTool ? <ToolBody key={openTool + (touring ? "-tour" : "")} tool={openTool} query={query} demo={touring} /> : null}
      </DeskWindow>
    </div>
  );
}
