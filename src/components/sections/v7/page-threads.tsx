"use client";

import { useEffect, useRef, useState } from "react";
import s from "./page-threads.module.css";

/**
 * The hero's threads carried below it, quietly: stitches (Alec's pick,
 * 2026-09-29, over a knotted margin thread that ran down the whole page; that
 * one is in git at 82f9c1f). Site-only: not part of the Lens design system.
 *
 * Below the hero nothing loops: each piece draws itself in once as its
 * section scrolls into view, then holds still (Lens v4: motion is triggered,
 * never on a timer, never scrubbed by scroll). Hidden under 1100px.
 */

export function PageThreads() {
  return <Stitches />;
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

/* ── Stitches ─────────────────────────────────────────────────────────────
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

