/*
 * desk-scene.js · "the front desk": the lens-on-the-desk hero grown into a page.
 * Forked from lens-hero.js on 2026-09-23 (Yamagata Build Day). Same optics,
 * same sprites; adds objects that open tools, drag-and-throw physics, the
 * time-of-day window light with Night after hours, the pen that writes your
 * note, and fly-to hooks for the tour.
 * Self-contained, framework-free. WebGL1 with a 2D-canvas still fallback.
 *
 *   import { init } from './lens-hero.js'
 *   const hero = init(canvas, { progress: 0 })
 *   hero.setProgress(0..1)   // scroll-scrubbed growth of the lens
 *   hero.destroy()
 *
 * The desk is painted with Canvas2D into per-item sprites (a messy version and
 * a tidy version of each), composed every frame into one scene canvas, uploaded
 * as a texture, blurred on the GPU (disc bokeh), and composited by a fragment
 * shader that does the optics: magnification, rim distortion, chromatic
 * fringing, metal rim, engraved tab, contact shadow, caustic, grain, feather.
 */

const DEFAULTS = {
  scrollGrow: false,      // OFF (founder, 2026-09-22): the lens keeps one size and scrolling never touches it. true restores setProgress/pinScroll.
  progress: 0,            // initial scroll progress 0..1
  maxDpr: 1.5,            // devicePixelRatio cap (1.5: sharp enough under the glass, half the pixels of 2)
  sceneScale: 1.15,       // scene texture supersample (sharpness under magnification)
  lensRadius: 98,         // design units (wide layout); tall layout scales it
  magnification: 1.16,
  blurRadius: 2.9,        // design units, depth of field outside the glass
  grain: 0.055,
  tallBelow: 520,         // css px width under which the portrait layout is used
  handFont: 'Kalam',            // the office manager's hand
  handFont2: 'Reenie Beanie',   // whoever took the phone message
  textFont: 'Inter Tight',
  labelFont: 'Schibsted Grotesk',
  power: '+2.00',
  reducedMotion: null,    // null = read the media query
  followPointer: true,
  pageColor: [0.965, 0.898, 0.843],   // what the window edge melts into
  nightPageColor: [0.086, 0.074, 0.066],
  hour: null,             // null = the real clock; a number pins the light for a demo
  onOpen: null,           // (id, tool) when an object is clicked
  onHover: null,          // ({id, name, verb, tool, x, y} | null) as the pointer moves over objects
  onLight: null,          // ({hour, night, warm}) when the light target changes
  items: null,            // (painters) => items: a different set of objects on the same desk (the sandbox). null = the front desk
  stops: null,            // { wide: [[x, y], ...], tall: [...] } the idle lens visits, when items are supplied
  deskColor: null,        // the laminate colour; null = the front desk's
};

/* ------------------------------------------------------------------ utils */
function mulberry(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const INK = '#171310', ACCENT = '#DC6843', CREAM = '#F5F1E8';

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
  return c;
}

let _noiseTile = null;
function noiseTile() {
  if (_noiseTile) return _noiseTile;
  const n = 256, c = makeCanvas(n, n), x = c.getContext('2d');
  const id = x.createImageData(n, n), r = mulberry(7);
  for (let i = 0; i < n * n; i++) {
    const v = 128 + (r() - 0.5) * 150;
    id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255;
  }
  x.putImageData(id, 0, 0);
  _noiseTile = c; return c;
}

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
}

/* grain clipped to whatever is already painted */
function grainAtop(ctx, w, h, alpha, px) {
  ctx.save();
  ctx.globalCompositeOperation = 'source-atop';
  ctx.globalAlpha = alpha;
  const t = noiseTile();
  // draw the tile in device pixels so the grain stays fine at any scale
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const W = ctx.canvas.width, H = ctx.canvas.height;
  ctx.globalCompositeOperation = 'source-atop';
  for (let y = 0; y < H; y += 512) for (let x = 0; x < W; x += 512) ctx.drawImage(t, x, y, 512, 512);
  ctx.restore();
  void w; void h; void px;
}

/* a sheet of paper lit from the top left */
function paper(ctx, w, h, color, o = {}) {
  const r = o.radius ?? 1.2;
  rr(ctx, 0, 0, w, h, r); ctx.fillStyle = color; ctx.fill();
  ctx.save(); rr(ctx, 0, 0, w, h, r); ctx.clip();
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, 'rgba(255,255,255,0.30)'); g.addColorStop(0.45, 'rgba(255,255,255,0)');
  g.addColorStop(1, 'rgba(96,60,36,0.10)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  if (o.curl) { // bottom edge lifts: light band then a darker lip
    const c = ctx.createLinearGradient(0, h * 0.62, 0, h);
    c.addColorStop(0, 'rgba(255,255,255,0)'); c.addColorStop(0.55, 'rgba(255,255,255,0.22)');
    c.addColorStop(0.86, 'rgba(255,255,255,0.05)'); c.addColorStop(1, 'rgba(90,55,30,0.16)');
    ctx.fillStyle = c; ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
  ctx.save(); rr(ctx, 0.25, 0.25, w - 0.5, h - 0.5, r);
  ctx.strokeStyle = 'rgba(80,50,30,0.13)'; ctx.lineWidth = 0.5; ctx.stroke(); ctx.restore();
}

/* handwriting: ONE layout whose messiness m (1 = hurried scrawl, 0 = written neatly) is a parameter.
   Same words, same hand, same ink, same line breaks. Nothing is ever cross-faded. */
function script(ctx, lines, m, o = {}) {
  const font = o.font, color = o.color ?? '#27325A', weight = o.weight ?? 400;
  ctx.save(); ctx.fillStyle = color; ctx.strokeStyle = color; ctx.textBaseline = 'alphabetic';
  lines.forEach((ln, li) => {
    const r = mulberry((o.seed ?? 1) * 97 + li * 13);
    const size = ln.size, lr = r(), lx = r(), ly = r(), ls = r(), ph = r() * 6;
    ctx.save();
    ctx.translate(ln.x + (lx - 0.5) * 7 * m, ln.y + (ly - 0.5) * 6 * m);
    ctx.rotate(((lr - 0.5) * 0.20 + (ln.tilt ?? 0)) * m);
    const grow = 1 + m * (0.10 + 0.10 * ls);
    ctx.font = `${weight} ${size}px '${font}', cursive`;
    let cx = 0;
    const slant = -(o.slant ?? 0.06) - m * (0.10 + 0.22 * ls);
    for (const ch of ln.text) {
      const a = r(), b = r(), c = r(), d = r();
      const w = ctx.measureText(ch).width;
      const sc = grow * (1 + (a - 0.5) * (0.05 + 0.34 * m));
      const gy = m * (Math.sin(cx * 0.11 + ph) * size * 0.13 + (b - 0.5) * size * 0.22) + (b - 0.5) * 0.5 + cx * m * (lr - 0.5) * 0.05;
      ctx.save();
      ctx.translate(cx, gy); ctx.rotate((c - 0.5) * (0.04 + 0.26 * m)); ctx.transform(1, 0, slant, 1, 0, 0); ctx.scale(sc, sc);
      ctx.globalAlpha = 0.86 + d * 0.10;
      ctx.fillText(ch, 0, 0);
      if (m > 0.02) { ctx.globalAlpha = 0.55 * m; ctx.fillText(ch, 0.45, 0.25); }   // a hurried pen doubles its strokes
      ctx.restore();
      cx += w * sc * (1 + m * (d - 0.5) * 0.22) * (ch === ' ' ? 1 + m * 0.35 : 1);
    }
    // what only haste adds: extra question marks, a false start struck out. They thin away as the hand calms.
    if (ln.extra && m > 0.01) {
      ctx.save(); ctx.globalAlpha = smooth(0.0, 0.7, m) * 0.9; ctx.translate(cx + (ln.struck ? 6 : 1.5), (r() - 0.5) * 3); ctx.rotate(0.12 * m); ctx.scale(grow * (0.6 + 0.5 * m), grow * (0.6 + 0.5 * m));
      ctx.fillText(ln.extra, 0, 0);
      if (ln.struck) { const ew = ctx.measureText(ln.extra).width; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-1, -size * 0.30); ctx.lineTo(ew + 1, -size * 0.36); ctx.stroke(); }
      ctx.restore();
    }
    if (ln.underline) { // the underline stays; it just stops being a slash
      const ru = mulberry((o.seed ?? 1) * 31 + li);
      ctx.globalAlpha = 0.85; ctx.lineWidth = 1.05 + 0.35 * m; ctx.lineCap = 'round'; ctx.beginPath();
      const n = 6, len = cx * (ln.underline === true ? 1 : ln.underline);
      for (let i = 0; i <= n; i++) {
        const ux = len * i / n, uy = size * 0.20 + m * ((ru() - 0.5) * 5 + Math.sin(i * 1.7) * 1.6 - ux * 0.04);
        if (!i) ctx.moveTo(ux, uy); else ctx.lineTo(ux, uy);
      }
      ctx.stroke();
    }
    ctx.restore();
  });
  ctx.restore();
}
/* print: quiet office-document type. Never bold display, never brand UI. */
function print(ctx, F, text, x, y, size, o = {}) {
  ctx.save(); ctx.font = `${o.weight ?? 400} ${size}px '${o.label ? F.label : F.text}', sans-serif`;
  ctx.fillStyle = o.color ?? 'rgba(34,30,28,0.86)'; ctx.textAlign = o.align ?? 'left';
  try { ctx.letterSpacing = o.track ?? '0px'; } catch (e) { /* older engines */ }
  ctx.fillText(text, x, y); ctx.restore();
}

/* ------------------------------------------------------------ desk items */
/* Every item: size in design units; draw(ctx, F) paints the object itself (paper and
   anything PRINTED on it, identical in both states); ink(ctx, m, F) writes whatever is
   HANDWRITTEN on it at messiness m. Pose per layout: m = messy [cx, cy, deg], t = tidy [cx, cy, deg]. */
function buildItems() {
  const items = [];
  const BLUE = '#26336B', BLACK = '#2A2826', RED = '#B5452A';

  items.push({
    id: 'fees', w: 186, h: 238, shadow: 1,
    wide: { m: [150, 182, -8.5], t: [132, 166, 0.5] }, tall: { m: [110, 150, -7.5], t: [104, 142, 0.5] }, tool: 'playbook', name: 'Fee sheet', verb: 'Collect or bill?',
    draw(ctx, F) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, '#FBF9F4');
      // a laser-printed price list: regular weight, dotted leaders, a blank rule where the amount is filled in
      print(ctx, F, 'Fee sheet', 18, 30, 12.5, { weight: 500 });
      print(ctx, F, 'Front desk copy', w - 18, 30, 8.2, { align: 'right', color: 'rgba(34,30,28,0.55)' });
      ctx.fillStyle = 'rgba(34,30,28,0.55)'; ctx.fillRect(18, 38, w - 36, 0.7);
      const rows = ['Comprehensive exam', 'Refraction', 'Contact lens fitting', 'Contact lens follow-up', 'Frame adjustment', 'Frame repair', 'Kids under 5'];
      rows.forEach((row, i) => {
        const y = 60 + i * 19.5;
        print(ctx, F, row, 18, y, 10.4);
        const tw = (() => { ctx.save(); ctx.font = `400 10.4px '${F.text}', sans-serif`; const v = ctx.measureText(row).width; ctx.restore(); return v; })();
        ctx.fillStyle = 'rgba(34,30,28,0.40)';
        for (let x = 18 + tw + 5; x < w - 50; x += 3.6) ctx.fillRect(x, y - 1, 1, 1);
        ctx.fillStyle = 'rgba(34,30,28,0.60)'; ctx.fillRect(w - 46, y + 1, 28, 0.6);
      });
      print(ctx, F, 'Notes', 18, 206, 8.2, { color: 'rgba(34,30,28,0.55)' });
      ctx.fillStyle = 'rgba(34,30,28,0.30)'; ctx.fillRect(18, 226, w - 36, 0.6);
      // fold crease from living in a drawer
      const c = ctx.createLinearGradient(0, h * 0.5 - 3, 0, h * 0.5 + 3);
      c.addColorStop(0, 'rgba(0,0,0,0)'); c.addColorStop(0.5, 'rgba(90,60,40,0.11)'); c.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = c; ctx.fillRect(0, h * 0.5 - 3, w, 6);
      grainAtop(ctx, w, h, 0.07);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'new', x: this.w - 45, y: 99, size: 11.5, extra: '??' }], m, { font: F.hand, color: BLUE, seed: 5 });
      script(ctx, [{ text: 'ask Dr.', x: this.w - 47, y: 177, size: 11, extra: '!' }], m, { font: F.hand, color: RED, seed: 8 });
      script(ctx, [{ text: 'collect or bill?', x: 50, y: 222, size: 13.5, underline: true, extra: '?', tilt: -0.25 }], m, { font: F.hand, color: BLUE, seed: 12 });
    },
  });

  items.push({
    id: 'slip', w: 152, h: 104, shadow: 1,
    wide: { m: [522, 92, 12.5], t: [500, 82, 0] }, tall: { m: [104, 322, 8], t: [100, 314, -0.4] }, tool: 'reminders', name: 'Phone message', verb: 'Confirm tomorrow',
    draw(ctx, F) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, '#FBE9DC');
      // a pre-printed message pad
      ctx.fillStyle = '#C8583A'; ctx.fillRect(0, 0, w, 18);
      print(ctx, F, 'WHILE YOU WERE OUT', 10, 12.6, 8.4, { label: true, weight: 700, color: '#FFF4EC', track: '1px' });
      const ink = 'rgba(168,66,40,0.85)';
      print(ctx, F, 'From', 10, 34, 6.6, { color: ink }); print(ctx, F, 'Message', 10, 54, 6.6, { color: ink });
      ctx.fillStyle = 'rgba(181,69,42,0.40)';
      [38, 60, 80].forEach(y => ctx.fillRect(10, y, w - 20, 0.6));
      // tick boxes
      [['Telephoned', 10], ['Please call', 62], ['Will call again', 112]].forEach(([t, x], i) => {
        ctx.strokeStyle = ink; ctx.lineWidth = 0.6; ctx.strokeRect(x, 90, 5, 5);
        if (i < 2) print(ctx, F, t, x + 8, 95, 6, { color: ink }); else print(ctx, F, 'Urgent', x + 8, 95, 6, { color: ink });
      });
      grainAtop(ctx, w, h, 0.07);
    },
    ink(ctx, m, F) {
      const o = { font: F.hand2, color: BLUE, seed: 31, slant: 0.10 };
      script(ctx, [
        { text: 'Mrs. Alvarez', x: 34, y: 36.5, size: 17 },
        { text: 'call back re: frames', x: 12, y: 78, size: 17, extra: '!!', underline: 0.45 },
      ], m, o);
      // the tick in "Please call"
      ctx.save(); ctx.strokeStyle = BLUE; ctx.lineWidth = 1.2; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(62.5, 92.5 - m); ctx.lineTo(64.5, 95); ctx.lineTo(69 + 3 * m, 87.5 - 3 * m); ctx.stroke(); ctx.restore();
    },
  });

  const sticky = stickyItem;
  items.push(sticky('vsp', '#F8E7A6',
    { wide: { m: [300, 250, -13], t: [318, 244, -0.7] }, tall: { m: [280, 212, 13], t: [284, 206, -0.7] }, tool: 'playbook', name: 'Sticky note', verb: 'Look it up' },
    [{ text: 'VSP or', x: 13, y: 44, size: 19 }, { text: 'EyeMed?', x: 13, y: 70, size: 19, extra: '??', underline: true }], 40));
  items.push(sticky('refr', '#F6CDB9',
    { wide: { m: [420, 258, 9.5], t: [428, 246, 0.3] }, tall: null, tool: 'playbook', name: 'Sticky note', verb: 'Look it up' },
    [{ text: 'Refraction:', x: 10, y: 38, size: 16.5 }, { text: 'collect', x: 10, y: 60, size: 16.5 }, { text: 'or bill?', x: 10, y: 82, size: 16.5, extra: '?', underline: true }], 52));

  items.push({
    id: 'kids', w: 152, h: 84, shadow: 1,
    wide: { m: [300, 384, -16], t: [322, 372, 0.4] }, tall: null, tool: 'playbook', name: 'Index card', verb: 'Look it up',
    draw(ctx) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, '#FCFAF5');
      ctx.fillStyle = 'rgba(190,80,60,0.50)'; ctx.fillRect(0, 17, w, 0.7);       // a ruled index card
      ctx.fillStyle = 'rgba(70,110,170,0.30)';
      [33, 49, 65, 81].forEach(y => ctx.fillRect(0, y, w, 0.6));
      grainAtop(ctx, w, h, 0.07);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'Which doctor sees', x: 11, y: 47.5, size: 15.5 }, { text: 'kids under 5?', x: 11, y: 63.5, size: 15.5, extra: '??', underline: true }], m, { font: F.hand, color: BLACK, seed: 61 });
    },
  });

  items.push({
    id: 'binder', w: 176, h: 214, shadow: 2.0,
    wide: { m: [692, 152, 5.2], t: [690, 140, 0] }, tall: null,
    draw(ctx, F) {
      const w = this.w, h = this.h;
      rr(ctx, 0, 0, w, h, 7); ctx.fillStyle = '#231E1A'; ctx.fill();
      ctx.save(); rr(ctx, 0, 0, w, h, 7); ctx.clip();
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(255,240,225,0.17)'); g.addColorStop(0.5, 'rgba(255,240,225,0.03)'); g.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      const s = ctx.createLinearGradient(14, 0, 30, 0);
      s.addColorStop(0, 'rgba(0,0,0,0.35)'); s.addColorStop(0.4, 'rgba(255,240,225,0.16)'); s.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = s; ctx.fillRect(14, 0, 16, h);
      ctx.restore();
      [[22, 40], [22, h - 40]].forEach(([x, y]) => {
        const rg = ctx.createRadialGradient(x - 1, y - 1, 0.5, x, y, 4);
        rg.addColorStop(0, '#E9E2D8'); rg.addColorStop(1, '#7E746A');
        ctx.beginPath(); ctx.arc(x, y, 3.4, 0, 7); ctx.fillStyle = rg; ctx.fill();
      });
      // a label-maker strip, stuck on not quite level
      ctx.save(); ctx.translate(42, 86); ctx.rotate(-0.012);
      ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 2; ctx.shadowOffsetY = 1;
      rr(ctx, 0, 0, 112, 21, 1.6); ctx.fillStyle = '#F4F1EA'; ctx.fill(); ctx.shadowColor = 'transparent';
      const lg = ctx.createLinearGradient(0, 0, 0, 21); lg.addColorStop(0, 'rgba(255,255,255,0.8)'); lg.addColorStop(0.5, 'rgba(255,255,255,0)'); lg.addColorStop(1, 'rgba(0,0,0,0.08)');
      rr(ctx, 0, 0, 112, 21, 1.6); ctx.fillStyle = lg; ctx.fill();
      print(ctx, F, 'FRONT DESK', 56, 15.2, 11.5, { label: true, weight: 700, align: 'center', track: '2.2px', color: '#1B1917' });
      ctx.restore();
      grainAtop(ctx, w, h, 0.10);
    },
  });

  items.push({
    id: 'card', w: 118, h: 74, shadow: 0.8,
    wide: { m: [520, 332, -12], t: [520, 322, 0] }, tall: { m: [268, 320, -13], t: [268, 312, 0] }, tool: 'eligibility', name: 'Insurance card', verb: 'Check coverage',
    draw(ctx, F) {
      const w = this.w, h = this.h;
      rr(ctx, 0, 0, w, h, 6); ctx.fillStyle = '#F1F0EC'; ctx.fill();
      ctx.save(); rr(ctx, 0, 0, w, h, 6); ctx.clip();
      ctx.fillStyle = '#51657A'; ctx.fillRect(0, 0, w, 20);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(255,255,255,0.40)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,50,40,0.12)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); ctx.restore();
      print(ctx, F, 'VISION PLAN', 10, 13.6, 8, { label: true, weight: 600, color: '#F4F6F8', track: '1px' });
      print(ctx, F, 'Member ID', 10, 34, 6.6, { color: 'rgba(40,40,44,0.7)' });
      print(ctx, F, 'Group', 10, 58, 6.6, { color: 'rgba(40,40,44,0.7)' });
      // embossed characters: raised plastic, lit from the top left, no readable number
      const emboss = (x, y, n) => { for (let i = 0; i < n; i++) { const ex = x + i * 7.4 + (i > 3 ? 5 : 0) + (i > 7 ? 5 : 0);
        rr(ctx, ex + 0.6, y + 0.7, 5, 7.4, 1.4); ctx.fillStyle = 'rgba(40,36,34,0.40)'; ctx.fill();
        rr(ctx, ex - 0.4, y - 0.5, 5, 7.4, 1.4); ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill();
        rr(ctx, ex, y, 5, 7.4, 1.4); ctx.fillStyle = '#D8D6D0'; ctx.fill(); } };
      emboss(10, 38, 12); emboss(10, 62, 6);
      grainAtop(ctx, w, h, 0.05);
    },
  });

  items.push({
    id: 'scrap', w: 100, h: 54, shadow: 1.2,
    wide: { m: [612, 446, 21], t: [604, 448, -0.6] }, tall: null,
    draw(ctx) {
      const w = this.w, h = this.h, r = mulberry(88);
      ctx.beginPath(); ctx.moveTo(0, 5);
      for (let x = 0; x <= w; x += 4) ctx.lineTo(x, 2 + r() * 5.5);
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.save(); ctx.clip(); paper(ctx, w, h, '#FAF6EC');
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(0, 0, w, 8); ctx.restore();
      grainAtop(ctx, w, h, 0.08);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'call lab', x: 10, y: 27, size: 15, extra: 'today', struck: true }, { text: 're: order', x: 10, y: 45, size: 15, extra: '?' }], m, { font: F.hand, color: BLACK, seed: 91 });
    },
  });

  items.push({
    id: 'clip', w: 34, h: 12, shadow: 0.7, soft: true, follow: 'fees',
    wide: { m: [78, 78, 64], t: [71, 52, 90] }, tall: { m: [40, 48, 66], t: [43, 28, 90] },
    draw(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 12);
      g.addColorStop(0, '#FFFFFF'); g.addColorStop(0.5, '#A8A29A'); g.addColorStop(1, '#6F6861');
      ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(8, 9.2); ctx.lineTo(28, 9.2); ctx.arc(28, 6, 3.2, Math.PI / 2, -Math.PI / 2, true);
      ctx.lineTo(5, 2.8); ctx.arc(5, 6.4, 3.6, -Math.PI / 2, Math.PI / 2, true);
      ctx.lineTo(24, 10); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(24, 5.2); ctx.lineTo(10, 5.2); ctx.arc(10, 6.6, 1.4, -Math.PI / 2, Math.PI / 2, true); ctx.lineTo(22, 8); ctx.stroke();
    },
  });

  items.push({
    id: 'pen', w: 150, h: 12, shadow: 1.5, soft: true,
    wide: { m: [232, 300, -27], t: [232, 322, 0] }, tall: { m: [150, 262, 31], t: [111, 254, 0] },
    draw(ctx) {
      const w = this.w, y = 1.5, bh = 9;
      ctx.beginPath(); ctx.moveTo(0, y + bh / 2); ctx.lineTo(14, y + 1); ctx.lineTo(14, y + bh - 1); ctx.closePath();
      const tg = ctx.createLinearGradient(0, y, 0, y + bh);
      tg.addColorStop(0, '#F2EEE8'); tg.addColorStop(0.5, '#B7AEA4'); tg.addColorStop(1, '#6E665E');
      ctx.fillStyle = tg; ctx.fill();
      rr(ctx, 13, y, w - 34, bh, 2.5);
      const bg = ctx.createLinearGradient(0, y, 0, y + bh);
      bg.addColorStop(0, '#5B514A'); bg.addColorStop(0.28, '#2C2622'); bg.addColorStop(1, '#120E0C');
      ctx.fillStyle = bg; ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(18, y + 1.6, w - 46, 0.9);
      rr(ctx, w - 22, y, 22, bh, 3.5);
      const cg = ctx.createLinearGradient(0, y, 0, y + bh);
      cg.addColorStop(0, '#F08A66'); cg.addColorStop(0.4, ACCENT); cg.addColorStop(1, '#9E4326');
      ctx.fillStyle = cg; ctx.fill();
      rr(ctx, w - 62, y - 1.5, 46, 3.2, 1.5);
      const kg = ctx.createLinearGradient(0, y - 1.5, 0, y + 2);
      kg.addColorStop(0, '#FFFFFF'); kg.addColorStop(1, '#9A9088'); ctx.fillStyle = kg; ctx.fill();
    },
  });

  // the 2004 manual with the notebook of Alexis's notes on top: the whole onboarding, on paper
  items.push({
    id: 'manual', w: 168, h: 122, shadow: 2.2, tool: 'playbook', name: 'The manual and the notebook', verb: 'Search it',
    wide: { m: [332, 112, 6], t: [330, 104, 0] }, tall: { m: [266, 92, 6], t: [266, 84, 0] },
    draw(ctx, F) {
      const w = this.w, h = this.h;
      rr(ctx, 0, 0, w, h, 4); ctx.fillStyle = '#3B5B8C'; ctx.fill();
      ctx.save(); rr(ctx, 0, 0, w, h, 4); ctx.clip();
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(0.6, 'rgba(255,255,255,0.02)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#EFE9DC'; ctx.fillRect(w - 7, 3, 7, h - 6);
      for (let y = 4; y < h - 4; y += 1.6) { ctx.fillStyle = (y % 3.2) < 1.6 ? 'rgba(120,100,80,0.25)' : 'rgba(255,255,255,0.4)'; ctx.fillRect(w - 7, y, 7, 0.6); }
      for (let y = 8; y < h - 6; y += 9) { ctx.beginPath(); ctx.arc(6, y, 2.6, 0, 7); ctx.strokeStyle = '#D8D3C8'; ctx.lineWidth = 1.1; ctx.stroke(); }
      ctx.restore();
      print(ctx, F, 'GETTING STARTED', 20, 34, 8.6, { label: true, weight: 700, color: '#F1EEE6', track: '1.6px' });
      print(ctx, F, 'Dentrix', 20, 60, 20, { weight: 600, color: '#FFFFFF' });
      print(ctx, F, 'Practice management · 2004', 20, 76, 7.4, { color: 'rgba(241,238,230,0.75)' });
      print(ctx, F, 'Front office edition', 20, h - 14, 7, { label: true, weight: 600, color: 'rgba(241,238,230,0.7)', track: '1px' });
      ctx.save(); ctx.translate(96, 30); ctx.rotate(-0.16);
      ctx.shadowColor = 'rgba(40,20,5,0.45)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 3;
      rr(ctx, 0, 0, 78, 96, 2); ctx.fillStyle = '#F7F1E3'; ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.fillStyle = 'rgba(70,110,170,0.28)'; for (let y = 16; y < 92; y += 9) ctx.fillRect(4, y, 70, 0.6);
      ctx.fillStyle = 'rgba(190,80,60,0.45)'; ctx.fillRect(11, 0, 0.7, 96);
      grainAtop(ctx, 78, 96, 0.07);
      ctx.restore();
      grainAtop(ctx, w, h, 0.08);
    },
    ink(ctx, m, F) {
      ctx.save(); ctx.translate(96, 30); ctx.rotate(-0.16);
      script(ctx, [
        { text: 'Alexis said:', x: 14, y: 14, size: 9.5 },
        { text: 'verify BEFORE', x: 14, y: 30, size: 10, underline: 0.9 },
        { text: 'booking new pts', x: 14, y: 44, size: 10 },
        { text: 'Cigna = call', x: 14, y: 60, size: 10, extra: '!!' },
        { text: 'group # ??', x: 14, y: 76, size: 10, extra: '??' },
      ], m, { font: F.hand, color: '#27325A', seed: 121 });
      ctx.restore();
    },
  });

  // the denial letter, weeks late, half out of its envelope
  items.push({
    id: 'letter', w: 172, h: 104, shadow: 1.4, tool: 'claims', name: 'Denial letter', verb: 'See the claims',
    wide: { m: [662, 334, 8], t: [660, 322, 0] }, tall: { m: [252, 428, 8], t: [252, 420, 0] },
    draw(ctx, F) {
      const w = this.w, h = this.h;
      ctx.save(); ctx.translate(18, -16); ctx.rotate(-0.06);
      paper(ctx, 136, 90, '#FCFBF7');
      ctx.fillStyle = '#2E5A9C'; ctx.fillRect(12, 10, 40, 6);
      print(ctx, F, 'EXPLANATION OF BENEFITS', 12, 26, 6.2, { label: true, weight: 700, color: 'rgba(34,30,28,0.7)', track: '1px' });
      ctx.fillStyle = 'rgba(34,30,28,0.35)'; [34, 40, 46].forEach((y, i) => ctx.fillRect(12, y, 112 - i * 18, 0.7));
      print(ctx, F, 'Claim status:', 12, 62, 7.2, { color: 'rgba(34,30,28,0.75)' });
      print(ctx, F, 'DENIED', 62, 62, 7.6, { label: true, weight: 700, color: '#B5452A', track: '1.2px' });
      print(ctx, F, 'Amount paid: $0.00', 12, 74, 7.2, { color: 'rgba(34,30,28,0.75)' });
      ctx.fillStyle = 'rgba(34,30,28,0.3)'; [82, 87].forEach(y => ctx.fillRect(12, y, 100, 0.6));
      ctx.restore();
      ctx.save(); ctx.translate(0, 30);
      ctx.shadowColor = 'rgba(40,20,5,0.35)'; ctx.shadowBlur = 4; ctx.shadowOffsetY = 2;
      rr(ctx, 0, 0, w, 74, 2); ctx.fillStyle = '#EFE7D6'; ctx.fill(); ctx.shadowColor = 'transparent';
      ctx.save(); rr(ctx, 0, 0, w, 74, 2); ctx.clip();
      const g = ctx.createLinearGradient(0, 0, w, 74); g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(96,60,36,0.10)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, 74);
      rr(ctx, 14, 30, 78, 26, 1.5); ctx.fillStyle = 'rgba(200,215,225,0.55)'; ctx.fill();
      ctx.fillStyle = 'rgba(34,30,28,0.45)'; [37, 43, 49].forEach((y, i) => ctx.fillRect(19, y, 60 - i * 12, 0.9));
      ctx.restore();
      rr(ctx, w - 34, 8, 22, 26, 1); ctx.fillStyle = '#D9C9A8'; ctx.fill();
      ctx.strokeStyle = 'rgba(60,40,30,0.35)'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.arc(w - 44, 20, 12, 0, 7); ctx.stroke();
      print(ctx, F, 'FIRST CLASS', 12, 16, 5.8, { label: true, weight: 700, color: 'rgba(34,30,28,0.5)', track: '1px' });
      ctx.restore();
      grainAtop(ctx, w, h, 0.07);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'call Cigna re: Delgado crown', x: 12, y: 96, size: 10.5, extra: '!!', underline: 0.5 }], m, { font: F.hand, color: '#B5452A', seed: 133 });
    },
  });

  // the review card that does not exist yet: a tent card with a dashed square where the QR code should be
  items.push({
    id: 'review', w: 112, h: 84, shadow: 1.2, tool: 'review', name: 'Review card', verb: 'Make the card',
    wide: { m: [148, 404, 10], t: [140, 404, 0] }, tall: { m: [82, 456, 10], t: [82, 452, 0] },
    draw(ctx, F) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, '#FFF9EE', { radius: 3 });
      ctx.fillStyle = ACCENT; ctx.fillRect(0, 0, w, 3);
      print(ctx, F, 'HOW DID WE DO?', w / 2, 20, 7.4, { label: true, weight: 700, align: 'center', color: 'rgba(34,30,28,0.8)', track: '1.4px' });
      const q = 34, qx = w / 2 - q / 2, qy = 28;
      ctx.strokeStyle = 'rgba(34,30,28,0.35)'; ctx.setLineDash([2, 2]); ctx.lineWidth = 0.8; ctx.strokeRect(qx, qy, q, q); ctx.setLineDash([]);
      [[0, 0], [q - 9, 0], [0, q - 9]].forEach(([dx, dy]) => { ctx.fillStyle = 'rgba(34,30,28,0.28)'; ctx.fillRect(qx + dx + 1, qy + dy + 1, 8, 8); ctx.fillStyle = '#FFF9EE'; ctx.fillRect(qx + dx + 3, qy + dy + 3, 4, 4); });
      print(ctx, F, 'scan to leave a review', w / 2, h - 12, 6.6, { align: 'center', color: 'rgba(34,30,28,0.6)' });
      grainAtop(ctx, w, h, 0.06);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'QR??', x: 44, y: 52, size: 12, extra: '!', tilt: -0.15 }], m, { font: F.hand, color: '#B5452A', seed: 140 });
    },
  });

  // the vendor bill, with two more underneath
  items.push({
    id: 'invoice', w: 150, h: 100, shadow: 1.5, tool: 'invoices', name: 'Vendor bill', verb: 'File it',
    wide: { m: [432, 434, -6], t: [432, 432, 0] }, tall: { m: [182, 546, -6], t: [182, 544, 0] },
    draw(ctx, F) {
      const w = this.w, h = this.h;
      ctx.save(); ctx.translate(6, 6); ctx.rotate(0.05); paper(ctx, w - 12, h - 8, '#F3EFE6'); ctx.restore();
      ctx.save(); ctx.translate(3, 3); ctx.rotate(-0.03); paper(ctx, w - 8, h - 5, '#F8F5EE'); ctx.restore();
      paper(ctx, w, h, '#FCFBF8');
      ctx.fillStyle = '#1F6F8B'; ctx.fillRect(0, 0, w, 14);
      print(ctx, F, 'PATTERSON DENTAL', 8, 9.8, 6.4, { label: true, weight: 700, color: '#F2F7F9', track: '1.3px' });
      print(ctx, F, 'INVOICE', w - 8, 9.8, 6.4, { label: true, weight: 700, align: 'right', color: '#F2F7F9', track: '1.3px' });
      print(ctx, F, 'Invoice no. 41877', 8, 26, 6.6, { color: 'rgba(34,30,28,0.75)' });
      print(ctx, F, 'Sep 8, 2026', w - 8, 26, 6.6, { align: 'right', color: 'rgba(34,30,28,0.75)' });
      ctx.fillStyle = 'rgba(34,30,28,0.35)'; ctx.fillRect(8, 31, w - 16, 0.6);
      const rows = [['Prophy paste, 200 ct', '48.00'], ['Nitrile gloves M, case', '119.40'], ['Bib clips', '12.60'], ['Composite kit A2', '432.40']];
      rows.forEach(([a, b], i) => { const y = 42 + i * 9.5; print(ctx, F, a, 8, y, 6.2, { color: 'rgba(34,30,28,0.7)' }); print(ctx, F, b, w - 8, y, 6.2, { align: 'right', color: 'rgba(34,30,28,0.7)' }); });
      ctx.fillStyle = 'rgba(34,30,28,0.5)'; ctx.fillRect(w - 60, 80, 52, 0.7);
      print(ctx, F, 'Total', w - 60, 90, 6.8, { weight: 600, color: 'rgba(34,30,28,0.85)' });
      print(ctx, F, '$612.40', w - 8, 90, 7.2, { weight: 600, align: 'right', color: 'rgba(34,30,28,0.9)' });
      grainAtop(ctx, w, h, 0.07);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'QB?', x: 10, y: 92, size: 12, extra: '?', tilt: -0.1 }], m, { font: F.hand, color: '#B5452A', seed: 150 });
    },
  });

  return items;
}

/* a sticky note. Module scope so a visitor's own question can become one at runtime. */
const BLUE_INK = '#26336B';
function stickyItem(id, color, poses, lines, seed) {
  return {
    id, w: 96, h: 96, shadow: 1.25, ...poses,
    draw(ctx) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, color, { curl: true, radius: 0.8 });
      ctx.fillStyle = 'rgba(90,60,30,0.05)'; ctx.fillRect(0, 0, w, 17); // adhesive strip
      // the corner that stopped sticking months ago
      const k = 13; ctx.save();
      ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.moveTo(w, h - k); ctx.lineTo(w, h + 1); ctx.lineTo(w - k, h + 1); ctx.closePath(); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath(); ctx.moveTo(w, h - k); ctx.lineTo(w - k, h); ctx.lineTo(w - k * 0.92, h - k * 0.80); ctx.closePath();
      const fg = ctx.createLinearGradient(w - k, h - k, w - k * 0.3, h - k * 0.3);
      fg.addColorStop(0, 'rgba(255,255,255,0.95)'); fg.addColorStop(1, color); ctx.fillStyle = fg;
      ctx.shadowColor = 'rgba(60,30,10,0.40)'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 1.5; ctx.shadowOffsetY = 2; ctx.fill(); ctx.restore();
      grainAtop(ctx, w, h, 0.075);
    },
    ink(ctx, m, F) { script(ctx, lines, m, { font: F.hand, color: BLUE_INK, seed }); },
  };
}

/* the painters an outside item set can use: same paper, same hand, same print */
export const painters = { paper, print, script, rr, grainAtop, mulberry, makeCanvas, stickyItem, INK, ACCENT, CREAM, BLUE_INK };

/* the desk surface itself: pale warm laminate, faint grain, a coffee ring */
function paintDesk(ctx, W, H, layout, color) {
  ctx.fillStyle = color || '#D9B896'; ctx.fillRect(0, 0, W, H);
  const r = mulberry(99);
  ctx.save();
  for (let i = 0; i < 900; i++) {
    const y = r() * H, x = r() * W - 60, len = 60 + r() * 260;
    ctx.strokeStyle = r() > 0.55 ? `rgba(255,240,220,${0.05 + r() * 0.12})` : `rgba(122,74,40,${0.05 + r() * 0.13})`;
    ctx.lineWidth = 0.4 + r() * 1.6;
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.bezierCurveTo(x + len * 0.3, y + (r() - 0.5) * 3, x + len * 0.6, y + (r() - 0.5) * 3, x + len, y + (r() - 0.5) * 2);
    ctx.stroke();
  }
  ctx.restore();
  // window light from the top left, falling off to the bottom right
  const g = ctx.createRadialGradient(W * 0.18, H * 0.08, 10, W * 0.3, H * 0.2, Math.hypot(W, H) * 0.95);
  g.addColorStop(0, 'rgba(255,250,240,0.55)'); g.addColorStop(0.45, 'rgba(255,246,235,0.10)'); g.addColorStop(1, 'rgba(120,70,40,0.20)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // coffee ring
  const rings = layout === 'wide' ? [[414, 250, 26, 5], [236, 58, 22, 9], [128, 364, 24, 13]] : [[304, 412, 27, 5], [226, 300, 21, 9]];
  for (const [cx, cy, R, seed] of rings) {
  ctx.save(); ctx.globalCompositeOperation = 'multiply';
  const rr2 = mulberry(seed);
  for (let i = 0; i < 90; i++) {
    const a0 = rr2() * Math.PI * 2, a1 = a0 + 0.25 + rr2() * 0.9;
    const gap = (a0 > 0.6 && a0 < 1.5);
    ctx.strokeStyle = `rgba(112,62,30,${gap ? 0.03 : 0.07 + rr2() * 0.13})`;
    ctx.lineWidth = 0.8 + rr2() * 2.4;
    ctx.beginPath(); ctx.arc(cx + (rr2() - 0.5) * 0.8, cy + (rr2() - 0.5) * 0.8, R + (rr2() - 0.5) * 1.6, a0, a1); ctx.stroke();
  }
  ctx.fillStyle = 'rgba(128,78,44,0.05)'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
  ctx.restore();
  }
}

/* ---------------------------------------------------------------- shaders */
const VS = `attribute vec2 aPos; varying vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.0,1.0); }`;

const FS_BLUR = `precision highp float;
varying vec2 vUv; uniform sampler2D uTex; uniform vec2 uRad; uniform float uBoost;
void main(){
  vec3 acc = vec3(0.0); float wsum = 0.0;
  const float GA = 2.39996323;
  for (int i = 0; i < TAPS; i++) {
    float fi = float(i);
    float r = sqrt((fi + 0.5) / float(TAPS));
    vec2 o = vec2(cos(fi*GA), sin(fi*GA)) * r * uRad;
    vec3 c = texture2D(uTex, vUv + o).rgb;
    float l = dot(c, vec3(0.299,0.587,0.114));
    float w = 1.0 + uBoost * pow(l, 8.0);   // bright paper blooms into discs
    acc += c*w; wsum += w;
  }
  gl_FragColor = vec4(acc/wsum, 1.0);
}`;

const FS_MAIN = `precision highp float;
varying vec2 vUv;
uniform sampler2D uScene, uBlur, uTab;
uniform vec2 uDesign; uniform vec3 uLens; uniform vec3 uPage; uniform float uCaust, uMag, uTime, uAngle, uLift, uGrain, uPx, uDistort, uStill;
uniform vec2 uLD; uniform float uWarm, uNight;    // where the light comes from, how warm it is, and how far into the evening
const float RIMW = 2.1; const float TABW = 31.0; const float TABH = 21.0;
#define LD uLD

float hash(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*0.1031); p3 += dot(p3, p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vnoise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
vec2 suv(vec2 q){ return vec2(q.x/uDesign.x, 1.0 - q.y/uDesign.y); }
float sdRR(vec2 p, vec2 b, float r){ vec2 d = abs(p)-b+r; return length(max(d,0.0)) + min(max(d.x,d.y),0.0) - r; }
vec2 rot(vec2 p, float a){ float c=cos(a), s=sin(a); return vec2(c*p.x - s*p.y, s*p.x + c*p.y); }
float tabSdf(vec2 l){ return sdRR(l - vec2(0.0, -(uLens.z + TABH*0.5 - 1.0)), vec2(TABW*0.5, TABH*0.5 + 1.0), 5.0); }
float bodySdf(vec2 q){ return min(length(q) - (uLens.z + RIMW), tabSdf(rot(q, -uAngle))); }

vec3 deskLight(vec2 q, vec3 col, float under){
  vec2 c = uLens.xy; float R = uLens.z;
  vec2 so = -LD * (4.6 + uLift*16.0);
  float soft = 3.0 + uLift*12.0;
  float sd = bodySdf(q - c - so);
  float body = 1.0 - smoothstep(-soft, soft*1.5, sd);
  // glass lets light through: the interior of the shadow is lighter than its ring
  float inner = 1.0 - smoothstep(-soft*2.0, soft, length(q - c - so) - (R - 5.0));
  float sh = body * (1.0 - 0.62*inner);
  float ao = 1.0 - smoothstep(-R*0.10, R*0.42, length(q - c - so*2.4) - R);
  col *= 1.0 - (0.58*sh + 0.20*ao) * (1.0 - under*0.85);
  // caustic: light gathered by the glass, thrown as a warm crescent on the far side
  vec2 c0 = c - LD*(R*0.10 + uLift*10.0);
  vec2 dq = q - c0; float dist = length(dq);
  float side = dot(dq/max(dist,1e-3), -LD);
  float shim = 0.72 + 0.56*vnoise(q*0.085 + vec2(uTime*0.10, -uTime*0.07));
  float band = exp(-pow((dist - (R*1.03 + 5.5))/(3.6 + 2.5*vnoise(q*0.11 - uTime*0.05) + uLift*6.0), 2.0));
  float cres = band * smoothstep(0.15, 0.95, side);
  float pool = exp(-pow(length(q - (c - LD*R*0.92))/(R*0.50), 2.0)) * 0.36 * smoothstep(R*0.80, R*1.05, length(q - c));
  col += vec3(1.0, 0.78, 0.48) * (cres*0.70*shim*shim + pool*shim) * (0.50 + 0.50*col) * uCaust;
  return col;
}

void main(){
  vec2 p = vec2(vUv.x, 1.0 - vUv.y) * uDesign;
  vec2 c = uLens.xy; float R = uLens.z;
  vec2 dp = p - c; float dist = length(dp); vec2 dir = dp / max(dist, 1e-4);
  float d = dist / R;
  float aa = uPx * 1.2;

  // outside: depth of field
  vec3 col = deskLight(p, texture2D(uBlur, vUv).rgb, 0.0);

  // inside the glass
  if (dist < R + 0.5) {
    float k = d*d;
    float s = (1.0/uMag) * (1.0 + uDistort * k*k);           // the dome: centre magnified, rim compressed
    float ca = 0.009 * uDistort/0.30 * k*d;
    vec2 qr = c + dp * s * (1.0 + ca);
    vec2 qg = c + dp * s;
    vec2 qb = c + dp * s * (1.0 - ca);
    vec3 sharp = vec3(texture2D(uScene, suv(qr)).r, texture2D(uScene, suv(qg)).g, texture2D(uScene, suv(qb)).b);
    vec3 g = deskLight(qg, sharp, 1.0);
    g = (g - 0.5)*1.05 + 0.49; g = mix(vec3(dot(g, vec3(0.299,0.587,0.114))), g, 1.10);
    // the ground edge of the glass: a few units where focus falls away
    float edge = smoothstep(R - 10.0, R - 0.5, dist);
    g = mix(g, deskLight(qg, texture2D(uBlur, suv(qg)).rgb, 1.0), edge*0.85);
    float side = dot(dir, -LD);
    g += vec3(1.0,0.90,0.76) * edge * max(side, 0.0) * 0.26;     // light pooling in the far edge
    float inl = smoothstep(R - 2.6, R - 1.7, dist) * (1.0 - smoothstep(R - 1.0, R - 0.3, dist));
    g += vec3(1.0,0.97,0.90) * inl * smoothstep(-0.1, 0.8, side) * 0.85 * (1.0 - smoothstep(0.0, 0.6, uStill));   // thin bright line inside the rim, opposite the light
    g *= 1.0 - edge * max(-side, 0.0) * 0.34;                    // rim shadow on the near edge
    g = g*vec3(0.992,0.998,1.0) + 0.012;                          // the faintest glass tint
    // reflection of the window: a soft arc toward the light, a thin one opposite
    float ang = atan(dir.y, dir.x); float la = atan(LD.y, LD.x);
    float da = abs(atan(sin(ang-la), cos(ang-la)));
    float arc = exp(-pow((d-0.80)/0.055,2.0)) * exp(-pow(da/0.55,2.0));
    float arc2 = exp(-pow((d-0.90)/0.025,2.0)) * exp(-pow((3.14159-da)/0.40,2.0));
    float fade = 1.0 - smoothstep(0.0, 0.5, uStill);
    float sky = smoothstep(0.95, -0.35, dot(dir, -LD)*d);
    float bandR = length(dp + LD*R*-0.95) / R;                       // broad window reflection: a soft crescent across the upper glass
    float refl = smoothstep(1.22, 1.52, bandR) * (1.0 - smoothstep(0.80, 0.99, d));
    g += vec3(1.0,0.97,0.92) * (arc*0.40 + arc2*0.14 + sky*0.03 + refl*0.17) * fade;
    float inside = 1.0 - smoothstep(R - aa, R + aa, dist);
    col = mix(col, g, inside);
  }

  // metal rim and tab
  vec2 l = rot(dp, -uAngle);
  float ts = tabSdf(l);
  float ring = max(dist - (R + RIMW), (R - 0.4) - dist);
  float metalSd = min(ring, max(ts, (R - 0.4) - dist));
  float metal = 1.0 - smoothstep(-aa, aa, metalSd);
  if (metal > 0.001) {
    vec3 base = vec3(0.820, 0.368, 0.232);
    vec3 N;
    if (ring < ts) { float u = clamp((dist - R)/RIMW, 0.0, 1.0)*2.0 - 1.0; N = normalize(vec3(dir*u*0.95, sqrt(max(1.0-u*u*0.9, 0.05)))); }
    else {
      float e = 0.9;
      vec2 gl = vec2(tabSdf(l+vec2(e,0.0)) - tabSdf(l-vec2(e,0.0)), tabSdf(l+vec2(0.0,e)) - tabSdf(l-vec2(0.0,e)));
      vec2 gw = rot(gl, uAngle);
      float bev = smoothstep(-3.2, 0.0, ts);
      N = normalize(vec3(gw*bev*1.4, 1.0));
    }
    vec3 Lv = normalize(vec3(LD, 0.85));
    vec3 Hv = normalize(Lv + vec3(0.0,0.0,1.0));
    float diff = max(dot(N, Lv), 0.0);
    float spec = pow(max(dot(N, Hv), 0.0), 38.0);
    float brushed = 0.94 + 0.12*vnoise(vec2(atan(dp.y,dp.x)*60.0, dist*0.9));
    vec3 m = base * (0.30 + 0.92*diff) * brushed + vec3(1.0,0.93,0.86)*spec*1.10;
    m *= 1.0 - 0.35*smoothstep(0.2, 1.0, dot(dir, -LD)) * step(ring, ts);
    // engraved power marking
    vec2 tuv = (l - vec2(0.0, -(R + TABH*0.5 + 0.6))) / vec2(TABW, TABH) + 0.5;
    if (tuv.x > 0.0 && tuv.x < 1.0 && tuv.y > 0.0 && tuv.y < 1.0) {
      float t0 = texture2D(uTab, vec2(tuv.x, 1.0 - tuv.y)).r;
      vec2 lo = rot(LD, -uAngle) * 0.016;
      float t1 = texture2D(uTab, vec2(tuv.x + lo.x, 1.0 - (tuv.y + lo.y))).r;
      float cut = smoothstep(0.35, 0.65, t0), cutS = smoothstep(0.35, 0.65, t1);
      m = mix(m, vec3(0.26,0.09,0.05), clamp(cutS - cut, 0.0, 1.0)*0.9);   // the wall of the cut, on the lit side
      m = mix(m, vec3(1.0,0.97,0.93), cut);                                 // paint-filled engraving
    }
    col = mix(col, m, metal);
  }

  // window light, vignette, grain, feathered edge
  float sun = dot(p/uDesign - 0.5, -LD);                       // 0 at centre, + away from the light
  col *= mix(vec3(1.10,1.06,0.99), vec3(0.80,0.76,0.74), smoothstep(-0.55, 0.62, sun));
  col *= mix(vec3(0.975,1.0,1.045), vec3(1.10,1.015,0.925), uWarm);     // cool at 8am, amber by late afternoon
  // after hours: the room goes dark and a desk lamp in the corner takes over from the window
  vec2 lampP = uDesign * vec2(0.84, 0.04);
  float lampD = length((p - lampP) / vec2(uDesign.x*0.60, uDesign.x*0.52));
  float lamp = exp(-lampD*lampD*1.35);
  float glassN = 1.0 - smoothstep(R - 1.0, R + 1.0, dist);          // the glass gathers the lamp: what is under it stays readable
  vec3 nightCol = col * (0.30 + 1.05*lamp) * mix(vec3(0.78,0.82,1.0), vec3(1.0,0.88,0.68), lamp) * (1.0 + 0.55*glassN) + vec3(0.012,0.012,0.03);
  col = mix(col, nightCol, uNight);
  col += vec3(0.10,0.065,0.02) * exp(-pow(length((p - uDesign*vec2(0.16,0.10))/uDesign)/0.42, 2.0)) * (1.0 - uNight);
  vec2 v = vUv - 0.5; col *= 1.0 - smoothstep(0.10, 0.62, dot(v,v)*1.9)*0.34;
  col = clamp(col, 0.0, 1.0);
  col = mix(col, col*col*(3.0-2.0*col), 0.62);
  col = mix(vec3(dot(col, vec3(0.299,0.587,0.114))), col, 1.18);
  float gt = floor(uTime*14.0);
  float gr = hash(gl_FragCoord.xy + gt*17.0) + hash(gl_FragCoord.yx*1.3 + gt*5.0) - 1.0;
  float lum = dot(col, vec3(0.299,0.587,0.114));
  col += gr * uGrain * (0.55 + 0.75*(1.0-lum));
  vec2 hb = uDesign*0.5;
  float fe = 26.0;
  float sdf = sdRR(p - hb, hb - fe*0.35, 34.0);
  float a = 1.0 - smoothstep(-fe, fe*0.35, sdf);
  a = a*a*(3.0-2.0*a);
  col = mix(uPage, col, smoothstep(0.0, 0.85, a));   // colour melts to the page before alpha does, so dark objects never look torn
  gl_FragColor = vec4(col*a, a);
}`;

/* ------------------------------------------------------------------ init */
export function init(canvas, options = {}) {
  const opt = { ...DEFAULTS, ...options };
  const F = { hand: opt.handFont, hand2: opt.handFont2, text: opt.textFont, label: opt.labelFont };
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none)').matches;
  let reduced = opt.reducedMotion ?? mqReduce.matches;

  const S = {
    destroyed: false, raf: 0, visible: true, pageVisible: !document.hidden,
    progress: opt.scrollGrow ? clamp(opt.progress, 0, 1) : 0, layout: 'wide', dW: 800, dH: 500, cssW: 0, cssH: 0, dpr: 1,
    quality: 1, slowFrames: 0, fastFrames: 0, fps: 60, frameMs: 16, last: 0, time: 0,
    lens: { x: 320, y: 200, vx: 0, vy: 0, ang: 0.62, av: 0, lift: 0, lv: 0 },
    pointer: { x: 0, y: 0, rx: 0, ry: 0, active: false, lastMove: -10 },
    sceneDirty: true, fontsReady: false, mode: 'webgl', nudge: 0,
  };
  const items = opt.items ? opt.items(painters) : buildItems();
  items.forEach(initItemState);
  S.light = { ld: [-0.5547, -0.8320], warm: 0, night: 0 }; S.lightT = { ld: [-0.5547, -0.8320], warm: 0, night: 0 }; S.hour = opt.hour; S.noteN = 0; S.press = null; S.dragItem = null; S.hoverId = null; S.goto = null;

  /* ---- GL setup ---- */
  let gl = null;
  try {
    gl = canvas.getContext('webgl', { premultipliedAlpha: true, alpha: true, antialias: false, powerPreference: 'high-performance' });
  } catch (e) { gl = null; }
  let ctx2d = null;
  if (!gl) { S.mode = '2d'; ctx2d = canvas.getContext('2d'); }

  let sceneCanvas = makeCanvas(2, 2), sceneCtx = sceneCanvas.getContext('2d');
  let deskCanvas = null, messCanvas = null, SS = 1, active = [];
  let progBlur, progBlurSoft, progMain, quad, texScene, texMess, texTab, fboA, fboB;

  function compile(type, src) {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(fs) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, VS)); gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
    gl.bindAttribLocation(p, 0, 'aPos'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < n; i++) { const info = gl.getActiveUniform(p, i); u[info.name] = gl.getUniformLocation(p, info.name); }
    return { p, u };
  }
  function tex() {
    const t = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }
  function fbo(w, h) {
    const t = tex(); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, t, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { f, t, w, h };
  }
  function setupGL() {
    progBlur = program(FS_BLUR.replace(/TAPS/g, '40'));
    progBlurSoft = program(FS_BLUR.replace(/TAPS/g, '12'));
    progMain = program(FS_MAIN);
    quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    texScene = tex(); texMess = tex(); texTab = tex();
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND);
  }
  function paintTab() {
    const c = makeCanvas(496, 336), x = c.getContext('2d');
    x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = '#fff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `700 150px '${F.label}', sans-serif`;
    x.fillText(opt.power, c.width / 2, c.height / 2 + 26);
    gl.bindTexture(gl.TEXTURE_2D, texTab);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c);
  }

  /* ---- sprites ---- */
  function bakeItem(it) {
      const pad = 26;
      const mk = (fn) => {
        const c = makeCanvas((it.w + pad * 2) * SS, (it.h + pad * 2) * SS), x = c.getContext('2d');
        x.setTransform(SS, 0, 0, SS, pad * SS, pad * SS);
        fn(x); return c;
      };
      it.pad = pad; it.base = mk(x => it.draw(x, F));
      it.inkRest = it.ink ? [mk(x => it.ink(x, 0, F)), mk(x => it.ink(x, 1, F))] : null;   // neat, scrawled
      it.messy = it.tidy = it.base;
      // shadow from the sprite's own silhouette
      const sc = makeCanvas(it.messy.width, it.messy.height), sx = sc.getContext('2d');
      sx.shadowColor = 'rgba(58,30,12,0.95)'; sx.shadowBlur = (it.soft ? 2.0 : 2.8) * SS; sx.shadowOffsetX = 10000;
      sx.drawImage(it.tidy, -10000, 0);
      it.shadowSprite = sc;
      const lc = makeCanvas(it.messy.width, it.messy.height), lx = lc.getContext('2d');
      lx.shadowColor = 'rgba(70,36,14,0.95)'; lx.shadowBlur = (it.soft ? 5 : 11) * SS; lx.shadowOffsetX = 10000;
      lx.drawImage(it.tidy, -10000, 0);
      it.longShadow = lc;
      const p = it[S.layout]; it.pose = p;
  }
  function buildSprites() {
    active = items.filter(it => it[S.layout]);
    active.forEach(bakeItem);
    deskCanvas = makeCanvas(sceneCanvas.width, sceneCanvas.height);
    const dx = deskCanvas.getContext('2d'); dx.setTransform(SS, 0, 0, SS, 0, 0);
    paintDesk(dx, S.dW, S.dH, S.layout, opt.deskColor);
    grainAtopFull(dx);
    messCanvas = makeCanvas(sceneCanvas.width, sceneCanvas.height);
    composeScene(messCanvas.getContext('2d'), true);
    S.sceneDirty = true; S.messDirty = true;
  }
  function grainAtopFull(dx) {
    dx.save(); dx.setTransform(1, 0, 0, 1, 0, 0); dx.globalAlpha = 0.06; dx.globalCompositeOperation = 'overlay';
    const t = noiseTile();
    for (let y = 0; y < deskCanvas.height; y += 512) for (let x = 0; x < deskCanvas.width; x += 512) dx.drawImage(t, x, y, 512, 512);
    dx.restore();
  }

  function composeScene(x = sceneCtx, forceMess = false) {
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1;
    x.drawImage(deskCanvas, 0, 0);
    const order = active.slice().sort((a, b) => (a.z || 0) - (b.z || 0));
    for (const it of order) {
      const p = it.pose, t = forceMess ? 0 : it.t, tc = clamp(t, 0, 1);
      const ox = it.ox, oy = it.oy, orot = it.orot, air = it.air;   // where a thing has been thrown is true outside the glass too
      let px = lerp(p.m[0], p.t[0], t) + ox, py = lerp(p.m[1], p.t[1], t) + oy, rot = (lerp(p.m[2], p.t[2] || 0, t) + orot) * Math.PI / 180;
      if (it.id === 'pen' && S.penOverride) { px = S.penOverride.x; py = S.penOverride.y; rot = S.penOverride.deg * Math.PI / 180; }
      const lift = lerp(1, 0.62, tc) * it.shadow * (1 + 2.2 * air);
      const w = (it.w + it.pad * 2), h = (it.h + it.pad * 2);
      // shadow falls away from the light, in desk space
      x.setTransform(SS, 0, 0, SS, (px + 5.2 * lift) * SS, (py + 7.4 * lift) * SS); x.rotate(rot);
      x.globalAlpha = 0.34; x.drawImage(it.longShadow, -w / 2, -h / 2, w, h);          // the long, soft throw of low sun
      x.setTransform(SS, 0, 0, SS, (px + 1.5 * lift) * SS, (py + 2.2 * lift) * SS); x.rotate(rot);
      x.globalAlpha = 0.50; x.drawImage(it.shadowSprite, -w / 2, -h / 2, w, h);        // the tight contact shadow
      x.setTransform(SS, 0, 0, SS, px * SS, py * SS); x.rotate(rot);
      x.globalAlpha = 1;
      x.drawImage(it.base, -w / 2, -h / 2, w, h);
      if (it.ink) {   // one piece of writing, redrawn at its current messiness. Never two renderings at once.
        const mess = 1 - smooth(0.10, 0.95, tc);
        x.globalAlpha = 0.92;
        const writing = it.write < 1 && it.lines;   // a note still being written shows only what the pen has reached
        if (writing) { x.save(); x.translate(-it.w / 2, -it.h / 2); x.beginPath(); writeClip(x, it); x.clip(); x.translate(it.w / 2, it.h / 2); }
        if (mess > 0.999) x.drawImage(it.inkRest[1], -w / 2, -h / 2, w, h);
        else if (mess < 0.001) x.drawImage(it.inkRest[0], -w / 2, -h / 2, w, h);
        else { x.save(); x.translate(-it.w / 2, -it.h / 2); it.ink(x, mess, F); x.restore(); }
        if (writing) x.restore();
      }
    }
    x.globalAlpha = 1;
  }

  /* ---- sizing ---- */
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    S.cssW = rect.width; S.cssH = rect.height;
    const layout = rect.width < opt.tallBelow ? 'tall' : 'wide';
    const dW = layout === 'wide' ? 800 : 358;
    const dH = dW * rect.height / rect.width;
    S.dpr = Math.min(window.devicePixelRatio || 1, opt.maxDpr) * S.quality;
    const pw = Math.round(rect.width * S.dpr), ph = Math.round(rect.height * S.dpr);
    const layoutChanged = layout !== S.layout || Math.abs(dH - S.dH) > 0.5 || dW !== S.dW;
    S.layout = layout; S.dW = dW; S.dH = dH;
    const newSS = (pw / dW) * opt.sceneScale;
    const ssChanged = Math.abs(newSS - SS) > 0.01;
    if (canvas.width !== pw || canvas.height !== ph) { canvas.width = pw; canvas.height = ph; }
    if (layoutChanged || ssChanged || !deskCanvas) {
      SS = newSS;
      sceneCanvas.width = Math.round(dW * SS); sceneCanvas.height = Math.round(dH * SS);
      buildSprites();
      if (gl) {
        if (fboA) { gl.deleteFramebuffer(fboA.f); gl.deleteTexture(fboA.t); gl.deleteFramebuffer(fboB.f); gl.deleteTexture(fboB.t); }
        fboA = fbo(Math.round(pw * 0.75), Math.round(ph * 0.75)); fboB = fbo(Math.round(pw * 0.75), Math.round(ph * 0.75)); S.messDirty = true;
      }
      if (layoutChanged) { for (const it of items) { it.ox = it.oy = it.orot = it.vx = it.vy = it.vrot = 0; it.air = 0; it.homing = false; } S.dragItem = null; S.drag2 = null; S.press = null; S.penOverride = null; }
      if (layoutChanged || !S.placed) { S.placed = true; const i0 = idleTarget(S.time); S.lens.x = i0.x; S.lens.y = i0.y; S.lens.vx = S.lens.vy = 0; snapOrder(); }
    }
    S.sceneDirty = true;
  }

  /* ---- motion ---- */
  function baseRadius() { return S.layout === 'wide' ? opt.lensRadius : opt.lensRadius * 0.86; }
  function lensState() {
    const p = S.progress, e = smooth(0, 1, Math.pow(p, 1.3));
    const R0 = baseRadius(), Rf = Math.hypot(S.dW, S.dH) * 0.63;
    const R = R0 * Math.exp(Math.log(Rf / R0) * e);
    return { R, e, mag: lerp(opt.magnification, 1.0, smooth(0.15, 0.95, e)), distort: lerp(0.30, 0.0, smooth(0.1, 0.8, e)) };
  }
  function initItemState(it) { it.t = 0; it.tv = 0; it.hold = 0; it.want = 0; it.ox = 0; it.oy = 0; it.orot = 0; it.vx = 0; it.vy = 0; it.vrot = 0; it.air = 0; it.write = 1; }
  const STOPS = opt.stops || {
    wide: [[330, 104], [318, 244], [520, 322], [660, 322], [500, 82], [140, 404], [432, 432], [132, 166]],   // manual, stickies, insurance card, letter, slip, review card, bill, fee sheet
    tall: [[266, 84], [284, 206], [268, 312], [100, 314], [252, 420], [82, 452], [182, 544]],
  };
  const DWELL = 3.4, TRAVEL = 2.4;
  function idleTarget(t) {
    const stops = STOPS[S.layout], n = stops.length, seg = DWELL + TRAVEL;
    const tt = (coarse ? t + S.progress * seg * 1.5 : t);
    const i = Math.floor(tt / seg) % n, u = (tt % seg);
    const a = stops[i], b = stops[(i + 1) % n];
    const k = smooth(0, 1, clamp((u - DWELL) / TRAVEL, 0, 1));
    // an arc between stops, and a slow breathing drift so it is never dead still
    const bow = Math.sin(k * Math.PI) * 26;
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy) || 1;
    return {
      x: lerp(a[0], b[0], k) - dy / len * bow + Math.sin(t * 0.53) * 7 + Math.sin(t * 0.21 + 1.3) * 5,
      y: lerp(a[1], b[1], k) + dx / len * bow + Math.cos(t * 0.47 + 0.6) * 6,
    };
  }
  function nearestStop(x, y) {
    let best = null, bd = 1e9;
    for (const s of STOPS[S.layout]) { const d = Math.hypot(s[0] - x, s[1] - y); if (d < bd) { bd = d; best = s; } }
    return { s: best, d: bd };
  }
  function step(dt) {
    const L = S.lens, st = lensState();
    const idle = idleTarget(S.time);
    const dragging = !!S.drag;
    const usePointer = dragging || (opt.followPointer && S.pointer.active && !coarse);
    let tx = usePointer ? S.pointer.x : idle.x, ty = usePointer ? S.pointer.y : idle.y;
    if (dragging) { // a finger holds the glass: it rises clear of the fingertip so what it shows stays visible
      const D = S.drag, up = smooth(0, 0.22, S.time - D.t0), R0 = baseRadius();
      tx = clamp(D.x + D.ox * (1 - up), R0 * 0.5, S.dW - R0 * 0.5);
      ty = clamp(D.y + lerp(D.oy, -R0 * 0.78, up), R0 * 0.5, S.dH - R0 * 0.5);
    } else if (usePointer) { // a parked pointer lets the glass settle onto the nearest paper rather than bare wood or binder cover
      const still = smooth(0.35, 1.1, S.time - S.pointer.lastMove), ns = nearestStop(tx, ty);
      const pull = still * 0.9 * (1 - smooth(80, 170, ns.d));
      tx = lerp(tx, ns.s[0], pull); ty = lerp(ty, ns.s[1], pull);
    }
    // a fly-to (tour, or a fresh note) wins over idling and over a parked pointer
    const going = !!(S.goto && S.time < S.goto.until && !dragging && !S.dragItem);
    if (going) { tx = S.goto.x; ty = S.goto.y; }
    if (S.dragItem && !dragging) { tx = L.x; ty = L.y; }   // while a thing is being dragged the glass stays where it is
    // as the lens grows it settles on the middle of the desk
    const cen = smooth(0.05, 0.8, st.e);
    tx = lerp(tx, S.dW * 0.5, cen); ty = lerp(ty, S.dH * 0.5, cen);
    const k = dragging ? 120 : (usePointer || going) ? 46 : 7.5, c = dragging ? 16 : (usePointer || going) ? 8.2 : 4.4;   // underdamped on purpose: it overshoots, then settles
    const ax = (tx - L.x) * k - L.vx * c, ay = (ty - L.y) * k - L.vy * c;
    L.vx += ax * dt; L.vy += ay * dt; L.x += L.vx * dt; L.y += L.vy * dt;
    // the tab swings with lateral motion like a weight on the rim
    const rest = 0.62;
    const tq = (L.vx * Math.cos(L.ang) + L.vy * Math.sin(L.ang)) * 0.0022;
    const aa = (rest - L.ang) * 30 - L.av * 4.6 - tq * 26;
    L.av += aa * dt; L.ang += L.av * dt;
    if (Math.abs(L.ang - rest) > 0.75) { L.ang = rest + Math.sign(L.ang - rest) * 0.75; L.av *= -0.3; }
    // hop
    const la = -L.lift * 210 - L.lv * 13; L.lv += la * dt; L.lift = Math.max(0, L.lift + L.lv * dt);
    if (L.lift === 0 && L.lv < 0) L.lv = -L.lv * 0.35;

    // the light eases toward the hour's target
    { const Lt = S.light, T = S.lightT, kl = 1 - Math.exp(-dt * 1.6);
      Lt.ld[0] += (T.ld[0] - Lt.ld[0]) * kl; Lt.ld[1] += (T.ld[1] - Lt.ld[1]) * kl; Lt.warm += (T.warm - Lt.warm) * kl; Lt.night += (T.night - Lt.night) * kl;
      const ln = Math.hypot(Lt.ld[0], Lt.ld[1]) || 1; Lt.ld[0] /= ln; Lt.ld[1] /= ln; }
    // every object: dragged, thrown, sliding, or settling into order under the glass
    for (const it of active) {
      if (it.follow) continue;
      const p = it.pose;
      const px = lerp(p.m[0], p.t[0], it.t) + it.ox, py = lerp(p.m[1], p.t[1], it.t) + it.oy;
      const isDrag = S.dragItem === it;
      if (isDrag) {
        const D = S.drag2, hw = it.w * 0.35, hh = it.h * 0.35;
        const wx = clamp(D.px - D.gx, hw, S.dW - hw), wy = clamp(D.py - D.gy, hh, S.dH - hh);   // a dragged paper stays on the desk
        const kv = 1 - Math.exp(-dt * 18);
        it.vx += (D.vx - it.vx) * kv; it.vy += (D.vy - it.vy) * kv;
        it.ox += wx - px; it.oy += wy - py;
        const tr = clamp(-it.vx * 0.035, -14, 14);            // paper pushed sideways turns a little against the push
        it.vrot += ((tr - it.orot) * 40 - it.vrot * 9) * dt; it.orot += it.vrot * dt;
        it.air += (1 - it.air) * Math.min(1, dt * 14);
        S.sceneDirty = true; S.messDirty = true;
      } else if (Math.abs(it.vx) > 2 || Math.abs(it.vy) > 2 || it.air > 0.002) {
        // sliding: friction, the edge of the desk, a little spin
        it.ox += it.vx * dt; it.oy += it.vy * dt;
        const f = Math.exp(-dt * 3.1); it.vx *= f; it.vy *= f;
        const cx = lerp(p.m[0], p.t[0], it.t) + it.ox, cy = lerp(p.m[1], p.t[1], it.t) + it.oy;
        const hw = it.w * 0.42, hh = it.h * 0.42;
        if (cx < hw) { it.ox += hw - cx; it.vx = Math.abs(it.vx) * 0.42; it.vrot += it.vy * 0.04; }
        if (cx > S.dW - hw) { it.ox -= cx - (S.dW - hw); it.vx = -Math.abs(it.vx) * 0.42; it.vrot -= it.vy * 0.04; }
        if (cy < hh) { it.oy += hh - cy; it.vy = Math.abs(it.vy) * 0.42; it.vrot -= it.vx * 0.04; }
        if (cy > S.dH - hh) { it.oy -= cy - (S.dH - hh); it.vy = -Math.abs(it.vy) * 0.42; it.vrot += it.vx * 0.04; }
        it.vrot = clamp(it.vrot, -120, 120) * Math.exp(-dt * 2.2); it.orot += it.vrot * dt;
        it.air += (0 - it.air) * Math.min(1, dt * 6);
        if (Math.abs(it.vx) <= 2 && Math.abs(it.vy) <= 2) { it.vx = it.vy = 0; }
        S.sceneDirty = true; S.messDirty = true;
      }
      const nx = clamp(L.x, px - it.w / 2, px + it.w / 2), ny = clamp(L.y, py - it.h / 2, py + it.h / 2);
      const dist = Math.hypot(L.x - nx, L.y - ny);
      const cd = Math.hypot(L.x - px, L.y - py);
      const hy = it.want ? 1.12 : 1.0;                                   // hysteresis, so an item on the threshold does not chatter
      const want = (!isDrag && (dist < st.R * 0.50 * hy || cd < st.R * 0.92 * hy)) ? 1 : 0;   // once the rim has passed its middle, it is in order
      if (want && !isDrag && S.time > (it.settleAt || 0) && (it.ox || it.oy || it.orot)) it.homing = true;   // under the glass a thrown thing comes home, once it has had a moment to lie there
      if (it.homing && !isDrag) {
        const kh = 1 - Math.exp(-dt * 5.5);
        it.ox -= it.ox * kh; it.oy -= it.oy * kh; it.orot -= it.orot * kh; it.vx = it.vy = it.vrot = 0;
        if (Math.abs(it.ox) < 0.05 && Math.abs(it.oy) < 0.05 && Math.abs(it.orot) < 0.05) { it.ox = it.oy = it.orot = 0; it.homing = false; }
        S.sceneDirty = true; S.messDirty = true;
      }
      if (want !== it.want) { it.want = want; it.hold = want ? lerp(0.30, 0.06, st.e) : 0.12; }
      if (it.hold > 0) { it.hold -= dt; continue; }
      const kk = want ? 40 : 34, cc = want ? 8.4 : 11;
      const acc = (want - it.t) * kk - it.tv * cc;
      it.tv += acc * dt; const before = it.t; it.t += it.tv * dt;
      if (Math.abs(it.t - before) > 0.0004) {
        S.sceneDirty = true;
        if (!it.homing && (it.ox || it.oy)) { const dtt = it.t - before; it.ox -= (p.t[0] - p.m[0]) * dtt; it.oy -= (p.t[1] - p.m[1]) * dtt; S.messDirty = true; }   // a displaced paper stays where it was put while its writing calms
      }
    }
    for (const it of active) if (it.follow) {
      const f = active.find(o => o.id === it.follow); if (!f) continue;
      it.t = f.t; it.air = f.air; it.z = (f.z || 0) + 0.5; it.orot = f.orot;
      const fp = f.pose, cp = it.pose, fx = lerp(fp.m[0], fp.t[0], f.t), fy = lerp(fp.m[1], fp.t[1], f.t), cx = lerp(cp.m[0], cp.t[0], it.t), cy = lerp(cp.m[1], cp.t[1], it.t);
      const rx = cx - fx, ry = cy - fy, a = f.orot * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
      it.ox = f.ox + (rx * ca - ry * sa) - rx; it.oy = f.oy + (rx * sa + ry * ca) - ry;
    }
    stepWriting(dt);
    return st;
  }
  function snapOrder() { // first frame: whatever is under the glass is already in order
    const L = S.lens, R = lensState().R;
    for (const it of active) {
      const p = it.pose, cd = Math.hypot(L.x - p.t[0], L.y - p.t[1]);
      const nx = clamp(L.x, p.t[0] - it.w / 2, p.t[0] + it.w / 2), ny = clamp(L.y, p.t[1] - it.h / 2, p.t[1] + it.h / 2);
      const w = (Math.hypot(L.x - nx, L.y - ny) < R * 0.50 || cd < R * 0.92) ? 1 : 0;
      it.t = w; it.want = w; it.tv = 0; it.hold = 0;
    }
    S.sceneDirty = true;
  }

  /* ---- the pen writing a fresh note ---- */
  let measureC = null;
  function measureCtx() { if (!measureC) measureC = makeCanvas(2, 2).getContext('2d'); return measureC; }
  function handWidth(ln) { const c = measureCtx(); c.font = `400 ${ln.size}px '${F.hand}', cursive`; return c.measureText(ln.text).width * 1.2; }
  function writeClip(x, it) {
    const total = it.lines.reduce((a, l) => a + l.text.length, 0) || 1;
    let chars = it.write * total;
    for (const ln of it.lines) {
      const wFull = handWidth(ln), n = ln.text.length;
      const frac = chars >= n ? 1 : Math.max(0, chars / n); chars -= n;
      if (frac <= 0) continue;
      x.rect(ln.x - 8, ln.y - ln.size * 1.15, wFull * frac + (frac < 1 ? 2 : 26), ln.size * 1.6);
    }
  }
  function writeCursor(it) {
    const total = it.lines.reduce((a, l) => a + l.text.length, 0) || 1;
    let chars = it.write * total;
    for (const ln of it.lines) {
      const n = ln.text.length;
      if (chars >= n) { chars -= n; continue; }
      return { x: ln.x + handWidth(ln) * (chars / n), y: ln.y - ln.size * 0.15 };
    }
    const last = it.lines[it.lines.length - 1]; return { x: last.x + handWidth(last), y: last.y - last.size * 0.15 };
  }
  function penHome(pen) {
    const p = pen.pose; return { x: lerp(p.m[0], p.t[0], pen.t) + pen.ox, y: lerp(p.m[1], p.t[1], pen.t) + pen.oy, deg: lerp(p.m[2], p.t[2] || 0, pen.t) + pen.orot };
  }
  function stepWriting(dt) {
    const it = S.writing, pen = active.find(o => o.id === 'pen');
    if (!it && !S.penOverride) return;
    if (!pen) { if (it) { it.write = 1; S.writing = null; } return; }
    let tgt;
    if (it) {
      const total = it.lines.reduce((a, l) => a + l.text.length, 0) || 1;
      it.write = Math.min(1, it.write + dt * 9 / total);   // about nine characters a second
      const cur = writeCursor(it), p = it.pose;
      const px = lerp(p.m[0], p.t[0], it.t) + it.ox, py = lerp(p.m[1], p.t[1], it.t) + it.oy, rot = (lerp(p.m[2], p.t[2] || 0, it.t) + it.orot) * Math.PI / 180;
      const lx = cur.x - it.w / 2, ly = cur.y - it.h / 2;
      const wx = px + lx * Math.cos(rot) - ly * Math.sin(rot), wy = py + lx * Math.sin(rot) + ly * Math.cos(rot);
      const ang = -0.95 + Math.sin(S.time * 21) * 0.035;   // the hand wobbles as it writes
      tgt = { x: wx + 75 * Math.cos(ang), y: wy + 75 * Math.sin(ang) + 1.5, deg: ang * 180 / Math.PI };
      pen.z = 200; S.messDirty = true;
      if (it.write >= 1) { S.writing = null; it.air = 0.5; S.goto = { x: px, y: py, until: S.time + 4.5 }; }
    } else tgt = penHome(pen);
    if (!S.penOverride) S.penOverride = { ...penHome(pen) };
    const kp = 1 - Math.exp(-dt * (it ? 16 : 5));
    const O = S.penOverride;
    O.x += (tgt.x - O.x) * kp; O.y += (tgt.y - O.y) * kp; O.deg += (tgt.deg - O.deg) * kp;
    if (!it && Math.hypot(tgt.x - O.x, tgt.y - O.y) < 0.4 && Math.abs(tgt.deg - O.deg) < 0.4) { S.penOverride = null; pen.z = 0; }
    S.sceneDirty = true; S.messDirty = true;
  }
  const NOTE_SPOTS = {
    wide: [[600, 236, 14], [220, 66, -9], [560, 452, 7], [752, 452, -12]],
    tall: [[300, 546, 10], [54, 548, -8], [186, 222, 12], [186, 404, 5]],
  };
  function wrapHand(text) {
    const c = measureCtx();
    const layout = (size, maxLines, maxW) => {
      c.font = `400 ${size}px '${F.hand}', cursive`;
      const words = text.split(/\s+/), lines = []; let cur = '';
      for (const w of words) {
        const trial = cur ? cur + ' ' + w : w;
        if (c.measureText(trial).width * 1.12 <= maxW || !cur) cur = trial; else { lines.push(cur); cur = w; }
      }
      if (cur) lines.push(cur);
      return lines.length <= maxLines ? lines : null;
    };
    let size = 15, lines = layout(15, 4, 74);
    if (!lines) { size = 12.5; lines = layout(12.5, 5, 76); }
    if (!lines) { size = 12.5; lines = layout(12.5, 99, 76).slice(0, 5); lines[4] = lines[4].replace(/\s*\S*$/, '') + '…'; }
    const step = size === 15 ? 19 : 15.5, top = size === 15 ? 28 : 24;
    return lines.map((t, i) => ({ text: t, x: 10, y: top + i * step, size, ...(i === lines.length - 1 ? { underline: true, extra: /\?$/.test(t) ? '?' : '??' } : {}) }));
  }

  /* ---- what is under the pointer ---- */
  function itemAt(x, y) {
    const order = active.slice().sort((a, b) => (a.z || 0) - (b.z || 0)).reverse();   // topmost first
    for (const it of order) {
      if (it.follow) continue;
      const p = it.pose, px = lerp(p.m[0], p.t[0], it.t) + it.ox, py = lerp(p.m[1], p.t[1], it.t) + it.oy, rot = (lerp(p.m[2], p.t[2] || 0, it.t) + it.orot) * Math.PI / 180;
      const dx = x - px, dy = y - py, cs = Math.cos(-rot), sn = Math.sin(-rot);
      const lx = dx * cs - dy * sn, ly = dx * sn + dy * cs;
      const slop = it.soft ? 7 : 2;
      if (Math.abs(lx) <= it.w / 2 + slop && Math.abs(ly) <= it.h / 2 + slop) return it;
    }
    return null;
  }
  function hoverInfo(it, cx, cy) { return { id: it.id, tool: it.tool || null, name: it.name || it.id, verb: it.verb || 'Drag it', x: cx, y: cy }; }
  function dragSample(q) {
    const D = S.drag2, H = D.hist, now = performance.now(), last = H[H.length - 1];
    D.px = q.x; D.py = q.y;
    if (last) { const dtms = Math.max(now - last.t, 4); D.vx = (q.x - last.x) / dtms * 1000; D.vy = (q.y - last.y) / dtms * 1000; }
    H.push({ t: now, x: q.x, y: q.y }); if (H.length > 10) H.shift();
  }
  function beginDrag(it, q) {
    const p = it.pose, px = lerp(p.m[0], p.t[0], it.t) + it.ox, py = lerp(p.m[1], p.t[1], it.t) + it.oy;
    S.dragItem = it; S.drag2 = { px: q.x, py: q.y, gx: q.x - px, gy: q.y - py, vx: 0, vy: 0, hist: [{ t: performance.now(), x: q.x, y: q.y }] };
    it.homing = false;
    it.vx = it.vy = 0; it.z = ++S.zTop; canvas.style.cursor = 'grabbing';
    if (opt.onHover) opt.onHover(null);
    schedule();
  }
  function endDrag() {
    const it = S.dragItem; if (!it) return;
    // the throw: displacement over the last ~90ms of pointer samples. A hand that paused before letting go sets it down.
    const H = S.drag2.hist, now = performance.now(), last = H[H.length - 1];
    let vx = 0, vy = 0;
    if (last && now - last.t < 120) {
      let i = H.length - 1; while (i > 0 && now - H[i - 1].t < 110) i--;
      const a = H[i], dtms = Math.max(last.t - a.t, 8);
      vx = (last.x - a.x) / dtms * 1000; vy = (last.y - a.y) / dtms * 1000;
    }
    const sp = Math.hypot(vx, vy), cap = 1500;
    if (sp > cap) { vx *= cap / sp; vy *= cap / sp; }
    it.vx = sp < 40 ? 0 : vx; it.vy = sp < 40 ? 0 : vy;
    it.vrot += clamp(vx * 0.03, -60, 60) * (Math.random() > 0.5 ? 1 : -1);
    it.settleAt = S.time + 2.4;
    S.dragItem = null; S.drag2 = null; canvas.style.cursor = '';
    schedule();
  }
  function openItem(it) {
    if (!it || !it.tool) return;
    it.air = 1.6; it.z = ++S.zTop; S.lens.lv += 1.2; S.sceneDirty = true; S.messDirty = true; schedule();
    if (opt.onOpen) opt.onOpen(it.id, it.tool, { name: it.name, verb: it.verb });
  }

  /* ---- the light through the day ---- */
  function lightFor(hour) {
    const h = ((hour % 24) + 24) % 24;
    const day = clamp((h - 7) / 11, 0, 1);                 // 7am to 6pm
    const a = lerp(-2.55, -0.55, day);                     // the window: left in the morning, overhead at noon, low and right by late afternoon
    const warm = smooth(12.5, 17.5, h) * (1 - smooth(18.5, 20, h));
    let night = 0;
    if (h >= 18) night = smooth(18, 19.6, h); else if (h < 7.5) night = 1 - smooth(6, 7.5, h);
    const ld = [lerp(Math.cos(a), 0.62, night), lerp(Math.sin(a), -0.78, night)];   // after hours the lamp in the corner takes over from the window
    const len = Math.hypot(ld[0], ld[1]) || 1;
    return { ld: [ld[0] / len, ld[1] / len], warm, night };
  }
  function applyHour() {
    const h = S.hour == null ? (() => { const d = new Date(); return d.getHours() + d.getMinutes() / 60; })() : S.hour;
    S.lightT = lightFor(h);
    if (!S.lightSet || reduced) { S.lightSet = true; S.light = { ld: [...S.lightT.ld], warm: S.lightT.warm, night: S.lightT.night }; if (reduced && S.started) settleStill(); }
    if (opt.onLight) opt.onLight({ hour: h, night: S.lightT.night, warm: S.lightT.warm, pinned: S.hour != null });
    schedule();
  }
  S.zTop = 10;

  /* ---- draw ---- */
  function drawGL(st) {
    if (!deskCanvas) return;
    const pw = canvas.width, ph = canvas.height;
    if (S.sceneDirty) {
      composeScene();
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texScene);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);
      S.sceneDirty = false;
    }
    if (S.messDirty) {   // outside the glass the desk is always the mess; re-blurred only when something out there moved
      composeScene(messCanvas.getContext('2d'), true);
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texMess);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, messCanvas);
      const rad = opt.blurRadius * (S.layout === 'tall' ? 0.78 : 1);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboA.f); gl.viewport(0, 0, fboA.w, fboA.h);
      gl.useProgram(progBlur.p); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texMess);
      gl.uniform1i(progBlur.u.uTex, 0); gl.uniform2f(progBlur.u.uRad, rad / S.dW, rad / S.dH); gl.uniform1f(progBlur.u.uBoost, 5.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB.f);
      gl.useProgram(progBlurSoft.p); gl.bindTexture(gl.TEXTURE_2D, fboA.t);
      gl.uniform1i(progBlurSoft.u.uTex, 0); gl.uniform2f(progBlurSoft.u.uRad, 1.1 / S.dW, 1.1 / S.dH); gl.uniform1f(progBlurSoft.u.uBoost, 0.0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      S.messDirty = false;
    }
    gl.viewport(0, 0, pw, ph); gl.useProgram(progMain.p);
    const u = progMain.u;
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texScene); gl.uniform1i(u.uScene, 0);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, fboB.t); gl.uniform1i(u.uBlur, 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, texTab); gl.uniform1i(u.uTab, 2);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform2f(u.uDesign, S.dW, S.dH); gl.uniform3f(u.uLens, S.lens.x, S.lens.y, st.R);
    gl.uniform1f(u.uMag, st.mag * (1 + S.lens.lift * 0.5)); gl.uniform1f(u.uTime, reduced ? 3.0 : S.time); gl.uniform1f(u.uAngle, S.lens.ang);
    gl.uniform1f(u.uLift, S.lens.lift); gl.uniform1f(u.uGrain, opt.grain); gl.uniform1f(u.uPx, S.dW / pw);
    { const pc = opt.pageColor, nc = opt.nightPageColor, nn = S.light.night; gl.uniform3f(u.uPage, lerp(pc[0], nc[0], nn), lerp(pc[1], nc[1], nn), lerp(pc[2], nc[2], nn)); gl.uniform2f(u.uLD, S.light.ld[0], S.light.ld[1]); gl.uniform1f(u.uWarm, S.light.warm); gl.uniform1f(u.uNight, S.light.night); } gl.uniform1f(u.uDistort, st.distort); gl.uniform1f(u.uStill, st.e); gl.uniform1f(u.uCaust, 1 - smooth(0.35, 0.9, st.e));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function draw2D() {
    if (!deskCanvas) return;
    // still fallback: the tidy, focused desk with a feathered edge and grain
    active.forEach(it => { it.t = 1; });
    composeScene();
    const w = canvas.width, h = canvas.height, x = ctx2d;
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, h);
    const f = 20 * (w / S.dW);
    x.save(); x.shadowColor = '#000'; x.shadowBlur = f; x.shadowOffsetX = 20000; x.fillStyle = '#000';
    rr(x, f * 1.1 - 20000, f * 1.1, w - f * 2.2, h - f * 2.2, 26 * (w / S.dW)); x.fill(); x.restore();
    x.globalCompositeOperation = 'source-in'; x.drawImage(sceneCanvas, 0, 0, w, h);
    x.globalCompositeOperation = 'source-atop'; x.globalAlpha = 0.07;
    const t = noiseTile(); for (let yy = 0; yy < h; yy += 256) for (let xx = 0; xx < w; xx += 256) x.drawImage(t, xx, yy);
    x.globalAlpha = 1; x.globalCompositeOperation = 'source-over';
  }

  function settleStill() {
    // reduced motion: the end state. Everything in focus, everything in its place.
    S.progress = 1; active.forEach(it => { it.t = 1; it.tv = 0; });
    S.lens.x = S.dW / 2; S.lens.y = S.dH / 2; S.sceneDirty = true;
    if (gl) drawGL(lensState()); else draw2D();
  }

  function frame(now) {
    S.raf = 0;
    if (S.destroyed) return;
    if (!deskCanvas) { resize(); if (!deskCanvas) { schedule(); return; } }   // laid out at zero size so far: try again next frame
    const dtRaw = S.last ? (now - S.last) / 1000 : 1 / 60; S.last = now;
    const dt = Math.min(dtRaw, 1 / 30);
    S.frameMs = lerp(S.frameMs, dtRaw * 1000, 0.08); S.fps = 1000 / S.frameMs;
    S.time += dt;
    // quality governor
    if (dtRaw * 1000 > 24) { S.slowFrames++; S.fastFrames = 0; } else { S.fastFrames++; if (S.fastFrames > 120) S.slowFrames = 0; }
    if (S.slowFrames > 45 && S.quality > 0.5) { S.quality = Math.max(0.5, S.quality - 0.25); S.slowFrames = 0; resize(); }
    let st = null; const sub = Math.max(1, Math.ceil(dt / (1 / 120)));
    for (let i = 0; i < sub; i++) st = step(dt / sub);
    drawGL(st);
    schedule();
  }
  function schedule() {
    if (S.destroyed || S.raf || reduced || S.mode !== 'webgl') return;
    if (!S.started || !S.visible || !S.pageVisible) return;   // never draw before start() has built the scene (a scroll can arrive while fonts load)
    // nobody touching it: the desk idles at half rate, which is plenty for a drifting glass and keeps a laptop cool
    const busy = S.dragItem || S.drag || S.writing || S.pointer.active || (S.goto && S.time < S.goto.until) || S.penOverride;
    if (busy) { S.raf = requestAnimationFrame(frame); return; }
    S.raf = -1;
    S.idleT = setTimeout(() => { S.idleT = 0; if (S.destroyed || S.raf !== -1) return; S.raf = requestAnimationFrame(frame); }, 34);
  }
  function stop() { if (S.raf > 0) cancelAnimationFrame(S.raf); if (S.idleT) clearTimeout(S.idleT); S.idleT = 0; S.raf = 0; S.last = 0; }

  /* ---- events ---- */
  function toDesign(ev) {
    const r = canvas.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / r.width * S.dW, y: (ev.clientY - r.top) / r.height * S.dH, r };
  }
  function onCancel() { S.press = null; if (S.dragItem) { const it = S.dragItem; it.vx = it.vy = 0; S.dragItem = null; S.drag2 = null; canvas.style.cursor = ''; } }
  function onMove(ev) {
    if (ev.pointerType === 'touch') return;
    if ((S.dragItem || S.press) && ev.buttons === 0) { onCancel(); }   // the button came up somewhere we did not see
    const q = toDesign(ev), m = 70 * (S.dW / q.r.width);
    const inside = q.x > -m && q.x < S.dW + m && q.y > -m && q.y < S.dH + m;
    S.pointer.active = inside;
    if (Math.hypot(q.x - S.pointer.rx, q.y - S.pointer.ry) > 1.5) { S.pointer.lastMove = S.time; S.pointer.rx = q.x; S.pointer.ry = q.y; }
    const R = baseRadius() * 0.92;
    S.pointer.x = clamp(q.x, R, S.dW - R); S.pointer.y = clamp(q.y, R, S.dH - R);
    // a press that travels becomes a drag
    if (S.press && !S.dragItem && S.press.item && Math.hypot(q.x - S.press.x, q.y - S.press.y) > 5) beginDrag(S.press.item, q);
    if (S.dragItem) { dragSample(q); schedule(); return; }
    // what is under the pointer
    const inDesk = q.x >= 0 && q.y >= 0 && q.x <= S.dW && q.y <= S.dH;
    const hit = inDesk ? itemAt(q.x, q.y) : null, hid = hit ? hit.id : null;
    if (hid !== S.hoverId) { S.hoverId = hid; canvas.style.cursor = hit ? (hit.tool ? 'pointer' : 'grab') : ''; if (opt.onHover) opt.onHover(hit ? hoverInfo(hit, ev.clientX, ev.clientY) : null); }
    else if (hit && opt.onHover && S.time - (S.hoverAt || 0) > 0.06) { S.hoverAt = S.time; opt.onHover(hoverInfo(hit, ev.clientX, ev.clientY)); }
  }
  function onUp(ev) {
    if (ev.pointerType === 'touch') return;
    const P = S.press; S.press = null;
    if (S.dragItem) { endDrag(); return; }
    if (!P || !P.item) return;
    const q = toDesign(ev);
    if (S.time - P.t < 0.5 && Math.hypot(q.x - P.x, q.y - P.y) < 5) openItem(P.item);
  }
  function onLeave() { S.pointer.active = false; }
  function onScroll() {   // the page moved under a still pointer: whatever was under it no longer is
    if (S.hoverId != null) { S.hoverId = null; canvas.style.cursor = ''; if (opt.onHover) opt.onHover(null); }
  }
  /* touch: a finger that lands on the glass drags it; a finger anywhere else scrolls the page as usual */
  function touchOf(ev, id) { for (const t of ev.changedTouches) if (t.identifier === id) return t; return null; }
  function onTouchStart(ev) {
    if (S.drag || S.press || S.dragItem || reduced || S.mode !== 'webgl' || !opt.followPointer) return;   // one finger at a time
    const t = ev.changedTouches[0], q = toDesign(t), L = S.lens;
    const hit = Math.max(lensState().R * 1.25, 30 * (S.dW / q.r.width));   // never smaller than a fingertip
    if (Math.hypot(q.x - L.x, q.y - L.y) > hit) {
      const item = (q.x >= 0 && q.y >= 0 && q.x <= S.dW && q.y <= S.dH) ? itemAt(q.x, q.y) : null;
      if (!item) return;
      ev.preventDefault(); S.press = { x: q.x, y: q.y, t: S.time, item, touch: t.identifier }; return;
    }
    ev.preventDefault();
    S.drag = { id: t.identifier, x: q.x, y: q.y, ox: L.x - q.x, oy: L.y - q.y, t0: S.time };
    L.lv += 1.2; schedule();
  }
  function onTouchMove(ev) {
    if (S.press && S.press.touch != null) {
      const t = touchOf(ev, S.press.touch); if (!t) return;
      ev.preventDefault(); const q = toDesign(t);
      if (!S.dragItem && Math.hypot(q.x - S.press.x, q.y - S.press.y) > 5) beginDrag(S.press.item, q);
      if (S.dragItem) { dragSample(q); schedule(); }
      return;
    }
    if (!S.drag) return; const t = touchOf(ev, S.drag.id); if (!t) return;
    ev.preventDefault(); const q = toDesign(t); S.drag.x = q.x; S.drag.y = q.y;
  }
  function onTouchEnd(ev) {
    if (S.press && S.press.touch != null && touchOf(ev, S.press.touch)) {
      const P = S.press; S.press = null;
      if (S.dragItem) endDrag(); else if (ev.type === 'touchend' && S.time - P.t < 0.6) openItem(P.item);
      return;
    }
    if (S.drag && touchOf(ev, S.drag.id)) S.drag = null;
  }
  function onDown(ev) {
    if (ev.pointerType === 'touch') return;   // touch has its own handlers; a scrolling thumb must not shove the glass
    const q = toDesign(ev), L = S.lens;
    if (q.x < 0 || q.y < 0 || q.x > S.dW || q.y > S.dH) return;
    const hit = itemAt(q.x, q.y);
    S.press = { x: q.x, y: q.y, t: S.time, item: hit };
    if (hit) { ev.preventDefault(); try { canvas.setPointerCapture(ev.pointerId); } catch (e) { /* older engines */ } return; }   // an object under the pointer: a click opens it, a drag moves it
    const dx = L.x - q.x, dy = L.y - q.y, d = Math.hypot(dx, dy) || 1;
    const R = lensState().R;
    if (d < R) { L.lv += 1.5; L.av += (Math.random() > 0.5 ? 1 : -1) * 2.4; }        // pressed: it hops and the tab swings
    else { const f = 420 * Math.exp(-(d - R) / 140); L.vx += dx / d * f; L.vy += dy / d * f; L.lv += 0.7; L.av += (dx / d) * 2.4; }
  }
  const onVis = () => { S.pageVisible = !document.hidden; if (S.pageVisible) schedule(); else stop(); };
  const onReduce = () => { if (opt.reducedMotion == null) { reduced = mqReduce.matches; if (reduced) { stop(); settleStill(); } else schedule(); } };
  let resizeT = 0;
  const onResize = () => { clearTimeout(resizeT); resizeT = setTimeout(() => { resize(); if (reduced || S.mode !== 'webgl') settleStill(); }, 120); };

  const io = new IntersectionObserver((es) => { S.visible = es[0].isIntersecting; if (S.visible) schedule(); else stop(); }, { threshold: 0.01 });
  const ro = 'ResizeObserver' in window ? new ResizeObserver(onResize) : null;

  function start() {
    if (S.destroyed) return;
    try { if (gl) { setupGL(); paintTab(); } } catch (e) { console.warn('[lens-hero] WebGL setup failed, using still', e); gl = null; S.mode = 'still-img'; }
    if (!gl && !ctx2d) { // the canvas already holds a dead webgl context: swap in a still image
      const still = makeCanvas(2, 2); still.className = canvas.className; still.setAttribute('role', 'img');
      still.setAttribute('aria-label', canvas.getAttribute('aria-label') || ''); still.style.cssText = canvas.style.cssText;
      canvas.replaceWith(still); canvas = still; ctx2d = still.getContext('2d'); S.mode = '2d';
    }
    resize(); S.started = true;
    if (reduced || S.mode !== 'webgl') settleStill();
    io.observe(canvas); if (ro) ro.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true });
    canvas.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    canvas.addEventListener('pointercancel', onCancel); window.addEventListener('blur', onCancel);
    applyHour(); S.clockT = setInterval(applyHour, 60000);
    canvas.style.touchAction = 'pan-y';
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd); canvas.addEventListener('touchcancel', onTouchEnd);
    document.addEventListener('visibilitychange', onVis);
    mqReduce.addEventListener?.('change', onReduce);
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); });
    canvas.addEventListener('webglcontextrestored', () => { setupGL(); paintTab(); fboA = null; deskCanvas = null; resize(); schedule(); });
    schedule();
  }

  // wait for the faces the illustration is set in, but never for long
  const faces = [`400 16px '${F.hand}'`, `400 16px '${F.hand2}'`, `600 16px '${F.text}'`, `500 16px '${F.text}'`, `700 16px '${F.label}'`];
  const fontWait = document.fonts ? Promise.all(faces.map(f => document.fonts.load(f, 'Aa+2.00?'))).catch(() => {}) : Promise.resolve();
  Promise.race([fontWait, new Promise(r => setTimeout(r, 2500))]).then(() => { S.fontsReady = true; start(); });

  return {
    setProgress(p) {
      if (reduced || !opt.scrollGrow) return;
      const v = clamp(p, 0, 1); if (v === S.progress) return; S.progress = v; schedule();
    },
    get stats() { return { fps: S.fps, frameMs: S.frameMs, quality: S.quality, mode: S.mode, layout: S.layout }; },
    /* the desk's own surface */
    objects() { return active.filter(o => o.tool).map(o => ({ id: o.id, tool: o.tool, name: o.name, verb: o.verb })); },
    flyTo(id, ms = 2500) { const it = active.find(o => o.id === id); if (!it) return false; const p = it.pose; S.goto = { x: p.t[0], y: p.t[1], until: S.time + ms / 1000 }; schedule(); return true; },
    nudge(id) { const it = active.find(o => o.id === id); if (it) { it.air = 1.3; it.z = ++S.zTop; S.lens.lv += 0.8; S.sceneDirty = true; S.messDirty = true; schedule(); } },
    open(id) { openItem(active.find(o => o.id === id)); },
    shake(strength = 1) {   // the whole desk jolts: everything that can move gets a shove
      for (const it of active) {
        if (it.follow) continue;
        const a = Math.random() * Math.PI * 2, sp = (260 + Math.random() * 520) * strength;
        it.vx += Math.cos(a) * sp; it.vy += Math.sin(a) * sp * 0.7; it.vrot += (Math.random() - 0.5) * 90 * strength;
        it.air = Math.max(it.air, 0.8); it.homing = false; it.settleAt = S.time + 3.0;
      }
      S.lens.lv += 2.0; S.lens.av += (Math.random() > 0.5 ? 1 : -1) * 3;
      S.sceneDirty = true; S.messDirty = true; schedule();
    },
    setHour(h) { S.hour = (h == null ? null : clamp(+h, 0, 24)); applyHour(); },
    get hour() { return S.hour; },
    get light() { return { ...S.lightT }; },
    addNote(text) {
      text = String(text || '').trim(); if (!text) return null;
      const lines = wrapHand(text);
      const n = ++S.noteN, slot = (n - 1) % NOTE_SPOTS.wide.length, spot = NOTE_SPOTS.wide[slot], spotT = NOTE_SPOTS.tall[slot % NOTE_SPOTS.tall.length];
      if (S.writing) { S.writing.write = 1; S.writing = null; }
      const old = items.find(o => o.isNote && o.slot === slot);
      if (old) { items.splice(items.indexOf(old), 1); const ai = active.indexOf(old); if (ai >= 0) active.splice(ai, 1); if (S.writing === old) S.writing = null; }
      const colors = ['#DCE9D3', '#F8E7A6', '#F6CDB9', '#D9E4F5'];
      const it = stickyItem('note' + n, colors[slot], {
        wide: { m: [spot[0], spot[1], spot[2]], t: [spot[0], spot[1], 0.4] },
        tall: { m: [spotT[0], spotT[1], spotT[2]], t: [spotT[0], spotT[1], 0.4] },
        tool: 'playbook', name: 'Your note', verb: 'Look it up',
      }, lines, 300 + n * 7);
      initItemState(it); it.isNote = true; it.slot = slot; it.lines = lines; it.write = 0; it.z = ++S.zTop;
      items.push(it);
      if (deskCanvas) { bakeItem(it); active.push(it); composeScene(messCanvas.getContext('2d'), true); S.messDirty = true; S.sceneDirty = true; }
      S.writing = reduced ? null : it; if (reduced) { it.write = 1; if (S.started) settleStill(); }
      const p = it[S.layout], R0 = baseRadius();
      S.goto = { x: clamp(p.m[0] + 22, R0, S.dW - R0), y: clamp(p.m[1] - 34, R0, S.dH - R0), until: S.time + 2.5 + lines.reduce((a, l) => a + l.text.length, 0) / 9 };
      schedule();
      return { id: it.id, lines: lines.map(l => l.text) };
    },
    /* test hooks */
    _state: S, _items: items,
    destroy() {
      S.destroyed = true; stop(); io.disconnect(); if (ro) ro.disconnect(); clearTimeout(resizeT);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('scroll', onScroll);
      canvas.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp); clearInterval(S.clockT);
      canvas.removeEventListener('pointercancel', onCancel); window.removeEventListener('blur', onCancel);
      canvas.removeEventListener('touchstart', onTouchStart); canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd); canvas.removeEventListener('touchcancel', onTouchEnd);
      document.removeEventListener('visibilitychange', onVis);
      mqReduce.removeEventListener?.('change', onReduce);
      if (gl) { const ext = gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext(); }
    },
  };
}

/*
 * pinScroll(track, hero, options): the page-side half of the scroll story.
 * `track` is a tall wrapper whose first child is a position: sticky stage.
 * Sets the track height so the stage stays pinned while scroll grows the lens
 * (growVh), holds the finished desk (holdVh), then releases. Returns a disposer.
 */
export function pinScroll(track, hero, options = {}) {
  const o = { growVh: 1.4, holdVh: 0.3, phoneGrowVh: 1.0, phoneHoldVh: 0.25, phoneBelow: 560, ...options };
  let grow = 1, raf = 0;
  const measure = () => {
    const vh = window.innerHeight, phone = window.innerWidth < o.phoneBelow;
    grow = vh * (phone ? o.phoneGrowVh : o.growVh);
    track.style.height = `${Math.round(vh + grow + vh * (phone ? o.phoneHoldVh : o.holdVh))}px`;
    update();
  };
  const update = () => { raf = 0; const top = track.getBoundingClientRect().top; hero.setProgress(clamp(-top / grow, 0, 1)); };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', measure);
  measure();
  return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure); if (raf) cancelAnimationFrame(raf); };
}

export default { init, pinScroll };
