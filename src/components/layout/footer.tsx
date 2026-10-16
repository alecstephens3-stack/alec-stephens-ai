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
