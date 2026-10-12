import { HOME_EN, type HomeCopy } from "@/lib/content";
import s from "./patient-strip.module.css";

/**
 * Patient data, as one slim strip right after Services (Alec, 2026-09-29: the
 * old boxed statement "needs to be simplified and stylized... it doesn't fit
 * where it's at"). Three short lines, each behind the same fine-line check as
 * the pricing guarantee seal. Static on purpose: this is reassurance, not a
 * moment.
 */
const Check = () => (
  <svg className={s.check} width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
    <circle cx="13" cy="13" r="11.5" />
    <path d="M8.4 13.3l3 3 6.2-6.4" />
  </svg>
);

export function PatientStrip({ copy = HOME_EN.patient }: { copy?: HomeCopy["patient"] }) {
  return (
    <section className={s.wrap} aria-label={copy.label}>
      <div className={s.strip}>
        <p className={s.label}>{copy.label}</p>
        <ul className={s.points}>
          {copy.points.map((p) => (
            <li key={p} className={s.point}>
              <Check />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
