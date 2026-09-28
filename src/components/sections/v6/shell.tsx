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
  kicker,
  title,
  children,
  className,
  center = false,
  titleMax,
}: {
  id?: string;
  kicker?: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  center?: boolean;
  titleMax?: string;
}) {
  return (
    <section id={id} className={cn("draft-section scroll-mt-28", className)}>
      <div className={cn("draft-wrap", center && "text-center")}>
        {(kicker || title) && (
          <AnimateOnScroll className={cn("mb-10 md:mb-14", center && "flex flex-col items-center")}>
            {kicker && (
              <p className={cn("draft-crop t-label", center && "self-center")}>{kicker}</p>
            )}
            {title && (
              <h2 className={cn("t-title mt-5", titleMax ?? "max-w-[20ch]", center && "mx-auto")}>
                {title}
              </h2>
            )}
          </AnimateOnScroll>
        )}
        {children}
      </div>
    </section>
  );
}
