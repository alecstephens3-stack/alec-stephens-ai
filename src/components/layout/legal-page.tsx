import Link from "next/link";
import { CONTACT_EMAIL, CONTACT_EMAIL_JUSHEEN, LEGAL_UPDATED } from "@/lib/content";

/**
 * Shared shell for /privacy and /terms.
 *
 * Both pages are long-form prose, which the rest of the site never is, so the
 * type scale is set once here rather than repeated per page. Section ids feed
 * the "On this page" list; keep them stable because external links (a client's
 * procurement review, Google's OAuth consent screen) point at them.
 */

export type LegalSection = {
  id: string;
  heading: string;
  body: React.ReactNode;
};

export function LegalPage({
  title,
  summary,
  sections,
}: {
  title: string;
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <div className="px-4 pb-16 pt-28 md:px-6 md:pt-32">
      <div className="mx-auto max-w-3xl">
        <header className="rounded-panel sai-pane px-7 py-9 md:px-10 md:py-11">
          <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent-deep">
            Stephens AI LLC
          </p>
          <h1 className="mt-3 font-heading text-[34px] font-medium leading-[1.08] tracking-[-0.025em] text-ink md:text-[44px]">
            {title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-2">{summary}</p>
          <p className="mt-6 border-t border-rule-soft pt-5 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
            Last updated {LEGAL_UPDATED}
          </p>
        </header>

        <nav
          className="mt-4 rounded-panel sai-pane px-7 py-7 md:px-10"
          aria-label="On this page"
        >
          <h2 className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
            On this page
          </h2>
          <ol className="mt-4 grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
            {sections.map((section, i) => (
              <li key={section.id} className="flex gap-3 text-[15px] leading-snug">
                <span className="shrink-0 tabular-nums text-accent-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <a
                  href={`#${section.id}`}
                  className="text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
                >
                  {section.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="mt-4 rounded-panel sai-pane px-7 py-9 md:px-10 md:py-11">
          {sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 border-rule-soft pt-9 first:pt-0 [&+section]:border-t"
            >
              <h2 className="font-heading text-[21px] font-medium leading-tight text-ink md:text-[24px]">
                <span className="mr-2.5 tabular-nums text-accent-deep">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.heading}
              </h2>
              <div className="legal-prose mt-4 pb-9">{section.body}</div>
            </section>
          ))}
        </article>

        <div className="mt-4 rounded-panel sai-pane px-7 py-7 md:px-10">
          <p className="text-[15px] leading-relaxed text-ink-2">
            Questions about this page may be directed to{" "}
            <a
              className="text-accent-deep underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL}`}
            >
              {CONTACT_EMAIL}
            </a>{" "}
            or{" "}
            <a
              className="text-accent-deep underline underline-offset-4"
              href={`mailto:${CONTACT_EMAIL_JUSHEEN}`}
            >
              {CONTACT_EMAIL_JUSHEEN}
            </a>
            . See also our{" "}
            <Link
              className="text-accent-deep underline underline-offset-4"
              href={title.toLowerCase().includes("privacy") ? "/terms" : "/privacy"}
            >
              {title.toLowerCase().includes("privacy")
                ? "Terms of Service"
                : "Privacy Policy"}
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
