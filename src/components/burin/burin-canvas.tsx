"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * One Burin plate: a public-domain picture drawn live as banknote line engraving by /burin.js
 * (a copy of the design system's kit/burin.js; copy it again when the kit changes). The canvas
 * fills its parent, so size the parent. Put data-burin-host on the surface the lens should
 * track over. Plates are prepared with kit/burin_prep.py into /public/burin/.
 */
type SAIBurin = { mount: (el: HTMLCanvasElement) => unknown };

function mount(el: HTMLCanvasElement | null) {
  const w = window as unknown as { SAIBurin?: SAIBurin };
  if (el && w.SAIBurin) w.SAIBurin.mount(el);
}

export function BurinCanvas({
  src,
  mode = "day",
  focus = "0.5,0.5",
  zoom,
  gamma,
  lens = true,
  className,
}: {
  src: string;
  mode?: "day" | "night";
  focus?: string;
  zoom?: number;
  gamma?: number;
  lens?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  // Client navigation back to a page: the script is already loaded, so mount here.
  useEffect(() => { mount(ref.current); }, []);
  return (
    <>
      <Script src="/burin.js" strategy="afterInteractive" onLoad={() => mount(ref.current)} />
      <canvas
        ref={ref}
        className={cn("sai-burin", className)}
        data-src={src}
        data-mode={mode}
        data-focus={focus}
        data-zoom={zoom}
        data-gamma={gamma}
        data-lens={lens ? "" : undefined}
        aria-hidden="true"
      />
    </>
  );
}
