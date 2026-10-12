import { CHROME_EN, HOME_EN, type ChromeCopy, type HomeCopy } from "./content";
import { CHROME_KO, HOME_KO, KR_PATH } from "./content.ko";

/**
 * Two languages, one page each way: the English site, and its home page in
 * Korean at /kr (2026-10-12). The URL says kr; the language code is ko, which
 * is what lang attributes and hreflang take.
 */
export type Locale = "en" | "ko";

/** The header, footer and skip link sit in the root layout and read the language off the path. */
export function localeFromPath(pathname: string | null): Locale {
  return pathname === KR_PATH || pathname?.startsWith(`${KR_PATH}/`) ? "ko" : "en";
}

export function homeCopy(locale: Locale): HomeCopy {
  return locale === "ko" ? HOME_KO : HOME_EN;
}

export function chromeCopy(locale: Locale): ChromeCopy {
  return locale === "ko" ? CHROME_KO : CHROME_EN;
}
