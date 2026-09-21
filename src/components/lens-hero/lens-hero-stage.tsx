"use client";

import { useEffect, useRef } from "react";
import type { LensHero } from "./lens-hero";

/**
 * The page-side half of the lens hero.
 *
 * A tall track with a sticky stage inside it. The stage holds the window and
 * the eyebrow and headline beneath it, so the whole first thought stays on
 * screen together while scroll grows the lens. `pinScroll` sets the track's
 * height, so the height here is only a pre-hydration placeholder.
 *
 * The module is a vendored, framework-free ES module that touches WebGL and
 * window on import, so it is loaded with a dynamic import inside the effect and
 * never runs on the server.
 */

const ARIA_LABEL =
  "A cluttered clinic front desk seen from above, soft and out of focus: sticky notes, a fee sheet, a phone message slip. A round optometrist's trial lens drifts across it. Under the glass the notes come into focus and square themselves into order.";

/**
 * next/font generates a scoped family name per face, so the literal "Inter
 * Tight" the module would otherwise ask for resolves to whatever the visitor
 * happens to have installed. Read the real name out of the CSS variable and
 * hand it over.
 */
function resolveFamily(cssVar: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  const first = raw.split(",")[0]?.trim().replace(/^['"]|['"]$/g, "");
  return first || fallback;
}

export function LensHeroStage({ children }: { children: React.ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let hero: LensHero | null = null;
    let unpin: (() => void) | null = null;
    let cancelled = false;

    (async () => {
      const { init, pinScroll } = await import("./lens-hero.js");
      const canvas = canvasRef.current;
      const track = trackRef.current;
      if (cancelled || !canvas || !track) return;

      hero = init(canvas, {
        handFont: resolveFamily("--font-caveat", "Caveat"),
        textFont: resolveFamily("--font-inter-tight", "Inter Tight"),
        labelFont: resolveFamily("--font-schibsted", "Schibsted Grotesk"),
        // The warm peach the page's sky settles to behind the hero, so the
        // feathered window edge melts into the page rather than onto a seam.
        pageColor: [0.957, 0.898, 0.851],
      });

      // Reduced motion: no pin at all. The module paints the tidy desk once and
      // the page scrolls like any other page.
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        unpin = pinScroll(track, hero, {
          growVh: 1.4,
          holdVh: 0.3,
          phoneGrowVh: 1.0,
          phoneHoldVh: 0.25,
          phoneBelow: 560,
        });
      }
    })();

    return () => {
      cancelled = true;
      unpin?.();
      hero?.destroy();
    };
  }, []);

  return (
    <div ref={trackRef} className="lh-track">
      <div className="lh-stage">
        <canvas ref={canvasRef} className="lh-window" role="img" aria-label={ARIA_LABEL} />
        <div className="lh-copy">{children}</div>
      </div>
    </div>
  );
}
