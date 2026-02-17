import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section
      className="relative flex min-h-screen items-center overflow-hidden bg-black"
      aria-label="Hero"
    >
      {/* Radial gradient glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "800px",
          height: "800px",
          background:
            "radial-gradient(circle, rgba(220,104,67,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="h-1 w-8 rounded-full bg-terracotta" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
              AI Automation Consulting
            </span>
          </div>

          <h1 className="font-heading text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Turn Hours of Manual Work Into{" "}
            <span className="text-terracotta">Minutes</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-warm-gray md:text-xl">
            I build AI automations that actually work in production. n8n
            workflows, Claude API integrations, full-stack apps. If your team is
            doing something manually that a machine could handle, I can probably
            fix that.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Button href="#contact" size="lg">
              Book a Free Consultation
            </Button>
            <Button
              href="#work"
              variant="secondary"
              size="lg"
              className="border-white/20 text-white hover:border-terracotta hover:text-terracotta"
            >
              See My Work
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
