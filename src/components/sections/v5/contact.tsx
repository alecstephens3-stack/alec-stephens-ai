import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";
import { DayWindow, NightWindow, Porthole } from "@/components/ui/lens-primitives";
import { CONTACT, CONTACT_EMAIL, SECOND_EMAIL, CALENDLY } from "@/lib/content";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-28 px-5 py-11 md:px-8 md:py-14">
      <div className="mx-auto max-w-[1080px]">
        <AnimateOnScroll>
          <NightWindow ariaLabel="Contact" className="p-6 md:p-10">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
              <div className="lg:self-center">
                <Porthole onNight className="mb-4">{CONTACT.kicker}</Porthole>
                <h2 className="font-heading text-[30px] font-medium leading-[1.12] tracking-[-0.02em] text-cream md:text-[42px]">
                  {CONTACT.title}
                </h2>
                <p className="mt-4 max-w-[46ch] text-[16px] leading-[1.6] text-cream-2">{CONTACT.body}</p>
                <div className="mt-7 flex flex-col gap-2">
                  <a
                    href={CALENDLY}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent-night transition-opacity hover:opacity-80"
                  >
                    {CONTACT.bookLabel} &rarr;
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="self-start text-[15px] text-cream-2 transition-colors hover:text-accent-night">
                    {CONTACT_EMAIL}
                  </a>
                  <a href={`mailto:${SECOND_EMAIL}`} className="self-start text-[15px] text-cream-2 transition-colors hover:text-accent-night">
                    {SECOND_EMAIL}
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
