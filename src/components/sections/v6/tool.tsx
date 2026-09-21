import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Demo } from "./demo";
import { DEMO } from "@/lib/content";

/**
 * The demonstration, first thing after the hero, on purpose.
 *
 * The sticky note in the hero illustration asks "Refraction: collect or bill?"
 * and so does this screen. Saying that out loud in the lead is the whole point
 * of putting the two next to each other: the mess at the top of the page and
 * the answer to it are the same question.
 */
export function Tool() {
  return (
    <Section id="tool" kicker={DEMO.kicker} title={DEMO.title} titleMax="max-w-[22ch]">
      <AnimateOnScroll>
        <p className="t-body -mt-4 mb-12 max-w-[52ch] md:mb-14">{DEMO.lead}</p>
      </AnimateOnScroll>
      <AnimateOnScroll delay={60}>
        <Demo />
      </AnimateOnScroll>
    </Section>
  );
}
