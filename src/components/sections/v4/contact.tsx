import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";
import { DayWindow, NightWindow } from "@/components/ui/lens-primitives";
import { CONTACT_EMAIL, CALENDLY } from "@/lib/content";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-28 px-5 py-11 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1080px]">
        <AnimateOnScroll>
          <NightWindow ariaLabel="Contact" className="p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              <div className="lg:self-center">
                <h2 className="font-heading text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-cream md:text-[42px]">
                  Book a 20-minute call.
                </h2>

                <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-cream-2">
                  Bring one thing your front desk keeps getting wrong. We will tell you
                  whether this is the right fix for it, and you
                  leave with at least one idea you can act on even if you never
                  hire us.
                </p>

                <div className="mt-7 flex flex-col gap-2">
                  <a
                    href={CALENDLY}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent-night transition-opacity hover:opacity-80"
                  >
                    Book directly &rarr;
                  </a>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="self-start text-[15px] text-cream-2 transition-colors hover:text-accent-night"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <a
                    href="mailto:jusheen@stephensai.co"
                    className="self-start text-[15px] text-cream-2 transition-colors hover:text-accent-night"
                  >
                    jusheen@stephensai.co
                  </a>
                </div>
              </div>

              <DayWindow className="p-5 md:p-6">
                <ContactForm />
              </DayWindow>
            </div>
          </NightWindow>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
