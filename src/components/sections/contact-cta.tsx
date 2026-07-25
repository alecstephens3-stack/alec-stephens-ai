import { CONTACT_EMAIL } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";
import { DayWindow, NightWindow } from "@/components/ui/lens-primitives";

/**
 * Night window #2 of the two permitted on the home page (Alec, 2026-07-25).
 * The ask sits in the dark; the form stays a light day window inside it.
 */
export function ContactCTA() {
  return (
    <section id="contact" className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <NightWindow ariaLabel="Contact" className="p-8 md:p-14">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: copy */}
              <div className="lg:self-center">
                <h2
                  className="font-heading font-medium tracking-tight text-cream"
                  style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
                >
                  Let&apos;s talk.
                </h2>

                <p className="mt-4 max-w-md text-lg leading-relaxed text-cream-2">
                  Every engagement starts with a free discovery call.
                  Tell us what you&apos;re working on.
                </p>

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="mt-7 inline-block text-[15px] font-medium text-cream-2 transition-colors duration-[220ms] ease-brand hover:text-accent-night"
                >
                  {CONTACT_EMAIL}
                </a>
              </div>

              {/* Right: form — the light sheet inside the dark window */}
              <DayWindow className="p-6 md:p-8">
                <ContactForm />
              </DayWindow>
            </div>
          </NightWindow>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
