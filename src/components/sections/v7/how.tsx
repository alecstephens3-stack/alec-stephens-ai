import { Section } from "../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { V7_HOW } from "@/lib/content";

/** How a project goes, with the free time audit as step one. */
export function How() {
  return (
    <Section id="how" title={V7_HOW.title} accent={V7_HOW.accent}>
      <AnimateOnScroll>
        <ol className="draft-rail">
          {V7_HOW.steps.map((s) => (
            <li key={s.n} className="py-7 md:px-7 md:py-8 md:first:pl-0">
              <p className="font-label text-[15px] font-bold tracking-[0.12em] text-accent-deep">{s.n}</p>
              <h3 className="mt-3 font-heading text-[21px] font-medium leading-[1.25] text-ink md:text-[22px]">{s.title}</h3>
              <p className="t-body mt-3">{s.body}</p>
            </li>
          ))}
        </ol>
      </AnimateOnScroll>
    </Section>
  );
}
