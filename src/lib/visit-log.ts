/**
 * The visit log: one row per real page view, written to a Google Sheet that
 * Stephens AI owns (the Apps Script web app behind VISIT_LOG_URL). It runs in
 * the proxy, on the server, so it needs no cookie, no script in the page, and
 * an ad blocker cannot switch it off. No IP address is stored: the "visitor"
 * value is a hash of IP + browser + a salt that changes every day, enough to
 * count people per day and nothing more.
 *
 * Kept free of Next imports so the rules (what counts as a bot, how a source
 * is named) can be read and tested on their own.
 */

export type VisitRow = {
  time: string;
  page: string;
  type: "Landing" | "Next page";
  source: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  tag: string;
  city: string;
  region: string;
  country: string;
  device: string;
  browser: string;
  os: string;
  language: string;
  visitor: string;
};

export const SITE_HOST = "stephensai.co";
export const OPT_OUT_COOKIE = "sai_notrack";

const BOT_UA =
  /bot|crawl|spider|slurp|preview|scan|monitor|fetch|headless|lighthouse|pagespeed|facebookexternalhit|embedly|whatsapp|telegram|discord|slack|skype|vercel|curl|wget|python|axios|node-fetch|go-http|java\/|okhttp|httpclient|postman|insomnia|phantom|selenium|playwright|puppeteer/i;

export function isBot(ua: string | null): boolean {
  return !ua || ua.length < 20 || BOT_UA.test(ua);
}

/** Pages worth counting: no files (images, fonts, txt) except .html. */
export function isPagePath(path: string): boolean {
  const last = path.split("/").pop() ?? "";
  return !last.includes(".") || last.endsWith(".html");
}

/** Static pages are served as /x/index.html; log them as /x. */
export function cleanPath(path: string): string {
  const p = path.replace(/\/index\.html$/, "") || "/";
  return p.length > 1 ? p.replace(/\/$/, "") : p;
}

// Order matters: Gemini lives on a google.com subdomain, Gmail too.
const SOURCES: [RegExp, string][] = [
  [/(^|\.)stephensai\.co$/, "(inside the site)"],
  [/(^|\.)alecstephens\.tech$/, "alecstephens.tech"],
  [/^gemini\.google\./, "Gemini"],
  [/^mail\.google\./, "Email (Gmail)"],
  [/(^|\.)google\./, "Google search"],
  [/(^|\.)bing\.com$/, "Bing"],
  [/(^|\.)duckduckgo\.com$/, "DuckDuckGo"],
  [/(^|\.)yahoo\./, "Yahoo"],
  [/(^|\.)(linkedin\.com|lnkd\.in)$/, "LinkedIn"],
  [/(^|\.)(chatgpt\.com|openai\.com)$/, "ChatGPT"],
  [/(^|\.)perplexity\.ai$/, "Perplexity"],
  [/(^|\.)claude\.ai$/, "Claude"],
  [/(^|\.)(facebook\.com|fb\.com|fb\.me)$/, "Facebook"],
  [/(^|\.)instagram\.com$/, "Instagram"],
  [/(^|\.)(x\.com|twitter\.com|t\.co)$/, "X"],
  [/(^|\.)(youtube\.com|youtu\.be)$/, "YouTube"],
  [/(^|\.)upwork\.com$/, "Upwork"],
  [/(^|\.)(outlook\.|live\.com|office\.com)/, "Email (Outlook)"],
  [/(^|\.)medariadvisors\.com$/, "Medari"],
];

const UTM_NAMES: Record<string, string> = {
  medari: "Medari (Curtis)",
  card: "Business card QR",
  linkedin: "LinkedIn",
  instantly: "Cold email",
  email: "Email",
  upwork: "Upwork",
};

export function nameSource(utmSource: string, referrer: string): string {
  if (utmSource) return UTM_NAMES[utmSource.toLowerCase()] ?? utmSource;
  if (!referrer) return "Direct (typed, bookmark or app)";
  let host = "";
  try {
    host = new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "Unknown";
  }
  for (const [re, name] of SOURCES) if (re.test(host)) return name;
  return host;
}

/** Referrer without its query string, which can carry search terms or ids. */
export function shortReferrer(referrer: string): string {
  try {
    const u = new URL(referrer);
    return u.hostname + (u.pathname === "/" ? "" : u.pathname);
  } catch {
    return "";
  }
}

export function describeAgent(ua: string): {
  device: string;
  browser: string;
  os: string;
} {
  const device = /iPad|Tablet/i.test(ua)
    ? "Tablet"
    : /Mobi|iPhone|Android/i.test(ua)
      ? "Phone"
      : "Computer";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /SamsungBrowser/.test(ua)
        ? "Samsung"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Chrome\/|CriOS/.test(ua)
            ? "Chrome"
            : /Safari\//.test(ua)
              ? "Safari"
              : "Other";
  const os = /iPhone|iPad|iPod/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
        ? "Windows"
        : /Mac OS X|Macintosh/.test(ua)
          ? "Mac"
          : /CrOS/.test(ua)
            ? "ChromeOS"
            : /Linux/.test(ua)
              ? "Linux"
              : "Other";
  return { device, browser, os };
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

export function countryName(code: string): string {
  if (!code) return "";
  try {
    return regionNames.of(code.toUpperCase()) ?? code;
  } catch {
    return code;
  }
}

/**
 * One row from a request's headers. Vercel adds the x-vercel-ip-* location
 * headers to every request; they are absent locally, so location is blank.
 */
export async function buildRow(
  h: Headers,
  page: string,
  query: URLSearchParams,
  referrer: string,
  secret: string,
): Promise<VisitRow> {
  const ua = h.get("user-agent") ?? "";
  const utmSource = query.get("utm_source") ?? "";
  const internal = /(^|\.)stephensai\.co$/.test(hostOf(referrer));
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim();
  const now = new Date();
  return {
    time: now.toISOString(),
    page: cleanPath(page),
    type: internal ? "Next page" : "Landing",
    source: nameSource(utmSource, referrer),
    referrer: shortReferrer(referrer),
    utmSource,
    utmMedium: query.get("utm_medium") ?? "",
    utmCampaign: query.get("utm_campaign") ?? "",
    tag: query.get("utm_content") ?? query.get("ref") ?? "",
    city: decode(h.get("x-vercel-ip-city")),
    region: h.get("x-vercel-ip-country-region") ?? "",
    country: countryName(h.get("x-vercel-ip-country") ?? ""),
    ...describeAgent(ua),
    language: (h.get("accept-language") ?? "").split(",")[0],
    visitor: await visitorId(secret, ip, ua, now.toISOString().slice(0, 10)),
  };
}

export async function sendRow(
  endpoint: string,
  secret: string,
  row: VisitRow,
): Promise<void> {
  try {
    await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, row }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    console.error("visit log write failed", err);
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

function decode(v: string | null): string {
  if (!v) return "";
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

export async function visitorId(
  secret: string,
  ip: string,
  ua: string,
  day: string,
): Promise<string> {
  const data = new TextEncoder().encode(`${secret}|${day}|${ip}|${ua}`);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash).slice(0, 6))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
