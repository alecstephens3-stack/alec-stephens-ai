"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ContactForm } from "@/components/ui/contact-form";
import { DayWindow, NightWindow } from "@/components/ui/lens-primitives";
import { V7_CONTACT as CONTACT, CONTACT_EMAIL, SECOND_EMAIL, CALENDLY } from "@/lib/content";
import { MapSheet } from "./drawings";
import { useInViewOnce } from "./use-in-view";
import s from "./contact.module.css";

/**
 * The call to action, kept as the page's one night window. The only change:
 * the Opportunity Map from step one of How we work is drawn here again, in
 * cream, beside the promise that you keep it ("30 minutes. You keep the map.").
 */
export function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInViewOnce(ref);

  return (
    <section id="contact" className="scroll-mt-28 px-5 pb-[var(--draft-air-tight)] pt-[var(--draft-air)] md:px-8">
      <div ref={ref} className={cn("mx-auto max-w-[1000px]", s.wrap, on && s.on)}>
        <NightWindow ariaLabel="Contact" className="p-7 md:p-12">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
            <div className="lg:self-center">
              <p className="draft-crop t-label !text-accent-night">{CONTACT.kicker}</p>
              <h2 className="t-title mt-5 !text-cream">{CONTACT.title}</h2>
              <p className="t-body mt-5 max-w-[40ch] !text-cream-2">{CONTACT.body}</p>
              <div className={s.row}>
                <div className="flex flex-col gap-2.5">
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
                <svg className={s.map} viewBox="0 0 132 104" aria-hidden="true">
                  <g className={s.ink}>
                    <MapSheet ringClass={s.ring} />
                  </g>
                </svg>
              </div>
            </div>
            <DayWindow className="p-5 md:p-7">
              <ContactForm />
            </DayWindow>
          </div>
        </NightWindow>
      </div>
    </section>
  );
}
