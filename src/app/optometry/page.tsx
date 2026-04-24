import type { Metadata } from "next";
import { OptometryHero } from "@/components/sections/optometry/hero";
import { OptometryProblem } from "@/components/sections/optometry/problem";
import { OptometryFlagship } from "@/components/sections/optometry/flagship";
import { OptometryModules } from "@/components/sections/optometry/modules";
import { OptometryConnection } from "@/components/sections/optometry/connection";
import { OptometryCta } from "@/components/sections/optometry/cta";
import { OPTOMETRY_META } from "@/lib/optometry";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  title: OPTOMETRY_META.title,
  description: OPTOMETRY_META.description,
  alternates: { canonical: `${SITE_URL}${OPTOMETRY_META.path}` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}${OPTOMETRY_META.path}`,
    siteName: SITE_NAME,
    title: `${OPTOMETRY_META.title} | ${SITE_NAME}`,
    description: OPTOMETRY_META.description,
    images: [{ url: "/og/optometry.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${OPTOMETRY_META.title} | ${SITE_NAME}`,
    description: OPTOMETRY_META.description,
    images: ["/og/optometry.png"],
  },
};

export default function OptometryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Stephens AI for eyecare",
    description: OPTOMETRY_META.description,
    provider: {
      "@type": "ProfessionalService",
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: "United States",
    serviceType: [
      "Practice Intelligence Dashboard",
      "Booking Guardian",
      "Recall and Reactivation",
      "Reputation and Reviews",
      "Insurance Verification",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Independent eyecare practices",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <OptometryHero />
      <OptometryProblem />
      <OptometryFlagship />
      <OptometryModules />
      <OptometryConnection />
      <OptometryCta />
    </>
  );
}
