import { SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border py-10" aria-label="Site footer">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <a
            href="#"
            className="font-heading text-lg font-bold text-black transition-colors hover:text-terracotta"
          >
            Alec Stephens<span className="text-terracotta">.</span>
          </a>

          <nav className="flex items-center gap-6" aria-label="Footer navigation">
            <a
              href="#work"
              className="text-sm text-warm-gray transition-colors hover:text-black"
            >
              Work
            </a>
            <a
              href="#services"
              className="text-sm text-warm-gray transition-colors hover:text-black"
            >
              Services
            </a>
            <a
              href="https://www.linkedin.com/in/alec-stephens-55b392213/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-warm-gray transition-colors hover:text-black"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-sm text-warm-gray transition-colors hover:text-black"
            >
              Email
            </a>
          </nav>
        </div>

        <div className="mt-8 text-center sm:text-left">
          <p className="text-xs text-warm-gray">
            &copy; {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </footer>
  );
}
