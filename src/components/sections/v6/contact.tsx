import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";
import { DayWindow, NightWindow } from "@/components/ui/lens-primitives";
import { CONTACT, CONTACT_EMAIL, SECOND_EMAIL, CALENDLY } from "@/lib/content";

/**
 * The one call to action. Kept as the night window because the contact form is
 * a real object and this is the page's single loudest moment, which is exactly
 * what the one-night-window rule is for.
 */
export function Contact() {
  return (
    <section id="contact" className="scroll-mt-28 px-5 pb-[var(--draft-air-tight)] pt-[var(--draft-air)] md:px-8">
      <div className="mx-auto max-w-[1000px]">
        <AnimateOnScroll>
          <NightWindow ariaLabel="Contact" className="p-7 md:p-12">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
              <div className="lg:self-center">
                <p className="draft-crop t-label !text-accent-night">{CONTACT.kicker}</p>
                <h2 className="t-title mt-5 !text-cream">{CONTACT.title}</h2>
                <p className="t-body mt-5 max-w-[40ch] !text-cream-2">{CONTACT.body}</p>
                <div className="mt-8 flex flex-col gap-2.5">
                  <a
                    href={CALENDLY}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start font-label text-[15px] font-semibold uppercase tracking-[0.06em] text-accent-night transition-opacity hover:opacity-80"
                  >
                    {CONTACT.bookLabel} &rarr;
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="self-start text-[17px] text-cream-2 transition-colors hover:text-accent-night">
                    {CONTACT_EMAIL}
                  </a>
                  <a href={`mailto:${SECOND_EMAIL}`} className="self-start text-[17px] text-cream-2 transition-colors hover:text-accent-night">
                    {SECOND_EMAIL}
                  </a>
                </div>
              </div>
              <DayWindow className="p-5 md:p-7">
                <ContactForm />
              </DayWindow>
            </div>
          </NightWindow>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
