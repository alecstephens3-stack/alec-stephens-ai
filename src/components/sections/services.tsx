import { SERVICES } from "@/lib/constants";
import { SectionHeader } from "@/components/ui/section-header";
import { Card } from "@/components/ui/card";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";

const icons: Record<string, React.ReactNode> = {
  workflow: (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3z" />
      <path d="M17.5 14v3.5a3 3 0 01-3 3H14" />
      <path d="M14 17.5h7" />
    </svg>
  ),
  strategy: (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 20h20M5 20V10l4-4 4 4 4-8 4 4v14" />
    </svg>
  ),
  integration: (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M8.5 8.5l7 7M15 6h3v3M9 18H6v-3" />
    </svg>
  ),
  development: (
    <svg
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 9l3 3-3 3M13 15h3" />
      <rect x="3" y="4" width="18" height="16" rx="2" />
    </svg>
  ),
};

export function Services() {
  return (
    <section
      id="services"
      className="bg-warm-white py-24"
      aria-label="Services"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          label="Services"
          heading="What I Do"
          description="End-to-end AI automation, from figuring out the strategy to getting it running in production."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <AnimateOnScroll key={service.title} delay={index * 100}>
              <Card className="h-full">
                <div className="mb-4 text-terracotta">
                  {icons[service.icon]}
                </div>
                <h3 className="font-heading text-xl font-semibold text-black">
                  {service.title}
                </h3>
                <p className="mt-2 leading-relaxed text-warm-gray">
                  {service.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {service.capabilities.map((cap) => (
                    <li
                      key={cap}
                      className="flex items-center gap-2 text-sm text-warm-gray"
                    >
                      <div className="h-1 w-1 rounded-full bg-terracotta" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </Card>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
