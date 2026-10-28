import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL, CONTACT_EMAIL_JUSHEEN } from "@/lib/content";

export const dynamic = "force-dynamic";

/**
 * The Resend SDK does NOT throw on an API error. It returns { data, error },
 * so `await resend.emails.send(...)` followed by a bare success response told
 * every visitor "Message sent." while the mail was being rejected. On a site
 * whose only conversion is this form, that is lost revenue with no signal.
 * The error branch is now explicit.
 */

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Defaults to Resend's sandbox sender ON PURPOSE. It only delivers to the
// Resend account owner's own address, which is a real limitation, but it is a
// limitation that WORKS today. Pointing this at hello@stephensai.co before the
// domain is verified in Resend would 403 every single submission and turn a
// partly-working form into a fully broken one on merge.
// Once stephensai.co (or send.stephensai.co) shows Verified in Resend, set
// CONTACT_FROM_EMAIL in Vercel and this default stops being used.
const FROM =
  process.env.CONTACT_FROM_EMAIL ?? "Stephens AI <onboarding@resend.dev>";

// Where the message is delivered. The sandbox sender above only delivers to the
// Resend account owner's own address, so since the v4 rebuild (2026-08-14)
// moved CONTACT_EMAIL to alec@stephensai.co, every send was rejected with a 502
// (found 2026-10-28). Deliver to the owner address until stephensai.co is
// verified in Resend; then set CONTACT_FROM_EMAIL and CONTACT_TO_EMAIL in Vercel.
const OWNER = "alecstephens3@gmail.com";
const TO = process.env.CONTACT_TO_EMAIL ?? OWNER;
const SANDBOX = !process.env.CONTACT_FROM_EMAIL;

/**
 * Health check for the weekly monitor (Hermes cron, texts Alec only on a fail).
 * It can't prove a delivery without sending one, so it checks the two settings
 * that broke it before: a key exists, and the sandbox sender is only pointed at
 * the one address it can deliver to. No addresses or keys are returned.
 */
export async function GET() {
  const ok = !!resend && (!SANDBOX || TO === OWNER);
  return NextResponse.json(
    { ok, key: !!resend, sender: SANDBOX ? "sandbox" : "verified", recipientAllowed: !SANDBOX || TO === OWNER },
    { status: ok ? 200 : 500 },
  );
}

// Per-instance throttle. Good enough for a marketing form; swap for a shared
// store if the site ever runs on more than a handful of lambdas.
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 3;

const LIMITS = { name: 100, email: 200, message: 5000 } as const;

export async function POST(request: Request) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many messages. Please try again in a minute." },
        { status: 429 }
      );
    }
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    const { name, email, message, website, locale, subject } = body ?? {};
    // Sent by the Korean page (/kr). Anything else is treated as English.
    const korean = locale === "ko";

    // Honeypot: bots fill every field. Accept silently so they stop retrying.
    if (website) return NextResponse.json({ success: true });

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string"
    ) {
      return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
    }

    if (!name.trim() || !email.trim() || !message.trim()) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    if (
      name.length > LIMITS.name ||
      email.length > LIMITS.email ||
      message.length > LIMITS.message
    ) {
      return NextResponse.json(
        { error: "That message is too long to send. Please shorten it." },
        { status: 400 }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // Count the attempt only once it is a real send. Counting before
    // validation locked out anyone who mistyped their email three times.
    hits.set(ip, [...recent, now]);
    if (hits.size > 5000) hits.clear();

    if (!resend) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: `Our form is down. Please email ${CONTACT_EMAIL} directly.` },
        { status: 503 }
      );
    }

    const mail = {
      from: FROM,
      replyTo: email,
      // A page of our own (a client's picks page) can name its own subject line.
      subject:
        typeof subject === "string" && subject.trim()
          ? subject.trim().slice(0, 120)
          : `${korean ? "[KR] " : ""}New consultation request from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join(
        "\n"
      ),
    };
    let { data, error } = await resend.emails.send({ ...mail, to: TO });

    // Safety net: if the main address is ever refused, send it to the one
    // address the account always accepts, so a visitor's message is never lost.
    if (error && TO !== OWNER) {
      console.error("Resend send failed, retrying to the owner address:", error);
      ({ data, error } = await resend.emails.send({ ...mail, to: OWNER, subject: `[Form fallback] ${mail.subject}` }));
    }

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json(
        {
          error: `We couldn't send that. Please email ${CONTACT_EMAIL} directly.`,
        },
        { status: 502 }
      );
    }

    // Korean messages also go to Jusheen, who reads Korean. A separate send on
    // purpose: on the sandbox sender (CONTACT_FROM_EMAIL unset) Resend rejects
    // any recipient but the account owner, and as a second `to` that would sink
    // the whole message. This way the visitor's message always reaches
    // CONTACT_EMAIL, the [KR] subject tells its reader to pass it on, and a
    // failed copy is logged, never shown as a failure to the visitor.
    if (korean) {
      try {
        const copy = await resend.emails.send({ ...mail, to: CONTACT_EMAIL_JUSHEEN });
        if (copy.error) console.error("Resend copy to Jusheen failed:", copy.error);
      } catch (copyError) {
        console.error("Resend copy to Jusheen threw:", copyError);
      }
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: `Something went wrong. Please email ${CONTACT_EMAIL} directly.` },
      { status: 500 }
    );
  }
}
