"use client";

import "./paper-plane.css";

import { useEffect, useRef, useState } from "react";

import { GameFrame } from "@/components/play/game-frame";

/* World units. The board is always 640 x 360 (16:9) and scaled to fit. */
const VW = 640;
const VH = 360;
const DESK = 316; // where things stand on the desk top
const PX = 150; // the plane's fixed screen x
const MAX_W = 680;
const PER_M = 320; // one desk width (640) is 2 m
const GATES = 6;
const DECOS = 8;
const TRAIL = 36;
const WIDTHS = [56, 66, 50, 46, 80]; // none, stapler, mug, pencil cup, books
const BOOKS = ["#E6D8C3", "#CDB89C", "#B9A58C", "#E0CDB3", "#9C8A76"];
const DASH = [4, 6];
const SOLID: number[] = [];
const TAU = Math.PI * 2;

const INK = "rgba(23,19,16,0.82)";
const CREAM = "#F5F1E8";
const ACCENT = "#DC6843";
const PEN = "#26336B";

type Phase = "ready" | "flying" | "crashing" | "over";
type Gate = { x: number; w: number; kind: number; h: number; lamp: number };
type Deco = { x: number; kind: number; ruffle: number };

const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const mod = (a: number, m: number) => ((a % m) + m) % m;
const toMetres = (d: number) => Math.floor(d / PER_M);

function newWorld() {
  return {
    phase: "ready" as Phase,
    dist: 0, y: 170, vy: 0, ang: 0, t: 0, nextGate: 600, gi: 0, di: 0,
    gates: Array.from({ length: GATES }, (): Gate => ({ x: -1e4, w: 0, kind: 0, h: 0, lamp: 0 })),
    decos: Array.from({ length: DECOS }, (): Deco => ({ x: -1e4, kind: 0, ruffle: 0 })),
    trail: new Float32Array(TRAIL * 2), tn: 0, ti: 0, tclock: 0,
    crashAt: 0, ball: 0, by: 0, bvy: 0, jag: new Float32Array(10), reported: false,
  };
}

export function PaperPlaneGame({ onRound, best }: { onRound?: (score: number) => void; best?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onRoundRef = useRef(onRound);
  const restartRef = useRef<() => void>(() => {});
  const [phase, setPhase] = useState<Phase>("ready");
  const [metres, setMetres] = useState(0);

  useEffect(() => {
    onRoundRef.current = onRound;
  }, [onRound]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !wrap || !ctx) return;
    const bg = document.createElement("canvas");
    const bctx = bg.getContext("2d");
    const w = newWorld();
    let W = 0, k = 1, raf = 0, last = 0, shownM = 0, keysOn = false;
    let fHand = "cursive", fNum = "sans-serif", fCaps = "sans-serif";
    const css = (px: number) => (px * VW) / (W || VW); // CSS px to world units

    /* ---------- world ---------- */
    const spawn = (m: number) => {
      const g = w.gates[w.gi];
      w.gi = (w.gi + 1) % GATES;
      const G = Math.max(116, 160 - m * 0.45);
      const lo = 40 + G / 2, hi = DESK - 14 - G / 2;
      const cy = lo + Math.random() * (hi - lo);
      const h = DESK - (cy + G / 2);
      g.x = w.nextGate; g.lamp = cy - G / 2;
      g.kind = h < 18 ? 0 : h < 44 ? 1 : h < 78 ? 2 : h < 112 ? 3 : 4;
      g.h = g.kind ? h : 0;
      g.w = WIDTHS[g.kind];
      const gap = Math.max(236, 320 - m * 0.8);
      const o = w.decos[w.di];
      w.di = (w.di + 1) % DECOS;
      o.x = g.x + g.w + 30 + Math.random() * (gap - g.w - 110);
      o.kind = Math.random() < 0.55 ? 0 : 1; o.ruffle = 0;
      w.nextGate += gap;
    };

    const resetWorld = () => {
      Object.assign(w, { phase: "ready", dist: 0, y: 170, vy: 0, ang: 0, t: 0, nextGate: 600, gi: 0, di: 0 });
      Object.assign(w, { tn: 0, ti: 0, tclock: 0, ball: 0, reported: false });
      for (const g of w.gates) g.x = -1e4;
      for (const o of w.decos) o.x = -1e4;
      while (w.nextGate < VW + 80) spawn(0);
      shownM = 0; setMetres(0); setPhase("ready");
    };

    const box = (x0: number, y0: number, x1: number, y1: number) =>
      PX + 18 > x0 && PX - 16 < x1 && w.y + 6 > y0 && w.y - 6 < y1;

    const hit = () => {
      if (w.y + 6 >= DESK - 2) return true;
      for (const g of w.gates) {
        const sx = g.x - w.dist;
        if (sx > PX + 60 || sx + g.w < PX - 60) continue;
        const inset = g.kind === 3 ? 7 : 3;
        if (g.kind && box(sx + inset, DESK - g.h + 2, sx + g.w - inset, DESK)) return true;
        const cx = sx + g.w / 2;
        if (box(cx - 27, g.lamp - 30, cx + 27, g.lamp - 1)) return true;
        if (box(cx - 2, 0, cx + 2, g.lamp - 30)) return true;
      }
      return false;
    };

    /* ---------- keys: only while a round is running ---------- */
    const isLift = (e: KeyboardEvent) => e.code === "Space" || e.key === " " || e.key === "ArrowUp";
    const onWinKey = (e: KeyboardEvent) => {
      if (!isLift(e) || w.phase !== "flying") return;
      e.preventDefault();
      if (!e.repeat) lift();
    };
    const keys = (on: boolean) => {
      if (on === keysOn) return;
      if ((keysOn = on)) window.addEventListener("keydown", onWinKey);
      else window.removeEventListener("keydown", onWinKey);
    };

    const lift = () => void (w.vy = Math.max(Math.min(w.vy, 60) - 250, -240));

    const crash = () => {
      Object.assign(w, { phase: "crashing", crashAt: performance.now(), ball: 0, by: w.y, bvy: -140 });
      for (let i = 0; i < w.jag.length; i++) w.jag[i] = 0.72 + Math.random() * 0.42;
      keys(false);
      setPhase("crashing");
      if (w.reported) return;
      w.reported = true;
      setMetres((shownM = toMetres(w.dist)));
      onRoundRef.current?.(shownM);
    };

    const update = (dt: number) => {
      w.t += dt;
      for (const o of w.decos) o.ruffle = Math.max(0, o.ruffle - dt * 1.4);
      if (w.phase === "flying") {
        const m = toMetres(w.dist);
        w.dist += Math.min(290, 160 + m * 1.2) * dt;
        w.vy = Math.min(300, w.vy + 700 * dt);
        w.y += w.vy * dt;
        if (w.y < 14) [w.y, w.vy] = [14, Math.max(0, w.vy)];
        w.ang += (clamp(w.vy / 520, -0.5, 0.65) - w.ang) * Math.min(1, dt * 10);
        while (w.nextGate - w.dist < VW + 80) spawn(m);
        w.tclock += dt;
        if (w.tclock > 0.045) {
          w.tclock = 0;
          w.trail[w.ti * 2] = w.dist + PX - 18;
          w.trail[w.ti * 2 + 1] = w.y + 1;
          w.ti = (w.ti + 1) % TRAIL;
          w.tn = Math.min(TRAIL, w.tn + 1);
        }
        for (const o of w.decos) {
          if (o.kind === 0 && w.y > DESK - 80 && Math.abs(o.x + 23 - (w.dist + PX)) < 40) o.ruffle = 1;
        }
        if (hit()) crash();
        else if (m !== shownM) setMetres((shownM = m));
      } else if (w.phase === "crashing") {
        w.ball = Math.min(1, w.ball + dt * 4);
        w.bvy += 900 * dt;
        w.by += w.bvy * dt;
        const floor = DESK - 10;
        if (w.by >= floor) [w.by, w.bvy] = [floor, w.bvy > 140 ? -w.bvy * 0.3 : 0];
        if ((w.ball >= 1 && w.bvy === 0) || performance.now() - w.crashAt > 1600) setPhase((w.phase = "over"));
      }
    };

    /* ---------- drawing ---------- */
    const stroke = (lw = 1.5, c = INK) => ((ctx.lineWidth = lw), (ctx.strokeStyle = c), ctx.stroke());
    const fill = (c: string) => ((ctx.fillStyle = c), ctx.fill());
    const grad = (g: CanvasGradient, a: string, b: string) => (g.addColorStop(0, a), g.addColorStop(1, b), g);
    const band = (c: string | CanvasGradient, x: number, y: number, bw: number, bh: number) =>
      bctx && ((bctx.fillStyle = c), bctx.fillRect(x, y, bw, bh));

    const bake = () => {
      [bg.width, bg.height] = [canvas.width, canvas.height];
      if (!bctx) return;
      bctx.setTransform(k, 0, 0, k, 0, 0);
      band(grad(bctx.createLinearGradient(0, 0, 0, DESK), "#F6EBE1", "#F0DCCF"), 0, 0, VW, DESK);
      const pool = bctx.createRadialGradient(440, 120, 10, 440, 120, 230);
      band(grad(pool, "rgba(255,251,244,0.7)", "rgba(255,251,244,0)"), 180, 0, VW - 180, DESK);
      bctx.fillStyle = "rgba(255,252,246,0.38)";
      for (let i = 0; i < 4; i++) {
        const x0 = 370 + (i % 2) * 62 + (i >> 1) * 20, y0 = 46 + (i >> 1) * 80;
        bctx.beginPath(); bctx.moveTo(x0, y0); bctx.lineTo(x0 + 56, y0);
        bctx.lineTo(x0 + 74, y0 + 74); bctx.lineTo(x0 + 18, y0 + 74); bctx.fill();
      }
      band(grad(bctx.createLinearGradient(0, DESK - 30, 0, DESK - 6), "rgba(23,19,16,0)", "rgba(23,19,16,0.06)"), 0, DESK - 30, VW, 24);
      band("#D9B896", 0, DESK - 6, VW, 12);
      band("rgba(255,248,235,0.55)", 0, DESK - 6, VW, 1);
      band("#B08661", 0, DESK + 6, VW, 2.5);
      band(grad(bctx.createLinearGradient(0, DESK + 8, 0, VH), "#C9A27B", "#B38A63"), 0, DESK + 8.5, VW, VH - DESK);
    };

    const plane = (x: number, y: number, a: number, s: number) => {
      ctx.save();
      ctx.translate(x, y); ctx.rotate(a); ctx.scale(s, s);
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(24, 1); ctx.lineTo(-16, 1); ctx.lineTo(-11, 8); ctx.closePath();
      fill("#E4D9C5"); stroke(1.4);
      ctx.beginPath();
      ctx.moveTo(24, 1); ctx.lineTo(-20, -10); ctx.lineTo(-16, 1); ctx.closePath();
      fill(CREAM); stroke(1.4);
      ctx.beginPath(); ctx.moveTo(22, 0.4); ctx.lineTo(-18, -4); stroke(1, "rgba(23,19,16,0.3)");
      ctx.beginPath(); ctx.arc(5, -2.2, 2.3, 0, TAU); // the doodled window
      ctx.moveTo(-4, -3.2); ctx.quadraticCurveTo(-7, -6.5, -10, -4.6); stroke(1.2, PEN);
      ctx.restore();
    };

    const ball = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * TAU, rr = r * w.jag[i];
        (i ? ctx.lineTo : ctx.moveTo).call(ctx, x + Math.cos(a) * rr, y + Math.sin(a) * rr);
      }
      ctx.closePath();
      fill(CREAM); stroke(1.4);
      ctx.beginPath();
      ctx.moveTo(x - r * 0.5, y - r * 0.2); ctx.lineTo(x + r * 0.1, y + r * 0.15); ctx.lineTo(x + r * 0.45, y - r * 0.4);
      ctx.moveTo(x - r * 0.2, y + r * 0.55); ctx.lineTo(x + r * 0.1, y + r * 0.15);
      stroke(1, "rgba(23,19,16,0.4)");
    };

    const obstacle = (g: Gate, sx: number) => {
      const { h, w: gw, lamp: L } = g;
      const top = DESK - h;
      const cx = sx + gw / 2;
      ctx.beginPath();
      ctx.moveTo(cx - 26, L); ctx.lineTo(cx + 26, L); ctx.lineTo(cx + 72, L + 110); ctx.lineTo(cx - 72, L + 110);
      fill("rgba(255,240,214,0.26)");
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, L - 30); stroke(1.4);
      ctx.beginPath();
      ctx.moveTo(cx - 12, L - 30); ctx.lineTo(cx + 12, L - 30); ctx.lineTo(cx + 28, L); ctx.lineTo(cx - 28, L); ctx.closePath();
      fill("#241E19"); stroke(1.3);
      ctx.beginPath(); ctx.ellipse(cx, L, 25, 2.8, 0, 0, TAU); fill("#F7E4C0");
      if (g.kind === 1) {
        ctx.beginPath(); ctx.rect(sx, DESK - 5, gw, 5); fill("#3A312A");
        ctx.beginPath();
        ctx.moveTo(sx + 4, DESK - 5); ctx.lineTo(sx + 4, top + 5);
        ctx.quadraticCurveTo(sx + 4, top, sx + 12, top);
        ctx.lineTo(sx + gw - 6, top + h * 0.3); ctx.lineTo(sx + gw - 2, DESK - 5); ctx.closePath();
        fill("#241E19"); stroke(1.3);
        ctx.beginPath(); ctx.moveTo(sx + 12, top + 3); ctx.lineTo(sx + gw - 12, top + h * 0.3);
        stroke(1.2, "rgba(245,241,232,0.35)");
      } else if (g.kind === 2) {
        const bw = gw - 14, r = Math.min(12, h * 0.22);
        ctx.beginPath(); ctx.arc(sx + bw, top + h * 0.45, r, -Math.PI / 2, Math.PI / 2); stroke(3.2);
        ctx.beginPath(); ctx.roundRect(sx, top, bw, h, [2, 2, 7, 7]); fill(CREAM); stroke();
        ctx.fillStyle = ACCENT;
        ctx.fillRect(sx + 0.8, top + h * 0.32, bw - 1.6, Math.max(4, h * 0.1));
        ctx.beginPath(); ctx.ellipse(sx + bw / 2, top + 2.5, bw / 2 - 2.5, 2.2, 0, 0, TAU); fill("#6B4630");
      } else if (g.kind === 3) {
        const cupH = Math.min(h * 0.55, 52);
        for (let i = 0; i < 3; i++) {
          const bx = sx + gw * (0.3 + i * 0.21), ty = top + (i === 1 ? 0 : i === 0 ? 8 : 13), lean = (i - 1) * 4;
          ctx.beginPath(); ctx.moveTo(bx, DESK - cupH + 4); ctx.lineTo(bx + lean, ty + 7);
          stroke(5, i === 1 ? PEN : "#E2C79A");
          ctx.beginPath(); ctx.moveTo(bx + lean * 0.98, ty + 7); ctx.lineTo(bx + lean, ty); stroke(2.4, "#241E19");
        }
        ctx.beginPath(); ctx.rect(sx, DESK - cupH, gw, cupH); fill("#5A4F46"); stroke(1.4);
        ctx.beginPath(); ctx.moveTo(sx + 1, DESK - cupH + 4); ctx.lineTo(sx + gw - 1, DESK - cupH + 4);
        stroke(1, "rgba(245,241,232,0.3)");
      } else if (g.kind === 4) {
        const n = Math.max(2, Math.round(h / 22)), bh = h / n;
        for (let i = 0; i < n; i++) {
          const y = DESK - (i + 1) * bh, off = [0, 6, 2][i % 3], bw = gw - (i % 2) * 8;
          ctx.beginPath(); ctx.rect(sx + off, y, bw - off, bh); fill(BOOKS[i % 5]); stroke(1.3);
          ctx.beginPath(); ctx.moveTo(sx + bw - 5, y + 2.5); ctx.lineTo(sx + bw - 5, y + bh - 2.5);
          stroke(1.2, "rgba(245,241,232,0.8)");
        }
      }
    };

    const text = (s: string, x: number, y: number, px: number, family: string, color: string, align: CanvasTextAlign) => {
      [ctx.font, ctx.fillStyle, ctx.textAlign] = [`${css(px)}px ${family}`, color, align];
      ctx.fillText(s, x, y);
    };

    const note = (lines: number, y: number) => {
      const bw = Math.min(css(340), VW - 24);
      ctx.beginPath(); ctx.roundRect(VW / 2 - bw / 2, y - css(34), bw, css(lines * 30 + 22), css(14));
      fill("rgba(245,241,232,0.86)"); stroke(1, "rgba(23,19,16,0.1)");
    };

    const draw = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(bg, 0, 0); ctx.setTransform(k, 0, 0, k, 0, 0);
      const d = w.dist;
      ctx.beginPath();
      for (let i = 0; i < 9; i++) {
        const x = mod(i * 97 - d, 720) - 40, y = DESK + 16 + (i % 3) * 9;
        ctx.moveTo(x, y); ctx.lineTo(x + 34 + (i % 4) * 8, y);
      }
      stroke(1.2, "rgba(120,84,50,0.16)");
      for (const o of w.decos) {
        const sx = o.x - d;
        if (sx < -60 || sx > VW + 20) continue;
        ctx.beginPath();
        if (o.kind === 1) { // the coffee ring
          ctx.ellipse(sx + 14, DESK + 1, 14, 3, 0, 0, TAU);
          ctx.moveTo(sx + 31, DESK + 1); ctx.ellipse(sx + 17, DESK + 1, 14, 3.2, 0, 0, Math.PI * 1.3);
          stroke(1.5, "rgba(110,70,40,0.32)");
        } else { // loose paper that ruffles as the plane skims past
          const lift = o.ruffle * (6 + 3 * Math.sin(w.t * 28 + sx));
          ctx.moveTo(sx, DESK + 3); ctx.lineTo(sx + 30, DESK + 3);
          ctx.quadraticCurveTo(sx + 40, DESK + 2 - lift * 0.5, sx + 46, DESK - 1 - lift);
          ctx.lineTo(sx + 14, DESK - 3); ctx.closePath();
          fill("#FBF8F1"); stroke(1, "rgba(23,19,16,0.45)");
        }
      }
      if (w.tn > 1) {
        ctx.setLineDash(DASH); ctx.beginPath();
        for (let i = 0; i < w.tn; i++) {
          const idx = mod(w.ti - w.tn + i, TRAIL);
          (i ? ctx.lineTo : ctx.moveTo).call(ctx, w.trail[idx * 2] - d, w.trail[idx * 2 + 1]);
        }
        if (w.phase === "flying") ctx.lineTo(PX - 18, w.y + 1);
        stroke(1.3, "rgba(38,51,107,0.3)"); ctx.setLineDash(SOLID);
      }
      for (const g of w.gates) {
        if (g.x - d > -90 && g.x - d < VW + 40) obstacle(g, g.x - d);
      }
      if (w.phase === "ready" || w.phase === "flying") plane(PX, w.y, w.ang, 1);
      else {
        if (w.ball < 1) plane(PX, w.y, w.ang, 1 - w.ball);
        ball(PX, w.by, 11 * Math.max(0.35, w.ball));
      }
      if (w.phase !== "ready") {
        text("DISTANCE", VW - 20, css(28), 13.5, fCaps, "#5A4F46", "right");
        text(`${toMetres(d)} m`, VW - 20, css(56), 24, fNum, "#171310", "right");
      }
      if (w.phase === "ready") {
        note(1, 92);
        text("Tap or press space to launch", VW / 2, 92, 19, fHand, PEN, "center");
        ctx.beginPath(); ctx.moveTo(VW / 2 - css(90), 92 + css(22)); ctx.quadraticCurveTo(PX + 10, 124, PX + 6, 152);
        ctx.moveTo(PX + 1, 145); ctx.lineTo(PX + 6, 153); ctx.lineTo(PX + 12, 146); stroke(1.4, PEN);
      } else if (w.phase === "over") {
        note(2, 110);
        text(`Crumpled at ${toMetres(d)} m`, VW / 2, 110, 22, fHand, PEN, "center");
        text("Tap the board to fly again", VW / 2, 110 + css(30), 17, fHand, "#5A4F46", "center");
      }
    };

    /* ---------- loop: runs only while a round is in the air ---------- */
    const frame = (ts: number) => {
      update(clamp((ts - last) / 1000, 0, 1 / 30));
      last = ts;
      draw();
      raf = w.phase === "flying" || w.phase === "crashing" ? requestAnimationFrame(frame) : 0;
    };

    const start = () => {
      w.phase = "flying";
      keys(true);
      setPhase("flying");
      last = performance.now();
      raf = raf || requestAnimationFrame(frame);
    };

    const action = () => {
      if (w.phase === "over" && performance.now() - w.crashAt > 700) resetWorld();
      if (w.phase === "ready") start();
      if (w.phase === "flying") lift();
    };

    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      action();
    };
    const onCanvasKey = (e: KeyboardEvent) => {
      if (!isLift(e) || w.phase === "flying") return; // in flight the window listener lifts
      e.preventDefault();
      if (!e.repeat) action();
    };

    const readFonts = () => {
      const cs = getComputedStyle(canvas);
      const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
      fHand = `${v("--font-kalam", "Kalam")}, cursive`;
      fNum = `500 ${v("--font-inter-tight", "Inter Tight")}, sans-serif`;
      fCaps = `600 ${v("--font-schibsted", "Schibsted Grotesk")}, sans-serif`;
    };

    const resize = () => {
      const nw = Math.min(MAX_W, Math.floor(wrap.clientWidth));
      if (nw < 10 || nw === W) return;
      W = nw;
      const dpr = Math.min(1.5, window.devicePixelRatio || 1);
      const H = Math.round((W * 9) / 16);
      [canvas.width, canvas.height] = [Math.round(W * dpr), Math.round(H * dpr)];
      [canvas.style.width, canvas.style.height] = [`${W}px`, `${H}px`];
      k = canvas.width / VW;
      readFonts();
      bake();
      if (!raf) draw();
    };

    restartRef.current = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      keys(false);
      resetWorld();
      if (W) draw();
    };

    while (w.nextGate < VW + 80) spawn(0);
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive && !raf && W) {
        readFonts();
        draw();
      }
    });
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("keydown", onCanvasKey);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      raf = 0;
      ro.disconnect();
      keys(false);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("keydown", onCanvasKey);
      restartRef.current = () => {};
    };
  }, []);

  const status = phase === "ready" ? "Ready" : phase === "flying" ? "In the air" : "Crumpled";

  return (
    <GameFrame
      label="Paper plane"
      title="How far can a paper plane get across the desk?"
      howTo="Tap, click or press space to give the plane a little lift. Glide through the gaps between the mugs, books and lamps. Touch anything, or the desk, and it crumples."
      score={`${metres} m`}
      best={best != null ? `${best} m` : undefined}
      status={status}
      onRestart={() => restartRef.current()}
    >
      <div ref={wrapRef} className="g-plane-wrap">
        <canvas
          ref={canvasRef}
          className="g-plane-canvas"
          tabIndex={0}
          aria-label="Paper plane board. Press space, the up arrow, or tap to lift the plane."
        />
      </div>
    </GameFrame>
  );
}
