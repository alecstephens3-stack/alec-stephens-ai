import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, FAQ_SECTION, SITE_URL, CALENDLY, CONTACT } from "@/lib/content";
import { FaqTopics } from "@/components/sections/faq/faq-topics";

/**
 * The FAQ, on its own page since the v6 trim. Rebuilt 16 Nov 2026 as "Topics":
 * grouped questions that open on click, with the patient-data answers open from
 * the start so that answer is never hidden. The FAQPage JSON-LD lives here.
 */
export const metadata: Metadata = {
  title: "Questions clinics ask | Stephens AI",
  description: FAQ_SECTION.summary,
  alternates: { canonical: `${SITE_URL}/faq` },
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/faq#faq`,
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="px-5 pb-[var(--draft-air)] pt-[120px] md:px-8 md:pt-[160px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="mx-auto max-w-[1040px]">
        <p className="draft-crop t-label">{FAQ_SECTION.kicker}</p>
        <h1 className="t-title mt-5 max-w-[20ch]">{FAQ_SECTION.title}</h1>
        <p className="t-body mt-5 max-w-[48ch]">{FAQ_SECTION.summary}</p>

        <div className="mt-[var(--draft-air-tight)]">
          <FaqTopics />
        </div>

        <p className="t-body mt-[var(--draft-air-tight)] border-t border-rule pt-10">
          <strong>{CONTACT.title}</strong>{" "}
          <a
            href={CALENDLY}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent-deep"
          >
            {CONTACT.bookLabel} &rarr;
          </a>{" "}
          <Link href="/" className="t-fine underline underline-offset-4">
            Back to the homepage
          </Link>
        </p>
      </div>
    </div>
  );
}
