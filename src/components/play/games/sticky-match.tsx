"use client";

import "./sticky-match.css";

import { useCallback, useEffect, useRef, useState } from "react";
import { GameFrame } from "@/components/play/game-frame";

/**
 * Sticky match: a memory game on the front desk. Sixteen sticky notes lie
 * face down; eight hold a question the desk gets asked and eight hold the
 * answer. Flip two at a time; a question and its answer stay up.
 * Score is the seconds it took to clear the desk (lower is better).
 */

const PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["Kids under 5?", "Dr. Lee, mornings"],
  ["Collect or bill?", "Refraction: collect"],
  ["VSP or EyeMed?", "Check the card first"],
  ["Delta Care says other facility", "Patient calls Delta Care"],
  ["No group number?", "Call the insurer"],
  ["Running 15 late?", "Offer to rebook"],
  ["New insurance at checkup?", "Verify before the chair"],
  ["Claim quiet 30 days?", "Call, then appeal"],
];

const STICKY_COLORS = ["#F8E7A6", "#F6CDB9", "#DCE9D3", "#D9E4F5"];
const FLIP_BACK_MS = 700;

type Note = { key: string; pair: number; text: string; tilt: number; color: string };

/** Small seeded generator so the first deal is the same on server and client. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function deal(seed: number): Note[] {
  const rand = mulberry32(seed);
  const notes: Note[] = [];
  PAIRS.forEach(([q, a], pair) => {
    notes.push({ key: `q${pair}`, pair, text: q, tilt: 0, color: "" });
    notes.push({ key: `a${pair}`, pair, text: a, tilt: 0, color: "" });
  });
  for (let i = notes.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [notes[i], notes[j]] = [notes[j], notes[i]];
  }
  return notes.map((n) => ({
    ...n,
    tilt: Math.round((rand() * 7 - 3.5) * 10) / 10,
    color: STICKY_COLORS[Math.floor(rand() * STICKY_COLORS.length)],
  }));
}

export function StickyMatchGame({ onRound, best }: { onRound?: (score: number) => void; best?: number }) {
  const [deck, setDeck] = useState<Note[]>(() => deal(20260923));
  const [up, setUp] = useState<number[]>([]);
  const [matched, setMatched] = useState<boolean[]>(() => Array(PAIRS.length * 2).fill(false));
  const [moves, setMoves] = useState(0);
  const [startAt, setStartAt] = useState<number | null>(null);
  const [finalSecs, setFinalSecs] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const flipBack = useRef<ReturnType<typeof setTimeout> | null>(null);

  const running = startAt !== null && finalSecs === null;

  // Live clock while a round is running; stops the moment the desk is clear.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running]);

  // Never leave a flip-back timer behind.
  useEffect(
    () => () => {
      if (flipBack.current) clearTimeout(flipBack.current);
    },
    [],
  );

  const flip = useCallback(
    (i: number) => {
      if (finalSecs !== null || up.length >= 2 || matched[i] || up.includes(i)) return;
      const t = Date.now();
      const started = startAt ?? t;
      if (startAt === null) {
        setStartAt(t);
        setNow(t);
      }
      const next = [...up, i];
      if (next.length < 2) {
        setUp(next);
        return;
      }
      setMoves((m) => m + 1);
      const [a, b] = next;
      if (deck[a].pair === deck[b].pair) {
        const nextMatched = matched.slice();
        nextMatched[a] = true;
        nextMatched[b] = true;
        setMatched(nextMatched);
        setUp([]);
        if (nextMatched.every(Boolean)) {
          const secs = Math.max(1, Math.round((t - started) / 1000));
          setFinalSecs(secs);
          setNow(t);
          onRound?.(secs);
        }
        return;
      }
      setUp(next);
      flipBack.current = setTimeout(() => {
        flipBack.current = null;
        setUp([]);
      }, FLIP_BACK_MS);
    },
    [deck, finalSecs, matched, onRound, startAt, up],
  );

  const restart = useCallback(() => {
    if (flipBack.current) clearTimeout(flipBack.current);
    flipBack.current = null;
    setDeck(deal(Math.floor(Math.random() * 2 ** 31)));
    setUp([]);
    setMatched(Array(PAIRS.length * 2).fill(false));
    setMoves(0);
    setStartAt(null);
    setFinalSecs(null);
    setNow(0);
  }, []);

  const elapsed = finalSecs ?? (startAt === null ? 0 : Math.max(0, Math.floor((now - startAt) / 1000)));
  const pairsFound = matched.filter(Boolean).length / 2;
  const done = finalSecs !== null;

  const status = done
    ? `Desk clear in ${finalSecs}s, ${moves} moves`
    : startAt === null
      ? "Flip any note to start"
      : `${pairsFound} of ${PAIRS.length} pairs`;

  return (
    <GameFrame
      label="Memory"
      title="Sticky match"
      howTo="Flip two notes at a time. Match each front-desk question to its answer, as fast as you can."
      score={`${elapsed}s · ${moves} ${moves === 1 ? "move" : "moves"}`}
      best={best !== undefined ? `${best}s` : undefined}
      status={status}
      onRestart={restart}
    >
      <div className="g-match-desk">
        <div className="g-match-grid" role="group" aria-label="Sticky notes, four by four">
          {deck.map((note, i) => {
            const isMatched = matched[i];
            const isUp = isMatched || up.includes(i);
            return (
              <button
                key={note.key}
                type="button"
                className={`g-match-note${isUp ? " is-up" : ""}${isMatched ? " is-matched" : ""}`}
                style={{ "--g-match-tilt": `${note.tilt}deg`, "--g-match-paper": note.color } as React.CSSProperties}
                onClick={() => flip(i)}
                aria-disabled={isMatched || done || undefined}
                aria-label={isUp ? `${note.text}${isMatched ? ", matched" : ""}` : `Sticky note ${i + 1}, face down`}
              >
                <span className="g-match-card" aria-hidden="true">
                  <span className="g-match-face g-match-back" />
                  <span className="g-match-face g-match-front">
                    <span className="g-match-text">{note.text}</span>
                    {isMatched ? (
                      <svg className="g-match-tick" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M4 10.5 L8.5 15 L16 5" />
                      </svg>
                    ) : null}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {done ? (
          <p className="g-match-end" role="status">
            Desk clear in {finalSecs}s with {moves} moves.
          </p>
        ) : null}
      </div>
    </GameFrame>
  );
}
