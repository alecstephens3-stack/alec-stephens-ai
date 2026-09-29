import { cn } from "@/lib/utils";
import { Section } from "../../v6/shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { V7_HOW, V7_CTA } from "@/lib/content";
import s from "./how.module.css";

/**
 * How a project goes, with step one marked as the only one the reader does
 * today: its node on the rail is filled, its number is the accent, and it
 * carries the way to book it. Steps two to four sit back until they say yes.
 *
 * The markup keeps `#how .draft-rail > li` with the number as each step's
 * first <p>, so the page's dotted thread (page-threads.tsx) still stitches
 * through the four steps; the filled node sits exactly on its first knot.
 */
export function HowA() {
  return (
    <Section id="how" kicker="How we work" title={V7_HOW.title}>
      <AnimateOnScroll>
        <ol className={cn("draft-rail", s.rail)}>
          {V7_HOW.steps.map((st, i) => (
            <li key={st.n} className={cn(s.step, i === 0 && s.today)}>
              <p className={s.num}>{st.n}</p>
              <h3 className={s.title}>{st.title}</h3>
              <p className={cn("t-body", s.body)}>{st.body}</p>
              {i === 0 && (
                <a href={V7_CTA.href} target="_blank" rel="noopener noreferrer" className={s.start}>
                  {V7_CTA.label} <span aria-hidden="true">&rarr;</span>
                </a>
              )}
            </li>
          ))}
        </ol>
      </AnimateOnScroll>
    </Section>
  );
}
