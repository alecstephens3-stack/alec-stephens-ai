import { Hero } from "@/components/sections/v6/hero";
import { Proof } from "@/components/sections/v6/proof";
import { How } from "@/components/sections/v6/how";
import { Founders } from "@/components/sections/v6/founders";
import { Patient } from "@/components/sections/v6/patient";
import { Contact } from "@/components/sections/v6/contact";
import {
  SITE_NAME,
  SITE_URL,
  SITE_DESCRIPTION,
  CONTACT_EMAIL,
  LINKEDIN_URL,
} from "@/lib/content";

/**
 * DRAFT v6 homepage. Seven things, each said once:
 * the hero slot and the headline, the proof (quote, number, demonstration),
 * how a project goes, the two founders, the patient-data answer, one CTA.
 *
 * The FAQ moved to /faq, which is where the FAQPage JSON-LD went with it.
 */
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
          { "@type": "Person", name: "Alec Stephens", jobTitle: "Co-founder" },
          { "@type": "Person", name: "Jusheen Kim", jobTitle: "Co-founder" },
        ],
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
      <Proof />
      <How />
      <Founders />
      <Patient />
      <Contact />
    </>
  );
}
