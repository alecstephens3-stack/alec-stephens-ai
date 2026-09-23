/*
 * sandbox-items.js · the objects on "The sandbox" desk.
 * The front desk with nothing to do: same laminate, same lens, same light, but
 * littered with toys instead of paperwork. Each toy opens a mini game.
 *
 * Plain ES module, no imports. Everything is painted through the painters the
 * desk engine hands over (desk-scene.js exports them as `painters`):
 *   { paper, print, script, rr, grainAtop, mulberry, makeCanvas, stickyItem, INK, ACCENT, CREAM, BLUE_INK }
 *
 * Item contract (see buildItems() in desk-scene.js): w x h in design units,
 * draw(ctx, F) paints the object at the origin, ink(ctx, m, F) paints anything
 * handwritten at messiness m (1 = scrawled, 0 = neat). Poses per layout:
 * m = messy [cx, cy, deg], t = tidy [cx, cy, deg]. Wide desk 800 x 500, tall 358 x 600.
 */

export const SANDBOX_DESK_COLOR = '#D3AF89';   // a touch more honey than the front desk's #D9B896

/* the idle lens visits the tidy centre of each toy, in a loop around the desk */
export const SANDBOX_STOPS = {
  wide: [[366, 104], [560, 92], [680, 346], [512, 356], [336, 366], [156, 132]],   // football, stapler, plane, stickies, eraser, graph paper
  tall: [[98, 86], [256, 104], [288, 270], [268, 452], [112, 442], [124, 262]],    // football, stickies, stapler, plane, eraser, graph paper
};

export function buildSandboxItems(P) {
  const { paper, print, script, rr, grainAtop, mulberry, ACCENT } = P;
  const BLUE = '#26336B', GRAPHITE = '#4B4A4F';
  const RAD = Math.PI / 180;

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
    ctx.strokeStyle = `rgba(92,66,44,${o.dark ?? 0.30})`; ctx.lineWidth = o.w ?? 0.6;
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${o.light ?? 0.75})`; ctx.lineWidth = (o.w ?? 0.6) * 0.9;
    ctx.beginPath(); ctx.moveTo(x0 + nx * 0.7, y0 + ny * 0.7); ctx.lineTo(x1 + nx * 0.7, y1 + ny * 0.7); ctx.stroke();
    ctx.restore();
  }
  /* brushed steel along a direction */
  function steel(ctx, x0, y0, x1, y1) {
    const g = ctx.createLinearGradient(x0, y0, x1, y1);
    g.addColorStop(0, '#FBFAF8'); g.addColorStop(0.35, '#D2CDC6'); g.addColorStop(0.6, '#9C958D'); g.addColorStop(1, '#5F5852');
    return g;
  }
  /* a paper clip, 36 x 12, lying flat */
  function paperClip(ctx, x, y, rot, len = 36) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    const k = len / 34;
    ctx.scale(k, 1);
    ctx.shadowColor = 'rgba(50,28,12,0.45)'; ctx.shadowBlur = 1.6; ctx.shadowOffsetX = 0.8; ctx.shadowOffsetY = 1.2;
    ctx.strokeStyle = steel(ctx, 0, 0, 0, 12); ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(8, 9.2); ctx.lineTo(28, 9.2); ctx.arc(28, 6, 3.2, Math.PI / 2, -Math.PI / 2, true);
    ctx.lineTo(5, 2.8); ctx.arc(5, 6.4, 3.6, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(24, 10); ctx.stroke();
    ctx.shadowColor = 'transparent';
    ctx.beginPath(); ctx.moveTo(24, 5.2); ctx.lineTo(10, 5.2); ctx.arc(10, 6.6, 1.4, -Math.PI / 2, Math.PI / 2, true); ctx.lineTo(22, 8); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.4;   // the glint along the top wire
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
  const circlePts = (cx, cy, rad, n = 14, over = 0) => { const out = []; for (let i = 0; i <= n + over; i++) { const a = i / n * Math.PI * 2 - 0.4; out.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]); } return out; };

  const items = [];

  /* ------------------------------------------------------------ graph paper */
  const GX0 = 5, GY0 = 16, CELL = 8;   // grid origin under the gum binding, one square = 8 units
  items.push({
    id: 'graphpad', w: 170, h: 130, shadow: 1.6, tool: 'graph-snake', name: 'Graph paper', verb: 'Play snake',
    wide: { m: [150, 136, -8], t: [156, 132, 0] }, tall: { m: [122, 262, -4], t: [124, 262, 0] },
    draw(ctx, F) {
      const sw = this.w - 4, sh = this.h - 5;
      // the chipboard back and the edges of the sheets underneath
      rr(ctx, 3.5, 4.5, sw, sh, 1.5); ctx.fillStyle = '#8A765E'; ctx.fill();
      [[2.6, 3.4, '#DDE1DA'], [1.7, 2.3, '#E7EAE3'], [0.8, 1.1, '#F0F2EC']].forEach(([dx, dy, c]) => { rr(ctx, dx, dy, sw, sh, 1.2); ctx.fillStyle = c; ctx.fill(); ctx.strokeStyle = 'rgba(80,60,40,0.12)'; ctx.lineWidth = 0.4; ctx.stroke(); });
      // the top sheet, its bottom-right corner lifting a little
      ctx.save();
      poly(ctx, [[0, 0], [sw, 0], [sw, sh - 11], [sw - 11, sh], [0, sh]], 1.2); ctx.clip();
      paper(ctx, sw, sh, '#F7F8F3', { curl: true });
      // the grid: fine rule every square, a heavier rule every fifth
      for (let i = 0; GX0 + i * CELL < sw; i++) {
        const x = GX0 + i * CELL, major = i % 5 === 0;
        ctx.fillStyle = major ? 'rgba(66,120,186,0.40)' : 'rgba(66,120,186,0.24)'; ctx.fillRect(x - (major ? 0.4 : 0.25), 13, major ? 0.8 : 0.5, sh);
      }
      for (let j = 0; GY0 + j * CELL < sh; j++) {
        const y = GY0 + j * CELL, major = j % 5 === 0;
        ctx.fillStyle = major ? 'rgba(66,120,186,0.40)' : 'rgba(66,120,186,0.24)'; ctx.fillRect(0, y - (major ? 0.4 : 0.25), sw, major ? 0.8 : 0.5);
      }
      // an eraser was here: a pale smear where an earlier game got rubbed out
      const sm = ctx.createRadialGradient(118, 100, 1, 118, 100, 20);
      sm.addColorStop(0, 'rgba(120,120,126,0.10)'); sm.addColorStop(0.6, 'rgba(255,255,255,0.28)'); sm.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = sm; ctx.fillRect(96, 80, 44, 40);
      ctx.restore();
      // the folded-up corner
      ctx.save();
      ctx.beginPath(); ctx.moveTo(sw, sh - 11); ctx.lineTo(sw - 11, sh); ctx.lineTo(sw - 9.5, sh - 9.2); ctx.closePath();
      const fg = ctx.createLinearGradient(sw - 11, sh - 11, sw - 3, sh - 3);
      fg.addColorStop(0, '#FFFFFF'); fg.addColorStop(1, '#E4E7E0');
      ctx.fillStyle = fg; ctx.shadowColor = 'rgba(60,30,10,0.35)'; ctx.shadowBlur = 3; ctx.shadowOffsetX = 1.2; ctx.shadowOffsetY = 1.6; ctx.fill();
      ctx.restore();
      // the gum binding along the top
      rr(ctx, -0.6, -0.8, sw + 1.2, 13.5, 1.6); ctx.fillStyle = '#9C4A33'; ctx.fill();
      const bg = ctx.createLinearGradient(0, -1, 0, 13);
      bg.addColorStop(0, 'rgba(255,225,205,0.40)'); bg.addColorStop(0.35, 'rgba(255,225,205,0.08)'); bg.addColorStop(0.85, 'rgba(0,0,0,0.10)'); bg.addColorStop(1, 'rgba(0,0,0,0.30)');
      rr(ctx, -0.6, -0.8, sw + 1.2, 13.5, 1.6); ctx.fillStyle = bg; ctx.fill();
      const gr = mulberry(412); ctx.fillStyle = 'rgba(255,230,210,0.16)';
      for (let i = 0; i < 26; i++) ctx.fillRect(gr() * sw, 1 + gr() * 10, 1 + gr() * 5, 0.5);   // dried gum, streaky
      print(ctx, F, 'QUAD RULED  5 x 5', 9, 8.8, 5.6, { label: true, weight: 700, color: 'rgba(250,236,224,0.78)', track: '1.1px' });
      print(ctx, F, '50 SHEETS', sw - 8, 8.8, 5.6, { label: true, weight: 700, align: 'right', color: 'rgba(250,236,224,0.62)', track: '1.1px' });
      paperClip(ctx, 132, 81, 0.04, 38);   // clipping the right edge, half on the paper and half off
      grainAtop(ctx, this.w, this.h, 0.07);
    },
    ink(ctx, m, F) {
      // the snake, filled in square by square in pencil, and the apple it is after
      const cells = [[3, 7], [4, 7], [5, 7], [6, 7], [6, 6], [6, 5], [7, 5], [8, 5], [9, 5], [10, 5]];
      const r = mulberry(501);
      ctx.save(); ctx.lineCap = 'round';
      cells.forEach(([c, row], i) => {
        const x = GX0 + c * CELL, y = GY0 + row * CELL, head = i === cells.length - 1;
        const over = 1.4 * m;   // a hurried hand colours outside the square
        ctx.save(); ctx.beginPath(); ctx.rect(x - over, y - over, CELL + over * 2, CELL + over * 2); ctx.clip();
        ctx.strokeStyle = GRAPHITE; ctx.globalAlpha = head ? 0.78 : 0.52 + r() * 0.12; ctx.lineWidth = 0.8;
        for (let k = -CELL; k < CELL * 2; k += head ? 1.3 : 1.8) {
          const j = (r() - 0.5) * 1.2 * m;
          ctx.beginPath(); ctx.moveTo(x + k + j, y + CELL + over); ctx.lineTo(x + k + CELL * 0.9 + j, y - over); ctx.stroke();
        }
        ctx.restore();
        if (head) {   // the eye: a spot the pencil went round
          ctx.fillStyle = '#F7F8F3'; ctx.beginPath(); ctx.arc(x + 5.4, y + 2.8, 1.2, 0, 7); ctx.fill();
          ctx.fillStyle = GRAPHITE; ctx.beginPath(); ctx.arc(x + 5.6, y + 2.9, 0.5, 0, 7); ctx.fill();
          wobble(ctx, [[x + CELL, y + 4.4], [x + CELL + 2.6, y + 4], [x + CELL + 3.8, y + 3.2]], m, 507, { color: '#B5452A', width: 0.7 });   // the tongue
          wobble(ctx, [[x + CELL + 2.6, y + 4], [x + CELL + 3.8, y + 5.2]], m, 508, { color: '#B5452A', width: 0.7 });
        }
      });
      ctx.restore();
      // the apple
      const ax = GX0 + 14 * CELL + 4, ay = GY0 + 8 * CELL + 4;
      wobble(ctx, circlePts(ax, ay + 0.4, 2.9, 12, 1), m, 511, { color: GRAPHITE, width: 0.8, alpha: 0.8 });
      wobble(ctx, [[ax, ay - 2.4], [ax + 0.6, ay - 4.4]], m, 512, { color: GRAPHITE, width: 0.8, alpha: 0.8 });
      wobble(ctx, [[ax + 0.6, ay - 4.0], [ax + 2.8, ay - 4.8], [ax + 1.6, ay - 3.2]], m, 513, { color: GRAPHITE, width: 0.6, alpha: 0.7 });
      // the high score, pencilled in the corner
      script(ctx, [{ text: 'best: 12', x: 104, y: 30, size: 9.5, extra: '!', tilt: -0.08 }], m, { font: F.hand, color: GRAPHITE, seed: 520 });
    },
  });

  /* --------------------------------------------------------- paper football */
  items.push({
    id: 'football', w: 120, h: 70, shadow: 1.15, tool: 'paper-football', name: 'Paper football', verb: 'Flick it',
    wide: { m: [372, 108, 14], t: [366, 104, 0] }, tall: { m: [98, 90, -10], t: [98, 86, 0] },
    draw(ctx) {
      const A = [60, 7], B = [116, 63], C = [4, 63];
      // the folded strip is many sheets thick; the lower layers show along the base and the right leg
      [[1.8, 1.6, '#D6CFC0'], [1.1, 1.0, '#E3DDD0'], [0.5, 0.45, '#EEE9DE']].forEach(([dx, dy, c]) => {
        poly(ctx, [[A[0] + dx, A[1] + dy], [B[0] + dx, B[1] + dy], [C[0] + dx, C[1] + dy]], 3.2); ctx.fillStyle = c; ctx.fill();
      });
      ctx.save();
      poly(ctx, [A, B, C], 3.2); ctx.clip();
      ctx.fillStyle = '#FBF9F2'; ctx.fillRect(0, 0, 120, 70);
      // notebook paper: the ruled lines ran along the strip, so they cross the triangle at a slant
      ctx.strokeStyle = 'rgba(80,122,184,0.40)'; ctx.lineWidth = 0.6;
      for (let x0 = -90; x0 < 130; x0 += 9.6) { ctx.beginPath(); ctx.moveTo(x0, 0); ctx.lineTo(x0 + 80, 80); ctx.stroke(); }
      ctx.strokeStyle = 'rgba(198,84,62,0.50)'; ctx.lineWidth = 0.7;   // a scrap of the red margin line
      ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(62, 80); ctx.stroke();
      // the last fold: the flap on the right of the crease sits a layer higher and a shade darker
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.lineTo(66, 63); ctx.closePath();
      ctx.fillStyle = 'rgba(128,92,60,0.07)'; ctx.fill();
      // the tucked-in tail: its cut edge throws a hair of shadow
      const tg = ctx.createLinearGradient(30, 52, 34, 56);
      tg.addColorStop(0, 'rgba(90,60,36,0.20)'); tg.addColorStop(1, 'rgba(90,60,36,0)');
      ctx.beginPath(); ctx.moveTo(20, 63); ctx.lineTo(40, 43); ctx.lineTo(44, 47); ctx.lineTo(28, 63); ctx.closePath(); ctx.fillStyle = tg; ctx.fill();
      // window light from the top left
      const g = ctx.createLinearGradient(30, 10, 80, 70);
      g.addColorStop(0, 'rgba(255,255,255,0.40)'); g.addColorStop(0.5, 'rgba(255,255,255,0.04)'); g.addColorStop(1, 'rgba(96,60,36,0.13)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 120, 70);
      // wear: one soft crumple across the middle, and the grubby thumb end where it gets flicked
      crease(ctx, 46, 30, 58, 41, { dark: 0.14, light: 0.5 });
      crease(ctx, 58, 41, 63, 52, { dark: 0.10, light: 0.4 });
      const th = ctx.createRadialGradient(18, 60, 1, 18, 60, 16);
      th.addColorStop(0, 'rgba(110,96,88,0.14)'); th.addColorStop(1, 'rgba(110,96,88,0)');
      ctx.fillStyle = th; ctx.fillRect(0, 40, 40, 30);
      ctx.restore();
      crease(ctx, A[0], A[1] + 1.5, 66, 62.5, { dark: 0.34, light: 0.8, w: 0.7 });
      crease(ctx, 20.5, 62.5, 40, 43, { dark: 0.30, light: 0.7 });
      // a dog-eared tip on the right corner
      ctx.save();
      ctx.beginPath(); ctx.moveTo(104, 51); ctx.lineTo(110.5, 57.5); ctx.lineTo(103, 57.5); ctx.closePath();
      ctx.fillStyle = '#F2EEE3'; ctx.shadowColor = 'rgba(60,32,14,0.35)'; ctx.shadowBlur = 2; ctx.shadowOffsetX = -0.6; ctx.shadowOffsetY = 0.8; ctx.fill();
      ctx.restore();
      poly(ctx, [A, B, C], 3.2); ctx.strokeStyle = 'rgba(80,50,30,0.22)'; ctx.lineWidth = 0.55; ctx.stroke();
      grainAtop(ctx, this.w, this.h, 0.07);
    },
    ink(ctx, m, F) {
      script(ctx, [{ text: 'GO', x: 42, y: 53, size: 19, extra: '!', underline: 0.9, tilt: -0.12 }], m, { font: F.hand, color: BLUE, seed: 211, weight: 700 });
    },
  });

  /* ---------------------------------------------------------------- stapler */
  items.push({
    id: 'stapler', w: 150, h: 60, shadow: 2.0, tool: 'whack-a-sticky', name: 'Stapler', verb: 'Whack it',
    wide: { m: [562, 96, -10], t: [560, 92, 0] }, tall: { m: [286, 272, 84], t: [288, 270, 90] },
    draw(ctx) {
      // the black base, showing round the rear and as the anvil at the front
      rr(ctx, 1, 13, 148, 35, 17); ctx.fillStyle = '#231E1B'; ctx.fill();
      const bg = ctx.createLinearGradient(0, 13, 0, 48);
      bg.addColorStop(0, 'rgba(255,240,228,0.20)'); bg.addColorStop(0.4, 'rgba(255,240,228,0.03)'); bg.addColorStop(1, 'rgba(0,0,0,0.30)');
      rr(ctx, 1, 13, 148, 35, 17); ctx.fillStyle = bg; ctx.fill();
      rr(ctx, 132, 23, 14, 15, 5); ctx.fillStyle = steel(ctx, 0, 23, 0, 38); ctx.fill();   // the anvil plate
      ctx.fillStyle = 'rgba(40,36,34,0.55)'; ctx.fillRect(136, 29.5, 7, 1.6);            // its crimp groove
      // the red arm, lifted a few millimetres off the base
      const arm = () => poly(ctx, [[6, 12], [132, 15], [140, 30], [132, 45], [6, 48], [4, 30]], [18, 14, 9, 14, 18, 16]);
      ctx.save(); arm(); ctx.shadowColor = 'rgba(10,6,4,0.55)'; ctx.shadowBlur = 3.5; ctx.shadowOffsetX = 1.2; ctx.shadowOffsetY = 2.2; ctx.fillStyle = '#A2342A'; ctx.fill(); ctx.restore();
      ctx.save(); arm(); ctx.clip();
      const g = ctx.createLinearGradient(0, 12, 0, 48);
      g.addColorStop(0, '#D26452'); g.addColorStop(0.22, '#B8402F'); g.addColorStop(0.62, '#962B20'); g.addColorStop(1, '#651A13');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 150, 60);
      const hl = ctx.createLinearGradient(0, 15, 0, 22);   // the long glint of the enamel along the lit shoulder
      hl.addColorStop(0, 'rgba(255,236,222,0)'); hl.addColorStop(0.5, 'rgba(255,236,222,0.42)'); hl.addColorStop(1, 'rgba(255,236,222,0)');
      ctx.fillStyle = hl; ctx.fillRect(14, 15, 108, 7);
      const rear = ctx.createRadialGradient(20, 26, 1, 20, 30, 20);   // the domed hinge housing
      rear.addColorStop(0, 'rgba(255,220,200,0.22)'); rear.addColorStop(1, 'rgba(255,220,200,0)');
      ctx.fillStyle = rear; ctx.fillRect(0, 10, 40, 40);
      // chipped paint along the front edge, years of being slammed
      const ch = mulberry(611);
      for (let i = 0; i < 9; i++) { const x = 70 + ch() * 64, y = ch() > 0.5 ? 14 + ch() * 2.4 : 43.6 + ch() * 2.4; ctx.fillStyle = `rgba(214,206,196,${0.5 + ch() * 0.4})`; ctx.beginPath(); ctx.ellipse(x, y, 0.5 + ch() * 1.1, 0.4 + ch() * 0.6, ch() * 3, 0, 7); ctx.fill(); }
      ctx.restore();
      arm(); ctx.strokeStyle = 'rgba(40,10,6,0.45)'; ctx.lineWidth = 0.6; ctx.stroke();
      // the metal top plate over the magazine, with the thumb pad pressed into it
      ctx.save();
      rr(ctx, 64, 19.5, 68, 21, 10);
      ctx.shadowColor = 'rgba(40,10,6,0.45)'; ctx.shadowBlur = 1.5; ctx.shadowOffsetY = 0.8; ctx.fillStyle = steel(ctx, 0, 19.5, 0, 40.5); ctx.fill();
      ctx.restore();
      ctx.save(); rr(ctx, 64, 19.5, 68, 21, 10); ctx.clip();
      ctx.strokeStyle = 'rgba(255,255,255,0.20)'; ctx.lineWidth = 0.3;   // brushed grain
      for (let y = 20; y < 41; y += 0.9) { ctx.beginPath(); ctx.moveTo(64, y); ctx.lineTo(132, y + 0.2); ctx.stroke(); }
      const pad = ctx.createRadialGradient(108, 29, 1, 110, 30, 12);
      pad.addColorStop(0, 'rgba(90,84,78,0.28)'); pad.addColorStop(0.7, 'rgba(90,84,78,0.06)'); pad.addColorStop(1, 'rgba(255,255,255,0.18)');
      ctx.fillStyle = pad; ctx.beginPath(); ctx.ellipse(109, 30, 13, 7.5, 0, 0, 7); ctx.fill();
      ctx.restore();
      rr(ctx, 64, 19.5, 68, 21, 10); ctx.strokeStyle = 'rgba(40,34,30,0.55)'; ctx.lineWidth = 0.5; ctx.stroke();
      // rivet at the front of the plate and the hinge pin at the rear
      [[74, 30, 1.8], [15, 30, 2.6]].forEach(([x, y, r]) => {
        const rg = ctx.createRadialGradient(x - 0.7, y - 0.7, 0.2, x, y, r);
        rg.addColorStop(0, '#FFFFFF'); rg.addColorStop(0.5, '#BDB6AD'); rg.addColorStop(1, '#5F5852');
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fillStyle = rg; ctx.fill();
      });
      grainAtop(ctx, this.w, this.h, 0.06);
    },
  });

  /* -------------------------------------------------------------------- mug */
  items.push({
    id: 'mug', w: 90, h: 90, shadow: 2.4,
    wide: { m: [706, 118, 20], t: [704, 116, 0] }, tall: null,
    draw(ctx) {
      const cx = 40, cy = 45, R = 31;
      // the handle, a thick loop on the right
      ctx.save(); ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(60,30,10,0.35)'; ctx.shadowBlur = 2; ctx.shadowOffsetX = 0.8; ctx.shadowOffsetY = 1.2;
      const hg = ctx.createLinearGradient(0, cy - 12, 0, cy + 12);
      hg.addColorStop(0, '#FBF6EC'); hg.addColorStop(0.5, '#E4DAC8'); hg.addColorStop(1, '#B9AB95');
      ctx.strokeStyle = hg; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(cx + 26, cy - 11); ctx.quadraticCurveTo(cx + 45, cy - 12, cx + 45, cy); ctx.quadraticCurveTo(cx + 45, cy + 12, cx + 26, cy + 11); ctx.stroke();
      ctx.restore();
      // the body seen from above: just the rim, lit from the top left
      ctx.save(); ctx.shadowColor = 'rgba(60,30,10,0.30)'; ctx.shadowBlur = 2.5; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1.5;
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = '#ECE3D2'; ctx.fill(); ctx.restore();
      const body = ctx.createRadialGradient(cx - 12, cy - 14, 2, cx, cy, R);
      body.addColorStop(0, '#FFFCF5'); body.addColorStop(0.7, '#EDE4D3'); body.addColorStop(1, '#C9BBA3');
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = body; ctx.fill();
      // one terracotta pinstripe just under the lip
      ctx.beginPath(); ctx.arc(cx, cy, R - 1.2, 0, 7); ctx.strokeStyle = ACCENT; ctx.globalAlpha = 0.85; ctx.lineWidth = 1.1; ctx.stroke(); ctx.globalAlpha = 1;
      // the inner wall: in shadow on the lit side, catching light on the far side
      const inner = ctx.createLinearGradient(cx - R, cy - R, cx + R, cy + R);
      inner.addColorStop(0, '#B7A78E'); inner.addColorStop(0.55, '#DCD1BE'); inner.addColorStop(1, '#F6EFE2');
      ctx.beginPath(); ctx.arc(cx, cy, R - 4, 0, 7); ctx.fillStyle = inner; ctx.fill();
      // the coffee, sitting low in the cup
      const cr = R - 9;
      const cg = ctx.createRadialGradient(cx + 4, cy + 5, 2, cx, cy, cr);
      cg.addColorStop(0, '#4A2C1A'); cg.addColorStop(0.75, '#2E1A10'); cg.addColorStop(1, '#231208');
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.fillStyle = cg; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, cy, cr - 0.6, 0, 7); ctx.strokeStyle = 'rgba(150,96,58,0.55)'; ctx.lineWidth = 1.2; ctx.stroke();   // the meniscus where it meets the glaze
      ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.clip();   // the window, reflected
      const rf = ctx.createRadialGradient(cx - 8, cy - 9, 1, cx - 8, cy - 9, 11);
      rf.addColorStop(0, 'rgba(255,246,232,0.34)'); rf.addColorStop(1, 'rgba(255,246,232,0)');
      ctx.fillStyle = rf; ctx.fillRect(cx - cr, cy - cr, cr * 2, cr * 2);
      ctx.strokeStyle = 'rgba(255,246,232,0.30)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, cr - 3.5, Math.PI * 1.08, Math.PI * 1.42); ctx.stroke();
      ctx.restore();
      // the rim's own highlight, and a drip that ran down the side long ago
      ctx.beginPath(); ctx.arc(cx, cy, R - 2, Math.PI * 1.02, Math.PI * 1.55); ctx.strokeStyle = 'rgba(255,255,255,0.85)'; ctx.lineWidth = 1.3; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(cx + 18, cy + 23.5, 2.6, 1.4, 0.8, 0, 7); ctx.fillStyle = 'rgba(112,62,30,0.30)'; ctx.fill();
      // the spoon: bowl under the coffee, handle over the rim and out past it
      ctx.save();
      ctx.translate(cx, cy); ctx.rotate(-0.78);
      ctx.shadowColor = 'rgba(30,14,6,0.45)'; ctx.shadowBlur = 1.8; ctx.shadowOffsetX = 1.2; ctx.shadowOffsetY = 1.6;
      ctx.beginPath(); ctx.moveTo(10, -1.2); ctx.lineTo(44, -2.6); ctx.quadraticCurveTo(49, 0, 44, 2.6); ctx.lineTo(10, 1.2); ctx.closePath();
      ctx.fillStyle = steel(ctx, 0, -2.6, 0, 2.6); ctx.fill();
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = 0.4; ctx.beginPath(); ctx.moveTo(14, -0.8); ctx.lineTo(44, -1.8); ctx.stroke();
      const dip = ctx.createLinearGradient(9, 0, 16, 0);   // where the handle goes into the coffee
      dip.addColorStop(0, 'rgba(46,26,16,1)'); dip.addColorStop(1, 'rgba(46,26,16,0)');
      ctx.fillStyle = dip; ctx.fillRect(9, -3, 7, 6);
      ctx.restore();
      grainAtop(ctx, this.w, this.h, 0.05);
    },
  });

  /* ----------------------------------------------------------------- eraser */
  items.push({
    id: 'eraser', w: 150, h: 120, shadow: 1.0, tool: 'eraser-curling', name: 'Eraser', verb: 'Slide it',
    wide: { m: [340, 372, 7], t: [336, 366, 0] }, tall: { m: [112, 444, 6], t: [112, 442, 0] },
    draw(ctx, F) {
      // the coffee ring it was set down on: part of the object, it goes where the eraser goes
      const rc = mulberry(301), rx = 96, ry = 70, R = 38;
      ctx.save();
      for (let i = 0; i < 80; i++) {
        const a0 = rc() * Math.PI * 2, a1 = a0 + 0.25 + rc() * 0.9, gap = a0 > 3.7 && a0 < 4.5;
        ctx.strokeStyle = `rgba(112,62,30,${gap ? 0.025 : 0.05 + rc() * 0.11})`; ctx.lineWidth = 0.8 + rc() * 2.2;
        ctx.beginPath(); ctx.arc(rx + (rc() - 0.5) * 0.8, ry + (rc() - 0.5) * 0.8, R + (rc() - 0.5) * 1.6, a0, a1); ctx.stroke();
      }
      ctx.fillStyle = 'rgba(128,78,44,0.045)'; ctx.beginPath(); ctx.arc(rx, ry, R, 0, 7); ctx.fill();
      ctx.restore();
      // rubber crumbs, rolled off the last hard erase
      const cr = mulberry(333);
      for (let i = 0; i < 7; i++) {
        const x = 104 + cr() * 32, y = 18 + cr() * 22;
        ctx.save(); ctx.shadowColor = 'rgba(60,30,10,0.35)'; ctx.shadowBlur = 0.8; ctx.shadowOffsetY = 0.5;
        ctx.beginPath(); ctx.ellipse(x, y, 1.6 + cr() * 1.8, 0.7 + cr() * 0.6, cr() * 3, 0, 7);
        ctx.fillStyle = cr() > 0.4 ? '#C88C8C' : '#8C7E7C'; ctx.fill(); ctx.restore();
      }
      // the eraser: a bevelled pink wedge seen from above
      ctx.save(); ctx.translate(66, 58); ctx.rotate(-0.14);
      const P0 = [-41, -20], P1 = [49, -20], P2 = [41, 20], P3 = [-49, 20];      // where it meets the desk
      const T0 = [-36, -15.5], T1 = [43, -15.5], T2 = [36, 15.5], T3 = [-43, 15.5];   // the top face
      ctx.save(); poly(ctx, [P0, P1, P2, P3], [4, 9, 4, 4]);
      ctx.shadowColor = 'rgba(70,30,20,0.40)'; ctx.shadowBlur = 2.2; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1.4; ctx.fillStyle = '#C57478'; ctx.fill(); ctx.restore();
      ctx.save(); poly(ctx, [P0, P1, P2, P3], [4, 9, 4, 4]); ctx.clip();
      [[[P0, P1, T1, T0], '#F2BDB8'], [[P1, P2, T2, T1], '#B9676C'], [[P2, P3, T3, T2], '#A95A60'], [[P3, P0, T0, T3], '#EBAEAB']].forEach(([pts, c]) => { poly(ctx, pts); ctx.fillStyle = c; ctx.fill(); });
      ctx.restore();
      // the top face, one corner rubbed round from use
      const top = () => poly(ctx, [T0, T1, T2, T3], [3, 10, 3, 3]);
      top(); ctx.fillStyle = '#E8A2A2'; ctx.fill();
      ctx.save(); top(); ctx.clip();
      const lg = ctx.createLinearGradient(-40, -16, 30, 20);
      lg.addColorStop(0, 'rgba(255,238,232,0.45)'); lg.addColorStop(0.5, 'rgba(255,238,232,0.06)'); lg.addColorStop(1, 'rgba(120,40,50,0.14)');
      ctx.fillStyle = lg; ctx.fillRect(-50, -20, 100, 40);
      // the grey smudge: graphite ground into the worn end
      const sm = ctx.createRadialGradient(34, -4, 1, 32, -2, 17);
      sm.addColorStop(0, 'rgba(84,80,82,0.55)'); sm.addColorStop(0.55, 'rgba(96,90,92,0.22)'); sm.addColorStop(1, 'rgba(96,90,92,0)');
      ctx.fillStyle = sm; ctx.fillRect(10, -20, 40, 40);
      ctx.strokeStyle = 'rgba(70,66,68,0.22)'; ctx.lineWidth = 0.6; ctx.lineCap = 'round';
      const sr = mulberry(344);
      for (let i = 0; i < 7; i++) { const y = -12 + sr() * 24, x = 18 + sr() * 10; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 10 + sr() * 10, y + (sr() - 0.5) * 3); ctx.stroke(); }
      // the maker's name pressed into the rubber
      print(ctx, F, 'PINK No. 40', -3.4, 3.6, 7.2, { label: true, weight: 700, align: 'center', color: 'rgba(255,226,222,0.55)', track: '1.6px' });
      print(ctx, F, 'PINK No. 40', -4, 3, 7.2, { label: true, weight: 700, align: 'center', color: 'rgba(140,56,64,0.34)', track: '1.6px' });
      ctx.restore();
      top(); ctx.strokeStyle = 'rgba(120,50,56,0.28)'; ctx.lineWidth = 0.5; ctx.stroke();
      ctx.restore();
      grainAtop(ctx, this.w, this.h, 0.08);
    },
  });

  /* ------------------------------------------------------ stack of stickies */
  const NOTE = 82, TOP = { dx: 1, dy: -2, a: -2 };
  items.push({
    id: 'stickies', w: 120, h: 120, shadow: 1.2, tool: 'sticky-match', name: 'Stack of stickies', verb: 'Match them',
    wide: { m: [516, 360, -9], t: [512, 356, 0] }, tall: { m: [256, 106, 6], t: [256, 104, 0] },
    draw(ctx) {
      const notes = [{ c: '#D9E4F5', a: -15, dx: -6, dy: 4 }, { c: '#DCE9D3', a: -7, dx: -3, dy: 2 }, { c: '#F6CDB9', a: 5, dx: 3, dy: 1 }, { c: '#F8E7A6', ...TOP }];
      notes.forEach((n, i) => {
        const last = i === notes.length - 1, k = 12;
        ctx.save(); ctx.translate(60 + n.dx, 60 + n.dy); ctx.rotate(n.a * RAD); ctx.translate(-NOTE / 2, -NOTE / 2);
        const shape = () => last ? poly(ctx, [[0, 0], [NOTE, 0], [NOTE, NOTE - k], [NOTE - k, NOTE], [0, NOTE]], 0.8) : rr(ctx, 0, 0, NOTE, NOTE, 0.8);
        ctx.save(); shape(); ctx.shadowColor = 'rgba(60,32,12,0.24)'; ctx.shadowBlur = 2.6; ctx.shadowOffsetX = 0.8; ctx.shadowOffsetY = 1.3; ctx.fillStyle = n.c; ctx.fill(); ctx.restore();
        ctx.save(); shape(); ctx.clip();
        paper(ctx, NOTE, NOTE, n.c, { curl: true, radius: 0.8 });
        ctx.fillStyle = 'rgba(90,60,30,0.05)'; ctx.fillRect(0, 0, NOTE, 15);   // adhesive strip
        ctx.restore();
        if (last) {   // the top note's corner has let go
          ctx.beginPath(); ctx.moveTo(NOTE, NOTE - k); ctx.lineTo(NOTE - k, NOTE); ctx.lineTo(NOTE - k * 0.92, NOTE - k * 0.80); ctx.closePath();
          const fg = ctx.createLinearGradient(NOTE - k, NOTE - k, NOTE - k * 0.3, NOTE - k * 0.3);
          fg.addColorStop(0, 'rgba(255,255,255,0.95)'); fg.addColorStop(1, n.c); ctx.fillStyle = fg;
          ctx.shadowColor = 'rgba(60,30,10,0.40)'; ctx.shadowBlur = 4; ctx.shadowOffsetX = 1.5; ctx.shadowOffsetY = 2; ctx.fill();
        }
        ctx.restore();
      });
      grainAtop(ctx, this.w, this.h, 0.075);
    },
    ink(ctx, m, F) {
      ctx.save(); ctx.translate(60 + TOP.dx, 60 + TOP.dy); ctx.rotate(TOP.a * RAD); ctx.translate(-NOTE / 2, -NOTE / 2);
      script(ctx, [{ text: '?', x: 31, y: 60, size: 44, extra: '?' }], m, { font: F.hand, color: BLUE, seed: 71, weight: 700 });
      ctx.restore();
    },
  });

  /* ------------------------------------------------------------ paper plane */
  items.push({
    id: 'plane', w: 150, h: 90, shadow: 1.8, tool: 'paper-plane', name: 'Paper plane', verb: 'Fly it',
    wide: { m: [684, 350, 16], t: [680, 346, 0] }, tall: { m: [268, 454, -82], t: [268, 452, -90] },
    draw(ctx, F) {
      const N = [147, 45];   // the nose points right
      // the keel, folded down under the wings: a dark sliver down the middle
      poly(ctx, [[9, 40.5], N, [9, 49.5]], 1.5);
      const kg = ctx.createLinearGradient(0, 40, 0, 50); kg.addColorStop(0, '#9E968A'); kg.addColorStop(0.5, '#C6BEB0'); kg.addColorStop(1, '#8A8276'); ctx.fillStyle = kg; ctx.fill();
      // each wing is two panels; the outer panels tilt up to the light on the near wing and away on the far one
      const wing = (pts, c) => { poly(ctx, pts, [1.6, 1.2, 1.2]); ctx.fillStyle = c; ctx.fill(); };
      ctx.save(); ctx.shadowColor = 'rgba(60,34,14,0.30)'; ctx.shadowBlur = 2; ctx.shadowOffsetX = 0.6; ctx.shadowOffsetY = 1.2;
      wing([N, [6, 4], [14, 43.2]], '#FBFAF5'); wing([N, [14, 46.8], [6, 86]], '#F1EEE6');
      ctx.restore();
      wing([N, [6, 4], [8, 22]], '#FFFFFD');     // near wing, outer panel
      wing([N, [8, 22], [14, 43.2]], '#F3F0E8'); // near wing, inner panel
      wing([N, [14, 46.8], [8, 68]], '#E9E5DB'); // far wing, inner panel
      wing([N, [8, 68], [6, 86]], '#DDD8CC');    // far wing, outer panel
      // light across the whole plane
      ctx.save(); poly(ctx, [N, [6, 4], [6, 86]]); ctx.clip();
      const g = ctx.createLinearGradient(20, 0, 110, 90);
      g.addColorStop(0, 'rgba(255,255,255,0.30)'); g.addColorStop(0.55, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(96,60,36,0.10)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, 150, 90);
      // it was a printed page once: a ghost of the text, folded into the wings
      ctx.fillStyle = 'rgba(40,36,34,0.07)';
      const tr = mulberry(707);
      for (let i = 0; i < 7; i++) { const x = 30 + i * 11, y0 = 56 + i * 1.2; for (let j = 0; j < 3; j++) ctx.fillRect(x + tr() * 2, y0 + j * 4.2, 7 + tr() * 6, 1.1); }
      ctx.restore();
      // crisp folds
      crease(ctx, N[0] - 2, N[1] - 0.6, 8, 22, { dark: 0.26, light: 0.9 });
      crease(ctx, N[0] - 2, N[1] + 0.6, 8, 68, { dark: 0.30, light: 0.5 });
      crease(ctx, N[0] - 2, N[1] - 0.4, 14, 43.2, { dark: 0.42, light: 0.6, w: 0.7 });
      crease(ctx, N[0] - 2, N[1] + 0.4, 14, 46.8, { dark: 0.42, light: 0.3, w: 0.7 });
      // wear: the nose has met a wall or two
      ctx.save(); ctx.globalAlpha = 0.8;
      crease(ctx, 136, 41.2, 139, 47.4, { dark: 0.22, light: 0.6 });
      crease(ctx, 131, 43, 133, 46.4, { dark: 0.16, light: 0.5 });
      ctx.restore();
      // the trailing edges, a hair of shadow where the paper stands off the desk
      ctx.strokeStyle = 'rgba(70,44,24,0.28)'; ctx.lineWidth = 0.6;
      ctx.beginPath(); ctx.moveTo(6, 4); ctx.lineTo(14, 43.2); ctx.moveTo(14, 46.8); ctx.lineTo(6, 86); ctx.stroke();
      poly(ctx, [N, [6, 4], [14, 43.2]], [1.6, 1.2, 1.2]); ctx.strokeStyle = 'rgba(80,50,30,0.16)'; ctx.lineWidth = 0.5; ctx.stroke();
      poly(ctx, [N, [14, 46.8], [6, 86]], [1.6, 1.2, 1.2]); ctx.stroke();
      print(ctx, F, 'AIR MAIL', 36, 61, 5.2, { label: true, weight: 700, color: 'rgba(181,69,42,0.22)', track: '1.2px' });
      grainAtop(ctx, this.w, this.h, 0.06);
    },
    ink(ctx, m) {
      // a doodled window: three portholes along the fuselage and a pilot waving from the first
      [[98, 38.4], [85, 37.8], [72, 37.2]].forEach(([x, y], i) => wobble(ctx, circlePts(x, y, 3.1, 12, 1), m, 720 + i, { width: 0.8 }));
      wobble(ctx, [[98, 36.8], [98.2, 37.6]], m, 731, { width: 1.2 });            // the pilot's eye
      wobble(ctx, [[96.8, 39.4], [98, 40.2], [99.4, 39.4]], m, 732, { width: 0.7 }); // and grin
      wobble(ctx, [[64, 40.6], [110, 42.4]], m, 733, { width: 0.6, alpha: 0.6 });   // a stripe down the side
    },
  });

  /* ----------------------------------------------------------------- pencil */
  items.push({
    id: 'pencil', w: 150, h: 12, shadow: 1.5, soft: true,
    wide: { m: [140, 378, -24], t: [150, 382, 0] }, tall: { m: [160, 552, 3], t: [160, 556, 0] },
    draw(ctx, F) {
      const y = 1.5, bh = 9;
      // the sharpened end: shaved wood with a scalloped paint line, and the graphite point
      ctx.beginPath(); ctx.moveTo(1, y + bh / 2); ctx.lineTo(19, y + 0.2); ctx.lineTo(19, y + bh - 0.2); ctx.closePath();
      const wg = ctx.createLinearGradient(0, y, 0, y + bh); wg.addColorStop(0, '#F3DDBD'); wg.addColorStop(0.5, '#DDB88B'); wg.addColorStop(1, '#B38D63'); ctx.fillStyle = wg; ctx.fill();
      ctx.strokeStyle = 'rgba(140,100,60,0.35)'; ctx.lineWidth = 0.35;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(5 + i * 3.4, y + bh / 2 - 0.6 - i * 0.9); ctx.lineTo(18, y + 1.2 + i * 0.3); ctx.stroke(); }   // knife marks
      ctx.beginPath(); ctx.moveTo(0, y + bh / 2); ctx.lineTo(6.5, y + bh / 2 - 1.6); ctx.lineTo(6.5, y + bh / 2 + 1.6); ctx.closePath();
      const lg = ctx.createLinearGradient(0, y + 2.9, 0, y + 6.1); lg.addColorStop(0, '#8E8A88'); lg.addColorStop(0.5, '#3E3A38'); lg.addColorStop(1, '#1E1B1A'); ctx.fillStyle = lg; ctx.fill();
      // the painted hexagonal barrel: three facets, the top one catching the window
      ctx.save();
      ctx.beginPath(); ctx.moveTo(19, y); for (let s = 0; s <= 3; s++) ctx.quadraticCurveTo(17.4, y + (s + 0.5) * bh / 3, 19, y + Math.min(bh, (s + 1) * bh / 3));
      ctx.lineTo(132, y + bh); ctx.lineTo(132, y); ctx.closePath(); ctx.clip();
      [['#F4CE58', 0], ['#E2AD2F', 1], ['#B9861C', 2]].forEach(([c, i]) => { ctx.fillStyle = c; ctx.fillRect(14, y + i * bh / 3, 120, bh / 3 + 0.2); });
      ctx.fillStyle = 'rgba(255,248,220,0.55)'; ctx.fillRect(14, y + 0.9, 120, 0.8);
      ctx.fillStyle = 'rgba(120,80,10,0.35)'; ctx.fillRect(14, y + bh / 3 - 0.2, 120, 0.4); ctx.fillRect(14, y + bh * 2 / 3 - 0.2, 120, 0.4);
      print(ctx, F, 'No. 2  HB', 38, y + 5.3, 4.4, { label: true, weight: 700, color: 'rgba(60,40,6,0.55)', track: '0.8px' });
      ctx.fillStyle = 'rgba(80,50,6,0.30)';   // tooth marks near the ferrule
      [[121, 2.2], [124.5, 8.6], [126, 2.6]].forEach(([x, yy]) => ctx.fillRect(x, y + yy - 1, 1.6, 0.9));
      ctx.restore();
      // the crimped ferrule and a well-used eraser
      rr(ctx, 131, y - 0.4, 11, bh + 0.8, 0.8); ctx.fillStyle = steel(ctx, 0, y - 0.4, 0, y + bh + 0.4); ctx.fill();
      ctx.fillStyle = 'rgba(70,64,58,0.45)'; [134, 136.2, 138.4].forEach(x => ctx.fillRect(x, y - 0.3, 0.5, bh + 0.6));
      rr(ctx, 141.5, y + 0.4, 8.2, bh - 0.8, 2.8);
      const eg = ctx.createLinearGradient(0, y, 0, y + bh); eg.addColorStop(0, '#F2B3B0'); eg.addColorStop(0.5, '#DC8E8E'); eg.addColorStop(1, '#A9606A'); ctx.fillStyle = eg; ctx.fill();
      ctx.fillStyle = 'rgba(80,70,72,0.30)'; ctx.fillRect(147.5, y + 1.2, 1.8, bh - 2.4);   // the grey worn tip
    },
  });

  return items;
}
