"use client";

import { useEffect, useRef } from "react";
import type { LensHero } from "./lens-hero";

/**
 * The lens hero, mounted as an ordinary block at the top of the page.
 *
 * There is no scroll story any more. The window sits in normal document flow
 * and the page scrolls past it like any page. The lens keeps its own life
 * (idle drift, pointer follow, finger drag), all of which lives inside the
 * vendored module. Nothing here listens to scroll, nothing is sticky, nothing
 * calls setProgress, and the lens radius never changes.
 *
 * Removed 2026-09-22 on Alec's call: the scroll-driven growth read as buggy
 * and "messes with the hero". `pinScroll` is still exported by the module; we
 * simply do not import it. If it ever comes back, it needs a tall track and a
 * sticky stage again, which is what git history has.
 *
 * Reduced motion needs no branch here: the module reads the media query itself
 * and paints one still frame of the tidy desk.
 *
 * The module touches WebGL and window at import time, so it is loaded with a
 * dynamic import inside the effect and never runs on the server.
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let hero: LensHero | null = null;
    let cancelled = false;

    (async () => {
      const { init } = await import("./lens-hero.js");
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;

      hero = init(canvas, {
        handFont: resolveFamily("--font-kalam", "Kalam"),
        handFont2: resolveFamily("--font-reenie", "Reenie Beanie"),
        textFont: resolveFamily("--font-inter-tight", "Inter Tight"),
        labelFont: resolveFamily("--font-schibsted", "Schibsted Grotesk"),
        // The warm peach the page's sky settles to behind the hero, so the
        // feathered window edge melts into the page rather than onto a seam.
        pageColor: [0.957, 0.898, 0.851],
      });
    })();

    return () => {
      cancelled = true;
      hero?.destroy();
    };
  }, []);

  return (
    <div className="lh-stage">
      <canvas ref={canvasRef} className="lh-window" role="img" aria-label={ARIA_LABEL} />
      <div className="lh-copy">{children}</div>
    </div>
  );
}
