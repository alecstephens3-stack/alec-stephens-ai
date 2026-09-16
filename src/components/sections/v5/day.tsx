import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { DAY } from "@/lib/content";

export function Day() {
  return (
    <Section id="day" kicker="A day at the front desk" title={DAY.title} lede={DAY.lede} headMax="max-w-[26ch]">
      <div className="grid gap-4 md:grid-cols-3">
        {DAY.columns.map((c, i) => (
          <AnimateOnScroll key={c.tag} delay={i * 70} className="h-full">
            <Card className="flex h-full flex-col">
              <p className="font-label text-[12.5px] font-bold uppercase tracking-[0.1em] text-accent-deep">
                {c.tag}
              </p>
              <h3 className="mt-3 font-heading text-[19px] font-medium leading-[1.25] text-ink">
                {c.title}
              </h3>
              <ul className="mt-4 divide-y divide-rule-soft" role="list">
                {c.items.map((item) => (
                  <li key={item} className="py-2 text-[15.5px] font-medium text-ink">
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[14.5px] leading-[1.55] text-ink-2">{c.note}</p>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
      <AnimateOnScroll delay={120}>
        <p className="mt-7 max-w-[70ch] text-[17px] leading-[1.6] text-ink-2 md:text-lg">
          <span className="font-medium text-ink">{DAY.foot.strong}</span> {DAY.foot.rest}
        </p>
      </AnimateOnScroll>
    </Section>
  );
}
