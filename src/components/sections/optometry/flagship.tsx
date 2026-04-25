"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
    mondayBriefImage,
    mondayBriefFallback,
    howItWorks,
  } = OPTOMETRY_FLAGSHIP;

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const [briefImageFailed, setBriefImageFailed] = useState(false);
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
          <figure className="mt-16 overflow-hidden rounded-lg border border-border bg-paper md:mt-24">
            {briefImageFailed ? (
              <div className="px-6 py-8 md:px-10 md:py-10">
                <div className="mb-5 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-b border-border pb-4 font-mono text-xs uppercase tracking-[0.08em] text-ink-60">
                  <span>
                    <span className="text-ink-60">From</span>&nbsp; {mondayBriefFallback.from}
                  </span>
                  <span>
                    <span className="text-ink-60">Subject</span>&nbsp; {mondayBriefFallback.subject}
                  </span>
                  <span>
                    <span className="text-ink-60">Date</span>&nbsp; {mondayBriefFallback.date}
                  </span>
                </div>
                <div className="space-y-3 text-base leading-relaxed text-ink-90">
                  {mondayBriefFallback.body.map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ) : (
              <Image
                src={mondayBriefImage}
                alt="Example Monday briefing email delivered every Monday at 7 AM"
                width={1600}
                height={600}
                unoptimized
                className="h-auto w-full"
                onError={() => setBriefImageFailed(true)}
              />
            )}
            <figcaption className="border-t border-border px-6 py-4 font-mono text-xs uppercase tracking-[0.08em] text-ink-60 md:px-10">
              The Monday briefing, 7 AM, delivered by email
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
