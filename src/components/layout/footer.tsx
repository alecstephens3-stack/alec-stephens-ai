import { NAV_LINKS, SITE_NAME, CONTACT_EMAIL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-black py-16" aria-label="Site footer">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-3">
          <div>
            <a
              href="#"
              className="font-heading text-xl font-bold text-white transition-colors hover:text-terracotta"
            >
              Alec Stephens<span className="text-terracotta">.</span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-warm-gray">
              AI automation consultant helping businesses in the USA, Japan,
              and around the world turn hours of manual work into minutes.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
              Navigation
            </h3>
            <nav
              className="mt-4 flex flex-col gap-3"
              aria-label="Footer navigation"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-warm-gray transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-terracotta">
              Connect
            </h3>
            <div className="mt-4 flex flex-col gap-3">
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-sm text-warm-gray transition-colors hover:text-white"
              >
                {CONTACT_EMAIL}
              </a>
              <a
                href="https://www.linkedin.com/in/alec-stephens-55b392213/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-warm-gray transition-colors hover:text-white"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/alecstephens3-stack"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-warm-gray transition-colors hover:text-white"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p className="text-sm text-warm-gray">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
