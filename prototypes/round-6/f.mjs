import { chromium } from 'playwright';
import path from 'node:path';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('file://' + path.resolve('built/41.html'), { waitUntil: 'domcontentloaded' });
await p.waitForTimeout(2500);
console.log(JSON.stringify(await p.evaluate(() => {
  const g = s => { const e = document.querySelector(s); if (!e) return null;
    const c = getComputedStyle(e); return { fs: c.fontSize, fw: c.fontWeight, ff: c.fontFamily.split(',')[0], lh: c.lineHeight }; };
  return { badge: g('.kbdemo-badge'), flag: g('.kbdemo-flag'), meta: g('.kbdemo-meta'),
           pageP: g('.kbdemo-page p'), result: g('.kbdemo-results li'), h1: g('h1') };
}), null, 1));
await b.close();
