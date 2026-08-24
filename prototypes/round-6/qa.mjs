/* Round 6 screenshot QA. Phone first, so 390px is the case that matters.
   Checks overflow, height, contrast-critical text presence, and that the
   self playing demo actually reaches its answer state. */
import { chromium } from 'playwright';
import path from 'node:path';

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const files = process.argv.slice(2);
const b = await chromium.launch({ executablePath: CHROME });
let bad = 0;

for (const f of files) {
  const name = path.basename(f).replace(/\.html$/, '');
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = [];
  p.on('pageerror', e => errs.push(String(e).slice(0, 120)));
  // Google Fonts is unreachable from this container but IS allowed in published
  // artifacts, so a font CDN failure here is not a page defect.
  p.on('console', m => {
    if (m.type() !== 'error') return;
    const t = m.text();
    if (/fonts\.(googleapis|gstatic)\.com/.test(t) || /ERR_CONNECTION_RESET/.test(t)) return;
    errs.push('console: ' + t.slice(0, 120));
  });

  await p.goto('file://' + path.resolve(f), { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);

  const m = await p.evaluate(() => {
    const de = document.documentElement;
    // any element wider than the viewport is a horizontal-scroll bug
    const over = [];
    for (const el of document.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      // Only count it if nothing above it clips: decorative scene blobs are
      // deliberately oversized and live inside overflow:hidden.
      let clipped = false;
      for (let n = el.parentElement; n; n = n.parentElement) {
        if (getComputedStyle(n).overflow !== 'visible') { clipped = true; break; }
      }
      if (!clipped && r.width > 392 && r.right > 392) {
        over.push((el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
          ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '')) + ' w=' + Math.round(r.width));
      }
      if (over.length > 6) break;
    }
    return {
      scrollW: de.scrollWidth, scrollH: de.scrollHeight,
      h1: document.querySelectorAll('h1').length,
      demo: !!document.querySelector('[data-kb-demo]'),
      faq: document.querySelectorAll('.faqrow').length,
      openFaq: document.querySelectorAll('.faqrow[open]').length,
      seq: document.querySelectorAll('.rxseq-item').length,
      over: [...new Set(over)],
    };
  });

  // let the demo play: type + click + open
  await p.waitForTimeout(4200);
  const demoState = await p.evaluate(() => {
    const pg = document.querySelector('.kbdemo-page');
    const rows = document.querySelectorAll('.kbdemo-results li:not([data-out])');
    const typed = document.querySelector('.kbdemo-typed');
    // Check what the user can actually SEE, not just the class. The class was
    // present while a leftover hidden attribute kept display:none, so the demo
    // typed, filtered and clicked with no payoff, and QA called it green.
    const vis = pg && pg.getBoundingClientRect().height > 40 &&
                getComputedStyle(pg).visibility !== 'hidden' &&
                getComputedStyle(pg).display !== 'none' &&
                parseFloat(getComputedStyle(pg).opacity) > 0.5;
    return { answerOpen: !!vis, answerH: pg ? Math.round(pg.getBoundingClientRect().height) : 0,
             visibleRows: rows.length, typed: typed ? typed.textContent : null };
  });

  await p.screenshot({ path: `shots/${name}-390.png`, fullPage: true });
  await p.close();

  const problems = [];
  if (m.scrollW > 392) problems.push(`H-OVERFLOW scrollWidth=${m.scrollW}`);
  // The ~4,500px target came from 04-PAGE-SPEC, written before the client asked
  // for substantially more information in the knowledge base and operations
  // sections. 06 + 07 is roughly 1,900 words; at a 350px measure that is about
  // 6,200px of type before a single heading, widget or band of padding. So the
  // old threshold is no longer reachable without cutting sanctioned copy, and
  // this is a raised bar, not a met one. Desktop is the case that improved:
  // the multi-column groups bring the same content in at about 6,100 to 6,500px.
  if (m.scrollH > 10000) problems.push(`TALL ${m.scrollH}px at 390px`);
  if (m.over.length) problems.push('wide: ' + m.over.join(', '));
  if (m.h1 !== 1) problems.push(`h1 count=${m.h1}`);
  if (!m.demo) problems.push('no KB demo');
  if (m.openFaq > 0) problems.push(`FAQ not drawn closed (${m.openFaq} open)`);
  if (m.seq !== 6) problems.push(`sequence items=${m.seq}`);
  if (demoState.answerOpen !== true) problems.push('demo never opened its answer');
  if (demoState.visibleRows !== 3) problems.push(`results visible=${demoState.visibleRows}, expected 3`);
  if (demoState.typed !== 'no insurance card') problems.push(`typed="${demoState.typed}"`);
  if (errs.length) problems.push('JS: ' + errs.slice(0, 2).join(' | '));

  if (problems.length) bad++;
  console.log(`${problems.length ? 'FAIL' : ' OK '}  ${name}  ${m.scrollH}px tall  faq=${m.faq}` +
    (problems.length ? '\n        ' + problems.join('\n        ') : ''));
}
await b.close();
process.exit(bad ? 1 : 0);
