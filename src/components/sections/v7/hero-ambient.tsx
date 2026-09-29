"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import s from "./hero-ambient.module.css";

/**
 * DRAFT: options for the hero's empty side strips (Alec, 2026-09-29: "something
 * moving ... impressive and unique that does not distract from the rest of the
 * page"). Picked with ?amb=rings | light | contours | day. With no parameter
 * nothing renders, so the draft homepage is unchanged until one is chosen.
 *
 * This is an exception to the Lens v4 motion rule (nothing on a timer except
 * the hero window), made at Alec's request, and kept honest by:
 * - living only in the side strips, never under the header pill or the product
 *   window, so no glass surface re-blurs each frame (why the lenses were retired);
 * - hiding under 1100px wide, where there are no side strips;
 * - sleeping off screen and in hidden tabs; reduced motion gets one still frame;
 * - shaders at 30 fps.
 */

type Amb = "rings" | "light" | "contours" | "day";
const OPTIONS: readonly Amb[] = ["rings", "light", "contours", "day"];

const readAmb = (): Amb | null => {
  const v = new URLSearchParams(window.location.search).get("amb");
  return OPTIONS.includes(v as Amb) ? (v as Amb) : null;
};
const noSubscribe = () => () => {};

export function HeroAmbient() {
  const amb = useSyncExternalStore(noSubscribe, readAmb, () => null);
  if (!amb) return null;
  return (
    <div className={`${s.amb} ${s[amb]}`} aria-hidden="true">
      <Side amb={amb} side={0} />
      <Side amb={amb} side={1} />
    </div>
  );
}

function Side({ amb, side }: { amb: Amb; side: 0 | 1 }) {
  const cls = `${s.side} ${side ? s.right : s.left}`;
  if (amb === "light")
    return (
      <div className={cls}>
        <div className={s.flip}>
          <div className={s.blinds} />
          <div className={`${s.blinds} ${s.blindsSoft}`} />
        </div>
      </div>
    );
  if (amb === "day")
    return (
      <div className={cls}>
        <Day side={side} />
      </div>
    );
  return (
    <div className={cls}>
      <ShaderCanvas frag={amb === "rings" ? RINGS : CONTOURS} side={side} />
    </div>
  );
}

/* ── The day: an appointment book drifting upward. Below the "now" line the
      paperwork blocks are terracotta; once they pass it they are patient time. */

type Slot = { t: string; len: number; admin?: boolean };
const MORNING: Slot[] = [
  { t: "8:00", len: 2 }, { t: "8:30", len: 1, admin: true }, { t: "8:45", len: 3 },
  { t: "9:30", len: 2, admin: true }, { t: "10:00", len: 2 }, { t: "10:30", len: 1 },
  { t: "10:45", len: 1, admin: true }, { t: "11:00", len: 2 }, { t: "11:30", len: 2, admin: true },
  { t: "12:00", len: 3 }, { t: "12:45", len: 1, admin: true }, { t: "1:00", len: 2 },
  { t: "1:30", len: 1 }, { t: "1:45", len: 2, admin: true }, { t: "2:15", len: 3 },
];
const AFTERNOON: Slot[] = [
  { t: "2:00", len: 1, admin: true }, { t: "2:15", len: 2 }, { t: "2:45", len: 2 },
  { t: "3:15", len: 1, admin: true }, { t: "3:30", len: 3 }, { t: "4:15", len: 2, admin: true },
  { t: "4:45", len: 1 }, { t: "5:00", len: 2 }, { t: "5:30", len: 2, admin: true },
  { t: "6:00", len: 1 }, { t: "6:15", len: 3 }, { t: "7:00", len: 1, admin: true },
  { t: "7:15", len: 2 }, { t: "7:45", len: 2 },
];

function Day({ side }: { side: 0 | 1 }) {
  const slots = side ? AFTERNOON : MORNING;
  const track = (future: boolean) => (
    <div className={s.dayTrack}>
      {[...slots, ...slots].map((r, i) => (
        <div key={i} className={s.slot} style={{ height: r.len * 26 }}>
          <span className={s.time}>{r.t}</span>
          <span className={`${s.block} ${future && r.admin ? s.admin : ""}`} />
        </div>
      ))}
    </div>
  );
  return (
    <div className={`${s.day} ${side ? s.dayRight : ""}`}>
      <div className={`${s.dayLayer} ${s.future}`}>{track(true)}</div>
      <div className={`${s.dayLayer} ${s.past}`}>{track(false)}</div>
      <div className={s.now} />
    </div>
  );
}

/* ── Shaders. Both draw hairlines only (ink, with terracotta for the lines that
      matter), premultiplied alpha over the page's own sky. Coordinates are
      height-normalised and mirrored so x = 0 is always the outer screen edge. */

const HEAD = `#version 300 es
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform float u_side;
out vec4 o;
const vec3 INK = vec3(0.090, 0.075, 0.063);
const vec3 TER = vec3(0.863, 0.408, 0.263);
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.02 + vec2(3.1, 1.7); a *= 0.5; }
  return v;
}
// an anti-aliased line on every integer of f, px pixels wide
float iso(float f, float px) {
  float w = fwidth(f);
  float g = abs(fract(f + 0.5) - 0.5);
  return 1.0 - smoothstep(w * px * 0.5, w * px * 0.5 + w, g);
}
vec2 place() {
  vec2 uv = gl_FragCoord.xy / u_res.y;
  if (u_side > 0.5) uv.x = u_res.x / u_res.y - uv.x;
  return uv;
}
`;

/** Placido rings: two sets of fine rings, like the ones a corneal topographer
    projects onto the eye, drifting past each other. Where they cross, the
    interference turns terracotta. */
const RINGS = `${HEAD}
void main() {
  vec2 uv = place();
  float t = u_time + u_side * 40.0;
  vec2 c1 = vec2(-0.10 + 0.05 * sin(t * 0.043), 0.60 + 0.06 * cos(t * 0.037));
  vec2 c2 = vec2(-0.03 + 0.06 * cos(t * 0.029 + 1.3), 0.50 + 0.07 * sin(t * 0.041 + 0.4));
  float a = iso(length(uv - c1) * 30.0, 1.0);
  float b = iso(length(uv - c2) * 30.0, 1.0);
  float both = a * b;
  float alpha = max(a, b) * 0.10 + both * 0.22;
  vec3 col = INK * max(a, b) * 0.10 + TER * both * 0.22;
  o = vec4(col, alpha);
}`;

/** Contour lines, like a topography map being redrawn: a few hairlines that
    slowly swell, pinch and re-form, every fifth one terracotta. */
const CONTOURS = `${HEAD}
void main() {
  vec2 uv = place();
  float t = u_time * 0.018 + u_side * 7.0;
  vec2 q = uv * 0.95;
  vec2 warp = vec2(noise(q * 1.3 + vec2(t, 0.0)), noise(q * 1.3 + vec2(5.2, -t)));
  float f = fbm(q + 0.9 * warp + vec2(0.0, t * 0.6)) * 22.0;
  float major = 1.0 - step(0.5, mod(floor(f + 0.5), 5.0));
  float aMinor = iso(f, 1.0) * 0.11 * (1.0 - major);
  float aMajor = iso(f, 1.7) * 0.32 * major;
  o = vec4(INK * aMinor + TER * aMajor, aMinor + aMajor);
}`;

const VERT = `#version 300 es
in vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

function ShaderCanvas({ frag, side }: { frag: string; side: 0 | 1 }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const gl = canvas?.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false });
    if (!canvas || !gl) return;

    const shader = (type: number, src: string) => {
      const sh = gl.createShader(type)!;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(sh));
      return sh;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    gl.uniform1f(gl.getUniformLocation(prog, "u_side"), side);

    let dirty = true;
    const ro = new ResizeObserver(() => { dirty = true; });
    ro.observe(canvas);
    const draw = (sec: number) => {
      if (dirty) {
        const r = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.round(canvas.clientWidth * r));
        canvas.height = Math.max(1, Math.round(canvas.clientHeight * r));
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        dirty = false;
      }
      gl.uniform1f(uTime, sec);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    // Free what this effect made, but never lose the context: React's dev
    // double-mount re-runs the effect on the same canvas, and a lost context
    // cannot be reacquired (it painted the strips as a white haze, 2026-09-29).
    const cleanup = () => {
      ro.disconnect();
      gl.deleteProgram(prog);
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      draw(30);
      return cleanup;
    }

    let visible = true;
    let raf = 0;
    let last = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      if (now - last >= 33) {
        last = now;
        draw((now - t0) / 1000);
      }
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!raf && visible && !document.hidden) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      wake();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", wake);
    wake();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", wake);
      cleanup();
    };
  }, [frag, side]);

  return <canvas ref={ref} className={s.canvas} />;
}
