import type { Metadata } from "next";
import { HomeBody } from "@/components/sections/v7/home-body";
import { HtmlLang } from "@/components/layout/html-lang";
import { SITE_NAME, SITE_URL } from "@/lib/content";
import { KR_PATH, SITE_DESCRIPTION_KO, SITE_TAGLINE_KO } from "@/lib/content.ko";

/**
 * The home page in Korean (2026-10-12), for the investors and dealmakers Ju
 * Sheen meets in Seoul; the card QR (/card) sends Korean phones here.
 *
 * Same sections as the English home page, rendered with HOME_KO. Unlike /jp
 * (a separate page for Japanese construction clients, one static HTML file),
 * this is the same page in another language, so it shares the components and
 * cannot drift from the English one. Only the home page is translated; the
 * FAQ, case studies and legal pages stay English and are labelled (영문).
 */

const TITLE = `${SITE_NAME} | ${SITE_TAGLINE_KO}`;
const URL = `${SITE_URL}${KR_PATH}`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: SITE_DESCRIPTION_KO,
  alternates: {
    canonical: URL,
    languages: { en: SITE_URL, ko: URL, "x-default": SITE_URL },
  },
  // Replaces the layout's openGraph whole, so the image is restated.
  openGraph: {
    type: "website",
    locale: "ko_KR",
    alternateLocale: ["en_US"],
    url: URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: SITE_DESCRIPTION_KO,
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: SITE_DESCRIPTION_KO,
    images: ["/og-image.png"],
  },
};

export default function KoreanHome() {
  return (
    <>
      {/* Before the first paint on a full load; HtmlLang covers client-side navigation. */}
      <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.lang="ko"' }} />
      <HtmlLang lang="ko" />
      <div lang="ko">
        <HomeBody locale="ko" />
      </div>
    </>
  );
}
