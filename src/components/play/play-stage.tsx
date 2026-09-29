"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DeskScene, DeskHover, DeskLight } from "@/components/desk/desk-scene";
import { DeskWindow } from "@/components/desk/desk-window";
import { PaperFootballGame } from "./games/paper-football";
import { EraserCurlingGame } from "./games/eraser-curling";
import { StickyMatchGame } from "./games/sticky-match";
import { PaperPlaneGame } from "./games/paper-plane";
import { GraphSnakeGame } from "./games/graph-snake";
import { WhackAStickyGame } from "./games/whack-a-sticky";
import "@/components/desk/desk.css";
import "./play.css";

/**
 * The sandbox: the front desk with nothing to do. Same desk, same lens, same
 * physics, but the objects are toys and each one opens a small game. Best
 * scores live in this browser only.
 */

const ARIA_LABEL =
  "A desk seen from above with toys on it: a folded paper football, a pink eraser by a coffee ring, a stack of sticky notes, a paper plane, a pad of graph paper, a red stapler, a mug and a pencil. A round trial lens drifts across it, bringing whatever is under the glass into focus.";

type GameId = "paper-football" | "eraser-curling" | "sticky-match" | "paper-plane" | "graph-snake" | "whack-a-sticky";

const GAMES: Record<GameId, { title: string; unit: (n: number) => string; lowerIsBetter?: boolean }> = {
  "paper-football": { title: "Paper football", unit: (n) => `${n} goals` },
  "eraser-curling": { title: "Eraser curling", unit: (n) => `${n} points` },
  "sticky-match": { title: "Sticky match", unit: (n) => `${n}s`, lowerIsBetter: true },
  "paper-plane": { title: "Paper plane", unit: (n) => `${n} m` },
  "graph-snake": { title: "Graph paper snake", unit: (n) => `${n} clips` },
  "whack-a-sticky": { title: "Whack a sticky", unit: (n) => `${n} points` },
};
const GAME_IDS = Object.keys(GAMES) as GameId[];
const STORE = "sai-sandbox-best";

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
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "pm" : "am"}`;
}
function loadBest(): Partial<Record<GameId, number>> {
  try { return JSON.parse(localStorage.getItem(STORE) || "{}"); } catch { return {}; }
}

function GameBody({ game, best, onRound }: { game: GameId; best?: number; onRound: (n: number) => void }) {
  switch (game) {
    case "paper-football": return <PaperFootballGame best={best} onRound={onRound} />;
    case "eraser-curling": return <EraserCurlingGame best={best} onRound={onRound} />;
    case "sticky-match": return <StickyMatchGame best={best} onRound={onRound} />;
    case "paper-plane": return <PaperPlaneGame best={best} onRound={onRound} />;
    case "graph-snake": return <GraphSnakeGame best={best} onRound={onRound} />;
    case "whack-a-sticky": return <WhackAStickyGame best={best} onRound={onRound} />;
  }
}

export function PlayStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<DeskScene | null>(null);
  const [hover, setHover] = useState<DeskHover | null>(null);
  const [light, setLight] = useState<DeskLight | null>(null);
  const [hourIdx, setHourIdx] = useState(0);
  const [game, setGame] = useState<GameId | null>(null);
  const [best, setBest] = useState<Partial<Record<GameId, number>>>({});
  const [ready, setReady] = useState(false);

  useEffect(() => { setBest(loadBest()); }, []);

  useEffect(() => {
    let scene: DeskScene | null = null;
    let cancelled = false;
    (async () => {
      const [{ init }, { buildSandboxItems, SANDBOX_STOPS, SANDBOX_DESK_COLOR }] = await Promise.all([
        import("@/components/desk/desk-scene.js"),
        import("./sandbox-items.js"),
      ]);
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      scene = init(canvas, {
        handFont: resolveFamily("--font-kalam", "Kalam"),
        handFont2: resolveFamily("--font-reenie", "Reenie Beanie"),
        textFont: resolveFamily("--font-inter-tight", "Inter Tight"),
        labelFont: resolveFamily("--font-schibsted", "Schibsted Grotesk"),
        pageColor: [0.957, 0.898, 0.851],
        nightPageColor: [0.086, 0.074, 0.066],
        items: buildSandboxItems,
        stops: SANDBOX_STOPS,
        deskColor: SANDBOX_DESK_COLOR,
        onHover: (info) => setHover(info),
        onLight: (l) => setLight(l),
        onOpen: (_id, tool) => { if (tool in GAMES) setGame(tool as GameId); },
      });
      sceneRef.current = scene;
      (window as unknown as { __desk?: DeskScene }).__desk = scene;
      setReady(true);
    })();
    return () => { cancelled = true; scene?.destroy(); sceneRef.current = null; };
  }, []);

  const onRound = useCallback((n: number) => {
    if (!game) return;
    setBest((prev) => {
      const cur = prev[game];
      const better = cur == null || (GAMES[game].lowerIsBetter ? n < cur : n > cur);
      if (!better) return prev;
      const next = { ...prev, [game]: n };
      try { localStorage.setItem(STORE, JSON.stringify(next)); } catch { /* private mode */ }
      return next;
    });
  }, [game]);

  const cycleHour = useCallback(() => {
    const next = (hourIdx + 1) % HOURS.length;
    setHourIdx(next);
    sceneRef.current?.setHour(HOURS[next].hour);
  }, [hourIdx]);

  const night = (light?.night ?? 0) > 0.5;
  const played = GAME_IDS.filter((g) => best[g] != null);

  return (
    <div className={cn("desk-root", night && "is-night", ready && "is-ready")}>
      <header className="desk-dock sai-pane" role="banner">
        <Link href="/" className="desk-brand" aria-label="Stephens AI home">
          <Image src={night ? "/logo-dark.svg" : "/logo-light.svg"} alt="" width={122} height={22} priority />
        </Link>
        <span className="desk-dock-title">The sandbox</span>
        <div className="desk-dock-actions">
          <button type="button" className="desk-chip" onClick={() => sceneRef.current?.shake(1)} disabled={!ready}>Shake the desk</button>
          <button type="button" className="desk-chip" onClick={cycleHour} aria-label="Change the time of day">
            <span className="desk-chip-k">{HOURS[hourIdx].label}</span>
            {light ? <span className="desk-chip-v">{clockText(light.hour)}</span> : null}
          </button>
          <Link href="/desk" className="sai-btn primary desk-cta">The work version</Link>
        </div>
      </header>

      <section className="desk-main" aria-label="The sandbox">
        <p className="desk-lede">
          A desk with nothing to do. <span>Find the toys with the glass. Click one to play. Throw the rest.</span>
        </p>
        <div className="desk-frame">
          <canvas ref={canvasRef} className="desk-canvas" role="img" aria-label={ARIA_LABEL} />
          {hover && !game ? (
            <div className="desk-label sai-pane" style={{ left: hover.x, top: hover.y }} aria-hidden="true">
              <span className="desk-label-name">{hover.name}</span>
              <span className="desk-label-verb">{hover.tool ? hover.verb : "Drag it"}</span>
            </div>
          ) : null}
        </div>
        <p className="play-scores" aria-live="polite">
          {played.length === 0 ? (
            <span>Six games on the desk. Best scores stay in this browser.</span>
          ) : (
            played.map((g) => (
              <span key={g}><span className="play-score-k">{GAMES[g].title}</span><b>{GAMES[g].unit(best[g] as number)}</b></span>
            ))
          )}
        </p>
      </section>

      <DeskWindow open={!!game} title={game ? GAMES[game].title : ""} onClose={() => setGame(null)}>
        {game ? <GameBody key={game} game={game} best={best[game]} onRound={onRound} /> : null}
      </DeskWindow>
    </div>
  );
}
