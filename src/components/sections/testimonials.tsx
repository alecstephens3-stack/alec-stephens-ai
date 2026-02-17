import { TESTIMONIALS } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

export function Testimonials() {
  return (
    <section className="bg-cream py-24" aria-label="Testimonials">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Testimonials"
          heading="What Clients Say"
          description="Placeholder testimonials for now. Real reviews coming soon."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <AnimateOnScroll key={index} delay={index * 100}>
              <Card className="relative h-full">
                {/* Quote mark */}
                <div className="mb-4 font-heading text-5xl leading-none text-terracotta/20">
                  &ldquo;
                </div>
                <p className="text-warm-gray leading-relaxed italic">
                  {testimonial.quote}
                </p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-heading text-sm font-semibold text-black">
                    {testimonial.name}
                  </p>
                  {testimonial.title && (
                    <p className="text-xs text-warm-gray">
                      {testimonial.title}
                      {testimonial.company && `, ${testimonial.company}`}
                    </p>
                  )}
                </div>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
