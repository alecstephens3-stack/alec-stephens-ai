const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  fs.mkdirSync('full', { recursive: true });
  let total = 0;
  for (const f of fs.readdirSync('.').filter(x => /^\d\d.*\.page\.html$/.test(x)).sort()) {
    const p = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
    await p.goto('file://' + path.resolve(f), { waitUntil: 'domcontentloaded' });
    await p.waitForTimeout(2400);
    const out = 'full/' + f.replace('.page.html', '.jpg');
    await p.screenshot({ path: out, type: 'jpeg', quality: 54, fullPage: true });
    const kb = Math.round(fs.statSync(out).size/1024); total += kb;
    console.log(`  ${out.padEnd(30)} ${String(kb).padStart(4)}KB`);
    await p.close();
  }
  console.log(`  total ${total}KB`);
  await b.close();
})();
