import { ButtonLink } from "@/components/ui/button";
import { Porthole } from "@/components/ui/lens-primitives";
import { OPTOMETRY_HERO } from "@/lib/optometry";
import { HeroIllustration } from "./hero-illustration";

export function OptometryHero() {
  const { eyebrow, headline, lede, ledeHighlight, primaryCta, secondaryCta, trust } = OPTOMETRY_HERO;
  const ledeParts =
    ledeHighlight && lede.includes(ledeHighlight)
      ? {
          before: lede.slice(0, lede.indexOf(ledeHighlight)),
          highlight: ledeHighlight,
          after: lede.slice(lede.indexOf(ledeHighlight) + ledeHighlight.length),
        }
      : null;

  return (
    <section
      className="relative pt-36 pb-16 md:pt-44 md:pb-24"
      aria-label="Eyecare overview"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="sai-pane sai-streak rounded-window p-10 md:p-14">
          <div className="relative grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-12">
            <div>
              <div className="sai-rise" style={{ animationDelay: "0ms" }}>
                <Porthole>{eyebrow}</Porthole>
              </div>

              <h1
                className="sai-rise mt-7 max-w-[18ch] font-heading font-medium text-ink-90"
                style={{
                  fontSize: "clamp(2.35rem, 4.6vw, 3.5rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                  animationDelay: "80ms",
                }}
              >
                {headline.before}
                <em className="not-italic text-accent">{headline.accent}</em>
                {headline.after}
              </h1>

              <p
                className="sai-rise mt-7 max-w-[52ch] text-lg leading-relaxed text-ink-2 md:mt-8"
                style={{ animationDelay: "160ms" }}
              >
                {ledeParts ? (
                  <>
                    {ledeParts.before}
                    <span className="font-medium text-ink-90">{ledeParts.highlight}</span>
                    {ledeParts.after}
                  </>
                ) : (
                  lede
                )}
              </p>

              <div
                className="sai-rise mt-10 flex flex-wrap items-center gap-4 md:mt-12"
                style={{ animationDelay: "240ms" }}
              >
                <ButtonLink href={primaryCta.href} variant="primary">
                  {primaryCta.label}
                  <span aria-hidden="true">&rarr;</span>
                </ButtonLink>
                <ButtonLink href={secondaryCta.href} variant="ghost">
                  {secondaryCta.label}
                  <span aria-hidden="true">&darr;</span>
                </ButtonLink>
              </div>
            </div>

            {/* Below sm the wrapper reclaims the pane's 40px padding so the
                illustration renders 337px wide instead of 257px. That extra
                width is what lets its type clear the 13px floor without the
                SVG going oversized on desktop. */}
            <div
              className="sai-rise -mx-10 flex justify-center sm:mx-0 lg:justify-end"
              style={{ animationDelay: "200ms" }}
            >
              <HeroIllustration />
            </div>
          </div>

          <div
            className="sai-rise relative mt-12 flex flex-wrap items-center gap-2.5 border-t border-rule pt-8 md:mt-16 md:pt-10"
            aria-label="Compatible platforms"
            style={{ animationDelay: "320ms" }}
          >
            {trust.map((item) => (
              <span
                key={item}
                className="rounded-full border border-rule bg-white/60 px-3 py-1 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
