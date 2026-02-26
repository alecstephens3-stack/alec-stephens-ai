'use client';

import { Button } from "@/components/ui/button";
import { useShaderBackground } from "@/components/ui/animated-shader-hero";
import { Typewriter } from "@/components/ui/typewriter";

const TICKER_ITEMS = [
  "n8n",
  "Claude API",
  "Claude Code",
  "Next.js",
  "OpenAI",
  "Make.com",
  "PostgreSQL",
  "TypeScript",
  "Notion API",
  "REST APIs",
  "Vercel",
  "Webhooks",
  "Prisma",
];

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

export function Hero() {
  const canvasRef = useShaderBackground();
  const tickerItems = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <section
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: "#0D0C0B" }}
      aria-label="Hero"
    >
      {/* WebGL shader background */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full touch-none"
        style={{ background: 'black' }}
      />

      {/* Grain texture overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage: GRAIN_SVG,
          backgroundSize: "180px 180px",
          opacity: 0.045,
        }}
      />

      {/* Dark vignette so text stays readable */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(13,12,11,0.65) 100%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-20 flex flex-1 items-center">
        <div className="mx-auto w-full max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
          {/* Label */}
          <div className="mb-10 flex items-center gap-3 animate-fade-in-down">
            <span className="block h-px w-12 bg-terracotta" />
            <span className="text-xs font-bold uppercase tracking-[0.28em] text-terracotta">
              AI Automation Consulting
            </span>
          </div>

          {/* Headline */}
          <h1
            className="font-heading font-bold leading-[0.92] tracking-tight text-white animate-fade-in-up animation-delay-200"
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
              <Typewriter
                text={["Minutes.", "Results.", "Automations.", "Revenue."]}
                speed={60}
                deleteSpeed={35}
                waitTime={2200}
                cursorChar="_"
                cursorClassName="ml-0.5"
              />
            </em>
          </h1>

          {/* Hairline rule */}
          <div className="mt-10 h-px w-16 bg-white/10 animate-fade-in-up animation-delay-400" />

          {/* Body copy */}
          <p className="mt-8 max-w-[520px] text-lg leading-relaxed text-white/55 md:text-xl animate-fade-in-up animation-delay-600">
            I build AI automations that work in production. n8n workflows,
            Claude API integrations, full-stack apps. If your team is doing
            something manually that a machine could handle, I can fix that.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-fade-in-up animation-delay-800">
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
