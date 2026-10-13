import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { QuoteBelt } from "@/components/sections/v7/quote-belt";
import { HOME_EN, type HomeCopy } from "@/lib/content";

/**
 * Social proof right after the price: the people who use what we built, in
 * their own words. The opener sits in the page column; the belt runs the full
 * width so the quotes can slide in from the edge.
 * On /kr the cards carry a Korean translation with the person's English under
 * it (HOME_KO.inTheirWords, content.ko.ts).
 */
export function InTheirWords({ copy = HOME_EN.inTheirWords }: { copy?: HomeCopy["inTheirWords"] }) {
  return (
    <section id="in-their-words" className="draft-section scroll-mt-28">
      <div className="draft-wrap">
        <AnimateOnScroll className="mb-6 md:mb-8">
          <p className="draft-crop t-label">{copy.kicker}</p>
          <h2 className="t-title mt-5 max-w-[22ch]">
            {copy.title.lead} <span className="text-accent-display">{copy.title.accent}</span>
          </h2>
        </AnimateOnScroll>
      </div>
      <QuoteBelt items={copy.items} label={copy.beltLabel} originalLabel={copy.originalLabel} />
    </section>
  );
}
