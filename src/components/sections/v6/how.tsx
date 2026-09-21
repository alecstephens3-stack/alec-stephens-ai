import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { HOW } from "@/lib/content";

/**
 * How a project goes, a few words a step. No glass: four columns on a
 * hairline rail, which is what a sequence actually looks like. The v5 version
 * of this ran a paragraph per step inside a pane, plus three more guardrail
 * cards underneath saying what the FAQ already said.
 */
export function How() {
  return (
    <Section id="how" kicker="How we work" title={HOW.title}>
      <AnimateOnScroll>
        <ol className="draft-rail">
          {HOW.steps.map((s) => (
            <li key={s.n} className="py-7 md:px-7 md:py-8 md:first:pl-0">
              <p className="font-label text-[15px] font-bold tracking-[0.12em] text-accent-deep">{s.n}</p>
              <h3 className="mt-3 font-heading text-[21px] font-medium leading-[1.25] text-ink md:text-[22px]">
                {s.title}
              </h3>
              <p className="t-body mt-3">{s.body}</p>
            </li>
          ))}
        </ol>
      </AnimateOnScroll>
    </Section>
  );
}
