"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

/**
 * The Dock: the Lens floating pill header. Fixed, centered, top 22px on
 * desktop — logo + Schibsted nav pills on glass. On mobile it stays a compact
 * pill and the menu opens as a full glass sheet.
 */
export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="fixed left-0 right-0 top-[14px] z-50 md:top-[22px]">
      <div className="mx-auto flex w-fit max-w-[calc(100vw-24px)] items-center gap-1 rounded-full sai-pane-strong py-2 pl-4 pr-2">
        <Link
          href="/"
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
          className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "block h-0.5 w-5 bg-ink transition-all duration-300",
                isMobileMenuOpen && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-ink transition-all duration-300",
                isMobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-ink transition-all duration-300",
                isMobileMenuOpen && "-translate-y-2 -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      {/* Portaled to body: the dock uses backdrop-filter, which would otherwise
          become the containing block for this fixed overlay and clip it. */}
      {isMobileMenuOpen &&
        createPortal(
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, #F3EEE8 0%, #F7E7DA 42%, #F7DCC9 74%, #F2CFB8 100%)",
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-4 rounded-window sai-pane" aria-hidden="true" />
            <nav
              className="relative flex h-full flex-col items-center justify-center gap-7"
              aria-label="Mobile navigation"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-heading text-2xl font-medium text-ink transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 rounded-full bg-ink px-7 py-3.5 font-heading text-lg font-medium text-white transition-all hover:bg-accent"
              >
                Get in touch &rarr;
              </Link>
            </nav>
          </div>,
          document.body
        )}
    </header>
  );
}
