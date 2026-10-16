"use client";

import Link from "next/link";
import { BurinCanvas } from "./burin-canvas";
import "./burin-footer.css";

/**
 * The portfolio footer in Burin, the engraved style of the design system (2026-10-17):
 * cream lines on night, a soft lens on fine pointers, a still plate on phones and reduced motion.
 * Plate: Roman Corinthian capital, Walters Art Museum 23188, public domain. Credited here,
 * not on the page (Alec, 2026-10-17: the visible credit was distracting).
 */
export function PortfolioBurinFooter({ name, role, email, linkedin }: { name: string; role: string; email: string; linkedin: string }) {
  return (
    <footer className="burin-foot" data-burin-host aria-label="Site footer">
      <div className="burin-foot-art">
        <BurinCanvas src="/burin/capital-walters-23188.jpg" mode="night" zoom={0.95} />
      </div>
      <div className="burin-foot-in">
        <p className="burin-foot-name">{name}</p>
        <p className="burin-foot-role">{role}</p>
        <div className="burin-foot-links">
          <Link href="/">stephensai.co</Link>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href={`mailto:${email}`}>Email</a>
        </div>
        <div className="burin-foot-legal">
          <span className="burin-foot-co">&copy; 2026 Stephens AI LLC</span>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
