import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ButtonLink } from "@/components/ui/button";
import { StatusChip } from "@/components/ui/status-chip";
import { OPTOMETRY_CTA } from "@/lib/optometry";

export function OptometryCta() {
  const { eyebrow, headline, body, primary, secondary } = OPTOMETRY_CTA;

  return (
    <section
      id="book"
      className="py-24 md:py-32"
      aria-label="Book a call"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <div className="sai-pane sai-streak rounded-panel p-10 md:p-14">
            <div className="relative">
              <div className="mb-8">
                <StatusChip keyword="Booking" detail={eyebrow} status="accent" />
              </div>

              <h2
                className="max-w-[14ch] font-heading font-medium text-ink-90"
                style={{
                  fontSize: "clamp(2.4rem, 5.2vw, 4.25rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.035em",
                }}
              >
                {headline.line1}
                <br />
                {headline.line2}
                <br />
                <em className="not-italic text-accent">{headline.accent}</em>
              </h2>

              <p className="mt-10 max-w-[56ch] text-lg leading-relaxed text-ink-2">
                {body}
              </p>

              <div className="mt-12 flex flex-wrap items-center gap-4 md:mt-14">
                <ButtonLink href={primary.href} variant="primary">
                  {primary.label}
                  <span aria-hidden="true">&rarr;</span>
                </ButtonLink>
                <ButtonLink href={secondary.href} variant="ghost">
                  {secondary.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
