import { HowA } from "./how";
import { PricingA } from "./pricing";
import { PatientA } from "./patient";
import { FoundersA } from "./founders";
import { ContactA } from "./contact";

/**
 * Builder A, direction "Instruments" (2026-09-29): How we work down to
 * Contact as precise, calm controls a practice owner can check things with.
 * The standout is Pricing (the itemised statement and the reader's own
 * estimate); everything else stays quiet: step one marked on the How thread,
 * a two-way switch that redraws where patient data goes, our clock against
 * theirs, and the night panel saying what happens in the 30 minutes.
 */
export function LowerA() {
  return (
    <>
      <HowA />
      <PricingA />
      <PatientA />
      <FoundersA />
      <ContactA />
    </>
  );
}
