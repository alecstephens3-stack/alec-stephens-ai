"use client";

import { usePathname } from "next/navigation";
import { chromeCopy, localeFromPath } from "@/lib/i18n";

/** The first Tab stop on every page, in the page's language. */
export function SkipLink() {
  const t = chromeCopy(localeFromPath(usePathname()));
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-cream"
    >
      {t.skip}
    </a>
  );
}
