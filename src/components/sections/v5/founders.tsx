import Image from "next/image";
import { Section, Card } from "./shell";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { FOUNDERS, FOUNDERS_SECTION } from "@/lib/content";

export function Founders() {
  return (
    <Section id="about" kicker="Who we are" title={FOUNDERS_SECTION.title} lede={FOUNDERS_SECTION.lede}>
      <div className="grid gap-4 md:grid-cols-2">
        {FOUNDERS.map((f, i) => (
          <AnimateOnScroll key={f.name} delay={i * 70} className="h-full">
            <Card className="flex h-full items-start gap-4 !p-5">
              <Image
                src={f.image}
                alt=""
                width={160}
                height={160}
                sizes="72px"
                className="h-[64px] w-[64px] shrink-0 rounded-full object-cover md:h-[72px] md:w-[72px]"
              />
              <div>
                <h3 className="font-heading text-[18px] font-medium leading-tight text-ink">{f.name}</h3>
                <p className="mt-0.5 font-label text-[12.5px] font-bold uppercase tracking-[0.08em] text-accent-deep">
                  {f.role}
                </p>
                <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">{f.bio}</p>
              </div>
            </Card>
          </AnimateOnScroll>
        ))}
      </div>
    </Section>
  );
}
