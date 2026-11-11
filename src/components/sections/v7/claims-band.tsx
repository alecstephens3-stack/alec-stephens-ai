import Link from "next/link";
import { V7_CLAIMS_BAND } from "@/lib/content";

/**
 * One quiet line under the hero that points at ClaimStride (Alec + Ju Sheen, 2026-11-11: the
 * homepage had no link to the flagship). Ink on a hairline, never a second filled button: the
 * hero's Get started stays the one thing to do on the first screen.
 */
export function ClaimsBand({ copy = V7_CLAIMS_BAND }: { copy?: typeof V7_CLAIMS_BAND }) {
  return (
    <div className="v7-claims-band">
      <Link href={copy.href} className="v7-claims-link">
        <span>
          <span className="v7-claims-ask">{copy.ask}</span> <span className="v7-claims-go">{copy.label}</span>
        </span>
        <span className="v7-claims-arrow" aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}
