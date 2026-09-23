"use client";

import "./eraser-curling.css";
import { useEffect, useRef, useState } from "react";
import { GameFrame } from "@/components/play/game-frame";

/* Board units: the desk is 300 wide and 400 deep, player at the bottom. */
const W = 300;
const H = 400;
const R = 13; // eraser collision radius
const TARGET = { x: 150, y: 88 };
const BANDS = [
  { r: 18, pts: 10 },
  { r: 38, pts: 5 },
  { r: 60, pts: 2 },
];
const START = { x: 150, y: 305 };
const THROW_LINE = 280;
const STAPLER = { x: 170, y: 190, w: 62, h: 22 };
const PULL_MAX = 80;
const POWER = 5; // launch speed per unit of pull
const FRICTION = 230; // units per second squared
const STOP = 4;
const ROUND = 5;
const PINK = "#EBA3A3";
const INK = "#26336B";
const PENCIL = "rgba(62, 56, 50, 0.5)";

type Eraser = { x: number; y: number; vx: number; vy: number; a: number; w: number; out: boolean; pts: number | null };
type Phase = "aim" | "pull" | "fly" | "done";
type Game = { list: Eraser[]; thrown: number; phase: Phase; px: number; py: number; pointer: number; reported: boolean };
type Ui = { total: number; thrown: number; phase: Phase };

function newEraser(): Eraser {
  return { x: START.x, y: START.y, vx: 0, vy: 0, a: -0.06, w: 0, out: false, pts: null };
}
function newGame(): Game {
  return { list: [newEraser()], thrown: 0, phase: "aim", px: START.x, py: START.y, pointer: -1, reported: false };
}
function pointsFor(e: Eraser): number {
  if (e.out) return 0;
  const d = Math.hypot(e.x - TARGET.x, e.y - TARGET.y);
  for (const b of BANDS) if (d <= b.r) return b.pts;
  return 0;
}
function totalOf(g: Game): number {
  let t = 0;
  for (let i = 0; i < g.thrown; i++) t += g.list[i].pts ?? 0;
  return t;
}
/** Seeded random so the desk grain is the same on every bake. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function fillRound(c: CanvasRenderingContext2D, fill: string, x: number, y: number, w: number, h: number, r: number | number[]) {
  c.fillStyle = fill;
  c.beginPath();
  c.roundRect(x, y, w, h, r);
  c.fill();
}
function stroke(c: CanvasRenderingContext2D, style: string, width: number, pts: number[], dash: number[] = []) {
  c.strokeStyle = style;
  c.lineWidth = width;
  c.setLineDash(dash);
  c.beginPath();
  for (let i = 0; i < pts.length; i += 2) c.lineTo(pts[i], pts[i + 1]);
  c.stroke();
  c.setLineDash([]);
}
function disc(c: CanvasRenderingContext2D, fill: string, x: number, y: number, rx: number, ry = rx, rot = 0) {
  c.fillStyle = fill;
  c.beginPath();
  c.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  c.fill();
}

export function EraserCurlingGame({ onRound, best }: { onRound?: (score: number) => void; best?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onRoundRef = useRef(onRound);
  const restartRef = useRef<() => void>(() => {});
  const [ui, setUi] = useState<Ui>({ total: 0, thrown: 0, phase: "aim" });

  useEffect(() => {
    onRoundRef.current = onRound;
  }, [onRound]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g: Game = newGame();
    const bg = document.createElement("canvas");
    let k = 1; // board unit to device pixel
    let raf = 0;
    let last = 0;
    let alive = true;
    const fonts = { hand: "'Kalam', cursive", num: "'Inter Tight', sans-serif", label: "'Schibsted Grotesk', sans-serif" };
    const sync = () => setUi({ total: totalOf(g), thrown: g.thrown, phase: g.phase });

    /* The desk, the coffee ring, the pencil bands and the stapler never move: bake once per resize. */
    const bake = () => {
      bg.width = canvas.width;
      bg.height = canvas.height;
      const c = bg.getContext("2d");
      if (!c) return;
      const cs = getComputedStyle(document.documentElement);
      const v = (name: string, fb: string) => `${cs.getPropertyValue(name).trim() || fb}, ${fb}`;
      fonts.hand = `${v("--font-kalam", "'Kalam'")}, cursive`;
      fonts.num = `${v("--font-inter-tight", "'Inter Tight'")}, sans-serif`;
      fonts.label = `${v("--font-schibsted", "'Schibsted Grotesk'")}, sans-serif`;
      c.setTransform(k, 0, 0, k, 0, 0);
      c.fillStyle = "#D9B896";
      c.fillRect(0, 0, W, H);
      const rand = rng(7);
      c.lineWidth = 0.6;
      for (let i = 0; i < 90; i++) {
        const [x, sway] = [rand() * W, (rand() - 0.5) * 18];
        c.strokeStyle = `rgba(122, 78, 38, ${0.05 + rand() * 0.08})`;
        c.beginPath();
        c.moveTo(x, -4);
        c.bezierCurveTo(x + sway, H * 0.33, x - sway, H * 0.66, x + sway * 0.4, H + 4);
        c.stroke();
      }
      const light = c.createRadialGradient(W * 0.45, H * 0.35, 20, W * 0.5, H * 0.5, H * 0.75);
      light.addColorStop(0, "rgba(255, 244, 225, 0.22)");
      light.addColorStop(1, "rgba(90, 55, 25, 0.16)");
      c.fillStyle = light;
      c.fillRect(0, 0, W, H);

      // Coffee ring: an uneven brown ring with a pale stain inside.
      disc(c, "rgba(128, 80, 40, 0.08)", TARGET.x, TARGET.y, 64);
      for (let i = 0; i < 3; i++) {
        c.strokeStyle = `rgba(112, 66, 30, ${0.32 - i * 0.08})`;
        c.lineWidth = 3 - i * 0.8;
        c.beginPath();
        c.arc(TARGET.x + (i - 1) * 0.8, TARGET.y + i * 0.6, 64 + i * 0.7, 0.3 * i, Math.PI * 2 - 0.2 + 0.3 * i);
        c.stroke();
      }
      // Pencil bands, each drawn twice with a small wobble.
      c.strokeStyle = PENCIL;
      c.lineWidth = 0.8;
      for (const b of BANDS) {
        for (let p = 0; p < 2; p++) {
          c.beginPath();
          c.ellipse(TARGET.x + p * 0.5, TARGET.y - p * 0.4, b.r + p * 0.4, b.r - p * 0.3, 0, 0, Math.PI * 2);
          c.stroke();
        }
      }
      c.fillStyle = "rgba(62, 56, 50, 0.7)";
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.font = `14px ${fonts.hand}`;
      for (const [t, dx, dy] of [["10", 0, 1], ["5", 0, -28], ["2", 0, -49], ["5", 28, 1], ["2", 49, 1]] as const) {
        c.fillText(t, TARGET.x + dx, TARGET.y + dy);
      }

      // Throw line.
      stroke(c, PENCIL, 0.8, [18, THROW_LINE, W - 18, THROW_LINE], [4, 4]);
      c.textAlign = "left";
      c.fillStyle = "rgba(62, 56, 50, 0.75)";
      c.font = `600 10px ${fonts.label}`;
      c.fillText("THROW LINE", 18, THROW_LINE - 9);

      // Stapler: shadow, base, top arm, hinge.
      const s = STAPLER;
      fillRound(c, "rgba(40, 24, 10, 0.22)", s.x + 3, s.y + 4, s.w, s.h, 7);
      fillRound(c, "#241E19", s.x, s.y, s.w, s.h, 7);
      fillRound(c, "#5A4F46", s.x + 4, s.y + 4, s.w - 12, s.h - 8, 5);
      stroke(c, "rgba(245, 241, 232, 0.35)", 1, [s.x + 8, s.y + 6.5, s.x + s.w - 14, s.y + 6.5]);
      disc(c, "#DC6843", s.x + s.w - 6, s.y + s.h / 2, 2.2);
    };

    const drawEraser = (e: Eraser) => {
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.rotate(e.a);
      fillRound(ctx, "rgba(60, 30, 15, 0.2)", -15, -8, 34, 20, 4);
      fillRound(ctx, PINK, -17, -10, 34, 20, [4, 9, 4, 4]); // the worn corner
      fillRound(ctx, "rgba(255, 255, 255, 0.25)", -15, -8.5, 30, 4, 2);
      disc(ctx, "rgba(92, 86, 86, 0.3)", 10, 3, 6, 4, 0.4); // grey smudge
      ctx.restore();
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(bg, 0, 0);
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.textBaseline = "middle";
      for (let i = 0; i < g.thrown; i++) if (!g.list[i].out) drawEraser(g.list[i]);
      ctx.fillStyle = INK;
      ctx.font = `15px ${fonts.hand}`;
      for (let i = 0; i < g.thrown; i++) {
        const e = g.list[i];
        if (e.out || e.pts == null || e.vx !== 0 || e.vy !== 0) continue;
        const onRight = e.x < W - 44;
        ctx.textAlign = onRight ? "left" : "right";
        ctx.fillText(e.pts > 0 ? `+${e.pts}` : "0", e.x + (onRight ? 21 : -21), e.y - 12);
      }
      if (g.phase === "aim" || g.phase === "pull") {
        const e = g.list[g.thrown];
        if (g.phase === "pull") {
          const [dx, dy] = [e.x - START.x, e.y - START.y];
          stroke(ctx, PENCIL, 1, [START.x - 20, START.y, e.x, e.y, START.x + 20, START.y]);
          if (Math.hypot(dx, dy) > 6) stroke(ctx, "#DC6843", 1.6, [START.x, START.y, START.x - dx * 1.6, START.y - dy * 1.6], [5, 5]);
        }
        drawEraser(e);
        if (g.thrown === 0 && g.phase === "aim") {
          ctx.fillStyle = INK;
          ctx.textAlign = "center";
          ctx.font = `15px ${fonts.hand}`;
          ctx.fillText("pull me back, then let go", START.x, H - 58);
        }
      }
      // Erasers still in the pencil case, bottom right.
      const left = ROUND - g.thrown - (g.phase === "done" ? 0 : 1);
      for (let i = 0; i < left; i++) fillRound(ctx, PINK, W - 22 - i * 14, H - 16, 10, 6, 2);
      if (g.phase === "done") {
        fillRound(ctx, "rgba(245, 241, 232, 0.82)", W / 2 - 80, H / 2 + 26, 160, 54, 12);
        ctx.textAlign = "center";
        ctx.fillStyle = "#171310";
        ctx.font = `600 10px ${fonts.label}`;
        ctx.fillText("ROUND TOTAL", W / 2, H / 2 + 40);
        ctx.fillStyle = INK;
        ctx.font = `500 24px ${fonts.num}`;
        ctx.fillText(`${totalOf(g)}`, W / 2, H / 2 + 62);
      }
    };

    const collideStapler = (e: Eraser) => {
      const s = STAPLER;
      const cx = Math.max(s.x, Math.min(e.x, s.x + s.w));
      const cy = Math.max(s.y, Math.min(e.y, s.y + s.h));
      let [nx, ny] = [e.x - cx, e.y - cy];
      const d = Math.hypot(nx, ny);
      if (d >= R) return;
      if (d < 0.001) {
        [nx, ny] = [0, e.y < s.y + s.h / 2 ? -1 : 1];
        e.y = ny < 0 ? s.y - R : s.y + s.h + R;
      } else {
        [nx, ny] = [nx / d, ny / d];
        [e.x, e.y] = [cx + nx * R, cy + ny * R];
      }
      const vn = e.vx * nx + e.vy * ny;
      if (vn >= 0) return;
      e.vx -= 1.55 * vn * nx;
      e.vy -= 1.55 * vn * ny;
      e.w += (e.vx * -ny + e.vy * nx) * 0.02;
    };

    const collidePair = (a: Eraser, b: Eraser) => {
      let [nx, ny] = [b.x - a.x, b.y - a.y];
      const d = Math.hypot(nx, ny);
      if (d >= R * 2 || d < 0.001) return;
      [nx, ny] = [nx / d, ny / d];
      const push = (R * 2 - d) / 2;
      a.x -= nx * push; a.y -= ny * push;
      b.x += nx * push; b.y += ny * push;
      const vr = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
      if (vr >= 0) return;
      const j = (-(1 + 0.8) * vr) / 2;
      a.vx -= j * nx; a.vy -= j * ny;
      b.vx += j * nx; b.vy += j * ny;
      const vt = (b.vx - a.vx) * -ny + (b.vy - a.vy) * nx;
      a.w += vt * 0.015;
      b.w -= vt * 0.015;
    };

    /** Advances the slide. Returns true while anything still moves. */
    const step = (dt: number) => {
      const n = g.thrown;
      for (let i = 0; i < n; i++) {
        const e = g.list[i];
        if (e.out) continue;
        const sp = Math.hypot(e.vx, e.vy);
        if (sp > 0) {
          const next = sp - FRICTION * dt;
          const f = next < STOP ? 0 : next / sp;
          e.vx *= f;
          e.vy *= f;
        }
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        e.a += e.w * dt;
        e.w *= Math.max(0, 1 - 2.5 * dt);
        if (Math.abs(e.w) < 0.02) e.w = 0;
        collideStapler(e);
        if (e.x < 0 || e.x > W || e.y < 0 || e.y > H) Object.assign(e, { out: true, vx: 0, vy: 0, w: 0 });
      }
      for (let i = 0; i < n; i++) {
        if (g.list[i].out) continue;
        for (let j = i + 1; j < n; j++) if (!g.list[j].out) collidePair(g.list[i], g.list[j]);
      }
      // Checked after collisions, so an eraser that was just knocked counts as moving.
      return g.list.some((e, i) => i < n && !e.out && (e.vx !== 0 || e.vy !== 0 || e.w !== 0));
    };

    const settle = () => {
      for (let i = 0; i < g.thrown; i++) g.list[i].pts = pointsFor(g.list[i]);
      if (g.thrown >= ROUND) {
        g.phase = "done";
        if (!g.reported) onRoundRef.current?.(totalOf(g));
        g.reported = true;
        canvas.classList.add("g-eraser-idle");
      } else {
        g.list.push(newEraser());
        g.phase = "aim";
      }
      sync();
    };

    const frame = (t: number) => {
      raf = 0;
      if (!alive) return;
      if (g.phase === "fly") {
        const dt = Math.min(1 / 30, last ? (t - last) / 1000 : 1 / 60);
        last = t;
        step(dt / 2);
        if (!step(dt / 2)) settle();
      }
      draw();
      if (g.phase === "fly") raf = requestAnimationFrame(frame);
    };
    const request = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const toBoard = (ev: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: ((ev.clientX - r.left) / r.width) * W, y: ((ev.clientY - r.top) / r.height) * H };
    };
    const onDown = (ev: PointerEvent) => {
      ev.preventDefault();
      if (g.phase !== "aim") return;
      const p = toBoard(ev);
      if (Math.hypot(p.x - START.x, p.y - START.y) > 48) return;
      g.phase = "pull";
      g.pointer = ev.pointerId;
      g.px = p.x - START.x;
      g.py = p.y - START.y;
      canvas.setPointerCapture(ev.pointerId);
      canvas.classList.add("g-eraser-pulling");
    };
    const onMove = (ev: PointerEvent) => {
      if (g.phase !== "pull" || ev.pointerId !== g.pointer) return;
      ev.preventDefault();
      const p = toBoard(ev);
      let dx = p.x - START.x - g.px;
      let dy = p.y - START.y - g.py;
      const len = Math.hypot(dx, dy);
      if (len > PULL_MAX) [dx, dy] = [(dx * PULL_MAX) / len, (dy * PULL_MAX) / len];
      const e = g.list[g.thrown];
      e.x = START.x + dx;
      e.y = START.y + dy;
      e.a = -0.06 + dx * 0.004;
      request();
    };
    const onUp = (ev: PointerEvent) => {
      if (g.phase !== "pull" || ev.pointerId !== g.pointer) return;
      ev.preventDefault();
      canvas.classList.remove("g-eraser-pulling");
      if (canvas.hasPointerCapture(ev.pointerId)) canvas.releasePointerCapture(ev.pointerId);
      const e = g.list[g.thrown];
      const [dx, dy] = [e.x - START.x, e.y - START.y];
      [e.x, e.y] = [START.x, START.y];
      if (Math.hypot(dx, dy) < 8 || ev.type === "pointercancel") {
        g.phase = "aim";
        request();
        return;
      }
      e.vx = -dx * POWER;
      e.vy = -dy * POWER;
      e.w = (Math.random() - 0.5) * 1.4 - dx * 0.01;
      g.thrown += 1;
      g.phase = "fly";
      last = 0;
      sync();
      request();
    };

    const resize = () => {
      const cssW = Math.min(wrap.clientWidth, 520);
      if (cssW <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const pw = Math.round(cssW * dpr);
      if (pw === canvas.width) return;
      canvas.width = pw;
      canvas.height = Math.round(((cssW * H) / W) * dpr);
      k = pw / W;
      bake();
      draw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    document.fonts?.ready.then(() => alive && (bake(), draw()));

    restartRef.current = () => {
      Object.assign(g, newGame());
      canvas.classList.remove("g-eraser-idle", "g-eraser-pulling");
      sync();
      request();
    };

    const events: [string, (ev: PointerEvent) => void][] = [["pointerdown", onDown], ["pointermove", onMove], ["pointerup", onUp], ["pointercancel", onUp]];
    for (const [name, fn] of events) canvas.addEventListener(name, fn as EventListener, { passive: false });
    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      for (const [name, fn] of events) canvas.removeEventListener(name, fn as EventListener);
      restartRef.current = () => {};
    };
  }, []);

  const done = ui.phase === "done";
  const score = done
    ? `All ${ROUND} erasers · ${ui.total} points`
    : `Eraser ${Math.min(ui.thrown + 1, ROUND)} of ${ROUND} · ${ui.total} points`;
  const status = done ? "Round over" : ui.phase === "fly" ? "Sliding" : "Your throw";

  return (
    <GameFrame
      label="Eraser curling"
      title="Slide it into the coffee ring"
      howTo="Pull the eraser back toward you and let go. Centre scores 10, the middle band 5, the outer band 2. Five erasers a round, and they can knock each other around."
      score={score}
      best={best != null ? `${best} points` : undefined}
      status={status}
      onRestart={() => restartRef.current()}
    >
      <div ref={wrapRef} className="g-eraser-wrap">
        <canvas ref={canvasRef} className="g-eraser-canvas" aria-label="A desk seen from above with a coffee ring target at the far end" />
        <p className="g-eraser-sr" aria-live="polite">{score}</p>
      </div>
    </GameFrame>
  );
}
