import { Hero } from "@/components/sections/hero";
import { StatsBar } from "@/components/sections/stats-bar";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CaseStudies } from "@/components/sections/case-studies";
import { About } from "@/components/sections/about";
import { ContactCTA } from "@/components/sections/contact-cta";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, CONTACT_EMAIL } from "@/lib/constants";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    serviceType: [
      "AI Automation",
      "Workflow Consulting",
      "Custom Integration",
      "AI Application Development",
    ],
    email: CONTACT_EMAIL,
    areaServed: ["United States", "Japan", "Worldwide"],
    founder: {
      "@type": "Person",
      name: "Alec Stephens",
      jobTitle: "AI Automation Consultant",
    },
    knowsAbout: [
      "n8n",
      "Make.com",
      "Claude API",
      "OpenAI",
      "Next.js",
      "PostgreSQL",
      "Workflow Automation",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <StatsBar />
      <Services />
      <HowItWorks />
      <CaseStudies />
      <About />
      <ContactCTA />
    </>
  );
}
