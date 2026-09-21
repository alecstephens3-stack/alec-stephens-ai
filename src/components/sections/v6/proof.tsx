import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Demo } from "./demo";
import { QUOTE, PROOF_LINKS } from "@/lib/content";

/**
 * The proof, once. One named quote in glass, one number, one demonstration.
 *
 * v5 said the same thing in a four-card stat grid, a "what was happening"
 * card, a "what we built" card, a footnote panel and a three-card PDF shelf.
 * The stat grid is gone except the 200 hours, and the long narrative lives in
 * the published case study it always came from.
 */
export function Proof() {
  return (
    <Section
      id="proof"
      kicker={QUOTE.kicker}
      titleMax="max-w-[26ch]"
      title={
        <>
          {QUOTE.title.lead}{" "}
          <span className="text-accent-display">{QUOTE.title.accent}</span>
        </>
      }
    >
      <AnimateOnScroll>
        <p className="t-body -mt-4 mb-12 max-w-[56ch] md:mb-16">{QUOTE.problem}</p>
      </AnimateOnScroll>

      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
        {/* The one glass object in this section: a real quote from a real person. */}
        <AnimateOnScroll>
          <figure className="sai-pane-strong m-0 rounded-card p-7 md:p-9">
            <blockquote className="m-0">
              <p className="t-title !text-[clamp(1.4rem,1.1rem+1.1vw,1.85rem)] !leading-[1.3]">
                <span className="text-accent-display">&ldquo;</span>
                {QUOTE.text}
                <span className="text-accent-display">&rdquo;</span>
              </p>
            </blockquote>
            <figcaption className="mt-7 flex items-start gap-3.5">
              <span aria-hidden="true" className="mt-[13px] h-[2px] w-8 shrink-0 rounded bg-accent" />
              <span className="t-body">
                <strong>{QUOTE.who}</strong>, {QUOTE.role}
              </span>
            </figcaption>
          </figure>
        </AnimateOnScroll>

        {/* The one number, in air rather than in a card. */}
        <AnimateOnScroll delay={90}>
          <p className="t-display !text-[clamp(2.1rem,1.4rem+2.6vw,3.1rem)] !leading-[1.05] text-accent-deep">
            {QUOTE.stat.big}
          </p>
          <p className="t-body mt-5 max-w-[34ch]">{QUOTE.stat.rest}</p>
          <p className="t-body mt-3 max-w-[34ch]">{QUOTE.since}</p>
        </AnimateOnScroll>
      </div>

      <AnimateOnScroll delay={60}>
        <div className="mt-[var(--draft-air)]">
          <Demo />
        </div>
      </AnimateOnScroll>

      <AnimateOnScroll delay={60}>
        <p className="t-body mt-12 flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <a
            href={PROOF_LINKS.full.href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent-deep"
          >
            {PROOF_LINKS.full.label} &rarr;
          </a>
          <span className="t-fine">
            {PROOF_LINKS.more}{" "}
            {PROOF_LINKS.items.map((item, i) => (
              <span key={item.href}>
                {i > 0 && ", "}
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  className="underline underline-offset-4 transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </span>
            ))}
          </span>
        </p>
      </AnimateOnScroll>
    </Section>
  );
}
