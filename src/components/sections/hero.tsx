import Image from "next/image";

export function Hero() {
  return (
    <section
      className="relative pt-40 pb-10 md:pt-52 md:pb-14"
      aria-label="Hero"
    >
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_auto] md:gap-16">
          {/* Left: text */}
          <div>
            {/* Headline */}
            <h1
              className="max-w-3xl font-heading font-medium leading-[1.05] tracking-tight text-black animate-fade-in-up"
              style={{ fontSize: "clamp(2.8rem, 5.5vw, 5rem)" }}
            >
              I diagnose where businesses lose time, and fix it with AI.
            </h1>

            {/* Body */}
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-60 animate-fade-in-up animation-delay-200">
              Most businesses know they should be using AI but don&apos;t know
              where to start. I do the analysis, build the systems, and make
              sure they actually work.
            </p>

            {/* CTA */}
            <a
              href="#contact"
              className="mt-9 inline-flex items-center gap-2 font-heading text-lg font-semibold text-salmon transition-colors hover:text-salmon-deep animate-fade-in-up animation-delay-400"
            >
              Book a free consultation
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>

          {/* Right: headshot placeholder */}
          <div className="animate-fade-in-up animation-delay-400 flex shrink-0 justify-center md:justify-end">
            <div
              className="relative overflow-hidden rounded-lg bg-sand border border-border"
              style={{ width: 220, height: 280 }}
            >
              <Image
                src="/images/headshot.png"
                alt="Alec Stephens"
                fill
                className="object-cover object-center"
                sizes="220px"
                priority
              />
            </div>
          </div>
        </div>

        {/* Proof bar */}
        <div className="mt-20 animate-fade-in-up animation-delay-600">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 rounded-lg border border-border bg-sand/40 px-6 py-5 md:justify-between">
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-medium text-black">5+</span>
              <span className="text-sm text-ink-60">years on Upwork</span>
            </div>
            <div className="hidden h-5 w-px bg-border md:block" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-medium text-salmon">100%</span>
              <span className="text-sm text-ink-60">Job Success Score</span>
            </div>
            <div className="hidden h-5 w-px bg-border md:block" aria-hidden="true" />
            <div className="flex items-center gap-1">
              <span className="font-heading text-xl font-medium text-black">3</span>
              <span className="text-sm text-ink-60">countries served</span>
            </div>
            <div className="hidden h-5 w-px bg-border md:block" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <span className="font-heading text-xl font-medium text-salmon">Top Rated</span>
              <span className="text-sm text-ink-60">on Upwork</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
