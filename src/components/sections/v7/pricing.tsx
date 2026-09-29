"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Section } from "../v6/shell";
import { ButtonLink } from "@/components/ui/button";
import { V7_PRICING, V7_CTA } from "@/lib/content";
import s from "./pricing.module.css";

/**
 * Pricing (Alec, 2026-09-29): "dynamic and have a cool element to it... the
 * middle pricing section should be dark and the different tiers should show up
 * as apple style cards and should move a little bit and be dynamic when you
 * hover... the buttons should lead somewhere on the pricing for every tier."
 *
 * Three cards, the middle one dark and raised. Each card tilts toward the
 * pointer on a damped spring with a soft light that follows it (fine pointers
 * only; never on touch or reduced motion). The prices roll into place once,
 * the first time the cards come on screen; the real price is always what
 * renders by default, so no one ever reads a parked "$9,999". Every tier's Get started goes to
 * the booking page, tagged with the plan so the booking shows which one.
 */
export function Pricing() {
  const grid = useRef<HTMLDivElement>(null);
  // The real price is the default (server render, no JS, reduced motion, or
  // cards already on screen). Only when the cards start below the fold does
  // the roll arm itself (digits parked at 9, off screen) and play on arrival.
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    const el = grid.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setArmed(false);
          io.disconnect();
        }
      },
      { rootMargin: "0px" },
    );
    const raf = requestAnimationFrame(() => {
      setArmed(true);
      io.observe(el);
    });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  return (
    <Section id="pricing" kicker={V7_PRICING.kicker} title={V7_PRICING.title} titleMax="max-w-[24ch]">
      <div ref={grid} className={s.grid}>
        {V7_PRICING.tiers.map((t, i) => {
          const dark = "note" in t && !!t.note;
          return (
            <TiltCard key={t.name} dark={dark}>
              <h3 className={s.name}>{t.name}</h3>
              {dark && <p className={s.note}>{t.note}</p>}
              <p className={s.price}>
                <Roll value={t.price} armed={armed} delay={i * 120} />
              </p>
              <p className={s.monthly}>{t.monthly}</p>
              <span className={s.rule} aria-hidden="true" />
              <p className={s.lead}>{t.lead}</p>
              <p className={s.body}>{t.body}</p>
              <ButtonLink
                href={`${V7_CTA.href}?utm_source=stephensai.co&utm_medium=pricing&utm_content=${t.slug}`}
                external
                className={cn(s.cta, dark && s.ctaLight)}
              >
                {V7_CTA.label}
              </ButtonLink>
            </TiltCard>
          );
        })}
      </div>
      <p className={s.fine}>{V7_PRICING.fine}</p>
    </Section>
  );
}

/** A card that leans toward the pointer. Damped spring on the real frame
    time, so it settles the same at 60 and 120 Hz; the loop sleeps at rest. */
function TiltCard({ dark, children }: { dark: boolean; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    let active = false;
    let tx = 0, ty = 0, x = 0, y = 0, vx = 0, vy = 0;
    const step = (now: number) => {
      const dt = last ? Math.min(0.032, (now - last) / 1000) : 1 / 60;
      last = now;
      const ax = 170 * (tx - x) - 22 * vx;
      const ay = 170 * (ty - y) - 22 * vy;
      vx += ax * dt;
      vy += ay * dt;
      x += vx * dt;
      y += vy * dt;
      el.style.setProperty("--ry", `${x.toFixed(3)}deg`);
      el.style.setProperty("--rx", `${y.toFixed(3)}deg`);
      const still = Math.abs(tx - x) < 0.005 && Math.abs(ty - y) < 0.005 && Math.abs(vx) < 0.01 && Math.abs(vy) < 0.01;
      if (still && !active) {
        raf = 0;
        last = 0;
        return;
      }
      raf = requestAnimationFrame(step);
    };
    const wake = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      tx = (px - 0.5) * 7; // degrees around the vertical axis
      ty = -(py - 0.5) * 5; // degrees around the horizontal axis
      el.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
      active = true;
      wake();
    };
    const leave = () => {
      tx = 0;
      ty = 0;
      active = false;
      wake();
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={cn(s.card, dark && s.dark)}>
      {dark && <span className={s.ember} aria-hidden="true" />}
      <div className={s.inner}>{children}</div>
    </div>
  );
}

/** A price that rolls into place like an odometer: each digit spins down
    from 9 to its value, a little later than the one before. */
function Roll({ value, armed, delay }: { value: string; armed: boolean; delay: number }) {
  return (
    <>
      <span className="sr-only">{value}</span>
      <span className={s.roll} aria-hidden="true">
        {value.split("").map((ch, i) =>
          /\d/.test(ch) ? (
            <span key={i} className={s.digit}>
              <span
                className={cn(s.strip, armed && s.parked)}
                style={{
                  transform: `translateY(-${(armed ? 9 : Number(ch)) * 10}%)`,
                  transitionDelay: armed ? "0ms" : `${delay + i * 70}ms`,
                }}
              >
                {"0123456789".split("").map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={i}>{ch}</span>
          ),
        )}
      </span>
    </>
  );
}
