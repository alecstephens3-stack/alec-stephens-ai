"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { DeskScene, DeskHover, DeskLight } from "@/components/desk/desk-scene";
import { DeskWindow } from "@/components/desk/desk-window";
import { BuildCard, CASES, ABOUT, SITE } from "./index";
import "@/components/desk/desk.css";
import "./bench.css";

/**
 * Alec's bench: stephensai.co/alec (2026-09-23). The same desk engine and lens
 * as /desk and /play, with one object per build on it. A click opens the build
 * in the glass window over the desk. The index strip under the desk reaches
 * every build without hunting, for keyboards and phones. The about copy is the
 * one the old /alec gallery carried, unchanged.
 */

const ARIA_LABEL =
  "Alec's workbench seen from above, with one object on it for each of the eight builds listed below. A round trial lens drifts across it, bringing whatever is under the glass into focus. Click an object to open its build.";

// The portfolio opens in afternoon light whatever the clock says: a first visit
// should not meet the bench in the dark. Live is one tap away.
const HOURS: { label: string; hour: number | null }[] = [
  { label: "3 pm", hour: 15 },
  { label: "Live", hour: null },
  { label: "8 am", hour: 8 },
  { label: "After hours", hour: 20.5 },
];

function resolveFamily(cssVar: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  const first = raw.split(",")[0]?.trim().replace(/^['"]|['"]$/g, "");
  return first || fallback;
}

function clockText(h: number) {
  const hh = Math.floor(h) % 24, mm = Math.round((h - Math.floor(h)) * 60);
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return `${h12}:${String(mm).padStart(2, "0")} ${hh >= 12 ? "pm" : "am"}`;
}

const SLUGS = new Set(CASES.map((c) => c.slug));

export function BenchStage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<DeskScene | null>(null);
  const flyTimer = useRef<number | null>(null);
  const [hover, setHover] = useState<DeskHover | null>(null);
  const [light, setLight] = useState<DeskLight | null>(null);
  const [hourIdx, setHourIdx] = useState(0);
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let scene: DeskScene | null = null;
    let cancelled = false;
    (async () => {
      const [{ init }, { buildBenchItems, BENCH_STOPS, BENCH_DESK_COLOR }] = await Promise.all([
        import("@/components/desk/desk-scene.js"),
        import("./bench-items.js"),
      ]);
      const canvas = canvasRef.current;
      if (cancelled || !canvas) return;
      scene = init(canvas, {
        hour: HOURS[0].hour,
        handFont: resolveFamily("--font-kalam", "Kalam"),
        handFont2: resolveFamily("--font-reenie", "Reenie Beanie"),
        textFont: resolveFamily("--font-inter-tight", "Inter Tight"),
        labelFont: resolveFamily("--font-schibsted", "Schibsted Grotesk"),
        pageColor: [0.957, 0.898, 0.851],
        nightPageColor: [0.086, 0.074, 0.066],
        items: buildBenchItems,
        stops: BENCH_STOPS,
        deskColor: BENCH_DESK_COLOR,
        onHover: (info) => setHover(info),
        onLight: (l) => setLight(l),
        onOpen: (_id, tool) => { if (SLUGS.has(tool)) setOpenSlug(tool); },
      });
      sceneRef.current = scene;
      (window as unknown as { __desk?: DeskScene }).__desk = scene;   // for scripted QA and the console
      setReady(true);
    })();
    return () => {
      cancelled = true;
      if (flyTimer.current != null) window.clearTimeout(flyTimer.current);
      scene?.destroy();
      sceneRef.current = null;
    };
  }, []);

  const closeWindow = useCallback(() => setOpenSlug(null), []);

  const cycleHour = useCallback(() => {
    const next = (hourIdx + 1) % HOURS.length;
    setHourIdx(next);
    sceneRef.current?.setHour(HOURS[next].hour);
  }, [hourIdx]);

  /** The index strip: bring the glass over the object, then open its build. */
  const goTo = useCallback((slug: string) => {
    if (flyTimer.current != null) window.clearTimeout(flyTimer.current);
    const scene = sceneRef.current;
    if (!scene) { setOpenSlug(slug); return; }
    scene.flyTo(slug, 1800);
    flyTimer.current = window.setTimeout(() => { flyTimer.current = null; setOpenSlug(slug); }, 900);
  }, []);

  const night = (light?.night ?? 0) > 0.5;
  const open = openSlug ? CASES.find((c) => c.slug === openSlug) ?? null : null;

  return (
    <div className={cn("desk-root bn-root", night && "is-night", ready && "is-ready")}>
      <header className="desk-dock sai-pane" role="banner">
        <Link href="/" className="desk-brand" aria-label="Stephens AI home">
          <Image src={night ? "/logo-dark.svg" : "/logo-light.svg"} alt="" width={122} height={22} priority />
        </Link>
        <span className="desk-dock-title">Alec Stephens · builds</span>
        <div className="desk-dock-actions">
          <button type="button" className="desk-chip" onClick={cycleHour} aria-label="Change the time of day">
            <span className="desk-chip-k">{HOURS[hourIdx].label}</span>
            {light ? <span className="desk-chip-v">{clockText(light.hour)}</span> : null}
          </button>
          <a href={SITE.github} target="_blank" rel="noopener noreferrer" className="desk-chip bn-dock-github">GitHub</a>
          <a href={SITE.calendly} target="_blank" rel="noopener noreferrer" className="sai-btn primary desk-cta">Talk to us</a>
        </div>
      </header>

      <section className="desk-main" aria-labelledby="bn-title">
        <div className="bn-head">
          <h1 id="bn-title" className="bn-display">Build <em>portfolio</em>.</h1>
          <p className="desk-lede">
            Eight builds, each one an object on my bench. <span>Bring the glass over one, then click it.</span>
          </p>
        </div>

        <div className="desk-frame">
          <canvas ref={canvasRef} className="desk-canvas" role="img" aria-label={ARIA_LABEL} />
          {hover && !open ? (
            <div className="desk-label sai-pane" style={{ left: hover.x, top: hover.y }} aria-hidden="true">
              <span className="desk-label-name">{hover.name}</span>
              <span className="desk-label-verb">{hover.tool ? hover.verb : "Drag it"}</span>
            </div>
          ) : null}
        </div>

        <nav className="bn-index" aria-label="The builds">
          <ul>
            {CASES.map((c) => (
              <li key={c.slug}>
                <button
                  type="button"
                  className={cn("bn-index-btn", openSlug === c.slug && "is-on")}
                  aria-current={openSlug === c.slug ? "true" : undefined}
                  onClick={() => goTo(c.slug)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section className="bn-about sai-pane" aria-labelledby="bn-about-name">
        <Image className="bn-face" src={ABOUT.headshot} width={168} height={168} alt="Alec Stephens" />
        <div className="bn-about-body">
          <span className="bn-label">{ABOUT.role}</span>
          <h2 id="bn-about-name" className="bn-about-name">{ABOUT.name}</h2>
          {ABOUT.paragraphs.map((p, i) => <p key={i} className="bn-about-p">{p}</p>)}
          <ul className="bn-creds" aria-label="Credentials">
            {ABOUT.credentials.map((c) => <li key={c} className="bn-chip">{c}</li>)}
          </ul>
          <p className="bn-cofounder">{ABOUT.cofounder}</p>
          <div className="bn-links">
            <a className="sai-btn ghost" href={`mailto:${SITE.email}`}>Email</a>
            <a className="sai-btn ghost" href={SITE.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a className="sai-btn ghost" href={SITE.upwork} target="_blank" rel="noopener noreferrer">Upwork</a>
            <a className="sai-btn ghost" href={SITE.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>
      </section>

      <DeskWindow open={!!open} title={open ? open.name : ""} onClose={closeWindow}>
        {open ? <BuildCard key={open.slug} c={open} /> : null}
      </DeskWindow>
    </div>
  );
}
