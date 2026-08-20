/* Layout audit for built round 5 pages.
 *
 * Three defects that build.py, lint.py and verify.js all pass while the page
 * is visibly wrong:
 *   1. content painted underneath the fixed dock at initial scroll
 *   2. text below the 13px floor
 *   3. real content clipped by an overflow container
 *
 * Scene decoration (the night ember, the drifting lenses, the tint pools) is
 * excluded from (3) because it is designed to bleed and be clipped.
 *
 *   node audit.js /tmp/r5/*.page.html
 */
const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of process.argv.slice(2)) {
    const page = await b.newPage({ viewport: { width: 1280, height: 950 } });
    await page.goto('file://' + f, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const out = { dockOverlap: null, tiny: [], clipped: [] };
      const dock = document.querySelector('.sai-dock');
      const dr = dock.getBoundingClientRect();
      // anything painted under the fixed dock at initial scroll
      for (const el of document.querySelectorAll('main *')) {
        const b = el.getBoundingClientRect();
        if (b.height === 0 || b.width === 0) continue;
        if (b.top < dr.bottom && b.bottom > dr.top && b.left < dr.right && b.right > dr.left) {
          if (el.textContent.trim() && el.children.length === 0) {
            out.dockOverlap = out.dockOverlap || el.textContent.trim().slice(0, 40);
          }
        }
      }
      // type floor
      for (const el of document.querySelectorAll('main *')) {
        if (!el.textContent.trim() || el.children.length) continue;
        const fs = parseFloat(getComputedStyle(el).fontSize);
        if (fs && fs < 13) out.tiny.push(`${fs}px "${el.textContent.trim().slice(0, 28)}"`);
      }
      // Horizontally clipped CONTENT. Scene decoration (the night ember, the
      // drifting lenses, the tint pools) is meant to bleed and be clipped by
      // its container, so overflow from those is by design, not a defect.
      const DECOR = /sai-(ember|lens|tint|streak)/;
      for (const el of document.querySelectorAll('main *')) {
        if (el.scrollWidth <= el.clientWidth + 2) continue;
        if (getComputedStyle(el).overflowX !== 'hidden') continue;
        const box = el.getBoundingClientRect();
        const real = [...el.querySelectorAll('*')].some(c => {
          if (DECOR.test(c.className.toString()) || c.getAttribute('aria-hidden') === 'true') return false;
          if (!c.textContent.trim()) return false;
          const b = c.getBoundingClientRect();
          return b.width > 0 && (b.right > box.right + 1 || b.left < box.left - 1);
        });
        if (real) out.clipped.push(el.className.toString().slice(0, 40));
      }
      return out;
    });
    const name = f.split('/').pop().replace('.page.html', '');
    const bad = r.dockOverlap || r.tiny.length || r.clipped.length;
    console.log(`${bad ? 'FAIL ' : 'ok   '} ${name.padEnd(26)}` +
      (r.dockOverlap ? ` dockOverlap="${r.dockOverlap}"` : '') +
      (r.tiny.length ? ` tiny=${r.tiny.slice(0,2).join('; ')}` : '') +
      (r.clipped.length ? ` clipped=${r.clipped.slice(0,2).join('; ')}` : ''));
    await page.close();
  }
  await b.close();
})();
