import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// Fixed date, not `new Date()`. Re-stamping every page as modified on every
// build teaches crawlers the signal is worthless.
const LAST_CONTENT_CHANGE = new Date("2026-08-14");
const JP_PAGE_PUBLISHED = new Date("2026-08-31");

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
  ];
}
