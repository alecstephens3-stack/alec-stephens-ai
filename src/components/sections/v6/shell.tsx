import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

/**
 * The v6 section shell. One job: hold a section's air and its opener.
 *
 * Differences from v5: no glass card wrapper, no lede slot (a section that
 * needs a lede and a title is saying the same thing twice), and the kicker is
 * a crop-mark stamp rather than a porthole, because the crop marks are the
 * recurring motif in this draft.
 */
export function Section({
  id,
  title,
  accent,
  eyebrow,
  children,
  className,
  center = false,
  titleMax,
}: {
  id?: string;
  /** Retired 2026-09-28 (Lens v4): the crop-mark kicker. Kept so old callers compile; never rendered. */
  kicker?: string;
  title?: React.ReactNode;
  /** Lens v4 section opening: the continuation of the statement, in terracotta. */
  accent?: React.ReactNode;
  /** Optional real object above the title (e.g. a client logo lockup), never a text label. */
  eyebrow?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  center?: boolean;
  titleMax?: string;
}) {
  return (
    <section id={id} className={cn("draft-section scroll-mt-28", className)}>
      <div className={cn("draft-wrap", center && "text-center")}>
        {(eyebrow || title) && (
          <AnimateOnScroll className={cn("mb-10 md:mb-14", center && "flex flex-col items-center")}>
            {eyebrow}
            {title && (
              <h2 className={cn("v7-open", eyebrow && "mt-6", titleMax ?? "max-w-[30ch]", center && "mx-auto")}>
                {title}
                {accent && <> <span className="text-accent-display">{accent}</span></>}
              </h2>
            )}
          </AnimateOnScroll>
        )}
        {children}
      </div>
    </section>
  );
}
