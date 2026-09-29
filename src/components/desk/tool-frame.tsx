"use client";

import { BracketStamp } from "@/components/ui/lens-primitives";
import { cn } from "@/lib/utils";

/**
 * The frame every desk tool renders inside. The window chrome (glass pane,
 * close button, backdrop, keyboard) lives in desk-window.tsx and is not the
 * tool's concern. A tool gives the frame a label (what kind of thing this is),
 * a title, an optional one-line note under the title, its body, and an
 * optional footer row (actions, a status line).
 *
 * `status` is the honesty line: "working" for a tool that really does the job
 * in the browser, "sample" for a prototype on sample data. It is always shown.
 */
export function ToolFrame({
  label,
  title,
  note,
  status,
  children,
  footer,
  className,
}: {
  label: string;
  title: string;
  note?: string;
  status: "working" | "sample";
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("dt-frame", className)}>
      <div className="dt-head">
        <BracketStamp>{label}</BracketStamp>
        <span className={cn("dt-status", status)}>
          {status === "working" ? "Working, in your browser" : "Prototype on sample data"}
        </span>
      </div>
      <h2 className="t-title dt-title">{title}</h2>
      {note ? <p className="t-body dt-note">{note}</p> : null}
      <div className="dt-body">{children}</div>
      {footer ? <div className="dt-foot">{footer}</div> : null}
    </div>
  );
}
