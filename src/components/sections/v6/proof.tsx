import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { HOME_EN, type HomeCopy } from "@/lib/content";

/**
 * The proof, once, and after the demonstration rather than before it: you see
 * what the thing does, then you hear from the person who uses it.
 *
 * The 200 hours is NOT here any more. It moved onto the first screen, under
 * the headline, and a number that appears twice is the habit this whole draft
 * is trying to break. The long narrative stays in the published case study.
 */
export function Proof({ copy = HOME_EN.proof }: { copy?: HomeCopy["proof"] }) {
  return (
    <Section
      id="proof"
      kicker={copy.kicker}
      titleMax="max-w-[26ch]"
      title={
        <>
          {copy.title.lead}{" "}
          <span className="text-accent-display">{copy.title.accent}</span>
        </>
      }
    >
      <AnimateOnScroll>
        <p className="t-body -mt-4 mb-12 max-w-[56ch] md:mb-14">{copy.problem}</p>
      </AnimateOnScroll>

      {/* The one glass object in this section: a real quote from a real person. */}
      <AnimateOnScroll delay={60}>
        <figure className="sai-pane-strong m-0 max-w-[740px] rounded-card p-7 md:p-10">
          <blockquote className="m-0">
            <p className="t-title !text-[clamp(1.4rem,1.1rem+1.1vw,1.9rem)] !leading-[1.3]">
              <span className="text-accent-display">&ldquo;</span>
              {copy.text}
              <span className="text-accent-display">&rdquo;</span>
            </p>
          </blockquote>
          {/* A translated page keeps the person's own words, smaller, under the translation. */}
          {copy.original && (
            <p className="t-fine mt-4">
              {copy.original.label}: <span lang="en">&ldquo;{copy.original.text}&rdquo;</span>
            </p>
          )}
          <figcaption className="mt-7 flex items-start gap-3.5">
            <span aria-hidden="true" className="mt-[13px] h-[2px] w-8 shrink-0 rounded bg-accent" />
            <span className="t-body">
              <strong>{copy.who}</strong>, {copy.role}
            </span>
          </figcaption>
        </figure>
      </AnimateOnScroll>

      <AnimateOnScroll delay={60}>
        <div className="pf-pay">
          {copy.payoff.map((x, i) => (
            <div key={x.n} className={i === 0 ? "pf-fig is-lead" : "pf-fig"}>
              <p className="pf-n">{x.n}</p>
              <p className="pf-l">{x.l}</p>
            </div>
          ))}
        </div>
        <p className="pf-note">
          <span className="pf-live">
            {copy.status}
          </span>
          <span className="t-fine">{copy.payoffNote}</span>
        </p>
        <p className="t-body mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3">
          <a
            href={copy.links.full.href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent-deep"
          >
            {copy.links.full.label} &rarr;
          </a>
          <span className="t-fine">
            {copy.links.more}{" "}
            {copy.links.items.map((item, i) => (
              <span key={item.href}>
                {i > 0 && ", "}
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener"
                  className="relative after:absolute after:-inset-x-1 after:-inset-y-2.5 after:content-[''] underline underline-offset-4 transition-colors hover:text-ink"
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
