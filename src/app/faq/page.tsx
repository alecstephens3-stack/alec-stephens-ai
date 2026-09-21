import type { Metadata } from "next";
import Link from "next/link";
import { FAQ, FAQ_SECTION, SITE_URL, CALENDLY, CONTACT } from "@/lib/content";

/**
 * The FAQ, moved off the homepage in the v6 trim. It is prose on its own page
 * rather than an accordion, so every answer is readable at full size and the
 * patient-data answer is not hidden behind a click. The FAQPage JSON-LD moved
 * here with it.
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
      <div className="mx-auto max-w-[720px]">
        <p className="draft-crop t-label">{FAQ_SECTION.kicker}</p>
        <h1 className="t-title mt-5">{FAQ_SECTION.title}</h1>
        <p className="t-body mt-5 max-w-[48ch]">{FAQ_SECTION.summary}</p>

        <div className="mt-[var(--draft-air-tight)] space-y-12">
          {FAQ.map((item) => (
            <section key={item.q}>
              <h2 className="font-heading text-[21px] font-medium leading-[1.3] text-ink md:text-[23px]">
                {item.q}
              </h2>
              <p className="t-body mt-4">{item.a}</p>
            </section>
          ))}
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
