import { Hero } from "@/components/sections/v4/hero";
import {
  Problem,
  Playbook,
  Proof,
  Timeline,
  Ownership,
  Faq,
  Founders,
} from "@/components/sections/v4/body";
import { Leak } from "@/components/sections/v4/leak";
import { Pricing } from "@/components/sections/v4/pricing";
import { Contact } from "@/components/sections/v4/contact";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  FAQ,
  PRICING_TIERS,
} from "@/lib/content";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}#business`,
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        email: CONTACT_EMAIL,
        areaServed: ["United States", "Worldwide"],
        serviceType: [
          "Front desk knowledge base for eyecare practices",
          "Practice operations automation",
          "Custom internal software",
        ],
        founder: [
          { "@type": "Person", name: "Alec Stephens", jobTitle: "Co founder" },
          { "@type": "Person", name: "Jusheen Kim", jobTitle: "Co founder" },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Eyecare practice systems",
          itemListElement: PRICING_TIERS.map((tier) => ({
            "@type": "Offer",
            name: tier.name,
            description: tier.summary,
            price: tier.setup.replace(/[$,]/g, ""),
            priceCurrency: "USD",
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}#faq`,
        mainEntity: FAQ.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Problem />
      <Playbook />
      <Proof />
      <Leak />
      <Pricing />
      <Timeline />
      <Ownership />
      <Faq />
      <Founders />
      <Contact />
    </>
  );
}
