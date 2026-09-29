"use client";

import { useEffect, useRef } from "react";
/**
 * The warm light that follows the pointer, as on the dark Growth price card
 * (Alec, 2026-09-29: "this orange highlight thing that moves with the cursor
 * is so cool. add it to the discover section"). Put <CursorGlow /> anywhere
 * inside a `section.sai-night` that also carries `host` from
 * cursor-glow.module.css (import the CSS module where the panel is rendered;
 * a server component cannot read a value exported from this client file): the light is the
 * section's own ::after, so it covers the whole panel (NightWindow wraps its
 * children in an inner box, and a light inside that box stopped 48px short
 * of the edges). Content above it needs z-index 1. Fine pointers only; off
 * for reduced motion.
 */
export function CursorGlow() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const host = ref.current?.closest<HTMLElement>("section.sai-night");
    if (!host) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const move = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      host.style.setProperty("--mx", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
      host.style.setProperty("--my", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      host.dataset.glow = "on";
    };
    const leave = () => {
      delete host.dataset.glow;
    };
    host.addEventListener("pointermove", move);
    host.addEventListener("pointerleave", leave);
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <span ref={ref} hidden />;
}
