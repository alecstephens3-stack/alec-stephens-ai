import { Hero } from "@/components/sections/v5/hero";
import { Day } from "@/components/sections/v5/day";
import { Proof } from "@/components/sections/v5/proof";
import { How } from "@/components/sections/v5/how";
import { Founders } from "@/components/sections/v5/founders";
import { Faq } from "@/components/sections/v5/faq";
import { Contact } from "@/components/sections/v5/contact";
import type { Metadata } from "next";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  LINKEDIN_URL,
  FAQ,
} from "@/lib/content";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}#business`,
        name: SITE_NAME,
        legalName: "Stephens AI LLC",
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        email: CONTACT_EMAIL,
        logo: `${SITE_URL}/logo-light.svg`,
        image: `${SITE_URL}/og-image.png`,
        sameAs: [
          LINKEDIN_URL,
          "https://www.linkedin.com/in/alec-stephens-55b392213/",
          "https://www.linkedin.com/in/jusheenkim",
        ],
        areaServed: ["United States"],
        serviceType: [
          "Custom office tools for healthcare clinics",
          "Front desk knowledge base",
          "Practice operations automation",
        ],
        founder: [
          {
            "@type": "Person",
            "@id": `${SITE_URL}/alec#person`,
            name: "Alec Stephens",
            jobTitle: "Co-founder",
            url: `${SITE_URL}/alec`,
            sameAs: ["https://www.linkedin.com/in/alec-stephens-55b392213/"],
          },
          {
            "@type": "Person",
            name: "Jusheen Kim",
            jobTitle: "Co-founder",
            sameAs: ["https://www.linkedin.com/in/jusheenkim"],
          },
        ],
      },
      {
        // Tells Google the site's name is "Stephens AI", so results show the
        // brand rather than the bare domain.
        "@type": "WebSite",
        "@id": `${SITE_URL}#website`,
        name: SITE_NAME,
        alternateName: ["Stephens AI LLC", "stephensai.co"],
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}#business` },
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
        dangerouslySetInnerHTML={{
          // Escaping "<" so a future copy string containing </script> cannot
          // break out of the tag and take the page with it.
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Hero />
      <Day />
      <Proof />
      <How />
      <Founders />
      <Faq />
      <Contact />
    </>
  );
}
