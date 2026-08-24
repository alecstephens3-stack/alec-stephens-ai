/* Desktop QA. The phone pass never looked at a wide viewport, which is how three
   pages shipped as a narrow ribbon down the middle of a laptop screen.
   Measures the used content width against the viewport at 1440px. */
import { chromium } from 'playwright';
import path from 'node:path';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
let bad = 0;
for (const f of process.argv.slice(2)) {
  const name = path.basename(f).replace(/\.html$/, '');
  const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(f), { waitUntil: 'networkidle' });
  await p.waitForTimeout(2500);
  const m = await p.evaluate(() => {
    // widest run of actual content, ignoring the full-bleed scene and page shell
    let widest = 0, who = '';
    for (const el of document.querySelectorAll('main *')) {
      const cs = getComputedStyle(el);
      if (cs.position === 'absolute' || cs.position === 'fixed') continue;
      if (!el.textContent.trim()) continue;
      const r = el.getBoundingClientRect();
      if (r.width > widest) { widest = r.width; who = el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0]; }
    }
    // how many sections actually use more than one column at this width
    let multiCol = 0;
    for (const el of document.querySelectorAll('main *')) {
      const t = getComputedStyle(el).gridTemplateColumns;
      if (t && t.split(' ').filter(x => x.endsWith('px')).length > 1) multiCol++;
    }
    return { widest: Math.round(widest), who, multiCol, h: document.documentElement.scrollHeight };
  });
  await p.screenshot({ path: `shots/${name}-1440.png`, fullPage: false });
  const problems = [];
  if (m.widest < 900) problems.push(`content only ${m.widest}px wide at 1440 (ribbon). widest=${m.who}`);
  if (m.multiCol < 3) problems.push(`only ${m.multiCol} multi-column groups at desktop`);
  if (problems.length) bad++;
  console.log(`${problems.length ? 'FAIL' : ' OK '}  ${name}  content=${m.widest}px  multiCol=${m.multiCol}  h=${m.h}` +
    (problems.length ? '\n        ' + problems.join('\n        ') : ''));
  await p.close();
}
await b.close();
process.exit(bad ? 1 : 0);
