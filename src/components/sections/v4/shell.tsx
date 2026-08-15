import { cn } from "@/lib/utils";
import { Porthole } from "@/components/ui/lens-primitives";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

/**
 * The v4 section shell. One rhythm for the whole page so the site reads as
 * one document instead of a stack of unrelated blocks. Vertical rhythm is
 * deliberately tighter than v3: the brief was "way too bulky."
 */
export function Section({
  id,
  kicker,
  title,
  lede,
  children,
  className,
  center = false,
}: {
  id?: string;
  kicker?: string;
  title?: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-11 md:py-14", className)}>
      <div className="mx-auto w-full max-w-[1080px] px-5 md:px-8">
        {(kicker || title) && (
          <AnimateOnScroll className={cn("mb-7 md:mb-9", center && "text-center")}>
            {kicker && (
              <div className={cn("mb-4", center && "flex justify-center")}>
                <Porthole>{kicker}</Porthole>
              </div>
            )}
            {title && (
              <h2
                className={cn(
                  "font-heading text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-ink md:text-[42px]",
                  center ? "mx-auto max-w-[22ch]" : "max-w-[24ch]"
                )}
              >
                {title}
              </h2>
            )}
            {lede && (
              <p
                className={cn(
                  "mt-4 text-[17px] leading-[1.6] text-ink-2 md:text-lg",
                  center ? "mx-auto max-w-[62ch]" : "max-w-[68ch]"
                )}
              >
                {lede}
              </p>
            )}
          </AnimateOnScroll>
        )}
        {children}
      </div>
    </section>
  );
}

/** A glass card. The one card recipe on the site. */
export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("sai-pane rounded-card p-6 md:p-7", className)}>
      {children}
    </div>
  );
}
