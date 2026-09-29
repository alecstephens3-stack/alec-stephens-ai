import Image from "next/image";
import { V7_LOGOS } from "@/lib/content";

/**
 * Partners (label renamed from "Who we work with", Alec 2026-09-29): one still, grayscale row. Deliberately NOT a moving
 * marquee (a ticker is on the banned list, Alec 2026-09-22). "Work with",
 * not "clients": Medari is a partner.
 */
export function Logos() {
  return (
    <section aria-label={V7_LOGOS.label} className="v7-logos">
      <p className="t-label text-center !text-ink-2">{V7_LOGOS.label}</p>
      <ul className="v7-logo-row">
        {V7_LOGOS.items.map((l) => (
          <li key={l.name}>
            <Image
              src={l.src}
              alt={l.name}
              width={l.w}
              height={l.h}
              style={{ ["--h" as string]: `${l.size}px` }}
              className="v7-logo"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
