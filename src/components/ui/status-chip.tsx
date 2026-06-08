import { cn } from "@/lib/utils";

type ChipStatus = "good" | "warn" | "bad" | "accent";

const STATUS_TEXT: Record<ChipStatus, string> = {
  good: "text-status-good",
  warn: "text-status-warn",
  bad: "text-status-bad",
  accent: "text-salmon",
};

const STATUS_TINT: Record<ChipStatus, string> = {
  good: "bg-status-good-tint",
  warn: "bg-status-warn-tint",
  bad: "bg-status-bad-tint",
  accent: "bg-salmon/10",
};

/**
 * Ledger-chip status marker (brand standard, locked 2026-06-08).
 * Sharp-cornered two-cell chip with a subtle status tint on the keyword cell
 * and an internal divider. Replaces the retired dot-pill status badge.
 */
export function StatusChip({
  keyword,
  detail,
  status = "good",
  onDark = false,
  className,
}: {
  keyword: string;
  detail?: string;
  status?: ChipStatus;
  onDark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-stretch overflow-hidden rounded-[3px] border align-middle",
        onDark ? "border-paper/25" : "border-border",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center px-3 py-1.5 font-mono text-[13px] uppercase tracking-[0.04em] whitespace-nowrap",
          STATUS_TEXT[status],
          onDark ? "bg-paper/5" : STATUS_TINT[status],
        )}
      >
        {keyword}
      </span>
      {detail && (
        <span
          className={cn(
            "flex items-center px-3 py-1.5 text-[14px] font-medium whitespace-nowrap",
            onDark ? "border-l border-paper/25 text-paper/85" : "border-l border-border text-ink-90",
          )}
        >
          {detail}
        </span>
      )}
    </span>
  );
}
