import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL, CALENDLY } from "@/lib/content";

/**
 * The footer kept reading as an empty bar, and the reason was structural rather
 * than a padding value: a 1080px pane was holding a single thin row of three
 * items, so most of its area was gap. Widening the gaps or shrinking the padding
 * only ever moved the emptiness around.
 *
 * So it gets real content instead. Three columns of links, which is what the
 * space was always asking for, and the wordmark and copyright anchor the left.
 * Everything here already exists elsewhere on the page: these are wayfinding
 * labels and contact details, not new claims.
 */

const COLUMNS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: "What we build",
    links: [
      { label: "Front desk knowledge base", href: "/#product" },
      { label: "Recall and time off", href: "/#systems" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    heading: "Before you ask",
    links: [
      { label: "How it goes", href: "/#timeline" },
      { label: "What you own", href: "/#ownership" },
      { label: "Common questions", href: "/#faq" },
    ],
  },
  {
    heading: "Talk to us",
    links: [
      { label: "Book a call", href: CALENDLY, external: true },
      { label: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
      {
        label: "LinkedIn",
        href: "https://www.linkedin.com/in/alec-stephens-55b392213/",
        external: true,
      },
    ],
  },
];

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-6 md:px-6" aria-label="Site footer">
      <div className="mx-auto max-w-5xl rounded-panel sai-pane px-7 py-8 md:px-9 md:py-9">
        <div className="grid gap-9 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,0.85fr))] lg:gap-10">
          <div>
            <Link
              href="/"
              className="inline-flex items-center transition-opacity hover:opacity-80"
              aria-label={`${SITE_NAME}, home`}
            >
              <Image
                src="/logo-light.svg"
                alt={SITE_NAME}
                width={160}
                height={36}
                className="h-7 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-[26ch] text-[13.5px] leading-[1.55] text-ink-2">
              Systems for independent eyecare practices, built by the two people
              you will be working with.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <p className="font-label text-[11.5px] uppercase tracking-[0.08em] text-ink-2">
                {col.heading}
              </p>
              <ul className="mt-3.5 grid gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] leading-[1.4] text-ink-2 transition-colors hover:text-ink"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[14px] leading-[1.4] text-ink-2 transition-colors hover:text-ink"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <p className="mt-9 border-t border-rule-soft pt-5 font-label text-[12px] uppercase tracking-[0.05em] text-ink-2">
          &copy; {new Date().getFullYear()} {SITE_NAME}
        </p>
      </div>
    </footer>
  );
}
