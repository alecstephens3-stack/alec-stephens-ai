"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The window a tool opens in, over the desk. One glass pane, centred, its own
 * scroll, a round close button, the backdrop dims and softens the desk behind
 * it. Escape and a click on the backdrop close it. The desk keeps living
 * behind the glass; nothing here touches it.
 */
export function DeskWindow({
  open,
  title,
  caption,
  onClose,
  children,
  className,
}: {
  open: boolean;
  title: string;
  /** One sentence shown under the pane during the tour. */
  caption?: string | null;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  const paneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    paneRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={cn("dw-backdrop", className)} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dw-pane sai-pane-strong" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={paneRef}>
        <button type="button" className="dw-close" onClick={onClose} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <div className="dw-scroll">{children}</div>
      </div>
      {caption ? <p className="dw-caption">{caption}</p> : null}
    </div>
  );
}
