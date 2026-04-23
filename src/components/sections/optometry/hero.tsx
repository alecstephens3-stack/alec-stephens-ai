import { OPTOMETRY_HERO } from "@/lib/optometry";

export function OptometryHero() {
  const { eyebrow, headline, lede, primaryCta, secondaryCta, trust } = OPTOMETRY_HERO;

  return (
    <section
      className="relative pt-32 pb-16 md:pt-40 md:pb-24"
      aria-label="Optometry overview"
    >
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-60 animate-fade-in-up">
          {eyebrow}
        </p>

        <h1
          className="max-w-[18ch] font-heading font-medium text-black animate-fade-in-up animation-delay-200"
          style={{
            fontSize: "clamp(2.8rem, 7vw, 6rem)",
            lineHeight: 0.95,
            letterSpacing: "-0.035em",
          }}
        >
          {headline.before}
          <span className="text-salmon">{headline.accent}</span>
          {headline.after}
        </h1>

        <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-ink-60 md:mt-10 md:text-xl animate-fade-in-up animation-delay-400">
          {lede}
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-5 md:mt-12 animate-fade-in-up animation-delay-600">
          <a
            href={primaryCta.href}
            className="group inline-flex items-center gap-2 rounded-full bg-black px-6 py-3.5 font-heading text-sm font-medium text-paper transition-colors hover:bg-salmon"
          >
            {primaryCta.label}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </a>
          <a
            href={secondaryCta.href}
            className="inline-flex items-center gap-2 font-heading text-sm font-medium text-ink-90 transition-colors hover:text-salmon"
          >
            {secondaryCta.label}
            <span aria-hidden="true">&darr;</span>
          </a>
        </div>

        <div
          className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-6 md:mt-24 animate-fade-in-up animation-delay-600"
          aria-label="Compatible platforms"
        >
          {trust.map((item, i) => (
            <span
              key={item}
              className="flex items-center font-mono text-[11px] uppercase tracking-[0.08em] text-ink-60"
            >
              {item}
              {i < trust.length - 1 && (
                <span className="ml-5 h-3 w-px bg-border" aria-hidden="true" />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
