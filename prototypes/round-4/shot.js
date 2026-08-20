const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = process.argv[2], SHOTS = process.argv[3];
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  for (const f of fs.readdirSync(DIR).filter(x => x.endsWith('.page.html')).sort()) {
    const errs = [];
    const page = await b.newPage({ viewport: { width: 1280, height: 900 } });
    page.on('pageerror', e => errs.push(e.message));
    await page.goto('file://' + path.join(DIR, f), { waitUntil: 'networkidle' });
    await page.waitForTimeout(900);
    const w1280 = await page.evaluate(() => document.documentElement.scrollWidth);
    const h = await page.evaluate(() => document.body.scrollHeight);
    await page.screenshot({ path: `${SHOTS}/${f.replace('.page.html','')}-top.png` });
    await page.setViewportSize({ width: 390, height: 800 });
    await page.waitForTimeout(400);
    const w390 = await page.evaluate(() => document.documentElement.scrollWidth);
    const stem = f.replace('.page.html','');
    console.log(`${stem.padEnd(18)} w1280=${String(w1280).padEnd(5)} w390=${String(w390).padEnd(5)} pageH=${String(h).padEnd(6)} jsErr=${errs.length}`);
    await page.close();
  }
  await b.close();
})();
