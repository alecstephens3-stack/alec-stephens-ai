import { CONTACT_EMAIL } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";

export function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-black py-24"
      aria-label="Contact"
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(220,104,67,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: copy */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="h-1 w-8 rounded-full bg-terracotta" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                  Let&apos;s Talk
                </span>
              </div>

              <h2 className="font-heading text-3xl font-bold text-white md:text-5xl">
                Ready to Automate
                <br />
                <span className="text-terracotta">Your Business?</span>
              </h2>

              <p className="mt-6 max-w-md text-lg text-warm-gray">
                Fill out the form and I&apos;ll get back to you within 24
                hours. Or if you prefer, shoot me an email directly.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-4 inline-block text-lg font-medium text-white transition-colors hover:text-terracotta"
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
