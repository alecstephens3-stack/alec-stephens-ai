import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  if (process.env.DRAFT_NOINDEX) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
