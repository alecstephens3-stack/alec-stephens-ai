import type { Metadata } from "next";
import { BenchStage } from "@/components/bench/bench-stage";
import { SITE } from "@/components/bench";
import { SITE_URL } from "@/lib/content";

/**
 * /alec: Alec's bench, the portfolio on the desk engine (2026-09-23). Replaces
 * the static card gallery that public/alec/index.html served; that file stays
 * reachable at /alec/index.html. The per-build pages at /alec/<slug> are still
 * the static ones.
 */
export const metadata: Metadata = {
  title: { absolute: SITE.title },
  description: SITE.description,
  alternates: { canonical: `${SITE_URL}/alec` },
  openGraph: {
    type: "profile",
    url: `${SITE_URL}/alec`,
    title: SITE.title,
    description: SITE.description,
    images: [{ url: "/og-image.png" }],
  },
};

// Who this page is about, for search engines: ties the name "Alec Stephens"
// to this page, his profiles and the company, so a name search finds it.
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/alec#person`,
  name: "Alec Stephens",
  url: `${SITE_URL}/alec`,
  jobTitle: "Co-founder",
  email: `mailto:${SITE.email}`,
  worksFor: { "@type": "Organization", "@id": `${SITE_URL}#business`, name: "Stephens AI", url: SITE_URL },
  sameAs: [SITE.linkedin, SITE.github],
};

export default function AlecPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
      <BenchStage />
    </>
  );
}
