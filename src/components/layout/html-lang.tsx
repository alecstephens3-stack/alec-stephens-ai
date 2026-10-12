"use client";

import { useEffect } from "react";

/**
 * The root layout renders <html lang="en">, and only it can render <html>.
 * A page in another language renders this to set the attribute while it is
 * open, and to put "en" back on the way out (client-side navigation keeps the
 * same <html>). The page also sets it with an inline script, so a full page
 * load is right before the first paint; this covers navigation in and out.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    return () => {
      root.lang = "en";
    };
  }, [lang]);
  return null;
}
