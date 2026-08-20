/* Functional check for the three shared widgets on a built round 5 page.
 *
 * Screenshot QA proves a page LOOKS right. This proves the widgets WORK, which
 * a screenshot cannot see: the time off request reaching payroll, the knowledge
 * base filter, and the ReExam sequence stopping when a patient books.
 *
 *   node verify.js /tmp/r5/31-search-first.page.html
 */
const { chromium } = require('playwright');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

(async () => {
  const file = process.argv[2];
  if (!file) { console.error('usage: node verify.js <built page>'); process.exit(2); }

  const b = await chromium.launch({ executablePath: CHROME });
  const page = await b.newPage({ viewport: { width: 1280, height: 950 } });
  const jsErrors = [];
  page.on('pageerror', e => jsErrors.push(e.message));
  await page.goto('file://' + file, { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  const fails = [];
  const check = (what, got, want) => {
    if (got !== want) fails.push(`${what}: got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);
  };

  // --- time off request -------------------------------------------------
  await page.selectOption('#opsPick', 'covered');
  await page.click('#opsFile');
  await page.waitForTimeout(120);
  const covered = await page.textContent('#opsRead');
  if (!/payroll updated in the same pass/i.test(covered)) {
    fails.push(`timeoff: the covered path did not reach payroll (got ${covered})`);
  }
  await page.selectOption('#opsPick', 'gap');
  await page.waitForTimeout(120);
  const cleared = await page.textContent('#opsRead');
  if (!/nothing filed yet/i.test(cleared)) {
    fails.push(`timeoff: changing the request did not clear the old answer (got ${cleared})`);
  }
  await page.click('#opsFile');
  await page.waitForTimeout(120);
  const gap = await page.textContent('#opsRead');
  if (!/short one person/i.test(gap)) {
    fails.push(`timeoff: the uncovered path did not name the gap (got ${gap})`);
  }

  // --- knowledge base ---------------------------------------------------
  await page.fill('#kbq', 'no card');
  await page.waitForTimeout(200);
  await page.press('#kbq', 'Enter');
  await page.waitForTimeout(200);
  const open = await page.evaluate(() =>
    [...document.querySelectorAll('[data-kb-page]')].filter(p => !p.hidden).map(p => p.dataset.title));
  check('kb.openPage', open.join(','), 'Patient arrives with no card');

  await page.fill('#kbq', 'zzzz');
  await page.waitForTimeout(200);
  const none = await page.textContent('#kbCount');
  if (!/still have to write/.test(none)) fails.push('kb: empty state message missing');

  // --- ReExam -----------------------------------------------------------
  for (let i = 0; i < 3; i++) { await page.click('#rxNext'); await page.waitForTimeout(60); }
  const at3 = await page.textContent('#rxRead');
  if (!/email only/i.test(at3)) fails.push(`reexam: day 10 is not flagged email only (got ${at3})`);
  await page.click('#rxBooks');
  await page.waitForTimeout(80);
  const booked = await page.textContent('#rxRead');
  if (!/stopped/i.test(booked)) fails.push(`reexam: booking did not stop the sequence (got ${booked})`);

  // --- layout -----------------------------------------------------------
  for (const w of [1280, 390]) {
    await page.setViewportSize({ width: w, height: 900 });
    await page.waitForTimeout(250);
    const sw = await page.evaluate(() => document.documentElement.scrollWidth);
    if (sw > w) fails.push(`layout: horizontal overflow at ${w}px (scrollWidth ${sw})`);
  }

  if (jsErrors.length) fails.push(`jsErrors: ${jsErrors.slice(0, 3).join(' | ')}`);

  const name = file.split('/').pop().replace('.page.html', '');
  console.log(fails.length ? `  FAIL  ${name}` : `  ok    ${name}`);
  fails.forEach(f => console.log(`          ${f}`));
  await b.close();
  process.exit(fails.length ? 1 : 0);
})();
