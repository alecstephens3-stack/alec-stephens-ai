"use client";

import "./paper-football.css";

import { useEffect, useRef, useState } from "react";

import { GameFrame } from "@/components/play/game-frame";

/* World units. The board is always 680 x 510 (4:3) and scaled to fit. */
const W = 680, H = 510, MAX_W = 680;
const EDGE = 78; // far edge of the desk: the goal line
const FLICKS = 10, START_X = 340, START_Y = 440;
const R = 16; // football collision radius
const S = 25; // football circumradius (drawn)
// A two-thirds pull reaches the pencils; at 150 / 820 only a near-full pull ever did.
const GRAB = 58, MAX_PULL = 130, MAX_SPEED = 1000, FRICTION = 1.5;
const AIR = 0.42, OUT_DUR = 0.5, MSG_DUR = 1.4, TAU = Math.PI * 2;
const POST_L = 270, POST_R = 410;
const MUG = { x: 425, y: 290, r: 38 };
const CUP = { x: 96, y: 150, r: 38 };
const OBSTACLES = [MUG, CUP, { x: POST_L, y: EDGE, r: 5 }, { x: POST_R, y: EDGE, r: 5 }];
const TX = [0, 1, 2].map((i) => Math.cos(-Math.PI / 2 + (i * TAU) / 3) * S);
const TY = [0, 1, 2].map((i) => Math.sin(-Math.PI / 2 + (i * TAU) / 3) * S);
const DASH = [6, 7];
const SOLID: number[] = [];

const INK_2 = "#5A4F46", ACCENT = "#DC6843", PEN = "#26336B";

type Phase = "idle" | "drag" | "fly" | "out" | "done";

function rng(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function verdict(goals: number) {
  if (goals >= 8) return "Pencil legend.";
  if (goals >= 5) return "Solid desk game.";
  if (goals >= 1) return "The mug says hi.";
  return "Warm-up round.";
}

export function PaperFootballGame({ onRound, best }: { onRound?: (score: number) => void; best?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const onRoundRef = useRef(onRound);
  const [flicks, setFlicks] = useState(0);
  const [goals, setGoals] = useState(0);
  const [status, setStatus] = useState("Your flick");

  useEffect(() => {
    onRoundRef.current = onRound;
  }, [onRound]);

  useEffect(() => {
    const wrap = wrapRef.current, canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;
    const bg = document.createElement("canvas");

    const fam = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
      getComputedStyle(document.body).getPropertyValue(name).trim() ||
      fallback;
    const hand = fam("--font-kalam", "Kalam");
    const num = fam("--font-inter-tight", "'Inter Tight', sans-serif");
    const caps = fam("--font-schibsted", "'Schibsted Grotesk', sans-serif");
    const F_GOAL = `400 96px ${hand}`, F_MISS = `400 46px ${hand}`, F_HINT = `400 26px ${hand}`;
    const F_NOTE = `400 30px ${hand}`, F_NUM = `600 88px ${num}`, F_CAPS = `700 15px ${caps}`;

    const g = {
      phase: "idle" as Phase,
      x: START_X, y: START_Y, vx: 0, vy: 0, a: 0, spin: 0, t: 0, power: 0,
      outT: 0, flutter: false, result: "", dragX: 0, dragY: 0,
      flicks: 0, goals: 0, marks: [] as boolean[], msg: "", msgT: 0, reported: false,
    };
    let k = 1, raf = 0, last = 0, alive = true, px = 0, py = 0;

    const bake = () => {
      bg.width = canvas.width;
      bg.height = canvas.height;
      const b = bg.getContext("2d");
      if (!b) return;
      b.setTransform(k, 0, 0, k, 0, 0);
      // Floor beyond the desk, with boards.
      b.fillStyle = "#86705D";
      b.fillRect(0, 0, W, EDGE);
      b.strokeStyle = "rgba(40,25,15,0.18)"; b.lineWidth = 1.5;
      b.beginPath(); b.moveTo(0, 26); b.lineTo(W, 26); b.moveTo(0, 54); b.lineTo(W, 54); b.stroke();
      // Laminate with faint grain.
      b.fillStyle = "#D9B896";
      b.fillRect(0, EDGE, W, H - EDGE);
      const rand = rng(7);
      for (let i = 0; i < 70; i++) {
        const y0 = EDGE + 6 + rand() * (H - EDGE), amp = 1 + rand() * 3;
        const fq = 0.004 + rand() * 0.01, ph = rand() * TAU;
        b.strokeStyle = `rgba(122,82,46,${(0.04 + rand() * 0.07).toFixed(3)})`;
        b.lineWidth = 0.5 + rand() * 1.4;
        b.beginPath();
        for (let x = 0; x <= W; x += 34) {
          const y = y0 + Math.sin(x * fq + ph) * amp;
          if (x === 0) b.moveTo(x, y); else b.lineTo(x, y);
        }
        b.stroke();
      }
      b.fillStyle = "rgba(90,58,34,0.38)"; b.fillRect(0, EDGE, W, 4);
      b.fillStyle = "rgba(255,245,225,0.3)"; b.fillRect(0, EDGE + 4, W, 1.5);
      // Coffee ring.
      b.strokeStyle = "rgba(112,64,32,0.2)"; b.lineWidth = 3.5;
      b.beginPath(); b.arc(180, 370, 34, 0, TAU); b.stroke();
      b.strokeStyle = "rgba(112,64,32,0.12)"; b.lineWidth = 1.5;
      b.beginPath(); b.arc(181, 369, 37, 0.4, 4.3); b.stroke();
      // Shadows are baked once here, never per frame.
      const shadow = (on: boolean) => {
        b.shadowColor = on ? "rgba(70,36,14,0.35)" : "transparent";
        b.shadowBlur = on ? 14 * k : 0;
        b.shadowOffsetX = on ? 4 * k : 0;
        b.shadowOffsetY = on ? 6 * k : 0;
      };
      // Pencil cup.
      shadow(true); b.fillStyle = "#2C2723";
      b.beginPath(); b.arc(CUP.x, CUP.y, CUP.r, 0, TAU); b.fill();
      shadow(false); b.fillStyle = "#1B1714";
      b.beginPath(); b.arc(CUP.x, CUP.y, CUP.r - 6, 0, TAU); b.fill();
      b.strokeStyle = "rgba(255,255,255,0.16)"; b.lineWidth = 3;
      b.beginPath(); b.arc(CUP.x, CUP.y, CUP.r - 2, 0, TAU); b.stroke();
      const ends: [number, number, string][] = [
        [-12, -10, "#E8B83A"], [9, -14, "#E8B83A"], [14, 6, PEN], [-6, 12, "#E8B83A"], [-16, 4, "#E8B83A"],
      ];
      for (const [dx, dy, c] of ends) {
        b.fillStyle = c;
        b.beginPath(); b.arc(CUP.x + dx, CUP.y + dy, 5, 0, TAU); b.fill();
        b.fillStyle = c === PEN ? "#1A2350" : "#3A3430";
        b.beginPath(); b.arc(CUP.x + dx, CUP.y + dy, 1.6, 0, TAU); b.fill();
      }
      // Coffee mug.
      shadow(true); b.strokeStyle = "#E7DFD0"; b.lineWidth = 9;
      b.beginPath(); b.arc(MUG.x + MUG.r + 3, MUG.y, 13, -1.25, 1.25); b.stroke();
      b.fillStyle = "#F5F1E8"; b.beginPath(); b.arc(MUG.x, MUG.y, MUG.r, 0, TAU); b.fill();
      shadow(false); b.strokeStyle = "rgba(23,19,16,0.16)"; b.lineWidth = 1.5; b.stroke();
      b.fillStyle = "#5A3822"; b.beginPath(); b.arc(MUG.x, MUG.y, MUG.r - 7, 0, TAU); b.fill();
      b.strokeStyle = "rgba(255,228,196,0.28)"; b.lineWidth = 3;
      b.beginPath(); b.arc(MUG.x, MUG.y, MUG.r - 13, 3.6, 5.0); b.stroke();
      // Goalposts: two yellow pencils standing on the edge, crossbar between.
      b.strokeStyle = "rgba(23,19,16,0.72)"; b.lineWidth = 2.5;
      b.beginPath(); b.moveTo(POST_L + 4, EDGE - 34); b.lineTo(POST_R - 4, EDGE - 34); b.stroke();
      for (const x of [POST_L, POST_R]) {
        b.fillStyle = "rgba(60,30,10,0.28)";
        b.beginPath(); b.ellipse(x + 4, EDGE + 3, 10, 4, 0, 0, TAU); b.fill();
        b.fillStyle = "#D98C7E"; b.fillRect(x - 5, EDGE - 8, 10, 8);
        b.fillStyle = "#B9B3A8"; b.fillRect(x - 5, EDGE - 15, 10, 7);
        b.fillStyle = "#E8B83A"; b.fillRect(x - 5, EDGE - 54, 10, 39);
        b.fillStyle = "rgba(150,100,20,0.35)"; b.fillRect(x - 1, EDGE - 54, 2, 39);
        b.fillStyle = "rgba(255,255,255,0.35)"; b.fillRect(x - 4, EDGE - 54, 1.5, 39);
        b.fillStyle = "#E9CFA3"; b.beginPath(); b.moveTo(x - 5, EDGE - 54); b.lineTo(x + 5, EDGE - 54); b.lineTo(x, EDGE - 68); b.fill();
        b.fillStyle = "#3A3430"; b.beginPath(); b.moveTo(x - 1.8, EDGE - 63.5); b.lineTo(x + 1.8, EDGE - 63.5); b.lineTo(x, EDGE - 68); b.fill();
      }
    };

    const tri = () => {
      ctx.beginPath();
      ctx.moveTo(TX[0], TY[0]); ctx.lineTo(TX[1], TY[1]); ctx.lineTo(TX[2], TY[2]);
      ctx.closePath();
    };

    const drawBall = () => {
      let s = 1, alpha = 1;
      const h = g.phase === "fly" && g.t < AIR ? Math.sin((Math.PI * g.t) / AIR) * g.power : 0;
      if (g.phase === "out") {
        alpha = Math.max(0, 1 - g.outT);
        if (g.flutter) s = 1 - 0.4 * g.outT;
      }
      s *= 1 + 0.14 * h;
      ctx.globalAlpha = alpha * 0.22 * (1 - h * 0.5); ctx.fillStyle = "#3B2412";
      ctx.save(); ctx.translate(g.x + 2 + h * 10, g.y + 3 + h * 12); ctx.rotate(g.a); ctx.scale(s, s);
      tri(); ctx.fill(); ctx.restore();
      ctx.globalAlpha = alpha;
      ctx.save(); ctx.translate(g.x, g.y - h * 6); ctx.rotate(g.a); ctx.scale(s, s);
      tri(); ctx.fillStyle = "#FBF8F0"; ctx.fill();
      ctx.save(); ctx.clip(); ctx.strokeStyle = "rgba(38,51,107,0.38)"; ctx.lineWidth = 1; ctx.beginPath();
      for (let yy = -S + 3; yy <= S; yy += 6) { ctx.moveTo(-S, yy); ctx.lineTo(S, yy); }
      ctx.stroke(); ctx.restore();
      ctx.strokeStyle = "rgba(23,19,16,0.16)"; ctx.beginPath();
      for (let i = 0; i < 3; i++) { ctx.moveTo(0, 0); ctx.lineTo(TX[i], TY[i]); }
      ctx.stroke();
      tri(); ctx.strokeStyle = "rgba(23,19,16,0.5)"; ctx.lineWidth = 1.3; ctx.lineJoin = "round"; ctx.stroke();
      ctx.restore(); ctx.globalAlpha = 1;
    };

    const drawAim = () => {
      const dx = g.x - g.dragX, dy = g.y - g.dragY, d = Math.hypot(dx, dy);
      if (d < 10) return;
      const len = Math.min(d, MAX_PULL) * 1.3, ux = dx / d, uy = dy / d;
      const ex = g.x + ux * len, ey = g.y + uy * len;
      ctx.strokeStyle = "rgba(23,19,16,0.25)"; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.lineTo(g.dragX, g.dragY); ctx.stroke();
      ctx.strokeStyle = PEN; ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.setLineDash(DASH);
      ctx.beginPath(); ctx.moveTo(g.x + ux * (S + 4), g.y + uy * (S + 4)); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.setLineDash(SOLID);
      ctx.beginPath();
      ctx.moveTo(ex - ux * 12 - uy * 7, ey - uy * 12 + ux * 7);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex - ux * 12 + uy * 7, ey - uy * 12 - ux * 7);
      ctx.stroke();
    };

    const drawTally = () => {
      ctx.font = F_CAPS; ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      ctx.fillStyle = INK_2; ctx.fillText("FLICKS", 28, H - 52); ctx.lineCap = "round";
      for (let i = 0; i < FLICKS; i++) {
        const x = 32 + i * 13 + (i >= 5 ? 10 : 0), used = i < g.marks.length;
        ctx.strokeStyle = !used ? "rgba(23,19,16,0.14)" : g.marks[i] ? ACCENT : "rgba(23,19,16,0.55)";
        ctx.lineWidth = used ? 3 : 2;
        ctx.beginPath(); ctx.moveTo(x, H - 42); ctx.lineTo(x + 1.5, H - 20); ctx.stroke();
      }
    };

    const drawMsg = () => {
      const p = g.msgT, sc = 1 + (1 - p) * 0.12;
      ctx.globalAlpha = Math.min(1, p * 1.6);
      ctx.save(); ctx.translate(W / 2, 178); ctx.rotate(-0.07); ctx.scale(sc, sc);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      if (g.result === "goal") {
        ctx.font = F_GOAL; ctx.fillStyle = ACCENT; ctx.fillText("GOAL", 0, 0);
        ctx.strokeStyle = ACCENT; ctx.lineWidth = 4; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(-104, 48); ctx.quadraticCurveTo(0, 38, 110, 50); ctx.stroke();
      } else {
        ctx.font = F_MISS; ctx.fillStyle = "rgba(23,19,16,0.62)"; ctx.fillText(g.msg, 0, 0);
      }
      ctx.restore(); ctx.globalAlpha = 1;
    };

    const drawEnd = () => {
      // An index card: terracotta head rule, blue lines.
      const x0 = W / 2 - 160, y0 = 130;
      ctx.fillStyle = "rgba(0,0,0,0.12)"; ctx.fillRect(x0 + 5, y0 + 7, 320, 230);
      ctx.fillStyle = "#FBF8F0"; ctx.fillRect(x0, y0, 320, 230);
      ctx.fillStyle = ACCENT; ctx.fillRect(x0, y0 + 34, 320, 1.5);
      ctx.fillStyle = "rgba(38,51,107,0.22)";
      for (let y = y0 + 64; y < y0 + 230; y += 28) ctx.fillRect(x0, y, 320, 1);
      ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
      ctx.font = F_CAPS; ctx.fillStyle = INK_2; ctx.fillText(`GOALS OUT OF ${FLICKS}`, W / 2, y0 + 24);
      ctx.font = F_NUM; ctx.fillStyle = ACCENT; ctx.fillText(String(g.goals), W / 2, y0 + 130);
      ctx.font = F_NOTE; ctx.fillStyle = PEN; ctx.fillText(verdict(g.goals), W / 2, y0 + 190);
    };

    const draw = () => {
      if (!bg.width) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.drawImage(bg, 0, 0);
      ctx.setTransform(k, 0, 0, k, 0, 0);
      drawTally();
      if (g.phase === "idle" && g.flicks === 0) {
        ctx.font = F_HINT; ctx.fillStyle = "rgba(38,51,107,0.75)";
        ctx.textAlign = "left"; ctx.textBaseline = "middle";
        ctx.fillText("pull back, let go", START_X + 42, START_Y + 22);
      }
      if (g.phase === "drag") drawAim();
      if (g.phase !== "done") drawBall();
      if (g.msgT > 0) drawMsg();
      if (g.phase === "done" && g.msgT === 0) drawEnd();
    };

    const place = () => {
      g.x = START_X; g.y = START_Y; g.vx = 0; g.vy = 0; g.a = 0; g.spin = 0;
    };

    const startOut = (flutter: boolean, result: string) => {
      Object.assign(g, { phase: "out", outT: 0, flutter, result, msg: result, msgT: 1 });
      if (result === "goal") setStatus("Goal");
    };

    const resolve = () => {
      const goal = g.result === "goal";
      g.flicks += 1; g.goals += goal ? 1 : 0; g.marks.push(goal);
      setFlicks(g.flicks); setGoals(g.goals);
      if (g.flicks >= FLICKS) {
        g.phase = "done"; setStatus("Round over");
        if (!g.reported) {
          g.reported = true;
          onRoundRef.current?.(g.goals);
        }
      } else {
        place(); g.phase = "idle"; setStatus("Your flick");
      }
    };

    const bounce = (o: { x: number; y: number; r: number }) => {
      const dx = g.x - o.x, dy = g.y - o.y, d = Math.hypot(dx, dy), min = o.r + R;
      if (d >= min || d < 0.001) return;
      const nx = dx / d, ny = dy / d, dot = g.vx * nx + g.vy * ny;
      g.x = o.x + nx * min; g.y = o.y + ny * min;
      if (dot < 0) { // restitution 0.6
        g.vx -= 1.6 * dot * nx; g.vy -= 1.6 * dot * ny; g.spin = -g.spin * 0.8 + dot * 0.01;
      }
    };

    const step = (dt: number) => {
      if (g.msgT > 0) g.msgT = Math.max(0, g.msgT - dt / MSG_DUR);
      if (g.phase === "fly") {
        g.t += dt;
        const damp = Math.exp(-FRICTION * dt);
        g.vx *= damp; g.vy *= damp; g.spin *= damp;
        const sp = Math.hypot(g.vx, g.vy);
        if (sp > 0) {
          const drop = Math.min(sp, 40 * dt);
          g.vx -= (g.vx / sp) * drop; g.vy -= (g.vy / sp) * drop;
        }
        g.x += g.vx * dt; g.y += g.vy * dt; g.a += g.spin * dt;
        for (const o of OBSTACLES) bounce(o);
        if (g.y < EDGE) startOut(true, g.x > POST_L + 5 && g.x < POST_R - 5 ? "goal" : "Wide");
        else if (g.x < 0 || g.x > W || g.y > H) startOut(true, "Off the desk");
        else if (Math.hypot(g.vx, g.vy) < 9) startOut(false, "Short");
      } else if (g.phase === "out") {
        g.outT += dt / OUT_DUR;
        if (g.flutter) {
          g.x += g.vx * dt * 0.5; g.y += g.vy * dt * 0.5;
          g.a += Math.sin(g.outT * 18) * 0.08 + g.spin * dt;
        }
        if (g.outT >= 1) resolve();
      }
    };

    const active = () => g.phase === "drag" || g.phase === "fly" || g.phase === "out" || g.msgT > 0;

    const loop = (now: number) => {
      raf = 0;
      const dt = last ? Math.min(0.033, (now - last) / 1000) : 0.016;
      last = now;
      step(dt); draw();
      if (alive && active()) raf = requestAnimationFrame(loop);
    };
    // The loop only runs while something moves; otherwise the board is drawn once.
    const kick = () => {
      if (!raf && alive) { last = 0; raf = requestAnimationFrame(loop); }
    };

    const resize = () => {
      const cw = Math.min(wrap.clientWidth, MAX_W);
      if (cw <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.style.width = `${cw}px`; canvas.style.height = `${cw * 0.75}px`;
      canvas.width = Math.round(cw * dpr); canvas.height = Math.round(cw * 0.75 * dpr);
      k = canvas.width / W;
      bake();
      if (!raf) draw();
    };

    const toWorld = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width) * W;
      py = ((e.clientY - r.top) / r.height) * H;
    };
    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      if (g.phase !== "idle") return;
      toWorld(e);
      if (Math.hypot(px - g.x, py - g.y) > GRAB) return;
      g.phase = "drag"; g.dragX = px; g.dragY = py;
      canvas.setPointerCapture(e.pointerId);
      kick();
    };
    const onMove = (e: PointerEvent) => {
      e.preventDefault();
      if (g.phase !== "drag") return;
      toWorld(e); g.dragX = px; g.dragY = py;
    };
    const onUp = () => {
      if (g.phase !== "drag") return;
      const dx = g.x - g.dragX, dy = g.y - g.dragY, d = Math.hypot(dx, dy);
      if (d < 10) { g.phase = "idle"; kick(); return; }
      g.power = Math.min(d, MAX_PULL) / MAX_PULL;
      g.vx = (dx / d) * g.power * MAX_SPEED;
      g.vy = (dy / d) * g.power * MAX_SPEED;
      g.spin = (dx / d) * 8 + (dx >= 0 ? 2 : -2);
      g.t = 0; g.phase = "fly"; setStatus("Sliding"); kick();
    };
    const onCancel = () => {
      if (g.phase === "drag") { g.phase = "idle"; kick(); }
    };

    resetRef.current = () => {
      Object.assign(g, { phase: "idle", flicks: 0, goals: 0, msgT: 0, reported: false, result: "" });
      g.marks.length = 0;
      place(); setFlicks(0); setGoals(0); setStatus("Your flick");
      if (!raf) draw();
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap); resize();
    canvas.addEventListener("pointerdown", onDown, { passive: false });
    canvas.addEventListener("pointermove", onMove, { passive: false });
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onCancel);
    document.fonts?.ready.then(() => {
      if (alive && !raf) draw();
    });

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onCancel);
      resetRef.current = () => {};
    };
  }, []);

  return (
    <GameFrame
      label="Paper football"
      title="Flick it through the pencils"
      howTo="Pull back from the paper football and let go to flick it. Land it between the two pencils at the far edge. Ten flicks a round, and the mug does not move."
      score={`${flicks} of ${FLICKS} flicks · ${goals} ${goals === 1 ? "goal" : "goals"}`}
      best={best != null ? `${best} goals` : undefined}
      status={status}
      onRestart={() => resetRef.current()}
    >
      <div ref={wrapRef} className="g-football-wrap">
        <canvas
          ref={canvasRef}
          className="g-football-canvas"
          role="img"
          aria-label={`Paper football on a desk. ${flicks} of ${FLICKS} flicks taken, ${goals} goals.`}
        />
      </div>
    </GameFrame>
  );
}
