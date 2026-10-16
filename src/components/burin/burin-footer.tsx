"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef } from "react";
import "./burin-footer.css";

/**
 * The portfolio footer in Burin, the engraved style of the design system (2026-10-17).
 * A public-domain Roman capital is drawn live as banknote line engraving by /burin.js
 * (a copy of the design system's kit/burin.js): cream lines on night, a soft lens on
 * fine pointers, a still plate on phones and reduced motion.
 * Plate: Roman Corinthian capital, Walters Art Museum 23188, public domain. Credited here,
 * not on the page (Alec, 2026-10-17: the visible credit was distracting).
 */
type SAIBurin = { mount: (el: HTMLCanvasElement) => unknown };

function mount(el: HTMLCanvasElement | null) {
  const w = window as unknown as { SAIBurin?: SAIBurin };
  if (el && w.SAIBurin) w.SAIBurin.mount(el);
}

export function PortfolioBurinFooter({ name, role, email, linkedin }: { name: string; role: string; email: string; linkedin: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Coming back to /alec by client navigation: the script is already loaded, so mount here.
  useEffect(() => { mount(canvasRef.current); }, []);

  return (
    <footer className="burin-foot" data-burin-host aria-label="Site footer">
      <Script src="/burin.js" strategy="afterInteractive" onLoad={() => mount(canvasRef.current)} />
      <div className="burin-foot-art" aria-hidden="true">
        <canvas
          ref={canvasRef}
          className="sai-burin"
          data-src="/burin/capital-walters-23188.jpg"
          data-mode="night"
          data-focus="0.5,0.5"
          data-zoom="0.95"
          data-lens=""
        />
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
