import { CONTACT_EMAIL } from "@/lib/constants";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";

export function ContactCTA() {
  return (
    <section
      id="contact"
      className="py-24 md:py-32"
      aria-label="Contact"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-20">
            {/* Left: copy */}
            <div>
              <h2
                className="font-heading font-bold tracking-tight text-black"
                style={{ fontSize: "clamp(2.5rem, 4vw, 3.5rem)" }}
              >
                Let&apos;s talk.
              </h2>

              <p className="mt-4 max-w-md text-lg text-warm-gray">
                Every engagement starts with a free discovery call.
                Tell me what you&apos;re working on.
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-6 inline-block text-sm font-medium text-warm-gray transition-colors hover:text-terracotta"
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
