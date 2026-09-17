import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// Fixed date, not `new Date()`. Re-stamping every page as modified on every
// build teaches crawlers the signal is worthless.
const LAST_CONTENT_CHANGE = new Date("2026-09-16");
const JP_PAGE_PUBLISHED = new Date("2026-08-31");
const PORTFOLIO_PUBLISHED = new Date("2026-09-16");
const LEGAL_PUBLISHED = new Date("2026-09-17");
const PORTFOLIO_SLUGS = [
  "knowledge-base", "pto-payroll", "invoice-agent", "ai-lab",
  "coaching-aios", "construction-site", "curriculum-system", "aios",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      // Japanese landing page for construction clients. Static file in public/jp,
      // reachable at /jp via the rewrite in next.config.ts.
      url: `${SITE_URL}/jp`,
      lastModified: JP_PAGE_PUBLISHED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      // Alec's portfolio index. Static files in public/alec, rewrites in next.config.ts.
      url: `${SITE_URL}/alec`,
      lastModified: PORTFOLIO_PUBLISHED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/case-studies/front-desk-knowledge-base`,
      lastModified: LEGAL_PUBLISHED,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...["privacy", "terms"].map((slug) => ({
      url: `${SITE_URL}/${slug}`,
      lastModified: LEGAL_PUBLISHED,
      changeFrequency: "yearly" as const,
      priority: 0.3,
    })),
    ...PORTFOLIO_SLUGS.map((slug) => ({
      url: `${SITE_URL}/alec/${slug}`,
      lastModified: PORTFOLIO_PUBLISHED,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
