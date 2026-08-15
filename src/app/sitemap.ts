import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

// Fixed date, not `new Date()`. Re-stamping every page as modified on every
// build teaches crawlers the signal is worthless.
const LAST_CONTENT_CHANGE = new Date("2026-08-14");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_CONTENT_CHANGE,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
