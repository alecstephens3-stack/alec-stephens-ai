import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/content";

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-6 md:px-6" aria-label="Site footer">
      <div className="mx-auto max-w-5xl rounded-panel sai-pane px-7 py-5 md:px-8 md:py-6">
        <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
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

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2" aria-label="Footer navigation">
            <Link
              href="/#product"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              What we build
            </Link>
            <Link
              href="/#pricing"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              Pricing
            </Link>
            <a
              href="https://www.linkedin.com/in/alec-stephens-55b392213/"
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

          {/* Sits in the same row as the nav. As its own band under a full
              width rule it was one short line of text in a lot of air. */}
          <p className="font-label text-[12.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
