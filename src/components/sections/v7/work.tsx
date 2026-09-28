import { Section } from "../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { V7_WORK } from "@/lib/content";

/** What we build: the real builds, a line each, on a hairline grid. No cards. */
export function Work() {
  return (
    <Section id="work" kicker={V7_WORK.kicker} title={V7_WORK.title} titleMax="max-w-[22ch]">
      <AnimateOnScroll>
        <ul className="v7-work">
          {V7_WORK.items.map((w) => (
            <li key={w.title}>
              <h3 className="font-heading text-[22px] font-medium leading-[1.25] text-ink">{w.title}</h3>
              <p className="t-body mt-2.5">{w.body}</p>
              {"link" in w && w.link && (
                <a
                  href={w.link.href}
                  target="_blank"
                  rel="noopener"
                  className="mt-3 inline-block font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent-deep"
                >
                  {w.link.label} &rarr;
                </a>
              )}
            </li>
          ))}
        </ul>
      </AnimateOnScroll>
    </Section>
  );
}
