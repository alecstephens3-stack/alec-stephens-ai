import Image from "next/image";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { FOUNDERS, FOUNDERS_SECTION } from "@/lib/content";
import { Clock } from "./clock";
import s from "./founders.module.css";

/**
 * The two of us, and the time difference shown rather than apologised for:
 * our clock against the clinic's, with the approved note (Japan and Korea,
 * next business morning) as its caption. No team grid, no cards for people.
 */
export function FoundersA() {
  return (
    <Section id="about" kicker="Who we are" title={FOUNDERS_SECTION.title}>
      <div className={s.grid}>
        <div className={s.people}>
          {FOUNDERS.map((f, i) => (
            <AnimateOnScroll key={f.name} delay={i * 80}>
              <div className={s.person}>
                <Image src={f.image} alt="" width={160} height={160} sizes="88px" className={s.face} />
                <div>
                  <h3 className={s.name}>{f.name}</h3>
                  <p className={s.role}>{f.role}</p>
                  <p className={s.bio}>{f.bio}</p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
        <AnimateOnScroll delay={120}>
          <figure className={s.fig}>
            <Clock />
            {"note" in FOUNDERS_SECTION && <figcaption className={s.note}>{FOUNDERS_SECTION.note}</figcaption>}
          </figure>
        </AnimateOnScroll>
      </div>
    </Section>
  );
}
