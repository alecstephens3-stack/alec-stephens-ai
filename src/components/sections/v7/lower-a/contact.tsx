import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { ContactForm } from "@/components/ui/contact-form";
import { DayWindow, NightWindow } from "@/components/ui/lens-primitives";
import { V7_CONTACT as CONTACT, CONTACT_EMAIL, SECOND_EMAIL, CALENDLY } from "@/lib/content";
import { A_CONTACT_LINES } from "./copy";
import s from "./contact.module.css";

/**
 * The one call to action, still the page's one night window. The approved
 * body is set as the three things that happen, on a short thread whose last
 * knot is filled: the map is what they keep. The short form sits beside it.
 */
export function ContactA() {
  return (
    <section id="contact" className={s.section}>
      <div className={s.wrap}>
        <AnimateOnScroll>
          <NightWindow ariaLabel="Contact" className={s.panel}>
            <div className={s.grid}>
              <div className={s.copy}>
                <p className="draft-crop t-label !text-accent-night">{CONTACT.kicker}</p>
                <h2 className="t-title mt-5 !text-cream">{CONTACT.title}</h2>
                <ol className={s.steps}>
                  {A_CONTACT_LINES.map((line, i) => (
                    <li key={line} className={i === A_CONTACT_LINES.length - 1 ? s.keep : undefined}>
                      {line}
                    </li>
                  ))}
                </ol>
                <div className={s.links}>
                  <a href={CALENDLY} target="_blank" rel="noopener noreferrer" className={s.book}>
                    {CONTACT.bookLabel} &rarr;
                  </a>
                  <a href={`mailto:${CONTACT_EMAIL}`} className={s.mail}>{CONTACT_EMAIL}</a>
                  <a href={`mailto:${SECOND_EMAIL}`} className={s.mail}>{SECOND_EMAIL}</a>
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
