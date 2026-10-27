import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";
import {
  OPT_OUT_COOKIE,
  SITE_HOST,
  buildRow,
  isBot,
  isPagePath,
  sendRow,
} from "@/lib/visit-log";

/**
 * Logs every full page load to the visit log (see src/lib/visit-log.ts): the
 * moment someone arrives, with where they came from, plus the static pages
 * (/jp, /alec/*, the case study) that never load React. The row is sent with
 * waitUntil, after the page has gone back to the visitor, so a slow or failed
 * write never slows the site down.
 *
 * Clicks from one page to another inside the app never reach this proxy as a
 * page load (Next serves them from its own cache, and strips its navigation
 * headers before the proxy runs), so VisitBeacon reports those to /api/visit.
 *
 * Counted: Sec-Fetch-Dest: document, which browsers send on a page load and
 * bots almost never do. Not counted: prefetches, files, preview deployments,
 * bots, and anyone carrying the opt-out cookie.
 *
 * Our own visits: open stephensai.co/?notrack=1 once on each browser to stop
 * counting it, ?notrack=0 to count it again. The cookie only ever exists on
 * browsers that asked for it.
 */
export function proxy(request: NextRequest, event: NextFetchEvent) {
  const url = request.nextUrl;

  const notrack = url.searchParams.get("notrack");
  if (notrack === "1" || notrack === "0") {
    const res = NextResponse.next();
    if (notrack === "1") {
      res.cookies.set(OPT_OUT_COOKIE, "1", {
        maxAge: 60 * 60 * 24 * 730,
        path: "/",
        sameSite: "lax",
        secure: true,
      });
    } else {
      res.cookies.delete(OPT_OUT_COOKIE);
    }
    return res;
  }

  const endpoint = process.env.VISIT_LOG_URL;
  const secret = process.env.VISIT_LOG_SECRET;
  if (
    endpoint &&
    secret &&
    request.method === "GET" &&
    (url.hostname === SITE_HOST || process.env.VISIT_LOG_ANY_HOST === "1") &&
    !request.cookies.get(OPT_OUT_COOKIE) &&
    isPagePath(url.pathname) &&
    request.headers.get("sec-fetch-dest") === "document" &&
    !isBot(request.headers.get("user-agent"))
  ) {
    event.waitUntil(
      buildRow(
        request.headers,
        url.pathname,
        url.searchParams,
        request.headers.get("referer") ?? "",
        secret,
      ).then((row) => sendRow(endpoint, secret, row)),
    );
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "next-router-segment-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
