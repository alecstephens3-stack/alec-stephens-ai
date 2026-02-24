import { CONTACT_EMAIL } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";

export function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden py-24"
      style={{ background: "#0D0C0B" }}
      aria-label="Contact"
    >
      {/* Grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "180px 180px",
          opacity: 0.04,
        }}
      />

      {/* Glow from bottom center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0"
        style={{
          bottom: "-30%",
          left: "50%",
          width: "900px",
          height: "900px",
          background:
            "radial-gradient(circle, rgba(220,104,67,0.12) 0%, transparent 62%)",
          transform: "translateX(-50%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
            {/* Left: copy */}
            <div>
              <div className="mb-8 flex items-center gap-3">
                <span className="block h-px w-10 bg-terracotta" />
                <span className="text-xs font-bold uppercase tracking-[0.28em] text-terracotta">
                  Let&apos;s Talk
                </span>
              </div>

              <h2
                className="font-heading font-bold leading-[0.95] tracking-tight text-white"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                Ready to Automate
                <br />
                <em className="text-terracotta" style={{ fontStyle: "italic" }}>
                  Your Business?
                </em>
              </h2>

              <div className="mt-8 h-px w-16 bg-white/10" />

              <p className="mt-8 max-w-md text-lg text-white/55">
                Every engagement starts with a free 30-minute discovery call.
                Projects typically start at{" "}
                <span className="font-semibold text-white">$1,500</span>.
              </p>

              <p className="mt-4 max-w-md text-white/40">
                Fill out the form and I&apos;ll get back to you within 24
                hours. Or shoot me an email directly.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-5 inline-block text-base font-medium text-white/60 transition-colors hover:text-terracotta"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            {/* Right: form */}
            <div>
              <ContactForm />
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
