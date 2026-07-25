"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Lens entrance: the staggered 700ms rise (18px travel, brand ease).
 * Stagger siblings with delay steps of ~60ms. After entering, nothing
 * moves except the scene lenses.
 */
export function AnimateOnScroll({
  children,
  className,
  delay = 0,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(18px)",
        transition: `opacity 700ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform 700ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
