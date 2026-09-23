"use client";

import "./graph-snake.css";
import { useEffect, useRef, useState } from "react";
import { GameFrame } from "@/components/play/game-frame";

/* A pencil line on a pad of graph paper. 20 x 20 cells, the paper edge is the wall. */
const N = 20;
const PAPER = "#FBF8F1";
const GRAPHITE = "#3A4256";
const BLUE_INK = "#26336B";
const TERRA = "#DC6843";
const DIRS = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] } as const;
type Dir = keyof typeof DIRS;
type Phase = "ready" | "playing" | "over";
const KEYS: Record<string, Dir> = {
  ArrowUp: "up", KeyW: "up", ArrowDown: "down", KeyS: "down",
  ArrowLeft: "left", KeyA: "left", ArrowRight: "right", KeyD: "right",
};

/** Moves per second: 9 to start, one step faster every 5 clips, capped at 16. */
const speedFor = (clips: number) => Math.min(16, 9 + Math.floor(clips / 5));
const opposite = (a: Dir, b: Dir) => DIRS[a][0] === -DIRS[b][0] && DIRS[a][1] === -DIRS[b][1];
/** Stable wobble in [-1, 1], so hand-drawn marks do not shimmer between ticks. */
const wob = (i: number) => {
  const s = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return (s - Math.floor(s)) * 2 - 1;
};

type Game = { snake: number[]; dir: Dir; queue: Dir[]; food: number; clips: number; phase: Phase; crash: number; scribble: number };
const freshGame = (): Game => ({
  snake: [10 * N + 10, 10 * N + 9, 10 * N + 8],
  dir: "right", queue: [], food: -1, clips: 0, phase: "ready", crash: -1, scribble: 0,
});

export function GraphSnakeGame({ onRound, best }: { onRound?: (score: number) => void; best?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restartRef = useRef<() => void>(() => {});
  const onRoundRef = useRef(onRound);
  const [clips, setClips] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");

  useEffect(() => {
    onRoundRef.current = onRound;
  }, [onRound]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;
    let alive = true;
    let g = freshGame();
    const occupied = new Uint8Array(N * N);
    const paper = document.createElement("canvas");
    let S = 0, W = 0, dpr = 1, pad = 0, m = 0, cell = 0, gx = 0, gy = 0;
    let fonts = { hand: "cursive", num: "sans-serif", label: "sans-serif" };
    let timer: number | undefined, scribbleTimer: number | undefined;
    let speed = speedFor(0);

    /* The clip is a unit-length wire: three nested U turns, built once. */
    const clipPath = new Path2D("M0.25 0.18 L-0.32 0.18 A0.18 0.18 0 0 1 -0.32 -0.18 L0.37 -0.18 A0.13 0.13 0 0 1 0.37 0.08 L-0.22 0.08 A0.08 0.08 0 0 1 -0.22 -0.08 L0.15 -0.08");

    const cx = (i: number) => gx + ((i % N) + 0.5) * cell;
    const cy = (i: number) => gy + (((i / N) | 0) + 0.5) * cell;

    function readFonts() {
      const cs = getComputedStyle(canvas!);
      const v = (name: string, fb: string) => `${cs.getPropertyValue(name).trim() || fb}, ${fb}`;
      fonts = { hand: v("--font-kalam", "cursive"), num: v("--font-inter-tight", "sans-serif"), label: v("--font-schibsted", "sans-serif") };
    }

    function placeFood() {
      occupied.fill(0);
      for (const c of g.snake) occupied[c] = 1;
      const free = N * N - g.snake.length;
      if (free <= 0) return false;
      let r = Math.floor(Math.random() * free);
      for (let i = 0; i < N * N; i++) {
        if (occupied[i]) continue;
        if (r-- === 0) { g.food = i; return true; }
      }
      return false;
    }

    /** The sheet, grid, margin lines and corner doodle: baked once per resize. */
    function bake() {
      [paper.width, paper.height] = [canvas!.width, canvas!.height];
      const p = paper.getContext("2d");
      if (!p) return;
      p.setTransform(dpr, 0, 0, dpr, 0, 0);
      p.save();
      Object.assign(p, { shadowColor: "rgba(112, 62, 40, 0.18)", shadowBlur: 16, shadowOffsetY: 5, fillStyle: PAPER });
      p.beginPath();
      p.roundRect(pad, pad, W, W, 5);
      p.fill();
      p.restore();
      p.lineWidth = 1;
      for (let i = 0; i <= N; i++) {
        p.strokeStyle = i % 5 === 0 ? "rgba(88, 122, 178, 0.36)" : "rgba(88, 122, 178, 0.18)";
        p.stroke(new Path2D(`M${gx + i * cell} ${gy}V${gy + N * cell}M${gx} ${gy + i * cell}H${gx + N * cell}`));
      }
      Object.assign(p, { strokeStyle: "rgba(38, 51, 107, 0.5)", lineWidth: 1.4 });
      p.stroke(new Path2D(`M${gx} ${pad + 2}V${pad + W - 2}M${pad + 2} ${gy}H${pad + W - 2}`));
      Object.assign(p, { strokeStyle: "rgba(58, 66, 86, 0.16)", lineWidth: 1 });
      p.beginPath();
      p.roundRect(pad + 0.5, pad + 0.5, W - 1, W - 1, 5);
      p.stroke();
      Object.assign(p, { fillStyle: BLUE_INK, font: `600 13px ${fonts.label}`, textBaseline: "middle" });
      p.fillText("PAPER CLIPS", gx + 8, pad + m / 2);
      // A pencil spiral in the bottom corner of the margin, the kind drawn during a long call.
      const sx = pad + m / 2, sy = pad + W - m * 0.6, R = m * 0.28;
      Object.assign(p, { strokeStyle: "rgba(58, 66, 86, 0.55)", lineWidth: 1.2 });
      p.beginPath();
      for (let t = 0; t <= Math.PI * 6; t += 0.2) {
        const r = (t / (Math.PI * 6)) * R;
        if (t === 0) p.moveTo(sx, sy);
        else p.lineTo(sx + Math.cos(t) * r, sy + Math.sin(t) * r * 0.9);
      }
      p.stroke();
    }

    function draw() {
      if (!S) return;
      const c = ctx!;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, canvas!.width, canvas!.height);
      c.drawImage(paper, 0, 0);
      c.setTransform(dpr, 0, 0, dpr, 0, 0);
      Object.assign(c, { lineCap: "round", lineJoin: "round", textBaseline: "middle" });

      // Header: the pace on the right, the count in the corner box.
      Object.assign(c, { fillStyle: BLUE_INK, font: `600 13px ${fonts.label}`, textAlign: "right" });
      c.fillText(`PACE ${speedFor(g.clips)}`, pad + W - 10, pad + m / 2);
      Object.assign(c, { textAlign: "center", fillStyle: TERRA, font: `600 ${Math.max(15, m * 0.46)}px ${fonts.num}` });
      c.fillText(String(g.clips), pad + m / 2, pad + m / 2 + 1);

      // Tally marks down the margin, in fives.
      const sp = m * 0.12, gh = Math.min(cell * 1.2, m * 0.6), rowH = gh + cell * 0.6, mx = pad + m / 2;
      const yMax = pad + W - m * 1.15;
      Object.assign(c, { strokeStyle: GRAPHITE, lineWidth: 1.6 });
      c.beginPath();
      for (let i = 0; i < g.clips; i++) {
        const k = i % 5, top = gy + cell * 0.6 + ((i / 5) | 0) * rowH;
        if (top + gh > yMax) break;
        if (k < 4) {
          const x = mx - 1.5 * sp + k * sp;
          c.moveTo(x + wob(i) * 1.2, top + wob(i + 50) * 1.5);
          c.lineTo(x + wob(i + 90) * 1.2, top + gh + wob(i + 7) * 1.5);
        } else {
          c.moveTo(mx - 2.3 * sp, top + gh * 0.8);
          c.lineTo(mx + 2.3 * sp, top + gh * 0.2);
        }
      }
      c.stroke();

      // The paper clip.
      if (g.food >= 0) {
        c.save();
        c.translate(cx(g.food), cy(g.food));
        c.rotate(-0.6 + wob(g.food) * 0.3);
        c.scale(cell * 0.95, cell * 0.95);
        c.translate(0.03, 0.04);
        for (const [col, lw] of [["rgba(23, 19, 16, 0.12)", 0.08], ["#8E959E", 0.075], ["#E4E7EB", 0.025]] as const) {
          Object.assign(c, { strokeStyle: col, lineWidth: lw });
          c.stroke(clipPath);
          if (lw === 0.08) c.translate(-0.03, -0.04);
        }
        c.restore();
      }

      // The pencil line, tail to head, then the head and its eyes.
      const s = g.snake;
      Object.assign(c, { strokeStyle: GRAPHITE, globalAlpha: 0.92, lineWidth: cell * 0.4 });
      c.beginPath();
      c.moveTo(cx(s[s.length - 1]), cy(s[s.length - 1]));
      for (let i = s.length - 2; i >= 0; i--) c.lineTo(cx(s[i]), cy(s[i]));
      c.stroke();
      Object.assign(c, { globalAlpha: 1, strokeStyle: "rgba(255, 255, 255, 0.14)", lineWidth: cell * 0.1 });
      c.stroke();
      const hx = cx(s[0]), hy = cy(s[0]);
      const [fx, fy] = DIRS[g.dir];
      c.fillStyle = GRAPHITE;
      c.beginPath();
      c.arc(hx, hy, cell * 0.3, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = PAPER;
      const er = Math.max(1.2, cell * 0.06);
      for (const side of [-1, 1]) {
        c.beginPath();
        c.arc(hx + fx * cell * 0.09 - fy * side * cell * 0.13, hy + fy * cell * 0.09 + fx * side * cell * 0.13, er, 0, Math.PI * 2);
        c.fill();
      }

      if (g.phase === "ready") {
        Object.assign(c, { fillStyle: BLUE_INK, textAlign: "center", font: `${Math.max(17, cell * 1.05)}px ${fonts.hand}` });
        c.fillText("press an arrow to start", gx + (N * cell) / 2, gy + cell * 5.5);
      }

      // The oops scribble at the collision cell, drawn in over a few quick steps.
      if (g.phase === "over" && g.crash >= 0) {
        const ox = cx(g.crash), oy = cy(g.crash), steps = Math.round(16 * g.scribble);
        Object.assign(c, { strokeStyle: TERRA, lineWidth: 1.8 });
        c.beginPath();
        for (let k = 0; k <= steps; k++) {
          const a = k * 1.9, r = cell * (0.4 + 0.22 * wob(k + 3));
          const x = ox + Math.cos(a) * r, y = oy + Math.sin(a) * r * 0.8;
          if (k === 0) c.moveTo(x, y);
          else c.lineTo(x, y);
        }
        c.stroke();
        if (g.scribble >= 1) {
          Object.assign(c, { fillStyle: TERRA, textAlign: "left", font: `${Math.max(17, cell * 1.1)}px ${fonts.hand}` });
          const tw = c.measureText("oops").width;
          const tx = Math.min(ox + cell * 0.7, pad + W - tw - 6);
          const ty = Math.max(oy - cell * 0.9, gy + cell);
          c.fillText("oops", tx < gx ? gx + 4 : tx, ty);
        }
      }
    }

    function startTimer() {
      window.clearInterval(timer);
      speed = speedFor(g.clips);
      timer = window.setInterval(tick, 1000 / speed);
    }

    function stopTimers() {
      window.clearInterval(timer);
      window.clearInterval(scribbleTimer);
      timer = scribbleTimer = undefined;
    }

    function end(cellIdx: number) {
      stopTimers();
      g.phase = "over";
      g.crash = cellIdx;
      g.scribble = 0;
      setPhase("over");
      onRoundRef.current?.(g.clips);
      if (cellIdx >= 0) {
        scribbleTimer = window.setInterval(() => {
          g.scribble = Math.min(1, g.scribble + 0.2);
          draw();
          if (g.scribble >= 1) { window.clearInterval(scribbleTimer); scribbleTimer = undefined; }
        }, 45);
      }
      draw();
    }

    function tick() {
      if (g.phase !== "playing") return;
      const next = g.queue.shift();
      if (next) g.dir = next;
      const head = g.snake[0];
      const nx = (head % N) + DIRS[g.dir][0], ny = ((head / N) | 0) + DIRS[g.dir][1];
      if (nx < 0 || ny < 0 || nx >= N || ny >= N) return end(head);
      const ni = ny * N + nx;
      const eat = ni === g.food;
      const check = eat ? g.snake.length : g.snake.length - 1; // the tail moves away unless we grow
      for (let i = 0; i < check; i++) if (g.snake[i] === ni) return end(ni);
      g.snake.unshift(ni);
      if (eat) {
        g.clips++;
        setClips(g.clips);
        if (!placeFood()) return end(-1);
        if (speedFor(g.clips) !== speed) startTimer();
      } else {
        g.snake.pop();
      }
      draw();
    }

    function steer(d: Dir) {
      if (g.phase === "over") return;
      if (g.phase === "ready") {
        if (opposite(d, g.dir)) g.snake.reverse();
        g.dir = d;
        g.phase = "playing";
        setPhase("playing");
        startTimer();
        draw();
        return;
      }
      const last = g.queue.length ? g.queue[g.queue.length - 1] : g.dir;
      if (d === last || opposite(d, last) || g.queue.length >= 2) return;
      g.queue.push(d);
    }

    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const d = KEYS[e.code];
      if (!d) return;
      e.preventDefault();
      steer(d);
    }

    let px = 0, py = 0, tracking = false;
    function onDown(e: PointerEvent) {
      [tracking, px, py] = [true, e.clientX, e.clientY];
      canvas!.setPointerCapture?.(e.pointerId);
    }
    function onMove(e: PointerEvent) {
      if (!tracking) return;
      const dx = e.clientX - px, dy = e.clientY - py;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
      steer(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
      [px, py] = [e.clientX, e.clientY];
    }
    const onUp = () => { tracking = false; };

    function resize() {
      const w = Math.min(560, Math.floor(wrap!.clientWidth));
      if (!w || w === S) return;
      S = w;
      dpr = Math.min(1.5, window.devicePixelRatio || 1);
      canvas!.width = canvas!.height = Math.round(S * dpr);
      canvas!.style.width = canvas!.style.height = `${S}px`;
      pad = Math.max(8, S * 0.03);
      W = S - 2 * pad;
      m = W * 0.1;
      cell = (W - m - W * 0.03) / N;
      gx = gy = pad + m;
      readFonts();
      bake();
      draw();
    }

    restartRef.current = () => {
      stopTimers();
      g = freshGame();
      placeFood();
      setClips(0);
      setPhase("ready");
      draw();
    };

    placeFood();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();
    document.fonts?.ready.then(() => {
      if (!alive) return;
      readFonts();
      bake();
      draw();
    });
    const pointer = [["pointerdown", onDown], ["pointermove", onMove], ["pointerup", onUp], ["pointercancel", onUp]] as const;
    window.addEventListener("keydown", onKey);
    for (const [ev, fn] of pointer) canvas.addEventListener(ev, fn);
    return () => {
      alive = false;
      stopTimers();
      ro.disconnect();
      window.removeEventListener("keydown", onKey);
      for (const [ev, fn] of pointer) canvas.removeEventListener(ev, fn);
    };
  }, []);

  const status = phase === "ready" ? "Press an arrow" : phase === "playing" ? "Go" : "Round over";
  return (
    <GameFrame
      label="Graph paper"
      title="Pencil snake"
      howTo="Steer the pencil line with the arrow keys, WASD, or a swipe. Each paper clip makes it one square longer. Stay off the paper edge and off your own line."
      score={`${clips} ${clips === 1 ? "clip" : "clips"} · pace ${speedFor(clips)}`}
      best={best != null ? `${best} clips` : undefined}
      status={status}
      onRestart={() => restartRef.current()}
    >
      <div ref={wrapRef} className="g-snake-board">
        <canvas
          ref={canvasRef}
          className="g-snake-canvas"
          role="img"
          aria-label={`Snake on graph paper. ${clips} paper clips collected.`}
        />
      </div>
    </GameFrame>
  );
}
