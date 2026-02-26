import { TECH_STACK } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Badge } from "@/components/ui/badge";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-deep-earth py-24" aria-label="About">
      {/* Ambient terracotta glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-32 z-0 h-[600px] w-[600px]"
        style={{ background: "radial-gradient(circle, rgba(220,104,67,0.07) 0%, transparent 65%)" }}
      />
      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="About"
          heading="Built by Someone Who Gets It"
          light
        />

        <div className="grid gap-12 md:grid-cols-2">
          <AnimateOnScroll>
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-white/80">
                I&apos;m not an agency. I&apos;m an independent consultant who
                does the strategy work and the technical work. When you hire me,
                you&apos;re talking directly to the person building your
                solution. No project managers, no handoffs.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                I&apos;ve worked with clients in the USA, Japan, and around
                the world, building everything from AI-powered learning apps to
                complex multi-step workflow automations. My background in
                full-stack development and business process analysis means I
                don&apos;t just build automations. I find the ones that will
                actually make a difference for your bottom line.
              </p>
              <p className="text-lg leading-relaxed text-white/80">
                Every project starts with understanding how your business
                actually works. From there, I build solutions that are reliable,
                easy to maintain, and genuinely useful. Not flashy demos that
                break the first time something unexpected happens.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {TECH_STACK.map((tech) => (
                  <Badge key={tech} className="bg-white/10 text-white/80">
                    {tech}
                  </Badge>
                ))}
              </div>

              <div className="mt-10 space-y-6">
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
                    What I Focus On
                  </h3>
                  <ul className="space-y-3">
                    {[
                      "Automations that handle edge cases without breaking",
                      "Solutions built to last, not just to demo well",
                      "Clear documentation so your team can understand the system",
                      "Measurable ROI, not technology for its own sake",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-white/70"
                      >
                        <div className="mt-2 h-1 w-1 shrink-0 rounded-full bg-terracotta" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
