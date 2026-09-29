"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import s from "./page-threads.module.css";

/**
 * DRAFT: the hero's threads carried down the rest of the page, quieter.
 * Two versions for Alec (2026-09-29), picked with ?threads=margin | stitches.
 * No parameter, nothing renders.
 *
 * Below the hero nothing loops: each piece draws itself in once as its
 * section scrolls into view, then holds still (Lens v4: motion is triggered,
 * never on a timer, never scrubbed by scroll). Hidden under 1100px.
 */

type Version = "margin" | "stitches";
const readVersion = (): Version | null => {
  const v = new URLSearchParams(window.location.search).get("threads");
  return v === "margin" || v === "stitches" ? v : null;
};
const noSubscribe = () => () => {};

export function PageThreads() {
  const v = useSyncExternalStore(noSubscribe, readVersion, () => null);
  if (v === "margin") return <MarginThread />;
  if (v === "stitches") return <Stitches />;
  return null;
}

/** Document position that ignores transforms (the scroll-in animations move
    labels before they are revealed; offsets do not see that). */
function docPos(el: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/* ── Version 1: the margin thread ─────────────────────────────────────────
   One thread leaves the bottom of the product window, runs down the left
   margin and ties into each section's label with a knot, like a binding
   stitch, then plugs into the booking panel at the end. */

type Knot = { x: number; y: number; tie: number; section: string };
type MarginGeo = { w: number; h: number; start: { x: number; y: number }; knots: Knot[]; end: { x: number; y: number } };

function MarginThread() {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<MarginGeo | null>(null);
  const [shown, setShown] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    const measure = () => {
      const frame = root.querySelector<HTMLElement>(".dx");
      const panel = root.querySelector<HTMLElement>("#contact .sai-night");
      if (!frame || !panel) return;
      const o = docPos(root);
      const rr = root.getBoundingClientRect();
      const fr = frame.getBoundingClientRect();
      const labels = [...root.querySelectorAll<HTMLElement>("section[id] > .draft-wrap .draft-crop:not(.is-block)")].filter(
        (el) => !el.closest("#contact"),
      );
      if (!labels.length) return;
      const first = docPos(labels[0]);
      const x = first.x - o.x - 60;
      const knots = labels.map((el) => {
        const p = docPos(el);
        return { x, y: p.y - o.y + el.offsetHeight / 2, tie: p.x - o.x - 8, section: el.closest("section")?.id ?? "" };
      });
      const pp = docPos(panel);
      setGeo({
        w: rr.width,
        h: root.offsetHeight,
        start: { x, y: Math.round(fr.bottom - rr.top) - 2 },
        knots,
        end: { x: pp.x - o.x + 64, y: pp.y - o.y },
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  // each stretch draws when the section it leads into comes on screen
  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root || !geo) return;
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).map((e) => (e.target as HTMLElement).id);
        if (hit.length) setShown((prev) => new Set([...prev, ...hit]));
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    [...geo.knots.map((k) => k.section), "contact"].forEach((id) => {
      const el = id && root.querySelector<HTMLElement>(`#${id}`);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [geo]);

  if (!geo || geo.w < 1100) return <div ref={ref} className={s.layer} aria-hidden="true" />;

  const pts = [geo.start, ...geo.knots, geo.end];
  const segs = pts.slice(1).map((b, i) => {
    const a = pts[i];
    const dy = b.y - a.y;
    const sway = i % 2 ? -26 : 26;
    return `M${a.x} ${a.y}C${a.x + sway} ${a.y + dy * 0.4} ${b.x - sway} ${b.y - dy * 0.4} ${b.x} ${b.y}`;
  });
  const ids = [...geo.knots.map((k) => k.section), "contact"];

  return (
    <div ref={ref} className={s.layer} aria-hidden="true">
      <svg className={s.svg} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
        {segs.map((d, i) => (
          <path key={i} d={d} pathLength={1} className={`${s.thread} ${shown.has(ids[i]) ? s.on : ""}`} />
        ))}
        {geo.knots.map((k) => (
          <g key={k.section} className={`${s.knot} ${shown.has(k.section) ? s.on : ""}`}>
            <path d={`M${k.x + 4} ${k.y}H${k.tie}`} className={s.tie} />
            <circle cx={k.x} cy={k.y} r={3.5} className={s.port} />
          </g>
        ))}
        <circle cx={geo.end.x} cy={geo.end.y} r={3.5} className={`${s.port} ${s.knot} ${shown.has("contact") ? s.on : ""}`} />
      </svg>
    </div>
  );
}

/* ── Version 2: stitches ──────────────────────────────────────────────────
   No page-long line. Short threads inside sections, where they connect two
   things that belong together: the service you pick and its window (re-
   stitches when you pick another), and the four steps of a project, joined
   by a dotted thread that one piece of light passes along once (Stripe's
   connector move, found by the scout). */

type Pt = { x: number; y: number };
type StitchGeo = { w: number; h: number; steps: Pt[] };

function Stitches() {
  const ref = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<StitchGeo | null>(null);
  const [svc, setSvc] = useState<{ a: Pt; b: Pt; key: string } | null>(null);
  const [howOn, setHowOn] = useState(false);

  // static geometry: the four steps
  useEffect(() => {
    const root = ref.current?.parentElement;
    if (!root) return;
    const measure = () => {
      const rail = root.querySelector<HTMLElement>("#how .draft-rail");
      if (!rail) return;
      const o = docPos(root);
      const steps = [...rail.querySelectorAll<HTMLElement>(":scope > li")].map((li, i) => {
        const p = docPos(li);
        const num = li.querySelector<HTMLElement>("p");
        const nx = num ? docPos(num).x : p.x + (i ? 28 : 0);
        return { x: nx - o.x, y: docPos(rail).y - o.y };
      });
      setGeo({ w: root.getBoundingClientRect().width, h: root.offsetHeight, steps });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, []);

  // the service stitch follows the sticky window while Services is on screen
  useEffect(() => {
    const root = ref.current?.parentElement;
    const work = root?.querySelector<HTMLElement>("#work");
    if (!root || !work) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const wr = work.getBoundingClientRect();
      if (wr.bottom < 0 || wr.top > window.innerHeight) return; // off screen: keep the last reading
      const on = work.querySelector<HTMLElement>(".sv-item.is-on .sv-head");
      const frame = work.querySelector<HTMLElement>(".sv-stage-side .sv-frame");
      if (!on || !frame || !frame.offsetParent) return setSvc(null);
      const rr = root.getBoundingClientRect();
      const h = on.getBoundingClientRect();
      const f = frame.getBoundingClientRect();
      setSvc({
        a: { x: h.right - rr.left + 8, y: h.top + h.height / 2 - rr.top },
        b: { x: f.left - rr.left, y: Math.min(Math.max(h.top + h.height / 2, f.top + 56), f.bottom - 56) - rr.top },
        key: on.textContent ?? "",
      });
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(measure); };
    const mo = new MutationObserver(kick);
    mo.observe(work, { subtree: true, attributes: true, attributeFilter: ["class"] });
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      mo.disconnect();
      window.removeEventListener("scroll", kick);
      window.removeEventListener("resize", kick);
    };
  }, []);

  useEffect(() => {
    const how = ref.current?.parentElement?.querySelector<HTMLElement>("#how");
    if (!how) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setHowOn(true); }, { rootMargin: "0px 0px -35% 0px" });
    io.observe(how);
    return () => io.disconnect();
  }, []);

  if (!geo || geo.w < 1100) return <div ref={ref} className={s.layer} aria-hidden="true" />;

  // a thread stitched through the rule at each step, dipping a little between
  const st = geo.steps;
  const end = st.length ? { x: st[st.length - 1].x + 150, y: st[0].y } : null;
  const how = st.length && end
    ? [...st.slice(1), end].reduce((d, b, i) => {
        const a = st[i];
        const mx = (a.x + b.x) / 2;
        return `${d}Q${mx} ${a.y + 9} ${b.x} ${b.y}`;
      }, `M${st[0].x} ${st[0].y}`)
    : "";

  return (
    <div ref={ref} className={s.layer} aria-hidden="true">
      <svg className={s.svg} width={geo.w} height={geo.h} viewBox={`0 0 ${geo.w} ${geo.h}`}>
        {svc && (
          <g key={svc.key}>
            <path
              className={`${s.stitch} ${s.stitchIn}`}
              pathLength={1}
              d={`M${svc.a.x} ${svc.a.y}C${svc.a.x + 22} ${svc.a.y} ${svc.b.x - 22} ${svc.b.y} ${svc.b.x} ${svc.b.y}`}
            />
            <circle className={s.port} cx={svc.b.x} cy={svc.b.y} r={3.5} />
          </g>
        )}
        {how && (
          <g className={howOn ? s.on : ""}>
            <path className={s.dotted} d={how} />
            <path className={s.once} pathLength={1} d={how} />
            {st.map((p, i) => (
              <circle
                key={i}
                className={`${s.knot} ${howOn ? s.on : ""} ${s.port}`}
                style={{ transitionDelay: `${450 + ((p.x - st[0].x) / Math.max(1, (end?.x ?? p.x) - st[0].x)) * 2400}ms` }}
                cx={p.x}
                cy={p.y}
                r={3.5}
              />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}

