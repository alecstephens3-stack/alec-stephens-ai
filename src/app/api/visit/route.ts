import { after } from "next/server";
import type { NextRequest } from "next/server";
import {
  OPT_OUT_COOKIE,
  SITE_HOST,
  buildRow,
  isBot,
  isPagePath,
  sendRow,
} from "@/lib/visit-log";

export const dynamic = "force-dynamic";

/**
 * Receives VisitBeacon's page changes inside the app. Only accepts a request
 * from our own pages (same-origin, real browser), and only a plain path, so
 * nobody can write arbitrary text into the log. Always answers 204: the
 * beacon never reads the reply.
 */
export async function POST(request: NextRequest) {
  const endpoint = process.env.VISIT_LOG_URL;
  const secret = process.env.VISIT_LOG_SECRET;
  const h = request.headers;
  const ok =
    endpoint &&
    secret &&
    (request.nextUrl.hostname === SITE_HOST ||
      process.env.VISIT_LOG_ANY_HOST === "1") &&
    h.get("sec-fetch-site") === "same-origin" &&
    !request.cookies.get(OPT_OUT_COOKIE) &&
    !isBot(h.get("user-agent"));

  if (ok) {
    let path = "";
    try {
      const body = JSON.parse(await request.text());
      path = typeof body?.path === "string" ? body.path : "";
    } catch {}
    if (/^\/[A-Za-z0-9\-_/.]{0,120}$/.test(path) && isPagePath(path)) {
      const row = await buildRow(
        h,
        path,
        new URLSearchParams(),
        `https://${SITE_HOST}/`,
        secret,
      );
      after(() => sendRow(endpoint, secret, row));
    }
  }
  return new Response(null, { status: 204 });
}
