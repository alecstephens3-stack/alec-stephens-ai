import { cn } from "@/lib/utils";

/**
 * Lens v3 primitive kit (design canon: brand-assets/stephens-ai-design-system).
 * Markers are portholes, bracket stamps, tick flags, and bubble bullets.
 * Dot-pills (rounded pill + leading colored dot) are banned, forever.
 */

/** Section marker: a tiny glass lens disc + Schibsted caps label. */
export function Porthole({
  children,
  onNight = false,
  className,
}: {
  children: React.ReactNode;
  onNight?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("sai-port", onNight && "on-night", className)}>
      <span className="disc" aria-hidden="true" />
      <span className="ptext">{children}</span>
    </span>
  );
}

/** Mode/label marker held by two registration crop marks. */
export function BracketStamp({
  children,
  onNight = false,
  className,
}: {
  children: React.ReactNode;
  onNight?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("sai-stamp", onNight && "on-night", className)}>
      {children}
    </span>
  );
}

/** Annotation pill leading with a 4px accent bar (never a dot). */
export function TickFlag({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("sai-flag", className)}>
      <span className="tick" aria-hidden="true" />
      {children}
    </span>
  );
}

/** List with miniature-lens markers. Pass items or compose children <li>s. */
export function BubbleList({
  items,
  children,
  className,
}: {
  items?: React.ReactNode[];
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("sai-bullets", className)}>
      {items ? items.map((item, i) => <li key={i}>{item}</li>) : children}
    </ul>
  );
}

/**
 * A dark module embedded in a light page. The ember glow is built in.
 * This build is permitted two on the home page (Alec, 2026-07-25);
 * the optometry page keeps one.
 */
export function NightWindow({
  children,
  className,
  ariaLabel,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  id?: string;
}) {
  return (
    <section id={id} aria-label={ariaLabel} className={cn("sai-night", className)}>
      <div className="sai-ember" aria-hidden="true" />
      <div className="relative">{children}</div>
    </section>
  );
}

/** A light sheet embedded inside a dark surface — the action item lives here. */
export function DayWindow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("sai-day-window", className)}>{children}</div>;
}
