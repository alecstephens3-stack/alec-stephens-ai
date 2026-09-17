import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL, CASE_STUDY_URL, LINKEDIN_URL } from "@/lib/content";

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-6 md:px-6" aria-label="Site footer">
      <div className="mx-auto max-w-5xl rounded-panel sai-pane px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-80"
            aria-label="Stephens AI, home"
          >
            <Image
              src="/logo-light.svg"
              alt="Stephens AI"
              width={160}
              height={36}
              className="h-7 w-auto"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label="Footer navigation">
            <a
              href={CASE_STUDY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              Case study
            </a>
            <Link
              href="/#how"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              How we work
            </Link>
            <a
              href="/alec"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              Alec&apos;s portfolio
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              Email
            </a>
          </nav>
        </div>

        <div className="mt-7 border-t border-rule-soft pt-5 text-center sm:text-left">
          <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
            &copy; {new Date().getFullYear()} {SITE_NAME} LLC
          </p>
          <p className="mt-1.5 text-[13.5px] text-ink-2">
            Stephens AI LLC is a Kansas limited liability company based in Wichita, Kansas.
          </p>
          <p className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[13.5px] sm:justify-start">
            <Link
              href="/privacy"
              className="text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
