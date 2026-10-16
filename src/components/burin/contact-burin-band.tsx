"use client";

import { BurinCanvas } from "./burin-canvas";

/**
 * The homepage ends here: the Jefferson Memorial colonnade engraved across the bottom of the
 * contact panel, the page's one night moment, so the site footer below can stay quiet
 * (Alec picked this over a separate night footer, 2026-10-17). Plate: HABS DC,WASH,453-28,
 * Jet Lowe 1992, Library of Congress, public domain.
 */
export function ContactBurinBand() {
  return (
    <div className="contact-burin" data-burin-host aria-hidden="true">
      <BurinCanvas src="/burin/jefferson-colonnade-habs.jpg" mode="night" focus="0.5,0.55" />
    </div>
  );
}
