/*
 * lens-hero.js · "the lens on the desk"
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
  progress: 0,            // initial scroll progress 0..1
  maxDpr: 2,              // devicePixelRatio cap
  sceneScale: 1.15,       // scene texture supersample (sharpness under magnification)
  lensRadius: 98,         // design units (wide layout); tall layout scales it
  magnification: 1.16,
  blurRadius: 2.9,        // design units, depth of field outside the glass
  grain: 0.055,
  tallBelow: 520,         // css px width under which the portrait layout is used
  handFont: 'Caveat',
  textFont: 'Inter Tight',
  labelFont: 'Schibsted Grotesk',
  power: '+2.00',
  reducedMotion: null,    // null = read the media query
  followPointer: true,
  pageColor: [0.965, 0.898, 0.843],   // what the window edge melts into
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

/* handwriting: glyph by glyph, wobbling baseline, uneven pressure */
function hand(ctx, text, x, y, size, o = {}) {
  const r = mulberry(o.seed ?? 3);
  ctx.save();
  ctx.font = `${o.weight ?? 600} ${size}px '${o.font}', cursive`;
  ctx.fillStyle = o.color ?? '#27325A';
  ctx.textBaseline = 'alphabetic';
  let cx = x; const slope = o.slope ?? -0.035;
  for (const ch of text) {
    const w = ctx.measureText(ch).width;
    ctx.save();
    ctx.translate(cx, y + (cx - x) * slope + (r() - 0.5) * size * 0.10);
    ctx.rotate((r() - 0.5) * 0.13);
    ctx.globalAlpha = 0.80 + r() * 0.20;
    ctx.fillText(ch, 0, 0);
    if (o.bold) ctx.fillText(ch, 0.35, 0.2);
    ctx.restore();
    cx += w * (0.93 + r() * 0.1);
  }
  ctx.restore();
  return cx - x;
}
function scribble(ctx, pts, color, width, seed = 1) {
  const r = mulberry(seed);
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.85; ctx.beginPath();
  pts.forEach((p, i) => {
    const px = p[0] + (r() - 0.5) * 1.2, py = p[1] + (r() - 0.5) * 1.2;
    if (!i) ctx.moveTo(px, py); else {
      const q = pts[i - 1];
      ctx.quadraticCurveTo((q[0] + px) / 2 + (r() - 0.5) * 3, (q[1] + py) / 2 + (r() - 0.5) * 3, px, py);
    }
  });
  ctx.stroke(); ctx.restore();
}
function label(ctx, F, text, x, y, size = 7.6, color = ACCENT) {
  ctx.save();
  ctx.fillStyle = ACCENT; ctx.fillRect(x, y - size * 0.80, 1.8, size * 0.86);
  ctx.font = `700 ${size}px '${F.label}', sans-serif`; ctx.fillStyle = color;
  try { ctx.letterSpacing = '0.9px'; } catch (e) { /* older engines */ }
  ctx.fillText(text.toUpperCase(), x + 5, y);
  ctx.restore();
}
function setType(ctx, F, lines, x, y, size, lh, color = INK, weight = 600) {
  ctx.save(); ctx.font = `${weight} ${size}px '${F.text}', sans-serif`; ctx.fillStyle = color;
  try { ctx.letterSpacing = '-0.2px'; } catch (e) { /* noop */ }
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); ctx.restore();
}

/* ------------------------------------------------------------ desk items */
/* Every item: size in design units, a draw(ctx, tidy, F) and a pose per
   layout: m = messy [cx, cy, deg], t = tidy [cx, cy]. */
function buildItems() {
  const items = [];

  items.push({
    id: 'fees', w: 186, h: 238, shadow: 1,
    wide: { m: [142, 170, -8.5], t: [121, 153, 0.5] }, tall: { m: [118, 152, -7.5], t: [111, 143, 0.5] },
    draw(ctx, tidy, F) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, '#FBF8F2');
      if (!tidy) {
        // a photocopied price list, corrected by hand for years
        ctx.save(); ctx.fillStyle = 'rgba(40,36,34,0.78)'; ctx.font = `700 9px '${F.text}', sans-serif`;
        ctx.fillText('FEE SHEET  (old copy?)', 16, 24); ctx.restore();
        const r = mulberry(21);
        for (let i = 0; i < 12; i++) {
          const y = 42 + i * 15.2;
          ctx.fillStyle = 'rgba(40,36,34,0.42)';
          ctx.fillRect(16, y, 56 + r() * 56, 2.6);
          ctx.fillRect(w - 44, y, 20 + r() * 8, 2.6);
          ctx.fillStyle = 'rgba(40,36,34,0.10)'; ctx.fillRect(16, y + 7, w - 32, 0.5);
        }
        scribble(ctx, [[w - 48, 58], [w - 16, 60]], '#27325A', 1.3, 2);
        scribble(ctx, [[w - 48, 104], [w - 14, 101]], '#27325A', 1.3, 4);
        scribble(ctx, [[w - 50, 103], [w - 16, 106]], '#27325A', 1.1, 5);
        hand(ctx, 'new?', w - 50, 96, 15, { font: F.hand, seed: 5, bold: true });
        hand(ctx, 'ask Dr.', 92, 139, 15, { font: F.hand, seed: 8, color: '#B5452A' });
        scribble(ctx, [[84, 142], [110, 146], [138, 141]], '#B5452A', 1.1, 9);
        hand(ctx, 'collect or bill??', 30, 205, 17, { font: F.hand, seed: 12, bold: true, slope: -0.06 });
        scribble(ctx, [[28, 212], [70, 210], [126, 204]], '#27325A', 1.2, 14);
        // circled row
        ctx.save(); ctx.strokeStyle = 'rgba(181,69,42,0.8)'; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.ellipse(62, 166, 50, 9, -0.05, 0.2, Math.PI * 2.05); ctx.stroke(); ctx.restore();
        // fold crease
        const c = ctx.createLinearGradient(0, h * 0.5 - 3, 0, h * 0.5 + 3);
        c.addColorStop(0, 'rgba(0,0,0,0)'); c.addColorStop(0.5, 'rgba(90,60,40,0.13)'); c.addColorStop(1, 'rgba(255,255,255,0.0)');
        ctx.fillStyle = c; ctx.fillRect(0, h * 0.5 - 3, w, 6);
      } else {
        label(ctx, F, 'Fees', 16, 25);
        setType(ctx, F, ['Fee sheet'], 16, 47, 17, 18, INK, 600);
        const rows = [['Comprehensive exam'], ['Refraction'], ['Contact lens fitting'], ['Frame adjustment'], ['Kids under 5']];
        rows.forEach((row, i) => {
          const y = 79 + i * 29.5;
          ctx.fillStyle = 'rgba(23,19,16,0.12)'; ctx.fillRect(16, y - 17, w - 32, 0.6);
          setType(ctx, F, [row[0]], 16, y, 11.2, 12, INK, 500);
          ctx.fillStyle = i === 2 ? ACCENT : 'rgba(23,19,16,0.78)';
          rr(ctx, w - 16 - 22, y - 5.2, 22, 2.6, 1.3); ctx.fill();          // a short ink dash where the amount goes
        });
        ctx.fillStyle = 'rgba(23,19,16,0.12)'; ctx.fillRect(16, 79 + 5 * 29.5 - 17, w - 32, 0.6);
      }
      grainAtop(ctx, w, h, 0.07);
    },
  });

  items.push({
    id: 'slip', w: 152, h: 104, shadow: 1,
    wide: { m: [372, 110, 12.5], t: [304, 86, 0] }, tall: { m: [112, 356, 8], t: [100, 340, -0.4] },
    draw(ctx, tidy, F) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, '#FBE9DC');
      if (!tidy) {
        ctx.fillStyle = '#C8583A'; ctx.fillRect(0, 0, w, 19);
        ctx.save(); ctx.font = `700 8.6px '${F.label}', sans-serif`; ctx.fillStyle = '#FFF4EC';
        try { ctx.letterSpacing = '1px'; } catch (e) { /* noop */ }
        ctx.fillText('WHILE YOU WERE OUT', 10, 13); ctx.restore();
        ctx.fillStyle = 'rgba(181,69,42,0.35)';
        [40, 60, 80].forEach(y => ctx.fillRect(10, y, w - 20, 0.6));
        hand(ctx, 'Mrs. Alvarez', 14, 37, 17, { font: F.hand, seed: 31, bold: true });
        hand(ctx, 'call back!! frames', 12, 58, 16, { font: F.hand, seed: 33, slope: -0.05 });
        hand(ctx, 'ready?? 2nd time', 22, 79, 15, { font: F.hand, seed: 36, slope: 0.02 });
        scribble(ctx, [[12, 63], [60, 65], [118, 60]], '#27325A', 1.1, 37);
      } else {
        label(ctx, F, 'Callback', 14, 24);
        setType(ctx, F, ['Call Mrs. Alvarez', 'back re: frames'], 14, 50, 15.5, 19.5);
        ctx.fillStyle = 'rgba(23,19,16,0.12)'; ctx.fillRect(14, 82, w - 28, 0.6);
        setType(ctx, F, ['Today'], 14, 95, 9.6, 12, '#6E6258', 500);
      }
      grainAtop(ctx, w, h, 0.07);
    },
  });

  const sticky = (id, color, poses, messy, tidyLabel, tidyLines, seed) => ({
    id, w: 96, h: 96, shadow: 1.25, ...poses,
    draw(ctx, tidy, F) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, color, { curl: true, radius: 0.8 });
      ctx.fillStyle = 'rgba(90,60,30,0.05)'; ctx.fillRect(0, 0, w, 17); // adhesive strip
      if (!tidy) {
        messy.forEach((m, i) => hand(ctx, m[0], m[1], m[2], m[3], { font: F.hand, seed: seed + i, bold: true, slope: m[4] ?? -0.05, color: m[5] }));
        scribble(ctx, [[14, h - 20], [44, h - 17], [70, h - 23]], '#27325A', 1.2, seed + 9);
        // the corner that stopped sticking months ago
        const k = 21; ctx.save();
        ctx.globalCompositeOperation = 'destination-out'; ctx.beginPath(); ctx.moveTo(w, h - k); ctx.lineTo(w, h + 1); ctx.lineTo(w - k, h + 1); ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
        ctx.beginPath(); ctx.moveTo(w, h - k); ctx.lineTo(w - k, h); ctx.lineTo(w - k * 0.92, h - k * 0.80); ctx.closePath();
        const fg = ctx.createLinearGradient(w - k, h - k, w - k * 0.3, h - k * 0.3);
        fg.addColorStop(0, 'rgba(255,255,255,0.95)'); fg.addColorStop(1, color); ctx.fillStyle = fg;
        ctx.shadowColor = 'rgba(60,30,10,0.45)'; ctx.shadowBlur = 5; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 3; ctx.fill(); ctx.restore();
      } else {
        label(ctx, F, tidyLabel, 11, 22);
        setType(ctx, F, tidyLines, 11, 46, 14.6, 18.4);
      }
      grainAtop(ctx, w, h, 0.075);
    },
  });
  items.push(sticky('vsp', '#F8E7A6',
    { wide: { m: [226, 214, -13], t: [276, 202, -0.7] }, tall: { m: [246, 98, 13], t: [286, 80, -0.7] } },
    [['VSP or', 12, 42, 24], ['EyeMed???', 9, 68, 22, 0.03]], 'Insurance', ['VSP or', 'EyeMed?'], 40));
  items.push(sticky('refr', '#F6CDB9',
    { wide: { m: [366, 236, 9.5], t: [380, 202, 0.3] }, tall: { m: [272, 208, -11], t: [286, 188, 0.4] } },
    [['refraction', 9, 38, 20], ['collect', 12, 58, 20, 0.02], ['or bill?', 20, 77, 20, -0.08]], 'Billing', ['Refraction:', 'collect', 'or bill?'], 52));

  items.push({
    id: 'kids', w: 152, h: 84, shadow: 1,
    wide: { m: [272, 326, -16], t: [304, 306, 0.4] }, tall: null,
    draw(ctx, tidy, F) {
      const w = this.w, h = this.h;
      paper(ctx, w, h, '#FCFAF5');
      if (!tidy) {
        ctx.fillStyle = 'rgba(190,80,60,0.45)'; ctx.fillRect(0, 17, w, 0.7);
        ctx.fillStyle = 'rgba(70,110,170,0.28)';
        [31, 45, 59, 73].forEach(y => ctx.fillRect(0, y, w, 0.6));
        hand(ctx, 'which dr sees kids', 10, 35, 17, { font: F.hand, seed: 61, bold: true, color: '#2B2B2B' });
        hand(ctx, 'under 5 ??', 16, 56, 19, { font: F.hand, seed: 63, bold: true, color: '#2B2B2B', slope: -0.07 });
        hand(ctx, 'ask again', 78, 75, 14, { font: F.hand, seed: 66, color: '#B5452A' });
      } else {
        label(ctx, F, 'Scheduling', 13, 23);
        setType(ctx, F, ['Which doctor sees', 'kids under 5?'], 13, 46, 14.6, 18.4);
      }
      grainAtop(ctx, w, h, 0.07);
    },
  });

  items.push({
    id: 'binder', w: 176, h: 214, shadow: 2.0,
    wide: { m: [512, 156, 5.2], t: [518, 143, 0] }, tall: null,
    draw(ctx, tidy, F) {
      const w = this.w, h = this.h;
      rr(ctx, 0, 0, w, h, 7); ctx.fillStyle = '#231E1A'; ctx.fill();
      ctx.save(); rr(ctx, 0, 0, w, h, 7); ctx.clip();
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(255,240,225,0.17)'); g.addColorStop(0.5, 'rgba(255,240,225,0.03)'); g.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      // spine ridge
      const s = ctx.createLinearGradient(14, 0, 30, 0);
      s.addColorStop(0, 'rgba(0,0,0,0.35)'); s.addColorStop(0.4, 'rgba(255,240,225,0.16)'); s.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = s; ctx.fillRect(14, 0, 16, h);
      ctx.restore();
      // rivets
      [[22, 40], [22, h - 40]].forEach(([x, y]) => {
        const rg = ctx.createRadialGradient(x - 1, y - 1, 0.5, x, y, 4);
        rg.addColorStop(0, '#E9E2D8'); rg.addColorStop(1, '#7E746A');
        ctx.beginPath(); ctx.arc(x, y, 3.4, 0, 7); ctx.fillStyle = rg; ctx.fill();
      });
      // label window
      ctx.save(); ctx.translate(36, 66);
      rr(ctx, 0, 0, 118, 64, 2.5); ctx.fillStyle = '#F7F1E6'; ctx.fill();
      if (!tidy) {
        hand(ctx, 'front desk', 9, 25, 19, { font: F.hand, seed: 71, bold: true, color: '#2B2B2B' });
        hand(ctx, 'stuff (old?)', 12, 46, 16, { font: F.hand, seed: 73, color: '#2B2B2B' });
      } else {
        label(ctx, F, 'Playbook', 10, 20);
        setType(ctx, F, ['Front desk'], 10, 42, 15.5, 18);
      }
      ctx.restore();
      grainAtop(ctx, w, h, 0.10);
    },
  });

  items.push({
    id: 'card', w: 118, h: 74, shadow: 0.8,
    wide: { m: [462, 306, -12], t: [489, 300, 0] }, tall: { m: [262, 352, -13], t: [268, 340, 0] },
    draw(ctx, tidy, F) {
      const w = this.w, h = this.h;
      rr(ctx, 0, 0, w, h, 6); ctx.fillStyle = '#F3F2EE'; ctx.fill();
      ctx.save(); rr(ctx, 0, 0, w, h, 6); ctx.clip();
      ctx.fillStyle = '#51657A'; ctx.fillRect(0, 0, w, 21);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(60,50,40,0.10)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); ctx.restore();
      ctx.save(); ctx.font = `700 8.4px '${F.label}', sans-serif`; ctx.fillStyle = '#F4F6F8';
      try { ctx.letterSpacing = '1px'; } catch (e) { /* noop */ }
      ctx.fillText('VISION PLAN', 10, 14); ctx.restore();
      setType(ctx, F, ['Member ID'], 10, 36, 8, 10, '#6E6258', 500);
      ctx.fillStyle = 'rgba(23,19,16,0.55)';
      [0, 1, 2].forEach(i => { rr(ctx, 10 + i * 26, 42, 21, 6.5, 2); ctx.fill(); });
      setType(ctx, F, ['Group'], 10, 62, 8, 10, '#6E6258', 500);
      ctx.fillStyle = 'rgba(23,19,16,0.40)'; rr(ctx, 40, 56, 34, 6.5, 2); ctx.fill();
      void tidy;
      grainAtop(ctx, w, h, 0.05);
    },
  });

  items.push({
    id: 'scrap', w: 100, h: 54, shadow: 1.2,
    wide: { m: [540, 344, 21], t: [480, 369, -0.6] }, tall: null,
    draw(ctx, tidy, F) {
      const w = this.w, h = this.h, r = mulberry(88);
      // torn along the top: a ragged edge, fibres showing
      ctx.beginPath(); ctx.moveTo(0, 5);
      for (let x = 0; x <= w; x += 4) ctx.lineTo(x, 2 + r() * 5.5);
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.save(); ctx.clip(); paper(ctx, w, h, '#FAF6EC');
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(0, 0, w, 8); ctx.restore();
      if (!tidy) {
        hand(ctx, 'call lab!!', 9, 27, 18, { font: F.hand, seed: 91, bold: true, color: '#2B2B2B' });
        hand(ctx, 're: order ??', 14, 45, 15, { font: F.hand, seed: 93, color: '#27325A' });
      } else {
        label(ctx, F, 'Lab', 10, 21);
        setType(ctx, F, ['Call lab re: order'], 10, 40, 11.6, 14);
      }
      grainAtop(ctx, w, h, 0.08);
    },
  });

  items.push({
    id: 'clip', w: 34, h: 12, shadow: 0.7, soft: true, follow: 'fees',
    wide: { m: [70, 66, 64], t: [60, 39, 90] }, tall: { m: [48, 50, 66], t: [50, 29, 90] },
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
    wide: { m: [150, 268, -27], t: [121, 318, 0] }, tall: { m: [150, 236, 31], t: [111, 286, 0] },
    draw(ctx) {
      const w = this.w, h = this.h, y = 1.5, bh = 9;
      // tip
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
      // clip
      rr(ctx, w - 62, y - 1.5, 46, 3.2, 1.5);
      const kg = ctx.createLinearGradient(0, y - 1.5, 0, y + 2);
      kg.addColorStop(0, '#FFFFFF'); kg.addColorStop(1, '#9A9088'); ctx.fillStyle = kg; ctx.fill();
      void h;
    },
  });

  return items;
}

/* the desk surface itself: pale warm laminate, faint grain, a coffee ring */
function paintDesk(ctx, W, H, layout) {
  ctx.fillStyle = '#D9B896'; ctx.fillRect(0, 0, W, H);
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
const float RIMW = 2.1; const float TABW = 31.0; const float TABH = 21.0;
const vec2 LD = vec2(-0.5547, -0.8320);           // toward the light (top left)

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
  col += vec3(0.10,0.065,0.02) * exp(-pow(length((p - uDesign*vec2(0.16,0.10))/uDesign)/0.42, 2.0));
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
  const F = { hand: opt.handFont, text: opt.textFont, label: opt.labelFont };
  const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarse = window.matchMedia('(hover: none)').matches;
  let reduced = opt.reducedMotion ?? mqReduce.matches;

  const S = {
    destroyed: false, raf: 0, visible: true, pageVisible: !document.hidden,
    progress: clamp(opt.progress, 0, 1), layout: 'wide', dW: 640, dH: 416, cssW: 0, cssH: 0, dpr: 1,
    quality: 1, slowFrames: 0, fastFrames: 0, fps: 60, frameMs: 16, last: 0, time: 0,
    lens: { x: 320, y: 200, vx: 0, vy: 0, ang: 0.62, av: 0, lift: 0, lv: 0 },
    pointer: { x: 0, y: 0, rx: 0, ry: 0, active: false, lastMove: -10 },
    sceneDirty: true, fontsReady: false, mode: 'webgl', nudge: 0,
  };
  const items = buildItems();
  items.forEach(it => { it.t = 0; it.tv = 0; it.hold = 0; it.want = 0; });

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
  function buildSprites() {
    const pad = 22;
    active = items.filter(it => it[S.layout]);
    active.forEach(it => {
      const mk = (tidy) => {
        const c = makeCanvas((it.w + pad * 2) * SS, (it.h + pad * 2) * SS), x = c.getContext('2d');
        x.setTransform(SS, 0, 0, SS, pad * SS, pad * SS);
        it.draw(x, tidy, F); return c;
      };
      it.pad = pad; it.messy = mk(false); it.tidy = mk(true);
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
    });
    deskCanvas = makeCanvas(sceneCanvas.width, sceneCanvas.height);
    const dx = deskCanvas.getContext('2d'); dx.setTransform(SS, 0, 0, SS, 0, 0);
    paintDesk(dx, S.dW, S.dH, S.layout);
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
    for (const it of active) {
      const p = it.pose, t = forceMess ? 0 : it.t, tc = clamp(t, 0, 1);
      const px = lerp(p.m[0], p.t[0], t), py = lerp(p.m[1], p.t[1], t), rot = lerp(p.m[2], p.t[2] || 0, t) * Math.PI / 180;
      const lift = lerp(1, 0.62, tc) * it.shadow;
      const w = (it.w + it.pad * 2), h = (it.h + it.pad * 2);
      // shadow falls away from the light, in desk space
      x.setTransform(SS, 0, 0, SS, (px + 5.2 * lift) * SS, (py + 7.4 * lift) * SS); x.rotate(rot);
      x.globalAlpha = 0.34; x.drawImage(it.longShadow, -w / 2, -h / 2, w, h);          // the long, soft throw of low sun
      x.setTransform(SS, 0, 0, SS, (px + 1.5 * lift) * SS, (py + 2.2 * lift) * SS); x.rotate(rot);
      x.globalAlpha = 0.50; x.drawImage(it.shadowSprite, -w / 2, -h / 2, w, h);        // the tight contact shadow
      x.setTransform(SS, 0, 0, SS, px * SS, py * SS); x.rotate(rot);
      const a = smooth(0.28, 0.82, tc);
      x.globalAlpha = 1;
      if (a < 1) x.drawImage(it.messy, -w / 2, -h / 2, w, h);
      if (a > 0) { x.globalAlpha = a; x.drawImage(it.tidy, -w / 2, -h / 2, w, h); }
    }
    x.globalAlpha = 1;
  }

  /* ---- sizing ---- */
  function resize() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    S.cssW = rect.width; S.cssH = rect.height;
    const layout = rect.width < opt.tallBelow ? 'tall' : 'wide';
    const dW = layout === 'wide' ? 640 : 358;
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
  const STOPS = {
    wide: [[330, 250], [316, 98], [524, 136], [486, 306], [128, 150]],   // stickies + scheduling card, slip, binder label, insurance card, fee sheet
    tall: [[276, 136], [112, 128], [104, 342], [266, 342]],
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
    const usePointer = opt.followPointer && S.pointer.active && !coarse;
    let tx = usePointer ? S.pointer.x : idle.x, ty = usePointer ? S.pointer.y : idle.y;
    if (usePointer) { // a parked pointer lets the glass settle onto the nearest paper rather than bare wood or binder cover
      const still = smooth(0.35, 1.1, S.time - S.pointer.lastMove), ns = nearestStop(tx, ty);
      const pull = still * 0.9 * (1 - smooth(80, 170, ns.d));
      tx = lerp(tx, ns.s[0], pull); ty = lerp(ty, ns.s[1], pull);
    }
    // as the lens grows it settles on the middle of the desk
    const cen = smooth(0.05, 0.8, st.e);
    tx = lerp(tx, S.dW * 0.5, cen); ty = lerp(ty, S.dH * 0.5, cen);
    const k = usePointer ? 46 : 7.5, c = usePointer ? 8.2 : 4.4;   // underdamped on purpose: it overshoots, then settles
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

    // tidiness per item
    for (const it of active) {
      const p = it.pose;
      const px = lerp(p.m[0], p.t[0], it.t), py = lerp(p.m[1], p.t[1], it.t);
      const nx = clamp(L.x, px - it.w / 2, px + it.w / 2), ny = clamp(L.y, py - it.h / 2, py + it.h / 2);
      const dist = Math.hypot(L.x - nx, L.y - ny);
      if (it.follow) continue;
      const cd = Math.hypot(L.x - px, L.y - py);
      const hy = it.want ? 1.12 : 1.0;                                   // hysteresis, so an item on the threshold does not chatter
      const want = (dist < st.R * 0.50 * hy || cd < st.R * 0.92 * hy) ? 1 : 0;   // once the rim has passed its middle, it is in order
      if (want !== it.want) { it.want = want; it.hold = want ? lerp(0.30, 0.06, st.e) : 0.12; }
      if (it.hold > 0) { it.hold -= dt; continue; }
      const kk = want ? 40 : 34, cc = want ? 8.4 : 11;
      const acc = (want - it.t) * kk - it.tv * cc;
      it.tv += acc * dt; const before = it.t; it.t += it.tv * dt;
      if (Math.abs(it.t - before) > 0.0004) S.sceneDirty = true;
    }
    for (const it of active) if (it.follow) { const f = active.find(o => o.id === it.follow); if (f) it.t = f.t; }
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

  /* ---- draw ---- */
  function drawGL(st) {
    const pw = canvas.width, ph = canvas.height;
    if (S.sceneDirty) {
      composeScene();
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, texScene);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sceneCanvas);
      S.sceneDirty = false;
    }
    if (S.messDirty) {   // outside the glass the desk is always the mess: blurred once, never again
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
    gl.uniform3f(u.uPage, opt.pageColor[0], opt.pageColor[1], opt.pageColor[2]); gl.uniform1f(u.uDistort, st.distort); gl.uniform1f(u.uStill, st.e); gl.uniform1f(u.uCaust, 1 - smooth(0.35, 0.9, st.e));
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  function draw2D() {
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
    if (!S.visible || !S.pageVisible) return;
    S.raf = requestAnimationFrame(frame);
  }
  function stop() { if (S.raf) cancelAnimationFrame(S.raf); S.raf = 0; S.last = 0; }

  /* ---- events ---- */
  function toDesign(ev) {
    const r = canvas.getBoundingClientRect();
    return { x: (ev.clientX - r.left) / r.width * S.dW, y: (ev.clientY - r.top) / r.height * S.dH, r };
  }
  function onMove(ev) {
    if (ev.pointerType === 'touch') return;
    const q = toDesign(ev), m = 70 * (S.dW / q.r.width);
    const inside = q.x > -m && q.x < S.dW + m && q.y > -m && q.y < S.dH + m;
    S.pointer.active = inside;
    if (Math.hypot(q.x - S.pointer.rx, q.y - S.pointer.ry) > 1.5) { S.pointer.lastMove = S.time; S.pointer.rx = q.x; S.pointer.ry = q.y; }
    const R = baseRadius() * 0.92;
    S.pointer.x = clamp(q.x, R, S.dW - R); S.pointer.y = clamp(q.y, R, S.dH - R);
  }
  function onLeave() { S.pointer.active = false; }
  function onDown(ev) {
    const q = toDesign(ev), L = S.lens;
    if (q.x < 0 || q.y < 0 || q.x > S.dW || q.y > S.dH) return;
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
    resize();
    if (reduced || S.mode !== 'webgl') settleStill();
    io.observe(canvas); if (ro) ro.observe(canvas);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    canvas.addEventListener('pointerdown', onDown);
    document.addEventListener('visibilitychange', onVis);
    mqReduce.addEventListener?.('change', onReduce);
    canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); });
    canvas.addEventListener('webglcontextrestored', () => { setupGL(); paintTab(); fboA = null; deskCanvas = null; resize(); schedule(); });
    schedule();
  }

  // wait for the faces the illustration is set in, but never for long
  const faces = [`600 16px '${F.hand}'`, `600 16px '${F.text}'`, `500 16px '${F.text}'`, `700 16px '${F.label}'`];
  const fontWait = document.fonts ? Promise.all(faces.map(f => document.fonts.load(f, 'Aa+2.00?'))).catch(() => {}) : Promise.resolve();
  Promise.race([fontWait, new Promise(r => setTimeout(r, 2500))]).then(() => { S.fontsReady = true; start(); });

  return {
    setProgress(p) {
      if (reduced) return;
      const v = clamp(p, 0, 1); if (v === S.progress) return; S.progress = v; schedule();
    },
    get stats() { return { fps: S.fps, frameMs: S.frameMs, quality: S.quality, mode: S.mode, layout: S.layout }; },
    /* test hooks */
    _state: S, _items: items,
    destroy() {
      S.destroyed = true; stop(); io.disconnect(); if (ro) ro.disconnect(); clearTimeout(resizeT);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      canvas.removeEventListener('pointerdown', onDown);
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
