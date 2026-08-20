const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  fs.mkdirSync('thumbs', { recursive: true });
  for (const f of fs.readdirSync('.').filter(x => /^\d\d.*\.page\.html$/.test(x)).sort()) {
    // deviceScaleFactor 0.5 renders at 1280 and emits a 640-wide image, so the
    // desktop layout is what gets captured, just at half the pixels.
    const p = await b.newPage({ viewport: { width: 1280, height: 1040 }, deviceScaleFactor: 0.5 });
    await p.goto('file://' + path.resolve(f), { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(2200);
    const out = 'thumbs/' + f.replace('.page.html', '.jpg');
    await p.screenshot({ path: out, type: 'jpeg', quality: 74 });
    console.log(`  ${out}  ${Math.round(fs.statSync(out).size/1024)}KB`);
    await p.close();
  }
  await b.close();
})();
