import { chromium } from 'playwright';
import path from 'node:path';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
const failed = [];
p.on('requestfailed', r => failed.push(r.url().slice(0, 90) + '  ' + (r.failure()?.errorText || '')));
await p.goto('file://' + path.resolve('built/41.html'), { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
console.log('failed requests:'); failed.forEach(f => console.log('  ' + f));
const r = await p.evaluate(() => {
  const el = document.querySelector('.sai-tint.t1');
  const cs = el && getComputedStyle(el);
  const de = document.documentElement, bd = document.body;
  // find the nearest ancestor that clips
  let clipper = null, n = el && el.parentElement;
  while (n) { const s = getComputedStyle(n);
    if (s.overflow !== 'visible' || s.position === 'fixed') { clipper = n.tagName + '.' + (n.className||'') + ' overflow=' + s.overflow; break; }
    n = n.parentElement; }
  return {
    tintPos: cs && cs.position, tintZ: cs && cs.zIndex, tintRect: el && JSON.parse(JSON.stringify(el.getBoundingClientRect())),
    clipper,
    docScrollW: de.scrollWidth, bodyScrollW: bd.scrollWidth, innerW: window.innerWidth,
    htmlOverflowX: getComputedStyle(de).overflowX, bodyOverflowX: getComputedStyle(bd).overflowX,
    canScrollX: de.scrollWidth > de.clientWidth,
    fontFamilyH1: document.querySelector('h1') && getComputedStyle(document.querySelector('h1')).fontFamily,
  };
});
console.log(JSON.stringify(r, null, 2));
await b.close();
