"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import s from "./hero-ambient.module.css";

/**
 * DRAFT: options for the hero's empty side strips (Alec, 2026-09-29: "something
 * moving ... impressive and unique that does not distract from the rest of the
 * page"). Picked with ?amb=rings | light | contours | day, and the healthcare
 * round (same day): anatomy | claims | threads. With no parameter
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

type Amb = "rings" | "light" | "contours" | "day" | "anatomy" | "claims" | "threads";
const OPTIONS: readonly Amb[] = ["rings", "light", "contours", "day", "anatomy", "claims", "threads"];

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
  if (amb === "claims")
    return (
      <div className={cls}>
        <Claims side={side} />
      </div>
    );
  if (amb === "threads")
    return (
      <div className={cls}>
        <div className={s.flip}>
          <Threads side={side} />
        </div>
      </div>
    );
  const frag = amb === "rings" ? RINGS : amb === "anatomy" ? ANATOMY : CONTOURS;
  return (
    <div className={cls}>
      <ShaderCanvas frag={frag} side={side} />
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

/* ── Claims: an insurance ledger drifting upward, dental on the left and eye
      care on the right. Below the "now" line some claims are unpaid; once they
      pass it every one is paid (the unpaid-claims offer, 2026-09-28). */

type Claim = { what: string; amt: string; unpaid?: boolean };
const DENTAL: Claim[] = [
  { what: "Crown", amt: "$1,184", unpaid: true }, { what: "Cleaning", amt: "$126" },
  { what: "X-rays", amt: "$98" }, { what: "Filling", amt: "$212", unpaid: true },
  { what: "Root canal", amt: "$1,020" }, { what: "Exam", amt: "$64", unpaid: true },
  { what: "Night guard", amt: "$410" }, { what: "Cleaning", amt: "$126", unpaid: true },
  { what: "Implant crown", amt: "$1,650" }, { what: "Sealants", amt: "$88" },
  { what: "Extraction", amt: "$240", unpaid: true }, { what: "Fluoride", amt: "$38" },
];
const EYECARE: Claim[] = [
  { what: "Eye exam", amt: "$165", unpaid: true }, { what: "Frames", amt: "$229" },
  { what: "Lenses", amt: "$184" }, { what: "Contact fitting", amt: "$95", unpaid: true },
  { what: "Retinal imaging", amt: "$39" }, { what: "Dry eye visit", amt: "$142", unpaid: true },
  { what: "Progressives", amt: "$310" }, { what: "Eye exam", amt: "$165" },
  { what: "Visual field", amt: "$78", unpaid: true }, { what: "Contacts", amt: "$120" },
  { what: "Follow-up", amt: "$89", unpaid: true }, { what: "Frames", amt: "$259" },
];

function Claims({ side }: { side: 0 | 1 }) {
  const rows = side ? EYECARE : DENTAL;
  const track = (future: boolean) => (
    <div className={s.claimTrack}>
      {[...rows, ...rows].map((r, i) => {
        const unpaid = future && r.unpaid;
        return (
          <div key={i} className={s.claim}>
            <span className={s.claimWhat}>{r.what}</span>
            <span className={s.claimLead} />
            <span className={s.claimAmt}>{r.amt}</span>
            <span className={`${s.claimChip} ${unpaid ? s.unpaid : ""}`}>{unpaid ? "Unpaid" : "Paid"}</span>
          </div>
        );
      })}
    </div>
  );
  return (
    <div className={`${s.day} ${side ? s.claimsRight : ""}`}>
      <div className={`${s.dayLayer} ${s.future}`}>{track(true)}</div>
      <div className={`${s.dayLayer} ${s.past}`}>{track(false)}</div>
      <div className={s.now} />
    </div>
  );
}

/* ── Threads (after Impilo's hero, found by the scout): real things from a
      practice drawn in one fine line down each strip, each with a thread that
      carries a small dot of work down into the product window, which covers
      the thread ends. Left: dental and paperwork. Right (mirrored): eye care
      and paperwork. */

const INK_STROKE = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" } as const;

function ticks(cx: number, cy: number, r1: number, r2: number, n: number) {
  let d = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    d += `M${(cx + Math.cos(a) * r1).toFixed(1)} ${(cy + Math.sin(a) * r1).toFixed(1)}L${(cx + Math.cos(a) * r2).toFixed(1)} ${(cy + Math.sin(a) * r2).toFixed(1)}`;
  }
  return d;
}

type Thing = { x: number; y: number; w: number; h: number; draw: React.ReactNode };

const MOLAR = (
  <>
    <path d="M14 28C12 12 28 6 37 13C41 9 49 9 53 13C62 6 78 12 76 28C75 40 69 46 67 58C65 71 63 84 57 84C51 84 50 70 45 62C40 70 39 84 33 84C27 84 25 71 23 58C21 46 15 40 14 28Z" />
    <path d="M25 31C35 37 55 37 65 31" opacity=".55" />
  </>
);
const CLAIM = (
  <>
    <rect x="0.5" y="0.5" width="68" height="86" rx="5" />
    <path d="M10 14H44" strokeWidth="2" />
    <path d="M10 28H58M10 38H58M10 48H40" />
    <rect x="10" y="60" width="9" height="9" rx="2" />
    <path d="M25 64.5H50" />
    <rect x="10" y="73" width="9" height="9" rx="2" />
    <path d="M12.5 77.5l2 2 4-4.5" />
    <path d="M25 77.5H46" />
  </>
);
const BOOK = (
  <>
    <path d="M48 10C36 4 16 4 4 8V60C16 56 36 56 48 62C60 56 80 56 92 60V8C80 4 60 4 48 10Z" />
    <path d="M48 10V62" />
    <path d="M12 20H40M12 30H40M12 40H40M12 50H32M56 20H84M56 30H84M56 40H74" opacity=".7" />
  </>
);
const TRIAL_FRAME = (
  <>
    <circle cx="24" cy="26" r="18" />
    <circle cx="76" cy="26" r="18" />
    <path d={ticks(24, 26, 20.5, 23.5, 24)} opacity=".6" />
    <path d={ticks(76, 26, 20.5, 23.5, 24)} opacity=".6" />
    <circle cx="24" cy="26" r="9" opacity=".5" />
    <path d="M42 23C46 17 54 17 58 23" />
    <path d="M6 20L1 15M94 20L99 15" />
  </>
);
const BILL = (
  <>
    <path d="M0.5 0.5H60.5V80l-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6-6 6-6-6Z" />
    <path d="M10 14H38" strokeWidth="2" />
    <path d="M10 28H50M10 38H50M10 48H50" opacity=".7" />
    <path d="M10 62H26M36 62H50" />
  </>
);
const CLIPBOARD = (
  <>
    <rect x="0.5" y="6.5" width="64" height="80" rx="6" />
    <rect x="20" y="1" width="24" height="12" rx="3" />
    <path d="M12 30H52M12 42H52M12 54H52M12 66H38" opacity=".7" />
  </>
);

const LEFT_THINGS: Thing[] = [
  { x: 40, y: 96, w: 90, h: 88, draw: MOLAR },
  { x: 58, y: 262, w: 69, h: 87, draw: CLAIM },
  { x: 30, y: 432, w: 96, h: 64, draw: BOOK },
];
const RIGHT_THINGS: Thing[] = [
  { x: 30, y: 118, w: 100, h: 50, draw: TRIAL_FRAME },
  { x: 60, y: 256, w: 61, h: 88, draw: BILL },
  { x: 40, y: 420, w: 65, h: 87, draw: CLIPBOARD },
];

const threadPath = (t: Thing, i: number) => {
  const sx = t.x + t.w + 10;
  const sy = t.y + t.h / 2;
  return `M${sx} ${sy}C${sx + 90} ${sy + 12} ${230 - i * 24} ${540 + i * 36} ${330} ${730}`;
};

function Threads({ side }: { side: 0 | 1 }) {
  const things = side ? RIGHT_THINGS : LEFT_THINGS;
  return (
    <div className={s.threadWrap}>
      <svg className={s.threadSvg} viewBox="0 0 340 740" width="340" height="740">
        {things.map((t, i) => (
          <path key={`t${i}`} className={s.thread} d={threadPath(t, i)} />
        ))}
        {things.map((t, i) => (
          <g key={`o${i}`} className={s.obj} transform={`translate(${t.x} ${t.y})`} {...INK_STROKE}>
            {t.draw}
          </g>
        ))}
      </svg>
      {things.map((t, i) => (
        <span
          key={`p${i}`}
          className={s.pulse}
          style={{ offsetPath: `path("${threadPath(t, i)}")`, animationDelay: `${-(i * 4.3 + side * 2.1)}s`, animationDuration: `${12 + i * 1.7}s` }}
        />
      ))}
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
float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
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

/** Anatomy: the contour lines again, but the map is of a molar (left, dental
    first) and an eye (right). The outline is the terracotta line; the echoes
    fade with distance and breathe on a slow noise field. */
const ANATOMY = `${HEAD}
// tapered capsule from (0,0) radius r1 to (0,h) radius r2 (Inigo Quilez)
float taper(vec2 p, float r1, float r2, float h) {
  p.x = abs(p.x);
  float b = (r1 - r2) / h, a = sqrt(1.0 - b * b), k = dot(p, vec2(-b, a));
  if (k < 0.0) return length(p) - r1;
  if (k > a * h) return length(p - vec2(0.0, h)) - r2;
  return dot(p, vec2(a, b)) - r1;
}
float molar(vec2 p) {
  float crown = length((p - vec2(0.0, 0.05)) / vec2(0.125, 0.08)) - 1.0;
  crown *= 0.08;
  float cusps = min(length(p - vec2(-0.062, 0.105)) - 0.052, length(p - vec2(0.062, 0.105)) - 0.052);
  float d = smin(crown, cusps, 0.03);
  vec2 q = p - vec2(-0.058, 0.0); q = rot(0.10) * vec2(q.x, -q.y);
  float r1 = taper(q, 0.046, 0.017, 0.2);
  q = p - vec2(0.058, 0.0); q = rot(-0.10) * vec2(q.x, -q.y);
  float r2 = taper(q, 0.046, 0.017, 0.2);
  return smin(d, min(r1, r2), 0.035);
}
// almond (a horizontal vesica), then the iris inside it
float almond(vec2 p) {
  p = abs(p.yx);
  float r = 0.2535, d = 0.1785, b = sqrt(r * r - d * d);
  return ((p.y - b) * d > p.x * b) ? length(p - vec2(0.0, b)) : length(p - vec2(-d, 0.0)) - r;
}
void main() {
  vec2 uv = place();
  float t = u_time;
  float breathe = (noise(uv * 5.0 + vec2(t * 0.12, -t * 0.09)) - 0.5) * 0.018;
  float k = 44.0;
  float fade;
  float lines, outline;
  if (u_side < 0.5) {
    vec2 p = rot(0.03 * sin(t * 0.21)) * (uv - vec2(0.18, 0.56 + 0.012 * sin(t * 0.3)));
    float d = molar(p) + breathe;
    fade = 1.0 - smoothstep(0.02, 0.30, abs(d));
    // outside echoes only: the contours inside a molar pinch into shapes that
    // read as a face (2026-09-29 screenshot), so the crown stays empty
    lines = d > 0.0 ? iso(d * k, 1.0) : 0.0;
    outline = iso(d * k, 1.8) * (1.0 - step(0.5, abs(d * k)));
  } else {
    vec2 c = vec2(0.20, 0.56 + 0.01 * sin(t * 0.27));
    vec2 p = uv - c;
    float a = almond(p) + breathe;
    vec2 look = vec2(0.018 * sin(t * 0.13), 0.008 * sin(t * 0.17 + 1.0));
    float iris = length(p - look) - 0.068 + breathe * 0.5;
    float d = a > 0.0 ? a : max(a, iris);
    fade = 1.0 - smoothstep(0.02, 0.30, abs(d));
    lines = a > 0.0 ? iso(a * k, 1.0) : iso(iris * k, 1.0);
    outline = max(iso(a * k, 1.8) * (1.0 - step(0.5, abs(a * k))),
                  a < 0.0 ? iso(iris * k, 1.6) * (1.0 - step(0.5, abs(iris * k))) : 0.0);
  }
  float aMinor = lines * 0.12 * fade * (1.0 - outline);
  float aLine = outline * 0.42;
  o = vec4(INK * aMinor + TER * aLine, aMinor + aLine);
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
