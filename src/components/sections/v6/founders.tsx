import Image from "next/image";
import { Section } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { FOUNDERS, FOUNDERS_SECTION } from "@/lib/content";

/** The two of us: a face and a line each. No cards. */
export function Founders() {
  return (
    <Section id="about" kicker="Who we are" title={FOUNDERS_SECTION.title}>
      <div className="grid gap-10 md:grid-cols-2 md:gap-14">
        {FOUNDERS.map((f, i) => (
          <AnimateOnScroll key={f.name} delay={i * 80}>
            <div className="flex items-start gap-5">
              <Image
                src={f.image}
                alt=""
                width={160}
                height={160}
                sizes="88px"
                className="h-[76px] w-[76px] shrink-0 rounded-full object-cover md:h-[88px] md:w-[88px]"
              />
              <div>
                <h3 className="font-heading text-[21px] font-medium leading-tight text-ink">{f.name}</h3>
                <p className="t-label mt-1">{f.role}</p>
                <p className="t-body mt-3 max-w-[34ch]">{f.bio}</p>
              </div>
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </Section>
  );
}
