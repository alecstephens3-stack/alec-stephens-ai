"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_NAME, CASE_STUDY_URL, LINKEDIN_URL } from "@/lib/content";
import { chromeCopy, localeFromPath } from "@/lib/i18n";
import { BurinCanvas } from "@/components/burin/burin-canvas";
import "./footer-burin.css";

/** A client component only to read the path: it sits in the root layout and /kr is in Korean. */
export function Footer() {
  const pathname = usePathname();
  const locale = localeFromPath(pathname);
  // The desk pages hide the site footer (desk.css); skip rendering it there so no WebGL plate loads.
  if (pathname === "/alec" || pathname === "/desk") return null;
  const t = chromeCopy(locale);
  const f = t.footer;
  // ClaimStride keeps its own look, so it closes on the plain glass footer, not the Burin plate (Alec, 2026-10-17).
  if (pathname?.startsWith("/claimstride")) return <PlainFooter locale={locale} />;
  return (
    <footer
      className="site-foot"
      data-burin-host
      aria-label={f.label}
      lang={locale === "ko" ? "ko" : undefined}
    >
      <div className="site-foot-in">
        <div className="site-foot-top">
          <Link
            href={t.home}
            className="flex items-center transition-opacity hover:opacity-80"
            aria-label={t.homeLabel}
          >
            <Image
              src="/logo-dark.svg"
              alt="Stephens AI"
              width={160}
              height={36}
              className="h-7 w-auto"
            />
          </Link>

          <nav className="site-foot-nav" aria-label={f.navLabel}>
            <a href={CASE_STUDY_URL} target="_blank" rel="noopener noreferrer">
              {f.caseStudy}
            </a>
            <Link href={f.workWithUs.href}>{f.workWithUs.label}</Link>
            <a href="/alec">{f.portfolio}</a>
            <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a href={f.email.href}>{f.email.label}</a>
          </nav>
        </div>

        <div className="site-foot-legal">
          {/* The year is the build's on the server and the visitor's here: they differ only across New Year. */}
          <span suppressHydrationWarning className="site-foot-co">
            &copy; {new Date().getFullYear()} {SITE_NAME} LLC
          </span>
          <span>{f.llc}</span>
          <Link href="/privacy">{f.privacy}</Link>
          <Link href="/terms">{f.terms}</Link>
        </div>
      </div>

      {/* Burin plate: the Jefferson Memorial's ambulatory colonnade, Jet Lowe, 1992, HABS DC,WASH,453-28,
          Library of Congress, public domain. Credited here, not on the page (Alec, 2026-10-17). */}
      <div className="site-foot-band">
        <BurinCanvas src="/burin/jefferson-colonnade-habs.jpg" mode="night" />
      </div>
    </footer>
  );
}

/** The plain glass footer (the site footer before Burin), kept for ClaimStride's own look. */
function PlainFooter({ locale }: { locale: ReturnType<typeof localeFromPath> }) {
  const t = chromeCopy(locale);
  const f = t.footer;
  return (
    <footer
      className="px-5 pb-8 pt-6 md:px-8"
      aria-label={f.label}
      lang={locale === "ko" ? "ko" : undefined}
    >
      <div className="mx-auto max-w-[1000px] rounded-panel sai-pane px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <Link
            href={t.home}
            className="flex items-center transition-opacity hover:opacity-80"
            aria-label={t.homeLabel}
          >
            <Image
              src="/logo-light.svg"
              alt="Stephens AI"
              width={160}
              height={36}
              className="h-7 w-auto"
            />
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-6" aria-label={f.navLabel}>
            <a
              href={CASE_STUDY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {f.caseStudy}
            </a>
            <Link
              href={f.workWithUs.href}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {f.workWithUs.label}
            </Link>
            <a
              href="/alec"
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {f.portfolio}
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
              href={f.email.href}
              className="text-sm text-ink-2 transition-colors hover:text-ink"
            >
              {f.email.label}
            </a>
          </nav>
        </div>

        <div className="mt-7 border-t border-rule-soft pt-5 text-center sm:text-left">
          {/* The year is the build's on the server and the visitor's here: they differ only across New Year. */}
          <p
            suppressHydrationWarning
            className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2"
          >
            &copy; {new Date().getFullYear()} {SITE_NAME} LLC
          </p>
          <p className="mt-1.5 text-[13.5px] text-ink-2">
            {f.llc}
          </p>
          <p className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-[13.5px] sm:justify-start">
            <Link
              href="/privacy"
              className="text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {f.privacy}
            </Link>
            <Link
              href="/terms"
              className="text-ink-2 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {f.terms}
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
