import { Button } from "@/components/ui/button";

const TICKER_ITEMS = [
  "n8n",
  "Claude API",
  "Next.js",
  "OpenAI",
  "Make.com",
  "PostgreSQL",
  "TypeScript",
  "Zapier",
  "REST APIs",
  "Vercel",
  "Webhooks",
  "Prisma",
];

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function Hero() {
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: "#0D0C0B" }}
      aria-label="Hero"
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundSize: "180px 180px",
          opacity: 0.04,
        }}
      />

      {/* Gradient orb — left */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0"
        style={{
          top: "20%",
          left: "5%",
          width: "900px",
          height: "900px",
          background:
            "radial-gradient(circle, rgba(220,104,67,0.13) 0%, transparent 62%)",
          animation: "float-a 22s ease-in-out infinite",
        }}
      />

      {/* Gradient orb — right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0"
        style={{
          bottom: "10%",
          right: "-8%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(220,104,67,0.06) 0%, transparent 60%)",
          animation: "float-b 28s ease-in-out infinite",
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="mb-10 flex items-center gap-3">
            <span className="block h-px w-12 bg-terracotta" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-terracotta">
              AI Automation Consulting
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading font-bold leading-[0.92] tracking-tight text-white"
            style={{ fontSize: "clamp(3rem, 8.5vw, 8rem)" }}
          >
            Turn Hours of
            <br />
            Manual Work
            <br />
            Into{" "}
            <em
              className="text-terracotta"
              style={{ fontStyle: "italic", letterSpacing: "-0.01em" }}
            >
              Minutes.
            </em>
          </h1>

          {/* Hairline rule */}
          <div className="mt-10 h-px w-16 bg-white/10" />

          {/* Body copy */}
          <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-white/55 md:text-xl">
            I build AI automations that work in production. n8n workflows,
            Claude API integrations, full-stack apps. If your team is doing
            something manually that a machine could handle, I can fix that.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#contact" size="lg">
              Book a Free Consultation
            </Button>
            <Button
              href="#work"
              variant="secondary"
              size="lg"
              className="border-white/15 text-white hover:border-terracotta hover:text-terracotta"
            >
              See My Work
            </Button>
          </div>
        </div>
      </div>

      {/* Scrolling tech ticker */}
      <div
        className="relative z-20 shrink-0 overflow-hidden py-5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div
          className="flex w-max"
          style={{ animation: "marquee 32s linear infinite" }}
        >
          {tickerItems.map((item, i) => (
            <span
              key={i}
              className="shrink-0 px-8 text-xs font-semibold uppercase tracking-[0.22em] text-white/25"
            >
              {item}
              <span className="ml-8 text-terracotta/30">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
