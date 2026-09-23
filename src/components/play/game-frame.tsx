"use client";

import { BracketStamp } from "@/components/ui/lens-primitives";
import { cn } from "@/lib/utils";

/**
 * The frame every sandbox game renders inside. The window chrome (glass pane,
 * close button, backdrop, keyboard) lives in desk-window.tsx. A game gives the
 * frame a label, a title, one line on how to play, the live score, the best
 * score the page remembers for it, and a restart handler. The body is the
 * game's own canvas or board.
 */
export function GameFrame({
  label,
  title,
  howTo,
  score,
  best,
  status,
  onRestart,
  children,
  className,
}: {
  label: string;
  title: string;
  howTo: string;
  /** Live score line, e.g. "3 of 10 flicks · 2 goals". */
  score?: string;
  /** Best score the page remembers, already formatted. */
  best?: string;
  /** A short state line: "Round over", "Paused", "Go". */
  status?: string;
  onRestart?: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("gf-frame", className)}>
      <div className="gf-head">
        <BracketStamp>{label}</BracketStamp>
        {best ? <span className="gf-best">Best {best}</span> : null}
      </div>
      <h2 className="t-title gf-title">{title}</h2>
      <p className="t-body gf-howto">{howTo}</p>
      <div className="gf-board">{children}</div>
      <div className="gf-foot">
        <span className="gf-score">{score ?? ""}</span>
        {status ? <span className="gf-status">{status}</span> : null}
        {onRestart ? (
          <button type="button" className="sai-btn ghost gf-restart" onClick={onRestart}>Play again</button>
        ) : null}
      </div>
    </div>
  );
}
