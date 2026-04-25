"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { OPTOMETRY_FLAGSHIP } from "@/lib/optometry";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PROTOTYPE_WIDTH = 800;
const PROTOTYPE_HEIGHT = 600;
const MOBILE_PROTOTYPE_WIDTH = 360;
const MOBILE_PROTOTYPE_HEIGHT = 480;
const MOBILE_MAX_SCALE = 1.25;

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

function useEmbedScale(
  ref: React.RefObject<HTMLDivElement | null>,
  intrinsicWidth: number,
  maxScale: number,
  enabled: boolean,
) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const applyScale = (width: number) => {
      if (width <= 0) return;
      const scale = Math.min(width / intrinsicWidth, maxScale);
      el.style.setProperty("--embed-scale", String(scale));
    };

    applyScale(el.clientWidth);
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) applyScale(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, intrinsicWidth, maxScale, enabled]);
}

export function OptometryFlagship() {
  const {
    eyebrow,
    headline,
    body,
    videoCaption,
    videoEmbedSrc,
    videoEmbedSrcMobile,
    videoPoster,
    mondayBrief,
    howItWorks,
  } = OPTOMETRY_FLAGSHIP;

  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot,
  );
  const desktopRef = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);

  useEmbedScale(desktopRef, PROTOTYPE_WIDTH, Infinity, !reducedMotion);
  useEmbedScale(mobileRef, MOBILE_PROTOTYPE_WIDTH, MOBILE_MAX_SCALE, !reducedMotion);

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
            {reducedMotion ? (
              <div className="relative overflow-hidden rounded-lg border border-border bg-mat aspect-[4/3]">
                <Image
                  src={videoPoster}
                  alt="Practice Intelligence Dashboard preview"
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              </div>
            ) : (
              <>
                <div
                  ref={mobileRef}
                  className="relative mx-auto overflow-hidden rounded-lg border border-border bg-mat aspect-[3/4] md:hidden"
                  style={{ maxWidth: MOBILE_PROTOTYPE_WIDTH * MOBILE_MAX_SCALE }}
                >
                  <iframe
                    src={videoEmbedSrcMobile}
                    title="Practice Intelligence Dashboard walkthrough"
                    loading="lazy"
                    sandbox="allow-scripts"
                    className="absolute left-0 top-0 border-0"
                    style={{
                      width: MOBILE_PROTOTYPE_WIDTH,
                      height: MOBILE_PROTOTYPE_HEIGHT,
                      transform: "scale(var(--embed-scale, 1))",
                      transformOrigin: "top left",
                    }}
                  />
                </div>
                <div
                  ref={desktopRef}
                  className="relative hidden overflow-hidden rounded-lg border border-border bg-mat aspect-[4/3] md:block"
                >
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
                </div>
              </>
            )}
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
