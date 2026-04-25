"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { OPTOMETRY_FLAGSHIP } from "@/lib/optometry";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PROTOTYPE_WIDTH = 800;
const PROTOTYPE_HEIGHT = 600;

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function getReducedMotionServerSnapshot() {
  return false;
}

export function OptometryFlagship() {
  const {
    eyebrow,
    headline,
    body,
    videoCaption,
    videoEmbedSrc,
    videoPoster,
    mondayBrief,
    howItWorks,
  } = OPTOMETRY_FLAGSHIP;

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const embedContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const el = embedContainerRef.current;
    if (!el) return;

    const applyScale = (width: number) => {
      if (width <= 0) return;
      el.style.setProperty("--embed-scale", String(width / PROTOTYPE_WIDTH));
    };

    applyScale(el.clientWidth);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) applyScale(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <section
      id="flagship"
      className="bg-paper-raised py-24 md:py-36"
      aria-label="Practice Intelligence Dashboard"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-salmon">
            {eyebrow}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <h2
            className="max-w-[22ch] font-heading font-medium text-black"
            style={{
              fontSize: "clamp(2.2rem, 4.5vw, 3.75rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.03em",
            }}
          >
            {headline.before}
            <span className="text-salmon">{headline.accent}</span>
            {headline.after}
          </h2>

          <div className="mt-8 max-w-[60ch] space-y-5 text-lg leading-relaxed text-ink-90">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150}>
          <div className="mt-12 md:mt-16">
            <div
              ref={embedContainerRef}
              className="relative overflow-hidden rounded-lg border border-border bg-ink aspect-[4/3]"
            >
              {reducedMotion ? (
                <Image
                  src={videoPoster}
                  alt="Practice Intelligence Dashboard preview"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              ) : (
                <iframe
                  src={videoEmbedSrc}
                  title="Practice Intelligence Dashboard walkthrough"
                  loading="lazy"
                  sandbox="allow-scripts"
                  className="absolute left-0 top-0 border-0"
                  style={{
                    width: PROTOTYPE_WIDTH,
                    height: PROTOTYPE_HEIGHT,
                    transform: "scale(var(--embed-scale, 1))",
                    transformOrigin: "top left",
                  }}
                />
              )}
            </div>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-ink-60">
              {videoCaption}
            </p>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <figure className="mt-16 md:mt-24">
            <div className="overflow-hidden rounded-lg border border-border bg-paper">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-border bg-paper-raised px-6 py-4 font-mono text-xs uppercase tracking-[0.08em] text-ink-60 md:px-10">
                <span>
                  From&nbsp;&nbsp;
                  <span className="font-sans normal-case tracking-normal text-ink-90">
                    {mondayBrief.from}
                  </span>
                </span>
                <span>
                  Subject&nbsp;&nbsp;
                  <span className="font-sans normal-case tracking-normal text-ink-90">
                    {mondayBrief.subject}
                  </span>
                </span>
                <span>{mondayBrief.date}</span>
              </div>

              <div className="space-y-6 px-6 py-8 md:space-y-7 md:px-10 md:py-10">
                <h3 className="font-heading text-2xl font-medium leading-snug tracking-tight text-ink-90 md:text-[1.625rem]">
                  {mondayBrief.headline}
                </h3>

                <div className="space-y-2 text-base leading-relaxed text-ink-90">
                  {mondayBrief.summary.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>

                <hr className="border-border" />

                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-salmon-deep">
                    Top concern
                  </p>
                  <p className="font-heading text-lg font-medium leading-snug text-ink-90">
                    {mondayBrief.topConcern}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-salmon-deep">
                    Top opportunity
                  </p>
                  <p className="font-heading text-lg font-medium leading-snug text-ink-90">
                    {mondayBrief.topOpportunity}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-ink-60">
                    Recommended focus
                  </p>
                  <p className="text-base leading-relaxed text-ink-90">
                    {mondayBrief.recommendedFocus}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-border px-6 py-4 font-mono text-xs uppercase tracking-[0.08em] text-ink-60 md:px-10">
                <span>{mondayBrief.footerLeft}</span>
                <span>{mondayBrief.footerRight}</span>
              </div>
            </div>

            <figcaption className="mt-3 font-mono text-xs uppercase tracking-[0.08em] text-ink-60">
              {mondayBrief.caption}
            </figcaption>
          </figure>
        </AnimateOnScroll>

        <AnimateOnScroll delay={250}>
          <p className="mt-12 max-w-[68ch] text-base leading-relaxed text-ink-90">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-60">
              How it works
            </span>
            <span aria-hidden="true" className="mx-2 font-mono text-xs text-ink-60">
              &middot;
            </span>
            {howItWorks}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
