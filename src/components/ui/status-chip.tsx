import { cn } from "@/lib/utils";

type ChipStatus = "good" | "warn" | "bad" | "accent";

const LIGHT_TEXT: Record<ChipStatus, string> = {
  good: "text-status-good",
  warn: "text-status-warn",
  bad: "text-status-bad",
  accent: "text-accent",
};

const LIGHT_TINT: Record<ChipStatus, string> = {
  good: "bg-status-good-tint",
  warn: "bg-status-warn-tint",
  bad: "bg-status-bad-tint",
  accent: "bg-accent-soft",
};

const NIGHT_TEXT: Record<ChipStatus, string> = {
  good: "text-status-good-night",
  warn: "text-status-warn-night",
  bad: "text-status-bad-night",
  accent: "text-accent-night",
};

const NIGHT_TINT: Record<ChipStatus, string> = {
  good: "bg-status-good-night-tint",
  warn: "bg-status-warn-night-tint",
  bad: "bg-status-bad-night-tint",
  accent: "bg-accent-soft",
};

/**
 * Ledger-chip status marker (Lens v3; the chip survives from v2 with a
 * Schibsted keyword cell and 8px radius). Two cells: tinted keyword + fact.
 * Status colors are functional and scoped to these chips only.
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
        "inline-flex items-stretch overflow-hidden rounded-chip border align-middle",
        onDark ? "border-nrule bg-white/5" : "border-rule bg-white/80",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center px-3 py-1.5 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] whitespace-nowrap",
          onDark ? NIGHT_TEXT[status] : LIGHT_TEXT[status],
          onDark ? NIGHT_TINT[status] : LIGHT_TINT[status],
        )}
      >
        {keyword}
      </span>
      {detail && (
        <span
          className={cn(
            "flex items-center px-3 py-1.5 text-[15px] font-medium whitespace-nowrap",
            onDark ? "border-l border-nrule text-cream" : "border-l border-rule text-ink-90",
          )}
        >
          {detail}
        </span>
      )}
    </span>
  );
}
