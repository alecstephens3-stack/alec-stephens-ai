"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

/**
 * The Dock: the Lens floating pill header. Fixed, centered, top 22px on
 * desktop — logo + Schibsted nav pills on glass. On mobile it stays a compact
 * pill and the menu opens as a full glass sheet.
 *
 * The sheet ships with the page and is toggled with opacity/visibility rather
 * than mounted on open: a viewport-sized pane costs a full-page rasterization
 * the first time it paints, which read as a delay between tapping the burger
 * and anything appearing.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  // A hash link on the current page never changes pathname, so the sheet also
  // closes from each link's onClick. This covers real route changes, including
  // the back button.
  const [openedAt, setOpenedAt] = useState(pathname);
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setIsMobileMenuOpen(false);
  }

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  // On the home page "/" is the current URL, so the router has nothing to do.
  // Take the reader to the top themselves.
  const goHome = () => {
    closeMenu();
    if (isHome) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed left-0 right-0 top-[14px] z-50 md:top-[22px]">
      <div className="mx-auto flex w-fit max-w-[calc(100vw-24px)] items-center gap-1 rounded-full sai-pane-strong py-2 pl-4 pr-2">
        <Link
          href="/"
          onClick={goHome}
          className="flex items-center pr-2 transition-opacity hover:opacity-80"
          aria-label="Stephens AI, home"
        >
          <Image
            src="/logo-light.svg"
            alt="Stephens AI"
            width={180}
            height={40}
            priority
            className="h-6 w-auto md:h-7"
          />
        </Link>

        <nav
          className="hidden items-center gap-0.5 md:flex"
          aria-label="Main navigation"
        >
          {!isHome && (
            <Link
              href="/"
              className="rounded-full px-3.5 py-2 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2 transition-colors duration-[220ms] hover:bg-white/70 hover:text-ink"
            >
              Home
            </Link>
          )}
          {NAV_LINKS.map((link) => {
            const isActive = link.href === pathname;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] transition-colors duration-[220ms] hover:bg-white/70 hover:text-ink",
                  isActive ? "bg-white/70 text-accent" : "text-ink-2"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            className="ml-1.5 rounded-full bg-ink px-4 py-2 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-white shadow-[0_8px_20px_rgba(23,19,16,0.2)] transition-all duration-[220ms] hover:-translate-y-px hover:bg-accent"
          >
            Get in touch &rarr;
          </Link>
        </nav>

        <button
          type="button"
          className="relative z-50 flex h-10 w-10 touch-manipulation items-center justify-center rounded-full md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "block h-0.5 w-5 bg-ink transition-transform duration-200",
                isMobileMenuOpen && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-ink transition-opacity duration-200",
                isMobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-ink transition-transform duration-200",
                isMobileMenuOpen && "-translate-y-2 -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      {/* A sibling of the dock, not of its inner pill: the pill uses
          backdrop-filter, which would otherwise become the containing block
          for this fixed overlay and clip it. Negative z keeps the sheet behind
          the dock while <header>'s own z-50 keeps both above the page. */}
      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-0 -z-10 transition-[opacity,visibility] duration-200 ease-out md:hidden",
          isMobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0 pointer-events-none"
        )}
        inert={!isMobileMenuOpen}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, #F3EEE8 0%, #F7E7DA 42%, #F7DCC9 74%, #F2CFB8 100%)",
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-4 rounded-window sai-sheet-pane"
          aria-hidden="true"
        />
        <nav
          className="relative flex h-full flex-col items-center justify-center gap-6"
          aria-label="Mobile navigation"
        >
          <Link
            href="/"
            onClick={goHome}
            aria-current={isHome ? "page" : undefined}
            className={cn(
              "font-heading text-2xl font-medium transition-colors hover:text-accent",
              isHome ? "text-accent" : "text-ink"
            )}
          >
            Home
          </Link>
          {NAV_LINKS.map((link) => {
            const isActive = link.href === pathname;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "font-heading text-2xl font-medium transition-colors hover:text-accent",
                  isActive ? "text-accent" : "text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            onClick={closeMenu}
            className="mt-2 rounded-full bg-ink px-7 py-3.5 font-heading text-lg font-medium text-white transition-colors hover:bg-accent"
          >
            Get in touch &rarr;
          </Link>
        </nav>
      </div>
    </header>
  );
}
