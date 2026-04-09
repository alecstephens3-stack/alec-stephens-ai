"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-cream/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <a
          href="#"
          className="font-heading text-lg font-bold text-black transition-colors hover:text-terracotta"
        >
          Alec Stephens<span className="text-terracotta">.</span>
        </a>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-warm-gray transition-colors hover:text-black"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="text-sm font-medium text-terracotta transition-colors hover:text-terracotta-light"
          >
            Get in touch &rarr;
          </a>
        </nav>

        <button
          className="relative z-50 flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={cn(
                "block h-0.5 w-5 bg-black transition-all duration-300",
                isMobileMenuOpen && "translate-y-2 rotate-45"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-black transition-all duration-300",
                isMobileMenuOpen && "opacity-0"
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 bg-black transition-all duration-300",
                isMobileMenuOpen && "-translate-y-2 -rotate-45"
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-cream/98 transition-all duration-300 md:hidden",
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
      >
        <nav
          className="flex h-full flex-col items-center justify-center gap-8"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="font-heading text-2xl font-semibold text-black transition-colors hover:text-terracotta"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="font-heading text-2xl font-semibold text-terracotta transition-colors hover:text-terracotta-light"
          >
            Get in touch &rarr;
          </a>
        </nav>
      </div>
    </header>
  );
}
