import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_EMAIL } from "@/lib/content";

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

const FROM = process.env.CONTACT_FROM_EMAIL ?? "Stephens AI <hello@stephensai.co>";

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
    hits.set(ip, [...recent, now]);
    if (hits.size > 5000) hits.clear();

    const body = await request.json();
    const { name, email, message, website } = body ?? {};

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

    if (!resend) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json(
        { error: `Our form is down. Please email ${CONTACT_EMAIL} directly.` },
        { status: 503 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: FROM,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `New consultation request from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, "", "Message:", message].join(
        "\n"
      ),
    });

    if (error) {
      console.error("Resend send failed:", error);
      return NextResponse.json(
        {
          error: `We couldn't send that. Please email ${CONTACT_EMAIL} directly.`,
        },
        { status: 502 }
      );
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
