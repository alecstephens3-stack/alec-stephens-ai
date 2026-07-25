"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { DayWindow, NightWindow, Porthole } from "@/components/ui/lens-primitives";
import { OPTOMETRY_FLAGSHIP } from "@/lib/optometry";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

// Intrinsic sizes of the two prototype documents. Both are 3:4 / 4:3 so they match
// their container's aspect ratio exactly at scale 1.
const PROTOTYPE_WIDTH = 800;
const PROTOTYPE_HEIGHT = 600;
const MOBILE_PROTOTYPE_WIDTH = 272;
const MOBILE_PROTOTYPE_HEIGHT = 363;

// Never upscale an embed. Upscaling softens the type and buys nothing, so both
// embeds cap at 1. The desktop tile letterboxes the 800px document against the
// night tile instead of stretching it. Downscaling is what threatens the 13px
// rendered floor, which is why the mobile document is authored at a 15px floor.
const MAX_SCALE = 1;

// The embed tile is border-box with a 1px border per side, so its content box (what
// clientWidth reports, and what the iframe has to fit into) is 2px narrower than its
// max-width. Without this the mobile embed caps at 270/272 = 0.993 and downscales for
// no reason.
const TILE_BORDER_X = 2;

const NIGHT_LABEL =
  "font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-cream-2";
const SHEET_LABEL =
  "font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-ink-2";

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

  useEmbedScale(desktopRef, PROTOTYPE_WIDTH, MAX_SCALE, !reducedMotion);
  useEmbedScale(mobileRef, MOBILE_PROTOTYPE_WIDTH, MAX_SCALE, !reducedMotion);

  return (
    <div className="py-24 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <NightWindow
          id="flagship"
          ariaLabel="Practice Intelligence Dashboard"
          className="p-8 md:p-12"
        >
          <AnimateOnScroll>
            <div className="mb-6">
              <Porthole onNight>{eyebrow}</Porthole>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={60}>
            <h2
              className="max-w-[22ch] font-heading font-medium text-cream"
              style={{
                fontSize: "clamp(2.1rem, 4.2vw, 3.4rem)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
              }}
            >
              {headline.before}
              <em className="not-italic text-accent-night">{headline.accent}</em>
              {headline.after}
            </h2>

            <div className="mt-8 max-w-[60ch] space-y-5 text-base leading-relaxed text-cream-2 md:text-lg">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={120}>
            <div className="mt-12 md:mt-16">
              {reducedMotion ? (
                <div className="sai-nglass-tile relative aspect-[4/3] overflow-hidden rounded-tile">
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
                  {/*
                    Breakpoint is lg, not md: at md the tile is only ~622px wide, which
                    would downscale the 800px document to 0.78 and drop its 13px type to
                    ~10px rendered. At lg the tile is ~878px, so the desktop document
                    always renders at scale 1. Everything below lg gets the compact
                    272px document, which caps at scale 1 too.
                  */}
                  <div
                    ref={mobileRef}
                    className="sai-nglass-tile relative mx-auto flex aspect-[3/4] items-center justify-center overflow-hidden rounded-tile lg:hidden"
                    style={{
                      maxWidth: MOBILE_PROTOTYPE_WIDTH * MAX_SCALE + TILE_BORDER_X,
                    }}
                  >
                    <iframe
                      src={videoEmbedSrcMobile}
                      title="Practice Intelligence Dashboard walkthrough"
                      // Eager, not lazy: the embed sits ~3000px down the page, so a
                      // lazy iframe never navigates during a full-page capture and the
                      // night window renders as an empty dark void. Both prototypes are
                      // small static HTML files, so eager costs nothing.
                      loading="eager"
                      sandbox="allow-scripts"
                      className="shrink-0 border-0"
                      style={{
                        width: MOBILE_PROTOTYPE_WIDTH,
                        height: MOBILE_PROTOTYPE_HEIGHT,
                        transform: "scale(var(--embed-scale, 1))",
                        transformOrigin: "center",
                      }}
                    />
                  </div>
                  <div
                    ref={desktopRef}
                    className="sai-nglass-tile relative hidden aspect-[4/3] items-center justify-center overflow-hidden rounded-tile lg:flex"
                  >
                    <iframe
                      src={videoEmbedSrc}
                      title="Practice Intelligence Dashboard walkthrough"
                      // See the mobile embed above: eager on purpose.
                      loading="eager"
                      sandbox="allow-scripts"
                      className="shrink-0 border-0"
                      style={{
                        width: PROTOTYPE_WIDTH,
                        height: PROTOTYPE_HEIGHT,
                        transform: "scale(var(--embed-scale, 1))",
                        transformOrigin: "center",
                      }}
                    />
                  </div>
                </>
              )}
              <p className={`mt-4 ${NIGHT_LABEL}`}>{videoCaption}</p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={180}>
            <figure className="mt-16 md:mt-20">
              <DayWindow className="p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule pb-5">
                  <span className={SHEET_LABEL}>
                    From&nbsp;&nbsp;
                    <span className="font-sans text-[15.5px] font-medium normal-case tracking-normal text-ink-90">
                      {mondayBrief.from}
                    </span>
                  </span>
                  <span className={SHEET_LABEL}>
                    Subject&nbsp;&nbsp;
                    <span className="font-sans text-[15.5px] font-medium normal-case tracking-normal text-ink-90">
                      {mondayBrief.subject}
                    </span>
                  </span>
                  <span className={SHEET_LABEL}>{mondayBrief.date}</span>
                </div>

                <div className="space-y-6 py-8 md:space-y-7">
                  <h3 className="max-w-[34ch] font-heading text-2xl font-medium leading-snug tracking-tight text-ink-90 md:text-[1.625rem]">
                    {mondayBrief.headline}
                  </h3>

                  <div className="space-y-2 text-base leading-relaxed text-ink-2">
                    {mondayBrief.summary.map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>

                  <hr className="border-rule" />

                  <div className="space-y-2">
                    <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent">
                      Top concern
                    </p>
                    <p className="font-heading text-lg font-medium leading-snug text-ink-90">
                      {mondayBrief.topConcern}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent">
                      Top opportunity
                    </p>
                    <p className="font-heading text-lg font-medium leading-snug text-ink-90">
                      {mondayBrief.topOpportunity}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className={SHEET_LABEL}>Recommended focus</p>
                    <p className="text-base leading-relaxed text-ink-90">
                      {mondayBrief.recommendedFocus}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-t border-rule pt-5">
                  <span className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent">
                    {mondayBrief.footerLeft}
                  </span>
                  <span className={SHEET_LABEL}>{mondayBrief.footerRight}</span>
                </div>
              </DayWindow>

              <figcaption className={`mt-4 ${NIGHT_LABEL}`}>
                {mondayBrief.caption}
              </figcaption>
            </figure>
          </AnimateOnScroll>

          <AnimateOnScroll delay={240}>
            <p className="mt-12 max-w-[68ch] text-base leading-relaxed text-cream-2">
              <span className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent-night">
                How it works
              </span>
              <span aria-hidden="true" className="mx-2 text-accent-night">
                &middot;
              </span>
              {howItWorks}
            </p>
          </AnimateOnScroll>
        </NightWindow>
      </div>
    </div>
  );
}
