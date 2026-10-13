import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { QuoteBelt } from "@/components/sections/v7/quote-belt";
import { HOME_TESTIMONIALS } from "@/lib/testimonials";

/**
 * Social proof right after the price: the people who use what we built, in
 * their own words. The opener sits in the page column; the belt runs the full
 * width so the quotes can slide in from the edge.
 */
export function InTheirWords() {
  return (
    <section id="in-their-words" className="draft-section scroll-mt-28">
      <div className="draft-wrap">
        <AnimateOnScroll className="mb-6 md:mb-8">
          <p className="draft-crop t-label">In their words</p>
          <h2 className="t-title mt-5 max-w-[22ch]">
            From the people who use <span className="text-accent-display">what we build.</span>
          </h2>
        </AnimateOnScroll>
      </div>
      <QuoteBelt items={HOME_TESTIMONIALS} label="Quotes from people we have built for" />
    </section>
  );
}
