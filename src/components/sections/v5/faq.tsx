import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { FAQ, FAQ_SECTION } from "@/lib/content";

export function Faq() {
  return (
    <Section id="faq" kicker={FAQ_SECTION.kicker} title={FAQ_SECTION.title} center>
      <div className="mx-auto max-w-[760px]">
        {FAQ.map((item, i) => (
          <AnimateOnScroll key={item.q} delay={Math.min(i, 3) * 45}>
            <details className="group sai-pane mb-2.5 rounded-card px-5 md:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-3.5 font-heading text-[16.5px] font-medium leading-[1.35] text-ink md:text-[17.5px]">
                {item.q}
                <span aria-hidden="true" className="relative h-3.5 w-3.5 shrink-0">
                  <span className="absolute left-0 top-1/2 h-[2px] w-3.5 -translate-y-1/2 rounded bg-accent-deep" />
                  <span className="absolute left-1/2 top-0 h-3.5 w-[2px] -translate-x-1/2 rounded bg-accent-deep transition-transform duration-200 group-open:rotate-90" />
                </span>
              </summary>
              <p className="pb-4 pr-8 text-[15px] leading-[1.6] text-ink-2">{item.a}</p>
            </details>
          </AnimateOnScroll>
        ))}
      </div>
    </Section>
  );
}
