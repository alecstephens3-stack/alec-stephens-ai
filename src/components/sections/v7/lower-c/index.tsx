import { How } from "./how";
import { Pricing } from "./pricing";
import { Patient } from "./patient";
import { Founders } from "./founders";
import { Contact } from "../contact";

/**
 * Builder C, "Working product" (2026-09-29): How we work down to Contact.
 * Each section shows one real object in the hero's product-window style;
 * How we work is the one interactive standout. Contact is the approved night
 * panel, unchanged: its form is already the real object there.
 */
export function LowerC() {
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
