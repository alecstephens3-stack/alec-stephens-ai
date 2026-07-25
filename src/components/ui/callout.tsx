import { cn } from "@/lib/utils";

/**
 * Registration-bracket callout (survives from v2, reskinned for Lens v3).
 * A strong glass pane with crop-mark brackets on opposite corners — salmon
 * at the top-left ramping to terracotta at the bottom-right. Never a
 * left-border bar. Use for the one decision / proof / key-number moment
 * per view.
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
    <div className={cn("relative rounded-card sai-pane-strong p-7 md:p-9", className)}>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 rounded-tl-[2px] border-l-[3px] border-t-[3px] border-salmon"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3.5 right-3.5 h-5 w-5 rounded-br-[2px] border-b-[3px] border-r-[3px] border-accent"
      />
      {label && (
        <div className="mb-4 font-label text-[13.5px] font-semibold uppercase tracking-[0.07em] text-accent">
          {label}
        </div>
      )}
      <div className="text-[17px] leading-relaxed text-ink-90">{children}</div>
    </div>
  );
}
