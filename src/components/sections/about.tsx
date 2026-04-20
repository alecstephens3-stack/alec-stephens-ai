import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function About() {
  return (
    <section id="about" className="bg-sand/50 py-28 md:py-40" aria-label="About">
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <div className="grid items-start gap-14 md:grid-cols-[auto_1fr] md:gap-20">
            {/* Headshot placeholder — swap with real image once available */}
            <div
              className="relative shrink-0 overflow-hidden rounded-lg bg-sand border border-border mx-auto md:mx-0"
              style={{ width: 180, height: 220 }}
            >
              <Image
                src="/images/headshot.png"
                alt="Alec Stephens"
                fill
                className="object-cover object-center"
                sizes="180px"
              />
            </div>

            {/* Text */}
            <div>
              <h2 className="font-heading text-3xl font-medium tracking-tight text-black md:text-4xl">
                About
              </h2>

              <div className="mt-8 max-w-2xl space-y-5">
                <p className="text-lg leading-relaxed text-ink-60">
                  I lead every engagement personally. Strategy, architecture,
                  and build. No account managers, no handoffs. The person on
                  the call is the person building your system.
                </p>
                <p className="text-lg leading-relaxed text-ink-60">
                  I&apos;ve worked with clients in the US, Japan, South Korea,
                  and around the world, building everything from AI learning apps
                  to complex workflow automations. Every project starts with
                  understanding how your business actually works.
                </p>
              </div>

              <a
                href="https://www.linkedin.com/in/alec-stephens-55b392213/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-salmon transition-colors hover:text-salmon-deep"
              >
                LinkedIn
                <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
