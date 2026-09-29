import { How } from "./how";
import { Pricing } from "./pricing";
import { Patient } from "./patient";
import { Founders } from "./founders";
import { Contact } from "./contact";

/**
 * Builder B, "Drawn" (2026-09-29): How we work down to Contact, carrying the
 * hero's fine-line hand into the lower half. One standout (Patient data: a
 * drawn map of where the data goes, redrawn by a three-state switch); every
 * other section stays quiet. Preview: /preview/lower-b.
 */
export function LowerB() {
  return (
    <>
      <How />
      <Pricing />
      <Patient />
      <Founders />
      <Contact />
    </>
  );
}
