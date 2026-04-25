import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-10" aria-label="Site footer">
      <div className="mx-auto max-w-5xl px-6">
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
              className="text-sm text-ink-60 transition-colors hover:text-black"
            >
              Work
            </Link>
            <Link
              href="/#services"
              className="text-sm text-ink-60 transition-colors hover:text-black"
            >
              Services
            </Link>
            <a
              href="https://www.linkedin.com/in/alec-stephens-55b392213/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-60 transition-colors hover:text-black"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-ink-60 transition-colors hover:text-black"
            >
              Email
            </a>
          </nav>
        </div>

        <div className="mt-8 text-center sm:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-60">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
