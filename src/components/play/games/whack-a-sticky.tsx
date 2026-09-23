"use client";

import "./whack-a-sticky.css";

import { useEffect, useState } from "react";
import { GameFrame } from "@/components/play/game-frame";

/**
 * Whack a sticky: whack-a-mole on the front desk. Sticky notes pop up on a
 * 3 x 3 desk. Questions need answering (tap them); finished notes do not
 * (tapping one costs two seconds and the combo). 45 second round.
 * The timing lives in a small engine outside React so every timer has one
 * owner and one place it is cleared.
 */

const QUESTIONS = [
  "Kids under 5?", "Collect or bill?", "VSP or EyeMed?", "Group number?",
  "Delta Care ok?", "Running late?", "New insurance?", "Copay for a crown?",
];
const STATEMENTS = [
  "Verified, all good", "Filed to QuickBooks", "Sent the reminder", "Appeal is drafted",
  "Card on file", "Lunch is 1 to 2", "Printer has paper", "Reviews are up",
];
const COLORS = ["#F8E7A6", "#F6CDB9", "#DCE9D3", "#D9E4F5"];
const ROUND_MS = 45_000;
const PENALTY_MS = 2_000;
const OUT_MS = 220;

type NoteState = "up" | "hit" | "miss" | "back" | "out";
type Note = { id: number; text: string; question: boolean; color: string; tilt: number; state: NoteState; stamped?: boolean };
type Phase = "ready" | "playing" | "over";
type View = {
  phase: Phase; notes: (Note | null)[]; score: number; combo: number;
  bestCombo: number; answered: number; msLeft: number; penalties: number; lastGain: number;
};

const freshView = (phase: Phase): View => ({
  phase, notes: Array(9).fill(null), score: 0, combo: 0, bestCombo: 0,
  answered: 0, msLeft: ROUND_MS, penalties: 0, lastGain: 0,
});
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const pick = <T,>(list: readonly T[]) => list[Math.floor(Math.random() * list.length)];

class WhackEngine {
  private v: View = freshView("ready");
  private timers = new Set<ReturnType<typeof setTimeout>>();
  private clock: ReturnType<typeof setInterval> | null = null;
  private endAt = 0;
  private nextId = 1;
  private emit: (v: View) => void = () => {};
  private done: (score: number) => void = () => {};

  connect(emit: (v: View) => void, done: (score: number) => void) {
    this.emit = emit;
    this.done = done;
  }

  /** Clears every timeout and the clock. Safe to call any time. */
  stop() {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers.clear();
    if (this.clock) clearInterval(this.clock);
    this.clock = null;
  }

  start() {
    this.stop();
    this.endAt = Date.now() + ROUND_MS;
    this.set(freshView("playing"));
    this.clock = setInterval(() => this.tick(), 100);
    this.later(() => this.spawn(), 350);
  }

  whack(spot: number) {
    if (this.v.phase !== "playing") return;
    const n = this.v.notes[spot];
    if (!n || (n.state !== "up" && n.state !== "back")) return;
    if (n.question) {
      const combo = this.v.combo + 1;
      const gain = 10 + 5 * (combo - 1);
      this.set({
        score: this.v.score + gain, combo, lastGain: gain,
        bestCombo: Math.max(this.v.bestCombo, combo), answered: this.v.answered + 1,
      });
      this.setNote(spot, { ...n, state: "hit", stamped: true });
      this.later(() => this.slideOut(spot, n.id, ["hit"]), 460);
    } else {
      this.endAt -= PENALTY_MS;
      this.set({ combo: 0, penalties: this.v.penalties + 1 });
      this.setNote(spot, { ...n, state: "miss" });
      this.later(() => {
        const cur = this.v.notes[spot];
        if (cur?.id === n.id && cur.state === "miss") this.setNote(spot, { ...cur, state: "back" });
      }, 380);
      this.tick();
    }
  }

  private set(patch: Partial<View>) {
    this.v = { ...this.v, ...patch };
    this.emit(this.v);
  }

  private setNote(spot: number, note: Note | null) {
    const notes = this.v.notes.slice();
    notes[spot] = note;
    this.set({ notes });
  }

  private later(fn: () => void, ms: number) {
    const t = setTimeout(() => {
      this.timers.delete(t);
      fn();
    }, ms);
    this.timers.add(t);
  }

  private progress() {
    return Math.min(1, Math.max(0, 1 - (this.endAt - Date.now()) / ROUND_MS));
  }

  private tick() {
    const left = Math.max(0, this.endAt - Date.now());
    if (left <= 0) this.finish();
    else this.set({ msLeft: left });
  }

  private finish() {
    if (this.v.phase !== "playing") return;
    this.stop();
    this.set({ phase: "over", msLeft: 0, notes: Array(9).fill(null) });
    this.done(this.v.score);
  }

  private spawn() {
    const p = this.progress();
    const empty = this.v.notes.flatMap((n, i) => (n ? [] : [i]));
    if (empty.length) {
      const spot = pick(empty);
      const question = Math.random() < 0.5;
      const onBoard = new Set(this.v.notes.map((n) => n?.text));
      const list = question ? QUESTIONS : STATEMENTS;
      const pool = list.filter((t) => !onBoard.has(t));
      const note: Note = {
        id: this.nextId++, question, text: pick(pool.length ? pool : list), color: pick(COLORS),
        tilt: Math.round((Math.random() * 8 - 4) * 10) / 10, state: "up",
      };
      this.setNote(spot, note);
      this.later(() => this.slideOut(spot, note.id, ["up", "miss", "back"]), lerp(1400, 900, p));
    }
    this.later(() => this.spawn(), lerp(900, 500, p));
  }

  private slideOut(spot: number, id: number, from: NoteState[]) {
    const cur = this.v.notes[spot];
    if (cur?.id !== id || !from.includes(cur.state)) return;
    this.setNote(spot, { ...cur, state: "out" });
    this.later(() => {
      if (this.v.notes[spot]?.id === id) this.setNote(spot, null);
    }, OUT_MS);
  }
}

const clockText = (ms: number) => {
  const s = Math.ceil(ms / 1000);
  return `0:${String(s).padStart(2, "0")}`;
};

export function WhackAStickyGame({ onRound, best }: { onRound?: (score: number) => void; best?: number }) {
  const [engine] = useState(() => new WhackEngine());
  const [view, setView] = useState<View>(() => freshView("ready"));

  useEffect(() => {
    engine.connect(setView, (score) => onRound?.(score));
  }, [engine, onRound]);

  // Every timer dies with the component.
  useEffect(() => () => engine.stop(), [engine]);

  // Number keys 1 to 9 map to the nine spots, only while mounted.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key >= "1" && e.key <= "9") {
        e.preventDefault();
        engine.whack(Number(e.key) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [engine]);

  const { phase, notes, score, combo, bestCombo, answered, msLeft, penalties, lastGain } = view;
  const status = phase === "ready" ? "Ready" : phase === "playing" ? "Go" : "Round over";
  const scoreLine = phase === "ready" ? "" : `${score} points · combo ${combo}`;

  return (
    <GameFrame
      label="Stapler"
      title="Whack a sticky"
      howTo="Tap the questions before they slide away. Leave the finished notes alone: tapping one costs two seconds. Keys 1 to 9 work too."
      score={scoreLine}
      best={best != null ? `${best} points` : undefined}
      status={status}
      onRestart={() => engine.start()}
    >
      <div className="g-whack-root">
        <div className="g-whack-clockbar">
          <span className="g-whack-clock" aria-live="off">{clockText(msLeft)}</span>
          <span className="g-whack-track" aria-hidden="true">
            <span className="g-whack-fill" style={{ transform: `scaleX(${msLeft / ROUND_MS})` }} />
          </span>
          <span className="g-whack-flash" aria-hidden="true">
            {phase === "playing" && penalties > 0 ? (
              <span key={penalties} className="g-whack-penalty">{"\u22122 s"}</span>
            ) : null}
            {phase === "playing" && combo > 0 ? (
              <span key={`c${answered}`} className="g-whack-combo">+{lastGain}</span>
            ) : null}
          </span>
        </div>

        <div className="g-whack-desk">
          {notes.map((n, i) => (
            <button
              key={i}
              type="button"
              className={`g-whack-spot${i === 6 ? " g-whack-spot--ring" : ""}`}
              aria-label={n ? `Spot ${i + 1}: ${n.text}` : `Spot ${i + 1}, empty`}
              onClick={() => engine.whack(i)}
            >
              <span className="g-whack-key" aria-hidden="true">{i + 1}</span>
              {n ? (
                <span
                  key={n.id}
                  className={`g-whack-note g-whack-note--${n.state}`}
                  style={{ background: n.color, "--g-whack-tilt": `${n.tilt}deg` } as React.CSSProperties}
                >
                  <span className="g-whack-text">{n.text}</span>
                  {n.stamped ? (
                    <span className="g-whack-stamp">Answered</span>
                  ) : null}
                </span>
              ) : null}
            </button>
          ))}

          {phase !== "playing" ? (
            <div className={`g-whack-cover g-whack-cover--${phase}`}>
              {phase === "ready" ? (
                <>
                  <p className="g-whack-cover-line">Questions pile up at the front desk. Answer them.</p>
                  <button type="button" className="sai-btn primary g-whack-start" onClick={() => engine.start()}>
                    Start the round
                  </button>
                </>
              ) : (
                <>
                  <p className="g-whack-result">{score} points</p>
                  <p className="g-whack-cover-line">
                    {answered} answered · best combo {bestCombo}
                  </p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </GameFrame>
  );
}
