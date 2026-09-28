import Image from "next/image";
import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { QUOTE, PROOF_LINKS } from "@/lib/content";

/**
 * The proof, once, and after the demonstration rather than before it: you see
 * what the thing does, then you hear from the person who uses it.
 *
 * The 200 hours is NOT here any more. It moved onto the first screen, under
 * the headline, and a number that appears twice is the habit this whole draft
 * is trying to break. The long narrative stays in the published case study.
 */
export function Proof() {
  return (
    <Section
      id="proof"
      eyebrow={
        <div className="v7-client">
          <Image src="/logos/wfv.png" alt="Wichita Family Vision" width={232} height={96} className="v7-client-logo" />
          <span className="v7-client-bar" aria-hidden="true" />
          <span className="v7-client-lab">Case study</span>
        </div>
      }
      title={QUOTE.title.lead}
      accent={QUOTE.title.accent}
    >
      <AnimateOnScroll>
        <p className="t-body -mt-4 mb-12 max-w-[56ch] md:mb-14">{QUOTE.problem}</p>
      </AnimateOnScroll>

      {/* The one glass object in this section: a real quote from a real person. */}
      <AnimateOnScroll delay={60}>
        <figure className="sai-pane-strong m-0 max-w-[740px] rounded-card p-7 md:p-10">
          <blockquote className="m-0">
            <p className="t-title !text-[clamp(1.4rem,1.1rem+1.1vw,1.9rem)] !leading-[1.3]">
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

      <AnimateOnScroll delay={60}>
        <div className="pf-pay">
          {QUOTE.payoff.map((x, i) => (
            <div key={x.n} className={i === 0 ? "pf-fig is-lead" : "pf-fig"}>
              <p className="pf-n">{x.n}</p>
              <p className="pf-l">{x.l}</p>
            </div>
          ))}
        </div>
        <p className="pf-note">
          <span className="pf-live">
            {QUOTE.status}
          </span>
          <span className="t-fine">{QUOTE.payoffNote}</span>
        </p>
        <p className="t-body mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-3">
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
