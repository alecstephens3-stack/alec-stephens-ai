/*
 * bench-items.js · the objects on "Alec's bench" (stephensai.co/alec).
 * Alec's workbench seen from above, on the same desk engine and lens as /desk and /play.
 * Each object is an artifact from one of his eight builds (cases.yaml); clicking it opens
 * that build. `id` and `tool` are both the build's slug, `verb` is its short name.
 *
 * Plain ES module, no imports. Everything is painted through the painters the desk
 * engine hands over (desk-scene.js exports them as `painters`):
 *   { paper, print, script, rr, grainAtop, mulberry, makeCanvas, stickyItem, INK, ACCENT, CREAM, BLUE_INK }
 *
 * Item contract (see ../desk/README.md): w x h in design units, draw(ctx, F) paints the
 * object at the origin, ink(ctx, m, F) paints anything handwritten at messiness m
 * (1 = scrawled, 0 = neat). Poses per layout: m = messy [cx, cy, deg], t = tidy [cx, cy, deg].
 * Wide desk 800 x 500, tall 358 x 600. One light, from the top left. The engine casts the
 * object's own shadow from its silhouette, so draw() only shades parts sitting on parts.
 */

/* an engineer's bench: the front desk's laminate (#D9B896), darker and more handled */
export const BENCH_DESK_COLOR = '#B38E69';

/* Every pose lives here once. The lens stops are derived from the tidy poses below, so a
   moved object can never leave its stop behind. */
const POSES = {
  'knowledge-base':    { wide: { m: [156, 134, -6], t: [150, 128, 0] },  tall: { m: [128, 104, -2], t: [128, 100, 0] } },
  'ai-lab':            { wide: { m: [326, 130, 8], t: [322, 126, 0] },   tall: { m: [285, 121, 2], t: [284, 118, 0] } },
  'coaching-aios':     { wide: { m: [486, 120, -5], t: [482, 114, 0] },  tall: { m: [113, 244, -2], t: [112, 240, 0] } },
  'aios':              { wide: { m: [680, 114, 9], t: [676, 108, 0] },   tall: { m: [265, 253, 3], t: [266, 250, 0] } },
  'curriculum-system': { wide: { m: [676, 358, -7], t: [672, 352, 0] },  tall: { m: [273, 380, 92], t: [274, 378, 90] } },
  'construction-site': { wide: { m: [500, 368, 6], t: [496, 362, 0] },   tall: { m: [119, 381, 2], t: [118, 378, 0] } },
  'invoice-agent':     { wide: { m: [306, 386, -9], t: [312, 382, 0] },  tall: { m: [255, 512, -1], t: [254, 510, 0] } },
  'pto-payroll':       { wide: { m: [140, 370, 7], t: [134, 364, 0] },   tall: { m: [105, 506, 2], t: [104, 504, 0] } },
  mug:                 { wide: { m: [644, 236, 18], t: [640, 232, 0] },  tall: null },
  pencil:              { wide: { m: [258, 262, -16], t: [262, 258, 0] }, tall: { m: [232, 116, 88], t: [232, 112, 90] } },
};

/* the idle lens visits the tidy centre of each build, in a loop around the desk */
const TOUR = {
  wide: ['knowledge-base', 'ai-lab', 'coaching-aios', 'aios', 'curriculum-system', 'construction-site', 'invoice-agent', 'pto-payroll'],
  tall: ['knowledge-base', 'ai-lab', 'aios', 'coaching-aios', 'construction-site', 'curriculum-system', 'invoice-agent', 'pto-payroll'],
};
export const BENCH_STOPS = {
  wide: TOUR.wide.map(id => POSES[id].wide.t.slice(0, 2)),
  tall: TOUR.tall.map(id => POSES[id].tall.t.slice(0, 2)),
};

export function buildBenchItems(P) {
  const { paper, print, script, rr, grainAtop, mulberry, ACCENT } = P;
  const INK = P.INK || '#171310', BLUE = P.BLUE_INK || '#26336B', GRAPHITE = '#4B4A4F';
  const RED_PENCIL = '#B5452A';

  /* ------------------------------------------------------------- helpers */
  /* a polygon with rounded corners (r may be one radius or one per corner) */
  function poly(ctx, pts, r = 0) {
    ctx.beginPath();
    const n = pts.length;
    if (!r) { ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1]); ctx.closePath(); return; }
    const a = pts[n - 1], b = pts[0];
    ctx.moveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2);
    for (let i = 0; i < n; i++) {
      const p = pts[i], q = pts[(i + 1) % n], ri = Array.isArray(r) ? r[i] : r;
      ctx.arcTo(p[0], p[1], q[0], q[1], ri);
    }
    ctx.closePath();
  }
  /* a crease: a dark line with a light line beside it, the way a fold catches the window */
  function crease(ctx, x0, y0, x1, y1, o = {}) {
    const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = `rgba(${o.dc ?? '92,66,44'},${o.dark ?? 0.30})`; ctx.lineWidth = o.w ?? 0.6;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = `rgba(${o.lc ?? '255,255,255'},${o.light ?? 0.75})`; ctx.lineWidth = (o.w ?? 0.6) * 0.9;
    ctx.beginPath(); ctx.moveTo(x0 + nx * 0.7, y0 + ny * 0.7); ctx.lineTo(x1 + nx * 0.7, y1 + ny * 0.7); ctx.stroke();
    ctx.restore();
  }
  /* brushed steel along a direction */
  function steel(ctx, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#FBFAF8'); g.addColorStop(0.35, '#D2CDC6'); g.addColorStop(0.6, '#9C958D'); g.addColorStop(1, '#5F5852');
    return g;
  }
  /* a part resting on another part throws a small shadow */
  function drop(ctx, blur, ox, oy, a) { ctx.shadowColor = `rgba(40,20,8,${a})`; ctx.shadowBlur = blur; ctx.shadowOffsetX = ox; ctx.shadowOffsetY = oy; }
  function noDrop(ctx) { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; }
  /* window light across a region: bright top left, a warm shade bottom right */
  function light(ctx, x, y, w, h, a0 = 0.30, a1 = 0.12) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, `rgba(255,255,255,${a0})`); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, `rgba(70,44,24,${a1})`);
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }
  /* a paper clip, 34 x 12, lying flat */
  function paperClip(ctx, x, y, rot, len = 34) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(len / 34, 1);
    drop(ctx, 1.6, 0.8, 1.2, 0.45);
    ctx.strokeStyle = steel(ctx, 0, 0, 0, 12); ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(8, 9.2); ctx.lineTo(28, 9.2); ctx.arc(28, 6, 3.2, Math.PI / 2, -Math.PI / 2, true);
    ctx.lineTo(5, 2.8); ctx.arc(5, 6.4, 3.6, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(24, 10); ctx.stroke();
    noDrop(ctx);
    ctx.beginPath(); ctx.moveTo(24, 5.2); ctx.lineTo(10, 5.2); ctx.arc(10, 6.6, 1.4, -Math.PI / 2, Math.PI / 2, true); ctx.lineTo(22, 8); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.4;
    ctx.beginPath(); ctx.moveTo(7, 2.4); ctx.lineTo(26, 2.4); ctx.stroke();
    ctx.restore();
  }
  /* a stroke that wobbles with messiness m: a pen line drawn in a hurry vs with care */
  function wobble(ctx, pts, m, seed, o = {}) {
    const r = mulberry(seed);
    ctx.save(); ctx.strokeStyle = o.color ?? BLUE; ctx.lineWidth = o.width ?? 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalAlpha = o.alpha ?? 0.88;
    ctx.beginPath();
    pts.forEach(([x, y], i) => { const jx = (r() - 0.5) * 2.4 * m, jy = (r() - 0.5) * 2.4 * m; if (!i) ctx.moveTo(x + jx, y + jy); else ctx.lineTo(x + jx, y + jy); });
    if (o.close) ctx.closePath();
    ctx.stroke(); ctx.restore();
  }
  const circlePts = (cx, cy, rx, ry = rx, n = 14, over = 0) => { const out = []; for (let i = 0; i <= n + over; i++) { const a = i / n * Math.PI * 2 - 0.4; out.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return out; };
  /* a greasy fingertip on glass: concentric ridges and a haze */
  function fingerprint(ctx, x, y, rot, k = 1, tone = '110,100,92', a = 0.12) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(k, k * 1.28);
    const hz = ctx.createRadialGradient(0, 0, 0.5, 0, 0, 9.5);
    hz.addColorStop(0, `rgba(${tone},${a * 0.8})`); hz.addColorStop(1, `rgba(${tone},0)`);
    ctx.fillStyle = hz; ctx.beginPath(); ctx.arc(0, 0, 9.5, 0, 7); ctx.fill();
    ctx.lineWidth = 0.42;
    for (let r = 1.1; r < 8.6; r += 0.95) {
      ctx.strokeStyle = `rgba(${tone},${a * (1 - r / 11)})`;
      ctx.beginPath(); ctx.ellipse(0.3 * (r / 8), 0, r, r * 0.9, 0, 0.35 + r * 0.18, Math.PI * 2 - 0.5 + r * 0.08); ctx.stroke();
    }
    ctx.restore();
  }

  const items = [];

  /* ======================================================= 1 knowledge base */
  /* the front desk tablet, lying flat, the knowledge base app open on it */
  items.push({
    id: 'knowledge-base', tool: 'knowledge-base', name: 'Front desk tablet', verb: 'Knowledge base',
    w: 184, h: 124, shadow: 1.7, ...POSES['knowledge-base'],
    draw(ctx, F) {
      const w = this.w, h = this.h;
      // the aluminium shell, lit from the top left
      const shell = ctx.createLinearGradient(0, 0, w, h);
      shell.addColorStop(0, '#F1EEEA'); shell.addColorStop(0.42, '#C3BEB7'); shell.addColorStop(1, '#6E6862');
      rr(ctx, 1, 1, w - 2, h - 2, 12); ctx.fillStyle = shell; ctx.fill();
      // the glass front and its black bezel
      rr(ctx, 2.5, 2.5, w - 5, h - 5, 10.6); ctx.fillStyle = '#151311'; ctx.fill();
      // front camera, centred on the long top edge
      ctx.beginPath(); ctx.arc(w / 2, 5.6, 1.15, 0, 7); ctx.fillStyle = '#26303A'; ctx.fill();
      ctx.beginPath(); ctx.arc(w / 2 - 0.35, 5.25, 0.35, 0, 7); ctx.fillStyle = 'rgba(190,220,255,0.7)'; ctx.fill();

      // the screen: the knowledge base home, light mode
      const sx = 10, sy = 9, sw = w - 20, sh = h - 18;
      ctx.save(); rr(ctx, sx, sy, sw, sh, 3.2); ctx.clip();
      ctx.fillStyle = '#F7F3EA'; ctx.fillRect(sx, sy, sw, sh);
      // app bar
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(sx, sy, sw, 13);
      ctx.fillStyle = 'rgba(23,19,16,0.10)'; ctx.fillRect(sx, sy + 13, sw, 0.5);
      ctx.beginPath(); ctx.arc(sx + 7, sy + 6.6, 1.8, 0, 7); ctx.fillStyle = ACCENT; ctx.fill();
      print(ctx, F, 'Front desk', sx + 12, sy + 8.6, 5.4, { weight: 600, color: INK });
      print(ctx, F, '35 pages  ·  41 prices', sx + sw - 6, sy + 8.4, 4.1, { align: 'right', color: 'rgba(23,19,16,0.52)' });
      // search box with a blinking caret
      const bx = sx + 8, by = sy + 19, bw = sw - 16, bh = 13;
      ctx.save(); rr(ctx, bx, by, bw, bh, 6.5); drop(ctx, 1.4, 0, 0.6, 0.10); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
      rr(ctx, bx, by, bw, bh, 6.5); ctx.strokeStyle = 'rgba(23,19,16,0.22)'; ctx.lineWidth = 0.6; ctx.stroke();
      ctx.save(); ctx.strokeStyle = 'rgba(23,19,16,0.62)'; ctx.lineWidth = 0.85; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(bx + 7.4, by + 6.1, 2.5, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(bx + 9.3, by + 8); ctx.lineTo(bx + 10.9, by + 9.6); ctx.stroke(); ctx.restore();
      ctx.fillStyle = ACCENT; ctx.fillRect(bx + 13.4, by + 3.2, 0.55, 6.8);
      print(ctx, F, 'Search protocols, prices, doctors', bx + 15, by + 8.4, 4.9, { color: 'rgba(23,19,16,0.42)' });
      // the four decision tools
      const tiles = [['Dr', 'Doctors', '#C85A38'], ['$', 'Prices', '#4E7A60'], ['?', 'Collect/bill', '#3B5687'], ['!', 'Urgency', '#9E3F2A']];
      const tw = (bw - 9) / 4, ty = by + bh + 5;
      tiles.forEach(([g, t, c], i) => {
        const x = bx + i * (tw + 3);
        ctx.save(); rr(ctx, x, ty, tw, 20, 3); drop(ctx, 1.5, 0, 0.6, 0.12); ctx.fillStyle = '#FFFFFF'; ctx.fill(); ctx.restore();
        rr(ctx, x + 3, ty + 3, 6.4, 6.4, 1.6); ctx.fillStyle = c; ctx.fill();
        print(ctx, F, g, x + 6.2, ty + 7.6, 3.8, { weight: 700, align: 'center', color: '#FFFFFF' });
        print(ctx, F, t, x + 3, ty + 16, 4.1, { weight: 600, color: INK });
      });
      // the page list
      print(ctx, F, 'PAGES', bx, sy + 65, 3.7, { label: true, weight: 700, color: 'rgba(23,19,16,0.45)', track: '0.8px' });
      print(ctx, F, '7 sections', bx + bw, sy + 65, 3.7, { align: 'right', color: 'rgba(23,19,16,0.45)' });
      const pages = [['Scheduling', 'Updated today'], ['Insurance and billing', ''], ['Optical and frames', ''], ['Contact lenses', '']];
      pages.forEach(([t, note], i) => {
        const y = sy + 74 + i * 8.2;
        if (i === 1) { ctx.fillStyle = 'rgba(220,104,67,0.09)'; ctx.fillRect(bx - 2, y - 5.2, bw + 4, 7.6); }
        ctx.fillStyle = 'rgba(23,19,16,0.30)'; ctx.fillRect(bx, y - 2.6, 1.6, 1.6);
        print(ctx, F, t, bx + 4, y, 4.6, { weight: i === 1 ? 600 : 400, color: INK });
        if (note) print(ctx, F, note, bx + bw - 7, y, 3.5, { align: 'right', color: 'rgba(78,122,96,0.9)' });
        ctx.save(); ctx.strokeStyle = 'rgba(23,19,16,0.35)'; ctx.lineWidth = 0.5;
        ctx.beginPath(); ctx.moveTo(bx + bw - 2.6, y - 3.8); ctx.lineTo(bx + bw - 1, y - 2.2); ctx.lineTo(bx + bw - 2.6, y - 0.6); ctx.stroke(); ctx.restore();
        ctx.fillStyle = 'rgba(23,19,16,0.08)'; ctx.fillRect(bx, y + 2.4, bw, 0.4);
      });
      ctx.restore();

      // the glass: one sheen from the window, and the fingerprint of whoever tapped Search last
      ctx.save(); rr(ctx, 2.5, 2.5, w - 5, h - 5, 10.6); ctx.clip();
      const gl = ctx.createLinearGradient(0, 0, w * 0.62, h);
      gl.addColorStop(0, 'rgba(255,255,255,0.20)'); gl.addColorStop(0.30, 'rgba(255,255,255,0.06)'); gl.addColorStop(0.31, 'rgba(255,255,255,0.015)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
      fingerprint(ctx, 138, 86, 0.55, 1.0, '96,86,78', 0.16);
      fingerprint(ctx, 150, 99, 0.9, 0.7, '96,86,78', 0.08);
      ctx.restore();
      // the lit rim, and a nick in the aluminium where it met the floor once
      ctx.save(); ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(13, 1.5); ctx.lineTo(w - 16, 1.5); ctx.moveTo(1.5, 13); ctx.lineTo(1.5, h - 16); ctx.stroke();
      ctx.strokeStyle = 'rgba(40,36,32,0.45)';
      ctx.beginPath(); ctx.moveTo(w - 1.5, h - 30); ctx.lineTo(w - 1.5, h - 18); ctx.stroke();
      ctx.fillStyle = 'rgba(250,248,244,0.9)'; ctx.beginPath(); ctx.ellipse(w - 6.5, h - 1.6, 1.4, 0.5, 0, 0, 7); ctx.fill();
      ctx.restore();
      grainAtop(ctx, w, h, 0.035);
    },
  });

  /* ========================================================= 2 pto + payroll */
  /* the green paper slip the clinic ran time off on, clipped, filled in, never approved */
  const SLIP = { x: 0, y: 7, green: '#D2E4C4' };
  items.push({
    id: 'pto-payroll', tool: 'pto-payroll', name: 'Time-off slip', verb: 'PTO + payroll',
    w: 144, h: 104, shadow: 1.1, ...POSES['pto-payroll'],
    draw(ctx, F) {
      const pw = this.w - 2, ph = this.h - SLIP.y - 1, G = SLIP.green;
      const GI = 'rgba(36,84,50,0.90)', GL = 'rgba(36,84,50,0.50)';
      ctx.save(); ctx.translate(SLIP.x, SLIP.y);
      // the top edge tore along the pad's perforation
      const r = mulberry(1201), pts = [];
      for (let x = 0; x <= pw + 0.1; x += 2.4) pts.push([Math.min(x, pw), 0.3 + r() * 1.5]);
      const shape = () => {
        ctx.beginPath(); ctx.moveTo(0, pts[0][1]); pts.forEach(([x, y]) => ctx.lineTo(x, y));
        ctx.lineTo(pw, ph - 1); ctx.quadraticCurveTo(pw, ph, pw - 1, ph); ctx.lineTo(1, ph); ctx.quadraticCurveTo(0, ph, 0, ph - 1); ctx.closePath();
      };
      shape(); ctx.fillStyle = G; ctx.fill();
      ctx.save(); shape(); ctx.clip();
      paper(ctx, pw, ph, G, { curl: true, radius: 0.6 });
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fillRect(0, 0, pw, 2.2);   // the torn fibres
      // the printed form, in the pad's dark green
      print(ctx, F, 'TIME OFF REQUEST', 10, 14.5, 8.4, { label: true, weight: 700, color: GI, track: '1.4px' });
      ctx.fillStyle = GI; ctx.fillRect(10, 18.6, pw - 20, 0.9);
      const field = (label, x, y, x1) => { print(ctx, F, label, x, y, 5.3, { color: GI }); ctx.fillStyle = GL; ctx.fillRect(x1, y + 1, pw - 10 - x1, 0.55); };
      field('Name', 10, 29, 28);
      field('Dates', 10, 41, 30);
      [['Vacation', 10], ['Sick', 52], ['Personal', 82]].forEach(([t, x]) => {
        ctx.strokeStyle = GI; ctx.lineWidth = 0.6; ctx.strokeRect(x + 0.3, 47.3, 5, 5);
        print(ctx, F, t, x + 8, 52, 5, { color: GI });
      });
      print(ctx, F, 'Hours', 10, 63, 5.3, { color: GI }); ctx.fillStyle = GL; ctx.fillRect(30, 64, 36, 0.55);
      ctx.strokeStyle = GI; ctx.lineWidth = 0.6; ctx.strokeRect(82.3, 58.3, 5, 5); print(ctx, F, 'Half day', 90, 63, 5, { color: GI });
      ctx.fillStyle = GL; ctx.fillRect(10, 80, 70, 0.55); print(ctx, F, 'Employee signature', 10, 85.6, 4.3, { color: GI });
      ctx.fillStyle = GL; ctx.fillRect(90, 80, pw - 100, 0.55); print(ctx, F, 'Approved by', 90, 85.6, 4.3, { color: GI });
      print(ctx, F, 'No. 0412', pw - 8, ph - 3.4, 4.6, { align: 'right', color: 'rgba(176,58,42,0.78)' });
      // folded once to fit a pocket, and handled: a grey thumb at the corner that got held
      const fy = ph * 0.53, fb = ctx.createLinearGradient(0, fy - 5, 0, fy + 5);
      fb.addColorStop(0, 'rgba(255,255,255,0)'); fb.addColorStop(0.45, 'rgba(70,90,60,0.08)'); fb.addColorStop(0.55, 'rgba(255,255,255,0.18)'); fb.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = fb; ctx.fillRect(0, fy - 5, pw, 10);
      crease(ctx, 0, fy, pw, fy + 0.8, { dark: 0.16, light: 0.45, dc: '60,80,52' });
      const th = ctx.createRadialGradient(8, ph - 6, 1, 8, ph - 6, 14);
      th.addColorStop(0, 'rgba(96,100,90,0.14)'); th.addColorStop(1, 'rgba(96,100,90,0)');
      ctx.fillStyle = th; ctx.fillRect(0, ph - 22, 24, 22);
      ctx.restore();
      shape(); ctx.strokeStyle = 'rgba(60,70,40,0.20)'; ctx.lineWidth = 0.5; ctx.stroke();
      // a dog-ear at the bottom right
      ctx.save(); ctx.beginPath(); ctx.moveTo(pw - 9, ph); ctx.lineTo(pw, ph - 8); ctx.lineTo(pw - 7.4, ph - 6.8); ctx.closePath();
      ctx.fillStyle = '#E1EDD6'; drop(ctx, 2, -0.6, -0.4, 0.3); ctx.fill(); ctx.restore();
      ctx.restore();
      // the paper clip across the top edge, half on the slip and half on the bench
      paperClip(ctx, 124, 0.4, Math.PI / 2, 36);
      grainAtop(ctx, this.w, this.h, 0.07);
    },
    ink(ctx, m, F) {
      ctx.save(); ctx.translate(SLIP.x, SLIP.y);
      const o = { font: F.hand2, color: BLUE, slant: 0.08 };
      script(ctx, [{ text: '10/12 - 10/14', x: 36, y: 40, size: 12 }], m, { ...o, seed: 1211 });
      script(ctx, [{ text: '24', x: 38, y: 62, size: 12, extra: '?' }], m, { ...o, seed: 1213 });
      wobble(ctx, [[10.8, 49.6], [12.6, 52], [17.4, 45.4]], m, 1215, { width: 1.1 });          // Vacation, ticked
      wobble(ctx, [[30, 28], [32, 22.5], [34, 28], [36.5, 25], [40, 27.2], [44, 25.6], [52, 26.4]], m, 1216, { width: 0.8 });   // the name, signed rather than printed
      wobble(ctx, [[14, 78], [17.5, 71.5], [19.5, 77], [23, 70], [25, 78], [29, 73.6], [33, 77.4], [37.5, 72.8], [43, 76], [51, 75], [62, 74.4]], m, 1217, { width: 0.85 });
      ctx.restore();
    },
  });

  /* ======================================================= 3 invoice agent */
  /* a vendor bill with two more underneath, flagged for Bedrock, costed in the margin */
  const BILL = { pw: 134, ph: 90, y: 5 };
  items.push({
    id: 'invoice-agent', tool: 'invoice-agent', name: 'Vendor bills', verb: 'Invoice processing',
    w: 144, h: 96, shadow: 1.4, ...POSES['invoice-agent'],
    draw(ctx, F) {
      const { pw, ph } = BILL;
      // the two bills underneath, each from a different vendor: only their header bands give them away
      ctx.save(); ctx.translate(8, 6); ctx.rotate(0.042);
      paper(ctx, pw - 6, ph - 4, '#EFEADF'); ctx.fillStyle = 'rgba(84,118,96,0.62)'; ctx.fillRect(0, 0, pw - 6, 5);
      ctx.restore();
      ctx.save(); ctx.translate(3.5, 3.5); ctx.rotate(-0.026);
      ctx.save(); rr(ctx, 0, 0, pw - 2, ph - 1, 1.2); drop(ctx, 2, 0.6, 1, 0.16); ctx.fillStyle = '#F5F1E8'; ctx.fill(); ctx.restore();
      paper(ctx, pw - 2, ph - 1, '#F5F1E8'); ctx.fillStyle = 'rgba(58,76,118,0.55)'; ctx.fillRect(0, 0, pw - 2, 4);
      ctx.restore();
      // the top bill
      ctx.save(); ctx.translate(0, BILL.y);
      ctx.save(); rr(ctx, 0, 0, pw, ph, 1.2); drop(ctx, 2.4, 0.8, 1.3, 0.2); ctx.fillStyle = '#FCFBF7'; ctx.fill(); ctx.restore();
      paper(ctx, pw, ph, '#FCFBF7');
      const T = 'rgba(34,30,28,0.78)', L = 'rgba(34,30,28,0.35)';
      print(ctx, F, 'LENS LAB SUPPLY', 9, 12, 5.6, { label: true, weight: 700, color: 'rgba(34,30,28,0.9)', track: '1.1px' });
      print(ctx, F, 'Wholesale · Net 30', 9, 18.4, 4.4, { color: 'rgba(34,30,28,0.55)' });
      print(ctx, F, 'Invoice No. 20931', pw - 9, 18.4, 4.6, { align: 'right', color: T });
      ctx.fillStyle = L; ctx.fillRect(9, 22.5, pw - 18, 0.6);
      print(ctx, F, 'Bill date  Sep 3, 2026', 9, 29.5, 4.8, { color: T });
      print(ctx, F, 'Due  Oct 3', pw - 9, 29.5, 4.8, { align: 'right', color: T });
      const rows = [['Lens cloths, 100 ct', '38.00'], ['Nose pads, silicone', '14.50'], ['Frame screw kit', '22.75'], ['Lens spray, 2 oz, 24', '31.20']];
      rows.forEach(([a, b], i) => {
        const y = 40 + i * 8.4;
        print(ctx, F, a, 9, y, 5, { color: T }); print(ctx, F, b, pw - 9, y, 5, { align: 'right', color: T });
        ctx.fillStyle = 'rgba(34,30,28,0.08)'; ctx.fillRect(9, y + 2.4, pw - 18, 0.4);
      });
      ctx.fillStyle = 'rgba(34,30,28,0.5)'; ctx.fillRect(pw - 58, 74, 49, 0.7);
      print(ctx, F, 'Total due', pw - 58, 82, 5.4, { weight: 600, color: 'rgba(34,30,28,0.9)' });
      print(ctx, F, '$106.45', pw - 9, 82, 5.8, { weight: 600, align: 'right', color: 'rgba(34,30,28,0.92)' });
      // folded in thirds for the envelope it came in
      crease(ctx, 0, ph / 3, pw, ph / 3 + 0.5, { dark: 0.10, light: 0.5 });
      crease(ctx, 0, ph * 2 / 3, pw, ph * 2 / 3 - 0.4, { dark: 0.13, light: 0.4 });
      // the staple through all three at the top left
      ctx.save(); ctx.translate(6, 4.5); ctx.rotate(-0.5); ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(40,36,32,0.35)'; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.moveTo(0.4, 0.6); ctx.lineTo(8.4, 0.6); ctx.stroke();
      ctx.strokeStyle = steel(ctx, 0, -1, 0, 1); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(8, 0); ctx.stroke();
      ctx.restore();
      ctx.restore();
      // the orange BEDROCK flag on the corner, half on the bill, half standing off it
      ctx.save(); ctx.translate(pw - 21, 1.5); ctx.rotate(0.07);
      const fl = () => rr(ctx, 0, 0, 31, 12.5, 1);
      ctx.save(); fl(); drop(ctx, 1.8, 0.6, 1, 0.3); ctx.fillStyle = '#E27340'; ctx.fill(); ctx.restore();
      ctx.save(); fl(); ctx.clip();
      const fg = ctx.createLinearGradient(0, 0, 0, 12.5);
      fg.addColorStop(0, 'rgba(255,226,206,0.40)'); fg.addColorStop(0.45, 'rgba(255,226,206,0.05)'); fg.addColorStop(1, 'rgba(120,40,10,0.22)');
      ctx.fillStyle = fg; ctx.fillRect(0, 0, 31, 12.5);
      ctx.fillStyle = 'rgba(255,240,228,0.20)'; ctx.fillRect(0, 0, 8, 12.5);   // the sticky end, pressed flat onto the paper
      ctx.restore();
      print(ctx, F, 'BEDROCK', 18.6, 8.4, 4.6, { label: true, weight: 700, align: 'center', color: '#FFF6EE', track: '0.9px' });
      ctx.restore();
      grainAtop(ctx, this.w, this.h, 0.07);
    },
    ink(ctx, m, F) {
      ctx.save(); ctx.translate(0, BILL.y);
      script(ctx, [{ text: '0.9¢', x: 12, y: 80, size: 13, tilt: -0.1 }], m, { font: F.hand, color: BLUE, seed: 1301, weight: 700 });
      wobble(ctx, circlePts(24.5, 76, 17, 8.4, 16, 2), m, 1302, { width: 0.8, alpha: 0.7 });
      script(ctx, [{ text: 'a bill', x: 47, y: 81, size: 7.5 }], m, { font: F.hand, color: BLUE, seed: 1303 });
      ctx.restore();
    },
  });

  /* ================================================================ 4 ai lab */
  /* a phone face up, a paused tutorial on the AI Lab channel */
  items.push({
    id: 'ai-lab', tool: 'ai-lab', name: 'Phone', verb: 'AI Lab',
    w: 76, h: 152, shadow: 1.8, ...POSES['ai-lab'],
    draw(ctx, F) {
      const w = this.w, h = this.h, x0 = 1.5, bw = w - 3;
      // side buttons: action and volume on the left, power on the right
      const btn = (x, y, len) => { rr(ctx, x, y, 2, len, 0.8); ctx.fillStyle = steel(ctx, x, 0, x + 2, 0); ctx.fill(); };
      btn(0, 26, 7); btn(0, 38, 12); btn(0, 53, 12); btn(w - 2, 42, 18);
      // the titanium band, lit from the top left
      const band = ctx.createLinearGradient(0, 0, w, h);
      band.addColorStop(0, '#E7E2DB'); band.addColorStop(0.4, '#A9A39B'); band.addColorStop(1, '#58524C');
      rr(ctx, x0, 0.5, bw, h - 1, 12.5); ctx.fillStyle = band; ctx.fill();
      rr(ctx, x0 + 1.4, 1.9, bw - 2.8, h - 3.8, 11.2); ctx.fillStyle = '#0F0D0C'; ctx.fill();
      // the screen
      const sx = 5.2, sy = 4.4, sw = w - 10.4, sh = h - 8.8;
      ctx.save(); rr(ctx, sx, sy, sw, sh, 9.4); ctx.clip();
      ctx.fillStyle = '#FAF7F1'; ctx.fillRect(sx, sy, sw, sh);
      print(ctx, F, '8:12', sx + 7, sy + 7.6, 4.4, { weight: 600, color: INK });
      rr(ctx, sx + sw - 13, sy + 4.4, 7, 3.4, 0.8); ctx.strokeStyle = 'rgba(23,19,16,0.6)'; ctx.lineWidth = 0.45; ctx.stroke();
      ctx.fillStyle = 'rgba(23,19,16,0.7)'; ctx.fillRect(sx + sw - 12.3, sy + 5.1, 4.4, 2);
      // the channel header
      const av = ctx.createLinearGradient(0, sy + 15, 0, sy + 23);
      av.addColorStop(0, '#8FBBE3'); av.addColorStop(1, '#F2D6BE');
      ctx.beginPath(); ctx.arc(sx + 7, sy + 19.5, 3.6, 0, 7); ctx.fillStyle = av; ctx.fill();
      print(ctx, F, 'AI Lab', sx + 13, sy + 21.4, 6.2, { weight: 700, color: INK });
      print(ctx, F, 'Tutorials', sx + sw - 4, sy + 21.2, 3.8, { align: 'right', color: 'rgba(23,19,16,0.5)' });
      // the video frame: a screen recording of a chat, paused, over the channel's clear sky
      const fx = sx + 3, fy = sy + 28, fw = sw - 6, fh = 70;
      ctx.save(); rr(ctx, fx, fy, fw, fh, 4); ctx.clip();
      const sky = ctx.createLinearGradient(0, fy, 0, fy + fh);
      sky.addColorStop(0, '#86B4E0'); sky.addColorStop(0.55, '#BFD6EA'); sky.addColorStop(1, '#F1D9C3');
      ctx.fillStyle = sky; ctx.fillRect(fx, fy, fw, fh);
      const win = () => rr(ctx, fx + 6, fy + 9, fw - 12, 44, 4);
      ctx.save(); win(); drop(ctx, 3, 0, 1.4, 0.18); ctx.fillStyle = 'rgba(255,255,255,0.74)'; ctx.fill(); ctx.restore();
      win(); ctx.strokeStyle = 'rgba(255,255,255,0.95)'; ctx.lineWidth = 0.5; ctx.stroke();
      [0, 1, 2].forEach(i => { ctx.beginPath(); ctx.arc(fx + 10 + i * 3, fy + 12.6, 0.9, 0, 7); ctx.fillStyle = 'rgba(23,19,16,0.25)'; ctx.fill(); });
      rr(ctx, fx + fw - 32, fy + 18, 22, 6, 3); ctx.fillStyle = 'rgba(220,104,67,0.22)'; ctx.fill();          // the question
      [[26, 30], [31, 24], [36, 27], [41, 16]].forEach(([y, len]) => { rr(ctx, fx + 10, fy + y, len, 2.2, 1.1); ctx.fillStyle = 'rgba(23,19,16,0.22)'; ctx.fill(); });   // the answer
      rr(ctx, fx + 10, fy + 46, fw - 20, 4.4, 2.2); ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill();
      ctx.beginPath(); ctx.arc(fx + fw - 12.4, fy + 48.2, 1.6, 0, 7); ctx.fillStyle = ACCENT; ctx.fill();
      ctx.fillStyle = 'rgba(16,12,10,0.16)'; ctx.fillRect(fx, fy, fw, fh);   // paused
      // play button
      const pcx = fx + fw / 2, pcy = fy + 31;
      ctx.save(); ctx.beginPath(); ctx.arc(pcx, pcy, 10.5, 0, 7); drop(ctx, 3, 0, 1.2, 0.3); ctx.fillStyle = 'rgba(255,255,255,0.94)'; ctx.fill(); ctx.restore();
      ctx.beginPath(); ctx.moveTo(pcx - 3.2, pcy - 5.2); ctx.lineTo(pcx + 5.4, pcy); ctx.lineTo(pcx - 3.2, pcy + 5.2); ctx.closePath(); ctx.fillStyle = INK; ctx.fill();
      // scrub bar
      print(ctx, F, '1:12 / 3:40', fx + 3, fy + fh - 7, 3.6, { weight: 600, color: 'rgba(255,255,255,0.95)' });
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fillRect(fx + 3, fy + fh - 4.2, fw - 6, 1.2);
      ctx.fillStyle = ACCENT; ctx.fillRect(fx + 3, fy + fh - 4.2, (fw - 6) * 0.33, 1.2);
      ctx.beginPath(); ctx.arc(fx + 3 + (fw - 6) * 0.33, fy + fh - 3.6, 1.7, 0, 7); ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.restore();
      // below the frame: the lesson and what plays next
      print(ctx, F, 'QUICK WIN', fx, fy + fh + 8, 3.7, { label: true, weight: 700, color: ACCENT, track: '0.8px' });
      rr(ctx, fx, fy + fh + 11, fw - 8, 3, 1.5); ctx.fillStyle = 'rgba(23,19,16,0.62)'; ctx.fill();
      rr(ctx, fx, fy + fh + 16.4, fw - 24, 3, 1.5); ctx.fillStyle = 'rgba(23,19,16,0.62)'; ctx.fill();
      rr(ctx, fx, fy + fh + 22, 26, 2, 1); ctx.fillStyle = 'rgba(23,19,16,0.25)'; ctx.fill();
      [0, 1].forEach(i => {
        const y = fy + fh + 29 + i * 16;
        const tg = ctx.createLinearGradient(fx, y, fx + 22, y + 13);
        tg.addColorStop(0, i ? '#E9C7AE' : '#9DC2E6'); tg.addColorStop(1, i ? '#B98C74' : '#E8D3C1');
        rr(ctx, fx, y, 22, 13, 2); ctx.fillStyle = tg; ctx.fill();
        rr(ctx, fx + 25, y + 2, fw - 29, 2.4, 1.2); ctx.fillStyle = 'rgba(23,19,16,0.45)'; ctx.fill();
        rr(ctx, fx + 25, y + 6.4, fw - 40, 2.4, 1.2); ctx.fillStyle = 'rgba(23,19,16,0.20)'; ctx.fill();
      });
      rr(ctx, sx + sw / 2 - 11, sy + sh - 4, 22, 1.4, 0.7); ctx.fillStyle = 'rgba(23,19,16,0.7)'; ctx.fill();   // home indicator
      ctx.restore();
      // the front camera island
      rr(ctx, w / 2 - 10, 7.2, 20, 5.6, 2.8); ctx.fillStyle = '#050404'; ctx.fill();
      ctx.beginPath(); ctx.arc(w / 2 + 5.6, 10, 1.3, 0, 7); ctx.fillStyle = '#1E2A36'; ctx.fill();
      ctx.beginPath(); ctx.arc(w / 2 + 5.2, 9.6, 0.4, 0, 7); ctx.fillStyle = 'rgba(170,210,255,0.6)'; ctx.fill();
      // glass sheen and a thumb smudge low on the screen
      ctx.save(); rr(ctx, x0 + 1.4, 1.9, bw - 2.8, h - 3.8, 11.2); ctx.clip();
      const gl = ctx.createLinearGradient(0, 0, w, h * 0.6);
      gl.addColorStop(0, 'rgba(255,255,255,0.18)'); gl.addColorStop(0.36, 'rgba(255,255,255,0.05)'); gl.addColorStop(0.37, 'rgba(255,255,255,0.01)'); gl.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gl; ctx.fillRect(0, 0, w, h);
      fingerprint(ctx, 50, 124, -0.4, 1.1, '96,86,78', 0.13);
      ctx.restore();
      // the band's lit edge, and one scuff
      ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(x0 + 0.6, 14); ctx.lineTo(x0 + 0.6, h - 20); ctx.moveTo(13, 1); ctx.lineTo(w - 16, 1); ctx.stroke();
      ctx.strokeStyle = 'rgba(40,36,32,0.5)'; ctx.beginPath(); ctx.moveTo(w - 2.1, h - 34); ctx.lineTo(w - 2.1, h - 27); ctx.stroke();
      ctx.restore();
      grainAtop(ctx, w, h, 0.035);
    },
  });

  /* ========================================================= 5 coaching aios */
  /* a spiral planner open on the page where the brain document started */
  const PL = { cw: 144, lx: 5, rx: 77, pw: 62, py: 6 };
  items.push({
    id: 'coaching-aios', tool: 'coaching-aios', name: 'Planner', verb: 'Coaching AI system',
    w: 152, h: 114, shadow: 1.6, ...POSES['coaching-aios'],
    draw(ctx, F) {
      const w = this.w, h = this.h, { cw, lx, rx, pw, py } = PL, ph = h - py * 2;
      // coloured tabs on the fore-edge, standing out past the cover
      const tabs = [['#D0673F', 14], ['#8FA88A', 34], ['#5F7BA5', 54], ['#D6B25C', 74]];
      tabs.forEach(([c, y]) => {
        ctx.save(); rr(ctx, rx + pw - 8, py + y, w - (rx + pw - 8), 15, 2); drop(ctx, 1.4, 0.5, 0.8, 0.25); ctx.fillStyle = c; ctx.fill(); ctx.restore();
        const tg = ctx.createLinearGradient(0, py + y, 0, py + y + 15);
        tg.addColorStop(0, 'rgba(255,255,255,0.28)'); tg.addColorStop(1, 'rgba(60,30,10,0.18)');
        rr(ctx, rx + pw - 8, py + y, w - (rx + pw - 8), 15, 2); ctx.fillStyle = tg; ctx.fill();
      });
      // the cover: soft brown leather, worn pale at the corners
      rr(ctx, 0, 1, cw, h - 2, 5); ctx.fillStyle = '#5B3D2B'; ctx.fill();
      ctx.save(); rr(ctx, 0, 1, cw, h - 2, 5); ctx.clip();
      light(ctx, 0, 0, cw, h, 0.16, 0.24);
      [[2, 3], [cw - 2, h - 3], [2, h - 3]].forEach(([x, y]) => { const cg = ctx.createRadialGradient(x, y, 0.5, x, y, 8); cg.addColorStop(0, 'rgba(210,170,130,0.45)'); cg.addColorStop(1, 'rgba(210,170,130,0)'); ctx.fillStyle = cg; ctx.fillRect(x - 8, y - 8, 16, 16); });
      ctx.restore();
      // the pages, left and right of the wire
      const page = (x, c) => { ctx.save(); rr(ctx, x, py, pw, ph, 1.5); drop(ctx, 1.6, 0.6, 1, 0.3); ctx.fillStyle = c; ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(x, py); paper(ctx, pw, ph, c, { radius: 1.5 }); ctx.restore(); };
      page(lx, '#FBF8F0'); page(rx, '#FCFAF3');
      // left page: the printed week, faint rules
      ctx.save(); ctx.translate(lx, py);
      print(ctx, F, 'WEEK 29', 6, 9, 4.4, { label: true, weight: 700, color: 'rgba(34,30,28,0.55)', track: '1px' });
      ['MON', 'TUE', 'WED', 'THU', 'FRI'].forEach((d, i) => {
        const y = 14 + i * 18.4;
        ctx.fillStyle = 'rgba(34,30,28,0.22)'; ctx.fillRect(4, y, pw - 12, 0.5);
        print(ctx, F, d, 6, y + 5.4, 3.6, { label: true, weight: 700, color: 'rgba(34,30,28,0.42)', track: '0.6px' });
      });
      ctx.restore();
      // right page: a dot grid
      ctx.save(); ctx.translate(rx, py); ctx.fillStyle = 'rgba(60,50,40,0.22)';
      for (let y = 8; y < ph - 3; y += 5) for (let x = 12; x < pw - 3; x += 5) ctx.fillRect(x, y, 0.55, 0.55);
      ctx.restore();
      // the gutter shade, where the pages bend down into the wire
      [[lx + pw - 10, lx + pw, 0, 0.16], [rx, rx + 10, 0.16, 0]].forEach(([a, b, s0, s1]) => {
        const gg = ctx.createLinearGradient(a, 0, b, 0); gg.addColorStop(0, `rgba(80,56,36,${s0})`); gg.addColorStop(1, `rgba(80,56,36,${s1})`);
        ctx.fillStyle = gg; ctx.fillRect(a, py, b - a, ph);
      });
      // the punched holes and the wire through them
      const cx = (lx + pw + rx) / 2;
      for (let y = py + 7; y < py + ph - 4; y += 7) {
        [lx + pw - 3.2, rx + 3.2].forEach(x => { ctx.beginPath(); ctx.arc(x, y, 1.3, 0, 7); ctx.fillStyle = '#3E2A1E'; ctx.fill(); });
        ctx.save(); ctx.lineCap = 'round';
        ctx.strokeStyle = 'rgba(30,18,10,0.35)'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(lx + pw - 3.2 + 0.5, y + 0.9); ctx.quadraticCurveTo(cx + 0.5, y - 4.6, rx + 3.2 + 0.5, y + 0.9); ctx.stroke();
        ctx.strokeStyle = steel(ctx, 0, y - 3.6, 0, y + 0.8); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(lx + pw - 3.2, y); ctx.quadraticCurveTo(cx, y - 5.4, rx + 3.2, y); ctx.stroke();
        ctx.restore();
      }
      // a terracotta ribbon marker down the right page and out past the cover
      ctx.save(); ctx.beginPath(); ctx.moveTo(rx + 7.4, py + 2); ctx.lineTo(rx + 10.2, py + 2); ctx.lineTo(rx + 12, h); ctx.lineTo(rx + 10.1, h - 2.2); ctx.lineTo(rx + 8.2, h + 0.2); ctx.closePath();
      ctx.fillStyle = '#B9563A'; drop(ctx, 1, 0.4, 0.6, 0.3); ctx.fill(); ctx.restore();
      grainAtop(ctx, w, h, 0.07);
    },
    ink(ctx, m, F) {
      const { lx, rx, py } = PL;
      ctx.save(); ctx.translate(rx, py);
      script(ctx, [{ text: 'BRAIN', x: 12, y: 18, size: 13, underline: true, extra: '!' }], m, { font: F.hand, color: BLUE, seed: 1501, weight: 700 });
      const lines = ['voice', 'brand rules', 'clients', 'policies'];
      lines.forEach((t, i) => {
        const y = 33 + i * 13.4;
        wobble(ctx, circlePts(15, y - 2.8, 0.9, 0.9, 6, 1), m, 1510 + i, { width: 1.2 });
        script(ctx, [{ text: t, x: 18.5, y, size: 7.6 }], m, { font: F.hand, color: BLUE, seed: 1520 + i });
      });
      ctx.restore();
      ctx.save(); ctx.translate(lx, py);
      script(ctx, [{ text: '1st: invoices', x: 14, y: 64.5, size: 6.4 }], m, { font: F.hand, color: GRAPHITE, seed: 1531 });
      wobble(ctx, [[18, 23.5], [20, 26], [25, 19.6]], m, 1532, { color: GRAPHITE, width: 0.8 });
      ctx.restore();
    },
  });

  /* ===================================================== 6 construction site */
  /* a folded site plan, a blueprint of a house, with the company's card on it */
  const BP = '#2C5D95';
  items.push({
    id: 'construction-site', tool: 'construction-site', name: 'Site plan', verb: 'Construction website',
    w: 164, h: 114, shadow: 1.2, ...POSES['construction-site'],
    draw(ctx, F) {
      const w = this.w, h = this.h, pw = w - 2, ph = h - 2;
      const Wt = 'rgba(244,248,252,0.90)', Wf = 'rgba(244,248,252,0.55)';
      rr(ctx, 0, 0, pw, ph, 1.4); ctx.fillStyle = BP; ctx.fill();
      ctx.save(); rr(ctx, 0, 0, pw, ph, 1.4); ctx.clip();
      // the cyanotype's uneven blue
      const mr = mulberry(1601);
      for (let i = 0; i < 46; i++) {
        const x = mr() * pw, y = mr() * ph, r = 4 + mr() * 14, g = ctx.createRadialGradient(x, y, 0.5, x, y, r);
        const tone = mr() > 0.5 ? '255,255,255' : '10,30,70';
        g.addColorStop(0, `rgba(${tone},${0.03 + mr() * 0.04})`); g.addColorStop(1, `rgba(${tone},0)`);
        ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
      }
      // folded in quarters: each panel leans a little differently to the window
      ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(0, 0, pw / 2, ph / 2);
      ctx.fillStyle = 'rgba(0,12,36,0.10)'; ctx.fillRect(pw / 2, 0, pw / 2, ph / 2);
      ctx.fillStyle = 'rgba(0,12,36,0.04)'; ctx.fillRect(0, ph / 2, pw / 2, ph / 2);
      ctx.fillStyle = 'rgba(0,12,36,0.14)'; ctx.fillRect(pw / 2, ph / 2, pw / 2, ph / 2);
      light(ctx, 0, 0, pw, ph, 0.14, 0.18);
      // the plan: walls with the door gaps left open
      ctx.save(); ctx.strokeStyle = Wt; ctx.lineCap = 'square'; ctx.lineWidth = 2;
      const walls = [
        [[16, 18], [108, 18]], [[108, 18], [108, 90]], [[16, 90], [60, 90]], [[70, 90], [108, 90]], [[16, 18], [16, 90]],
      ];
      ctx.beginPath(); walls.forEach(([a, b]) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }); ctx.stroke();
      ctx.lineWidth = 1.1;
      const inner = [
        [[56, 18], [56, 40]], [[56, 49], [56, 62]], [[16, 62], [30, 62]], [[39, 62], [84, 62]], [[92, 62], [108, 62]], [[80, 62], [80, 90]], [[80, 76], [108, 76]],
      ];
      ctx.beginPath(); inner.forEach(([a, b]) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }); ctx.stroke();
      // door swings
      ctx.strokeStyle = Wf; ctx.lineWidth = 0.5;
      [[56, 40, 9, 0, Math.PI / 2], [30, 62, 9, -Math.PI / 2, 0], [84, 62, 8, -Math.PI / 2, 0], [60, 90, 10, -Math.PI / 2, 0]].forEach(([x, y, r, a0, a1]) => {
        ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a0, a1); ctx.stroke();
      });
      // windows: thin double lines set into the outer walls
      ctx.strokeStyle = 'rgba(44,93,149,1)'; ctx.lineWidth = 2.2;
      ctx.beginPath(); [[26, 18, 44, 18], [66, 18, 98, 18], [16, 30, 16, 50], [108, 28, 108, 50], [24, 90, 50, 90]].forEach(([a, b, c, d]) => { ctx.moveTo(a, b); ctx.lineTo(c, d); }); ctx.stroke();
      ctx.strokeStyle = Wt; ctx.lineWidth = 0.45;
      [[26, 18, 44, 18], [66, 18, 98, 18], [16, 30, 16, 50], [108, 28, 108, 50], [24, 90, 50, 90]].forEach(([a, b, c, d]) => {
        const vx = a === c ? 1 : 0, vy = b === d ? 1 : 0;
        ctx.beginPath(); ctx.moveTo(a - vx, b - vy); ctx.lineTo(c - vx, d - vy); ctx.moveTo(a + vx, b + vy); ctx.lineTo(c + vx, d + vy); ctx.stroke();
      });
      // six tatami in the washitsu
      ctx.strokeStyle = 'rgba(244,248,252,0.35)'; ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.moveTo(16, 40); ctx.lineTo(56, 40); ctx.moveTo(36, 18); ctx.lineTo(36, 40); ctx.moveTo(29, 40); ctx.lineTo(29, 62); ctx.moveTo(42, 40); ctx.lineTo(42, 62); ctx.stroke();
      // dimension line along the top
      ctx.strokeStyle = Wf; ctx.lineWidth = 0.4;
      ctx.beginPath(); ctx.moveTo(16, 10); ctx.lineTo(108, 10); [16, 56, 108].forEach(x => { ctx.moveTo(x, 7.6); ctx.lineTo(x, 12.4); }); ctx.stroke();
      ctx.restore();
      print(ctx, F, '9,100', 62, 8.6, 3.6, { align: 'center', color: Wf });
      print(ctx, F, '和室', 36, 34, 4.6, { align: 'center', color: Wt });
      print(ctx, F, 'LDK', 82, 42, 5, { align: 'center', weight: 600, color: Wt });
      print(ctx, F, '洋室', 48, 79, 4.6, { align: 'center', color: Wt });
      print(ctx, F, 'WC', 94, 71, 3.8, { align: 'center', color: Wt });
      print(ctx, F, '玄関', 94, 86, 3.8, { align: 'center', color: Wt });
      // north arrow and the title block
      ctx.save(); ctx.strokeStyle = Wf; ctx.lineWidth = 0.5; ctx.beginPath(); ctx.arc(128, 70, 4.2, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(128, 65); ctx.lineTo(130, 71.5); ctx.lineTo(128, 70); ctx.lineTo(126, 71.5); ctx.closePath(); ctx.fillStyle = Wt; ctx.fill(); ctx.restore();
      print(ctx, F, 'N', 128, 63.6, 3.2, { align: 'center', weight: 700, color: Wf });
      ctx.save(); ctx.strokeStyle = Wf; ctx.lineWidth = 0.5; ctx.strokeRect(116, 78, 42, 28); ctx.beginPath(); ctx.moveTo(116, 90); ctx.lineTo(158, 90); ctx.stroke(); ctx.restore();
      print(ctx, F, '平面図', 119.5, 86.5, 5.4, { weight: 600, color: Wt });
      print(ctx, F, 'S = 1:100', 119.5, 96.5, 3.6, { color: Wf });
      print(ctx, F, '2026.04', 119.5, 102.5, 3.4, { color: Wf });
      // the hanko, pressed hard enough to leave the rim darker than the middle
      ctx.save(); ctx.translate(149.5, 98); ctx.rotate(-0.12);
      ctx.beginPath(); ctx.arc(0, 0, 6.4, 0, 7); ctx.fillStyle = 'rgba(226,78,56,0.22)'; ctx.fill();
      ctx.strokeStyle = 'rgba(232,82,58,0.92)'; ctx.lineWidth = 0.9; ctx.beginPath(); ctx.arc(0, 0, 6, 0, 7); ctx.stroke();
      print(ctx, F, '鎌', 0, -0.4, 4.6, { align: 'center', weight: 700, color: 'rgba(236,86,60,0.95)' });
      print(ctx, F, '田', 0, 4.2, 4.6, { align: 'center', weight: 700, color: 'rgba(236,86,60,0.95)' });
      const hr = mulberry(1611); ctx.fillStyle = 'rgba(44,93,149,0.7)';
      for (let i = 0; i < 14; i++) { const a = hr() * 6.3, d = hr() * 6.4; ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, 0.3 + hr() * 0.4, 0, 7); ctx.fill(); }   // where the ink skipped
      ctx.restore();
      // the folds, catching the light
      crease(ctx, pw / 2, 0, pw / 2 + 0.3, ph, { dc: '6,22,52', dark: 0.5, lc: '200,220,245', light: 0.35, w: 0.7 });
      crease(ctx, 0, ph / 2, pw, ph / 2 - 0.3, { dc: '6,22,52', dark: 0.42, lc: '200,220,245', light: 0.3, w: 0.7 });
      // worn: the edges have faded paler, and one corner is soft from being thumbed open
      ctx.strokeStyle = 'rgba(210,228,248,0.22)'; ctx.lineWidth = 2.4; rr(ctx, 0, 0, pw, ph, 1.4); ctx.stroke();
      const cg = ctx.createRadialGradient(0, ph, 1, 0, ph, 14); cg.addColorStop(0, 'rgba(220,234,250,0.28)'); cg.addColorStop(1, 'rgba(220,234,250,0)');
      ctx.fillStyle = cg; ctx.fillRect(0, ph - 14, 14, 14);
      ctx.restore();
      // the business card, dropped on the plan
      ctx.save(); ctx.translate(130, 37); ctx.rotate(-0.12); ctx.translate(-29, -17);
      ctx.save(); rr(ctx, 0, 0, 58, 34, 1.2); drop(ctx, 2.6, 1, 1.6, 0.4); ctx.fillStyle = '#FBF8F1'; ctx.fill(); ctx.restore();
      ctx.save(); rr(ctx, 0, 0, 58, 34, 1.2); ctx.clip(); light(ctx, 0, 0, 58, 34, 0.35, 0.10); ctx.restore();
      rr(ctx, 49, 5, 4.4, 4.4, 0.6); ctx.fillStyle = '#C8412F'; ctx.fill();
      print(ctx, F, '鎌田工務店', 6, 16, 7.4, { weight: 700, color: INK });
      print(ctx, F, 'KAMATA KOUMUTEN', 6, 21.6, 3.2, { label: true, weight: 700, color: 'rgba(23,19,16,0.55)', track: '0.7px' });
      ctx.fillStyle = 'rgba(23,19,16,0.28)'; ctx.fillRect(6, 26.4, 34, 0.7); ctx.fillRect(6, 29.4, 24, 0.7);
      ctx.restore();
      grainAtop(ctx, w, h, 0.07);
    },
  });

  /* ===================================================== 7 curriculum system */
  /* the OPIc textbook, earbuds on it, a pencilled bookmark in its pages */
  const BK = { x: 0, y: 1, w: 124, h: 98 };
  items.push({
    id: 'curriculum-system', tool: 'curriculum-system', name: 'Textbook', verb: 'Curriculum system',
    w: 146, h: 100, shadow: 1.8, ...POSES['curriculum-system'],
    draw(ctx, F) {
      const { x, y, w: bw, h: bh } = BK;
      // the bookmark, standing out of the fore-edge
      ctx.save(); rr(ctx, bw - 14, 58, 34, 14, 0.8); ctx.fillStyle = '#D9C39E'; ctx.fill();
      const bg = ctx.createLinearGradient(0, 58, 0, 72); bg.addColorStop(0, 'rgba(255,255,255,0.3)'); bg.addColorStop(1, 'rgba(90,60,30,0.14)');
      ctx.fillStyle = bg; ctx.fill(); ctx.restore();
      // the page block, a hair of it showing past the cover on the fore-edge and the foot
      ctx.save(); ctx.translate(x, y);
      rr(ctx, 2, 2, bw - 0.5, bh - 0.5, 2); ctx.fillStyle = '#EDE6D6'; ctx.fill();
      ctx.strokeStyle = 'rgba(120,100,76,0.25)'; ctx.lineWidth = 0.3;
      for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.moveTo(bw + 0.6 - k * 0.4, 6); ctx.lineTo(bw + 0.6 - k * 0.4, bh - 2); ctx.stroke(); ctx.beginPath(); ctx.moveTo(6, bh + 0.6 - k * 0.4); ctx.lineTo(bw - 2, bh + 0.6 - k * 0.4); ctx.stroke(); }
      // the cover
      const cover = () => poly(ctx, [[0, 0], [bw - 2, 0], [bw - 2, bh - 7], [bw - 8, bh - 2], [0, bh - 2]], [2, 2.5, 3, 3, 2]);
      cover(); ctx.fillStyle = '#F0E7D4'; ctx.fill();
      ctx.save(); cover(); ctx.clip();
      light(ctx, 0, 0, bw, bh, 0.34, 0.14);
      ctx.fillStyle = '#2F6368'; ctx.fillRect(0, 0, bw, 24);
      const band = ctx.createLinearGradient(0, 0, 0, 24); band.addColorStop(0, 'rgba(255,255,255,0.14)'); band.addColorStop(1, 'rgba(0,0,0,0.12)');
      ctx.fillStyle = band; ctx.fillRect(0, 0, bw, 24);
      print(ctx, F, 'OPIc ENGLISH', 16, 14.8, 5.6, { label: true, weight: 700, color: '#F3EDE0', track: '1.8px' });
      // a speech bubble, the book's one graphic
      ctx.save(); ctx.strokeStyle = 'rgba(243,237,224,0.9)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(bw - 20, 11.5, 7.4, 5.6, 0, 0.5, Math.PI * 2 + 0.2); ctx.lineTo(bw - 12, 19); ctx.closePath(); ctx.stroke();
      [-3, 0, 3].forEach(d => { ctx.beginPath(); ctx.arc(bw - 20 + d, 11.5, 0.8, 0, 7); ctx.fillStyle = 'rgba(243,237,224,0.9)'; ctx.fill(); });
      ctx.restore();
      print(ctx, F, '오픽 영어', 16, 44, 15, { weight: 700, color: INK });
      print(ctx, F, 'Speaking practice  ·  IM to AL', 16, 53.5, 4.8, { color: 'rgba(23,19,16,0.6)' });
      ctx.fillStyle = ACCENT; ctx.fillRect(16, 58, 14, 1.2);
      ctx.fillStyle = 'rgba(23,19,16,0.25)'; ctx.fillRect(16, 84, bw - 32, 0.5);
      print(ctx, F, 'KiwiOPIC', 16, 91.5, 5, { label: true, weight: 700, color: 'rgba(23,19,16,0.72)', track: '1px' });
      print(ctx, F, 'Seoul', bw - 16, 91.5, 4.2, { align: 'right', color: 'rgba(23,19,16,0.45)' });
      // the spine hinge, and scuffs from a backpack
      crease(ctx, 8.5, 0, 8.5, bh - 2, { dark: 0.28, light: 0.7, w: 0.8 });
      const sr = mulberry(1701); ctx.strokeStyle = 'rgba(255,255,255,0.45)'; ctx.lineCap = 'round';
      for (let i = 0; i < 10; i++) { const sx = 14 + sr() * (bw - 24), sy = 26 + sr() * 60; ctx.lineWidth = 0.3 + sr() * 0.4; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx + 3 + sr() * 7, sy + (sr() - 0.5) * 2); ctx.stroke(); }
      ctx.restore();
      // the bumped corner at the foot, folded back and gone pale
      ctx.save(); ctx.beginPath(); ctx.moveTo(bw - 2, bh - 7); ctx.lineTo(bw - 8, bh - 2); ctx.lineTo(bw - 7.2, bh - 6.2); ctx.closePath();
      ctx.fillStyle = '#F8F2E6'; drop(ctx, 1.6, -0.5, -0.5, 0.3); ctx.fill(); ctx.restore();
      cover(); ctx.strokeStyle = 'rgba(80,60,40,0.2)'; ctx.lineWidth = 0.5; ctx.stroke();
      ctx.restore();

      // wired earbuds, dropped on the cover
      const cable = (pts, wd = 1.1) => {
        ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        const path = () => { ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i += 3) ctx.bezierCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], pts[i + 2][0], pts[i + 2][1]); };
        path(); drop(ctx, 1.4, 0.6, 1, 0.35); ctx.strokeStyle = '#D8D5CF'; ctx.lineWidth = wd; ctx.stroke(); noDrop(ctx);
        path(); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = wd * 0.4; ctx.stroke();
        ctx.restore();
      };
      const Y = [74, 78];
      cable([[86, 64], [84, 70], [78, 72], Y]);
      cable([[103, 72], [96, 76], [84, 74], Y]);
      cable([Y, [68, 86], [58, 78], [50, 73]], 1.2);
      rr(ctx, Y[0] - 1.6, Y[1] - 2.4, 3.2, 4.8, 1.2); ctx.fillStyle = '#E6E3DD'; ctx.fill();   // the splitter
      // the jack, lying where the cable ends
      ctx.save(); ctx.translate(50, 73); ctx.rotate(Math.PI * 1.03);
      drop(ctx, 1.4, 0.6, 1, 0.35); rr(ctx, 0, -1.6, 7, 3.2, 1); ctx.fillStyle = '#E4E1DB'; ctx.fill(); noDrop(ctx);
      rr(ctx, 7, -0.7, 5, 1.4, 0.6); ctx.fillStyle = steel(ctx, 0, -0.7, 0, 0.7); ctx.fill();
      ctx.fillStyle = 'rgba(40,36,32,0.6)'; ctx.fillRect(9.2, -0.7, 0.4, 1.4); ctx.fillRect(10.6, -0.7, 0.4, 1.4);
      ctx.restore();
      const bud = (cx, cy, rot) => {
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
        ctx.save(); drop(ctx, 2, 0.8, 1.4, 0.4); rr(ctx, -1.6, 2, 3.2, 10, 1.4); ctx.fillStyle = '#ECEAE5'; ctx.fill(); ctx.restore();
        ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 4.6, 0, 7); drop(ctx, 2.2, 0.8, 1.4, 0.45); ctx.fillStyle = '#EFEDE8'; ctx.fill(); ctx.restore();
        const hg = ctx.createRadialGradient(-1.6, -1.8, 0.3, 0, 0, 4.8);
        hg.addColorStop(0, '#FFFFFF'); hg.addColorStop(0.6, '#E9E6E0'); hg.addColorStop(1, '#B9B4AB');
        ctx.beginPath(); ctx.arc(0, 0, 4.6, 0, 7); ctx.fillStyle = hg; ctx.fill();
        ctx.beginPath(); ctx.ellipse(0.8, -0.6, 1.8, 1.4, 0.4, 0, 7); ctx.fillStyle = 'rgba(60,56,52,0.55)'; ctx.fill();   // the grille
        ctx.fillStyle = steel(ctx, 0, 11, 0, 12.6); ctx.fillRect(-1.3, 11.2, 2.6, 1.2);
        ctx.restore();
      };
      bud(88, 51, 0.15); bud(106, 60, -0.35);
      grainAtop(ctx, this.w, this.h, 0.06);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'p.48', x: 127, y: 68.2, size: 7.2, tilt: -0.05 }], m, { font: F.hand, color: GRAPHITE, seed: 1711 });
      wobble(ctx, [[139.5, 61], [139.8, 66.5]], m, 1712, { color: GRAPHITE, width: 0.6, alpha: 0.7 });
      wobble(ctx, [[141.5, 61.2], [141.8, 66.3]], m, 1713, { color: GRAPHITE, width: 0.6, alpha: 0.7 });
    },
  });

  /* ================================================================== 8 aios */
  /* the black box the whole company runs on: a mini computer, one status light, a taped label */
  const BX = { x: 2, y: 3, w: 98, h: 70, r: 15 };
  items.push({
    id: 'aios', tool: 'aios', name: 'The black box', verb: 'My AIOS',
    w: 114, h: 76, shadow: 2.2, ...POSES['aios'],
    draw(ctx) {
      const { x, y, w: bw, h: bh, r } = BX;
      // the short cable, out of the back and lying loose on the bench
      const path = () => { ctx.beginPath(); ctx.moveTo(x + bw - 2, y + 26); ctx.bezierCurveTo(x + bw + 10, y + 26, x + bw + 12, y + 40, x + bw + 7, y + 52); ctx.bezierCurveTo(x + bw + 4, y + 59, x + bw + 6, y + 64, x + bw + 9, y + 66); };
      ctx.save(); ctx.lineCap = 'round';
      path(); drop(ctx, 1.8, 0.8, 1.4, 0.45); ctx.strokeStyle = '#1B1816'; ctx.lineWidth = 3.2; ctx.stroke(); noDrop(ctx);
      path(); ctx.strokeStyle = 'rgba(255,245,235,0.22)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.restore();
      ctx.save(); ctx.translate(x + bw + 9, y + 66); ctx.rotate(0.6);
      drop(ctx, 1.4, 0.6, 1, 0.4); rr(ctx, -1, -2.4, 8, 4.8, 1.4); ctx.fillStyle = '#26221F'; ctx.fill(); noDrop(ctx);
      rr(ctx, 7, -1.5, 3.6, 3, 1.2); ctx.fillStyle = steel(ctx, 0, -1.5, 0, 1.5); ctx.fill();
      ctx.restore();
      // the body: matte black, lit from the top left
      rr(ctx, x, y, bw, bh, r); ctx.fillStyle = '#1C1917'; ctx.fill();
      ctx.save(); rr(ctx, x, y, bw, bh, r); ctx.clip();
      const hl = ctx.createRadialGradient(x + 18, y + 12, 1, x + 18, y + 12, 80);
      hl.addColorStop(0, 'rgba(255,244,232,0.13)'); hl.addColorStop(0.5, 'rgba(255,244,232,0.03)'); hl.addColorStop(1, 'rgba(0,0,0,0.22)');
      ctx.fillStyle = hl; ctx.fillRect(x, y, bw, bh);
      // the bevel: a lit rim on the top and left, a dark one on the bottom and right
      const rim = ctx.createLinearGradient(x, y, x + bw, y + bh);
      rim.addColorStop(0, 'rgba(255,245,235,0.30)'); rim.addColorStop(0.5, 'rgba(255,245,235,0.04)'); rim.addColorStop(1, 'rgba(0,0,0,0.5)');
      rr(ctx, x + 1, y + 1, bw - 2, bh - 2, r - 1); ctx.strokeStyle = rim; ctx.lineWidth = 1.6; ctx.stroke();
      // vent slots along the back edge
      for (let i = 0; i < 13; i++) {
        const vx = x + 24 + i * 4;
        rr(ctx, vx, y + 5, 2.2, 0.9, 0.45); ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fill();
        ctx.fillStyle = 'rgba(255,245,235,0.08)'; ctx.fillRect(vx, y + 6.1, 2.2, 0.4);
      }
      // handled: an oily thumb print and a little dust
      fingerprint(ctx, x + 72, y + 50, 0.9, 1.1, '255,245,235', 0.07);
      const dr = mulberry(1801); ctx.fillStyle = 'rgba(230,222,210,0.28)';
      for (let i = 0; i < 22; i++) ctx.fillRect(x + 6 + dr() * (bw - 12), y + 6 + dr() * (bh - 12), 0.4 + dr() * 0.5, 0.4 + dr() * 0.4);
      // the status light, glowing into the matte around it
      const lx = x + 12, ly = y + bh - 8.5;
      const glow = ctx.createRadialGradient(lx, ly, 0.5, lx, ly, 9);
      glow.addColorStop(0, 'rgba(236,120,80,0.45)'); glow.addColorStop(0.4, 'rgba(220,104,67,0.14)'); glow.addColorStop(1, 'rgba(220,104,67,0)');
      ctx.fillStyle = glow; ctx.fillRect(lx - 9, ly - 9, 18, 18);
      ctx.restore();
      const dot = ctx.createRadialGradient(lx - 0.5, ly - 0.5, 0.1, lx, ly, 1.9);
      dot.addColorStop(0, '#FFD2BD'); dot.addColorStop(0.45, '#F08A62'); dot.addColorStop(1, ACCENT);
      ctx.beginPath(); ctx.arc(lx, ly, 1.8, 0, 7); ctx.fillStyle = dot; ctx.fill();
      // masking tape, torn at both ends, waiting for its label
      ctx.save(); ctx.translate(x + 24, y + 25); ctx.rotate(-0.045);
      const tr = mulberry(1811), tl = [], trr = [];
      for (let k = 0; k <= 5; k++) { tl.push([0.8 * tr(), k * 2.6]); trr.push([54 - 0.9 * tr(), 13 - k * 2.6]); }
      const tape = () => { ctx.beginPath(); ctx.moveTo(tl[0][0], 0); tl.forEach(p => ctx.lineTo(p[0], p[1])); trr.forEach(p => ctx.lineTo(p[0], p[1])); ctx.closePath(); };
      ctx.save(); tape(); drop(ctx, 1, 0.3, 0.6, 0.35); ctx.fillStyle = 'rgba(234,224,200,0.95)'; ctx.fill(); ctx.restore();
      ctx.save(); tape(); ctx.clip(); light(ctx, 0, 0, 54, 13, 0.25, 0.10);
      ctx.strokeStyle = 'rgba(160,140,100,0.12)'; ctx.lineWidth = 0.3;
      for (let k = 1; k < 13; k += 1.6) { ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(54, k + 0.3); ctx.stroke(); }
      ctx.restore();
      ctx.restore();
      grainAtop(ctx, this.w, this.h, 0.09);
    },
    ink(ctx, m, F) {
      ctx.save(); ctx.translate(BX.x + 24, BX.y + 25); ctx.rotate(-0.045);
      script(ctx, [{ text: 'the bridge', x: 4.5, y: 9.4, size: 8.2 }], m, { font: F.hand, color: BLUE, seed: 1821 });
      ctx.restore();
    },
  });

  /* ================================================================ texture */
  /* a stoneware mug, half drunk */
  items.push({
    id: 'mug', w: 88, h: 88, shadow: 2.4, ...POSES.mug,
    draw(ctx) {
      const cx = 39, cy = 45, R = 30;
      // the ring it left on the bench last time, part of the object
      const rc = mulberry(1901);
      ctx.save();
      for (let i = 0; i < 50; i++) {
        const a0 = rc() * Math.PI * 2, a1 = a0 + 0.3 + rc() * 0.8;
        ctx.strokeStyle = `rgba(100,58,28,${0.04 + rc() * 0.08})`; ctx.lineWidth = 0.8 + rc() * 1.6;
        ctx.beginPath(); ctx.arc(cx + 6, cy + 8, R + 0.5 + (rc() - 0.5) * 1.4, a0, a1); ctx.stroke();
      }
      ctx.restore();
      // the handle
      ctx.save(); ctx.lineCap = 'round';
      drop(ctx, 2, 0.8, 1.2, 0.35);
      const hg = ctx.createLinearGradient(0, cy - 12, 0, cy + 12);
      hg.addColorStop(0, '#EFE6D6'); hg.addColorStop(0.5, '#CFC2AC'); hg.addColorStop(1, '#9E8F78');
      ctx.strokeStyle = hg; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(cx + 25, cy - 11); ctx.quadraticCurveTo(cx + 44, cy - 12, cx + 44, cy); ctx.quadraticCurveTo(cx + 44, cy + 12, cx + 25, cy + 11); ctx.stroke();
      ctx.restore();
      // the rim: oatmeal glaze, speckled
      const body = ctx.createRadialGradient(cx - 12, cy - 14, 2, cx, cy, R);
      body.addColorStop(0, '#F6EFE3'); body.addColorStop(0.7, '#DFD3BF'); body.addColorStop(1, '#B6A68C');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = body; ctx.fill();
      const sp = mulberry(1905); ctx.fillStyle = 'rgba(70,52,36,0.45)';
      for (let i = 0; i < 40; i++) { const a = sp() * 6.28, d = R - 3.6 + sp() * 3.2; ctx.beginPath(); ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 0.2 + sp() * 0.35, 0, 7); ctx.fill(); }
      // the inner wall, tall above the coffee: in shadow on the lit side, catching light on the far side
      const inner = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      inner.addColorStop(0, '#A89779'); inner.addColorStop(0.55, '#D8CCB6'); inner.addColorStop(1, '#F2EADC');
      ctx.beginPath(); ctx.arc(cx, cy, R - 4, 0, 7); ctx.fillStyle = inner; ctx.fill();
      // the coffee, half way down
      const cr = R - 10;
      const cg = ctx.createRadialGradient(cx + 4, cy + 5, 2, cx, cy, cr);
      cg.addColorStop(0, '#4A2C1A'); cg.addColorStop(0.75, '#2E1A10'); cg.addColorStop(1, '#221108');
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.fillStyle = cg; ctx.fill();
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.clip();
      const ws = ctx.createLinearGradient(cx - cr, cy - cr, cx + cr * 0.2, cy + cr * 0.2);   // the lit wall shades the near side of the coffee
      ws.addColorStop(0, 'rgba(10,4,0,0.45)'); ws.addColorStop(1, 'rgba(10,4,0,0)');
      ctx.fillStyle = ws; ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
      ctx.strokeStyle = 'rgba(255,244,228,0.26)'; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.arc(cx, cy, cr - 3, Math.PI * 1.62, Math.PI * 1.95); ctx.stroke();
      ctx.restore();
      // the tide line: where it stood before it got drunk
      ctx.beginPath(); ctx.arc(cx, cy, cr + 3.4, 0, 7); ctx.strokeStyle = 'rgba(110,70,40,0.28)'; ctx.lineWidth = 0.8; ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, cr + 0.3, 0, 7); ctx.strokeStyle = 'rgba(150,96,58,0.5)'; ctx.lineWidth = 0.9; ctx.stroke();
      // the rim's highlight and a chip in the glaze
      ctx.beginPath(); ctx.arc(cx, cy, R - 2, Math.PI * 1.02, Math.PI * 1.55); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + 20, cy + 21.6, 1.8, 1, 0.8, 0, 7); ctx.fillStyle = '#C9B28E'; ctx.fill();
      grainAtop(ctx, this.w, this.h, 0.05);
    },
  });

  /* a black lacquer pencil, sharpened with a knife */
  items.push({
    id: 'pencil', w: 148, h: 12, shadow: 1.5, soft: true, ...POSES.pencil,
    draw(ctx, F) {
      const y = 1.5, bh = 9;
      // the knife-sharpened end: shaved cedar and the graphite point
      ctx.beginPath(); ctx.moveTo(1, y + bh / 2); ctx.lineTo(20, y + 0.2); ctx.lineTo(20, y + bh - 0.2); ctx.closePath();
      const wg = ctx.createLinearGradient(0, y, 0, y + bh); wg.addColorStop(0, '#EED5B2'); wg.addColorStop(0.5, '#D3AC7E'); wg.addColorStop(1, '#A57F56'); ctx.fillStyle = wg; ctx.fill();
      ctx.strokeStyle = 'rgba(130,90,54,0.4)'; ctx.lineWidth = 0.35;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(5 + i * 3, y + bh / 2 - 0.4 - i * 0.8); ctx.lineTo(19, y + 1 + i * 0.4); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(0, y + bh / 2); ctx.lineTo(7, y + bh / 2 - 1.7); ctx.lineTo(7, y + bh / 2 + 1.7); ctx.closePath();
      const lg = ctx.createLinearGradient(0, y + 2.8, 0, y + 6.2); lg.addColorStop(0, '#8E8A88'); lg.addColorStop(0.5, '#3E3A38'); lg.addColorStop(1, '#1E1B1A'); ctx.fillStyle = lg; ctx.fill();
      // the hexagonal barrel, three facets, the top one catching the window
      ctx.save();
      ctx.beginPath(); ctx.moveTo(20, y); for (let s = 0; s <= 3; s++) ctx.quadraticCurveTo(18.2, y + (s + 0.5) * bh / 3, 20, y + Math.min(bh, (s + 1) * bh / 3));
      ctx.lineTo(147, y + bh); ctx.lineTo(147, y); ctx.closePath(); ctx.clip();
      [['#4A4542', 0], ['#26221F', 1], ['#0F0D0C', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(15, y + i * bh / 3, 134, bh / 3 + 0.2); });
      ctx.fillStyle = 'rgba(255,248,236,0.40)'; ctx.fillRect(15, y + 0.9, 134, 0.7);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(15, y + bh / 3 - 0.2, 134, 0.4); ctx.fillRect(15, y + bh * 2 / 3 - 0.2, 134, 0.4);
      print(ctx, F, 'DRAFTING  2B', 44, y + 5.2, 4.2, { label: true, weight: 700, color: 'rgba(214,196,160,0.75)', track: '0.9px' });
      // worn: lacquer rubbed through to wood where it rides the fingers
      const wr = mulberry(1951); ctx.fillStyle = 'rgba(190,150,104,0.5)';
      for (let i = 0; i < 6; i++) ctx.fillRect(28 + wr() * 16, y + 0.6 + wr() * 2.2, 0.6 + wr() * 1.4, 0.4);
      ctx.restore();
      // the square cut end, cedar and a dot of lead
      rr(ctx, 145.6, y, 2.4, bh, 0.6); ctx.fillStyle = '#C79E70'; ctx.fill();
      ctx.beginPath(); ctx.arc(146.8, y + bh / 2, 0.9, 0, 7); ctx.fillStyle = '#2A2725'; ctx.fill();
    },
  });

  return items;
}
