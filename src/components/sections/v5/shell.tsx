import { cn } from "@/lib/utils";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Porthole } from "@/components/ui/lens-primitives";

/**
 * The v5 section shell. Same rhythm as v4 (one document, not a stack of
 * blocks), plus the porthole kicker that v4 declared but never rendered.
 */
export function Section({
  id,
  kicker,
  title,
  lede,
  children,
  className,
  center = false,
  headMax,
}: {
  id?: string;
  kicker?: string;
  title?: React.ReactNode;
  lede?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  center?: boolean;
  headMax?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-28 py-12 md:py-16", className)}>
      <div className="mx-auto w-full max-w-[1080px] px-5 md:px-8">
        {(kicker || title) && (
          <AnimateOnScroll className={cn("mb-8 md:mb-10", center && "text-center")}>
            {kicker && (
              <div className={cn("mb-4", center && "flex justify-center")}>
                <Porthole>{kicker}</Porthole>
              </div>
            )}
            {title && (
              <h2
                className={cn(
                  "font-heading text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-ink md:text-[42px]",
                  center ? "mx-auto" : "",
                  headMax ?? (center ? "max-w-[22ch]" : "max-w-[24ch]")
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
