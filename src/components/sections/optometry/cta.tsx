import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { OPTOMETRY_CTA } from "@/lib/optometry";

export function OptometryCta() {
  const { eyebrow, headline, body, primary, secondary } = OPTOMETRY_CTA;

  return (
    <section
      id="book"
      className="bg-ink text-paper"
      aria-label="Book a call"
    >
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-36">
        <AnimateOnScroll>
          <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-40">
            {eyebrow}
          </p>

          <h2
            className="max-w-[14ch] font-heading font-medium text-paper"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              lineHeight: 0.98,
              letterSpacing: "-0.035em",
            }}
          >
            {headline.line1}
            <br />
            {headline.line2}
            <br />
            <span className="text-salmon">{headline.accent}</span>
          </h2>

          <p className="mt-10 max-w-[56ch] text-base leading-relaxed text-ink-40 md:text-lg">
            {body}
          </p>

          <div className="mt-12 flex flex-wrap items-center gap-5 md:mt-14">
            <a
              href={primary.href}
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 font-heading text-sm font-medium text-black transition-colors hover:bg-salmon hover:text-paper"
            >
              {primary.label}
              <span aria-hidden="true">&rarr;</span>
            </a>
            <a
              href={secondary.href}
              className="inline-flex items-center gap-2 font-heading text-sm font-medium text-paper transition-colors hover:text-salmon"
            >
              {secondary.label}
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
