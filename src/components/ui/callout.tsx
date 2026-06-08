import { cn } from "@/lib/utils";

/**
 * Registration-bracket callout (brand standard, locked 2026-06-08).
 * Paper panel with salmon crop-mark brackets on the top-left + bottom-right
 * corners. Replaces the retired salmon left-border-bar callout. Use for the
 * one decision / proof / key-number moment per view.
 */
export function Callout({
  label,
  children,
  className,
}: {
  label?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative rounded-[4px] border border-border bg-paper p-7 md:p-9", className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-px -top-px h-5 w-5 rounded-tl-[4px] border-l-2 border-t-2 border-salmon"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-px -right-px h-5 w-5 rounded-br-[4px] border-b-2 border-r-2 border-salmon"
      />
      {label && (
        <div className="mb-4 flex items-center gap-2.5 font-mono text-[14px] uppercase tracking-[0.04em] text-ink-60">
          <span className="h-[5px] w-[5px] bg-salmon" aria-hidden="true" />
          {label}
        </div>
      )}
      <div className="text-[17px] leading-relaxed text-ink-90">{children}</div>
    </div>
  );
}
