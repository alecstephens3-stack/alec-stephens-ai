import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="px-4 pb-8 pt-6 md:px-6" aria-label="Site footer">
      <div className="mx-auto max-w-5xl rounded-panel sai-pane px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href="/"
            className="flex items-center transition-opacity hover:opacity-80"
            aria-label="Stephens AI — home"
          >
            <Image
              src="/logo-light.svg"
              alt="Stephens AI"
              width={160}
              height={36}
              className="h-7 w-auto"
            />
          </Link>

          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            <Link
              href="/#work"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              Work
            </Link>
            <Link
              href="/#services"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              Services
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
        </div>

        <div className="mt-7 border-t border-rule-soft pt-5 text-center sm:text-left">
          <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
