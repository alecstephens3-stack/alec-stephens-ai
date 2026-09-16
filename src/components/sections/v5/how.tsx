import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { HOW } from "@/lib/content";

export function How() {
  return (
    <Section id="how" kicker="How we work" title={HOW.title}>
      <AnimateOnScroll>
        <div className="sai-pane grid gap-0 divide-y divide-rule-soft rounded-card p-1 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {HOW.steps.map((s) => (
            <div key={s.n} className="p-5">
              <p className="font-label text-[12.5px] font-bold uppercase tracking-[0.1em] text-accent-deep">{s.n}</p>
              <h3 className="mt-2 font-heading text-[17px] font-medium leading-[1.3] text-ink">{s.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-ink-2">{s.body}</p>
            </div>
          ))}
        </div>
      </AnimateOnScroll>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        {HOW.guardrails.map((g, i) => (
          <AnimateOnScroll key={g.title} delay={i * 70} className="h-full">
            <Card className="h-full !p-5">
              <h3 className="font-heading text-[16.5px] font-medium leading-tight text-ink">{g.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.55] text-ink-2">{g.body}</p>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
    </Section>
  );
}
