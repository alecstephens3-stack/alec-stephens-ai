"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const REDUCED = "(prefers-reduced-motion: reduce)";

const subscribeReducedMotion = (onChange: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};

/**
 * Lens entrance: the staggered 700ms rise (18px travel, brand ease).
 *
 * Two things this has to get right, both learned the hard way:
 *  1. Unobserve once it has fired. A page mounts ~15 of these and the old
 *     version kept every observer attached for the life of the component.
 *  2. Reduced motion must skip the animation entirely rather than run it at
 *     0.01ms. The global media query only collapses the duration, which left
 *     reduced-motion users with an opacity flash on every section. Read as an
 *     external store so the very first render is already correct.
 */
export function AnimateOnScroll({
  children,
  className,
  delay = 0,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hasEntered, setHasEntered] = useState(false);

  const reduced = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED).matches,
    () => false
  );

  useEffect(() => {
    if (reduced) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduced]);

  const visible = reduced || hasEntered;

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(18px)",
        transition: reduced
          ? undefined
          : `opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
