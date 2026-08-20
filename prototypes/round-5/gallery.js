/* Build the round 5 gallery: one browsable page of all ten directions.
 *
 * Thumbnails are captured and embedded as data URIs rather than shown in live
 * frames. That is not a preference. Every Lens pane uses backdrop-filter, which
 * composites unreliably inside an embedded document, and when it fails it does
 * not degrade: it takes the whole document down to a blank sheet of sky.
 * Captures always draw. The live page is one click away per direction.
 *
 *   node gallery.js <builtDir> <out.html>
 */
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');

const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

const META = {
  '31-search-first':          ['Search First',           'The search box is the entire pitch. Everything else is evidence it generalises.', '7719f5bf-6ffd-4da7-a246-776bf5655e4e'],
  '32-the-spreadsheet':       ['The Spreadsheet',        'The practice runs on a workbook, a binder, and whoever remembers the rest.',      'd80aee6f-14c1-44c0-8bcb-e4169dffff50'],
  '33-the-year':              ['The Year',               'One practice’s year, on a spine where every entry is dated.',                'dbacf652-e062-4a2b-8ec7-5aa0eabce43e'],
  '34-three-desks':           ['Three Desks',            'Front desk, the list nobody works, the back office. One product each.',           'eb108e35-bb9f-429d-a2ab-e4a0786ef0a8'],
  '35-the-insurance-question':['The Insurance Question', 'Leads on the insurance pages, and says plainly what we never do.',                '58d6206d-ffde-44b5-8c41-548e284b789a'],
  '36-objections-first':      ['Objections First',       'The questions come first. The products are evidence for the answers.',            '9c8d14d1-c786-491d-87b7-7b8d7c19f364'],
  '37-the-ledger':            ['The Ledger',             'Counted, not claimed. No average, and nothing without a number behind it.',       '3631818e-0327-4c01-93d2-ca54f39ad60e'],
  '38-day-one':               ['Day One',                'What a new hire gets handed, and what they get handed instead.',                  'ddfb7771-b3c8-4252-aab1-9dd46ca1605a'],
  '39-the-night-deck':        ['The Night Deck',         'Dark led. Three lines open after the doors close.',                               'faac0b57-aded-485c-9b7e-b356bd6d1b00'],
  '40-the-console':           ['The Console',            'Three instruments, near zero prose. All three drive.',                            '32b86c68-c243-476c-a971-3c86e08241ad'],
};

(async () => {
  const [dir, out] = process.argv.slice(2);
  const b = await chromium.launch({ executablePath: CHROME });
  const cards = [];

  for (const stem of Object.keys(META)) {
    const file = path.join(dir, `${stem}.page.html`);
    if (!fs.existsSync(file)) { console.log(`  missing ${stem}`); continue; }
    const page = await b.newPage({ viewport: { width: 1280, height: 1000 }, deviceScaleFactor: 1 });
    await page.goto('file://' + file, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1100);
    const buf = await page.screenshot({ type: 'jpeg', quality: 68 });
    const [name, bet, id] = META[stem];
    cards.push({ stem, name, bet, id, src: `data:image/jpeg;base64,${buf.toString('base64')}` });
    console.log(`  captured ${stem}  ${Math.round(buf.length / 1024)}KB`);
    await page.close();
  }
  await b.close();

  const html = `<title>Round 5 Directions</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600&family=Schibsted+Grotesk:wght@600;700&display=swap" rel="stylesheet">
<style>
:root { color-scheme: light; --ink:#171310; --ink2:#5A4F46; --acc:#8F3616; --line:rgba(23,19,16,.12); }
body { background:#F5E9DE; color:var(--ink); font-family:'Inter Tight',system-ui,sans-serif; margin:0; }
.wrap { max-width:1180px; margin:0 auto; padding:56px 24px 80px; }
.kicker { font-family:'Schibsted Grotesk',system-ui,sans-serif; font-size:13.5px; font-weight:700;
  letter-spacing:.08em; text-transform:uppercase; color:var(--acc); margin:0 0 14px; }
h1 { font-size:clamp(30px,4vw,46px); font-weight:500; letter-spacing:-.025em; line-height:1.08; margin:0 0 16px; max-width:20ch; text-wrap:balance; }
.lede { font-size:17px; line-height:1.62; color:var(--ink2); max-width:64ch; margin:0 0 10px; }
.note { font-size:15px; line-height:1.6; color:var(--ink2); max-width:64ch; margin:0 0 44px; padding-top:14px; border-top:1px solid var(--line); }
.grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(330px,1fr)); gap:38px 30px; }
.card { display:flex; flex-direction:column; gap:11px; text-decoration:none; color:inherit; }
.shot { border:1px solid var(--line); border-radius:14px; overflow:hidden; background:#F5E9DE;
  box-shadow:0 10px 30px rgba(112,62,40,.11); transition:transform 240ms cubic-bezier(.2,.8,.2,1), box-shadow 240ms cubic-bezier(.2,.8,.2,1); }
.card:hover .shot, .card:focus-visible .shot { transform:translateY(-4px); box-shadow:0 18px 40px rgba(112,62,40,.18); }
.card:focus-visible { outline:2px solid var(--acc); outline-offset:6px; border-radius:16px; }
.shot img { display:block; width:100%; height:auto; }
.n { font-family:'Schibsted Grotesk',system-ui,sans-serif; font-size:13.5px; font-weight:700; letter-spacing:.06em; color:var(--acc); }
.t { font-size:19px; font-weight:500; letter-spacing:-.018em; }
.b { font-size:15.5px; line-height:1.55; color:var(--ink2); }
@media (max-width:600px){ .wrap{padding:38px 17px 60px;} .grid{gap:30px;} }
@media (prefers-reduced-motion:reduce){ .shot{transition:none;} }
</style>
<main class="wrap">
  <p class="kicker">Stephens AI · Round 5 · 2026-08-20</p>
  <h1>Ten directions, one base.</h1>
  <p class="lede">All ten are built on prototype 21, the direction you picked. Its knowledge base
  search and its questions accordion are shared parts spliced into every page, so they are
  literally the same code in all ten and cannot drift. What changes between them is the argument.</p>
  <p class="note">Product 3 is time off and payroll. Every page builds, lints and functionally
  verifies clean, with no JS errors and no horizontal scroll at 1280 or 390. Click any
  direction to open the real page and drive the widgets.</p>
  <div class="grid">
${cards.map(c => `    <a class="card" href="https://claude.ai/code/artifact/${c.id}">
      <span class="shot"><img src="${c.src}" alt="${c.name}, top of the page"></span>
      <span class="n">${c.stem.split('-')[0]}</span>
      <span class="t">${c.name}</span>
      <span class="b">${c.bet}</span>
    </a>`).join('\n')}
  </div>
</main>
`;
  fs.writeFileSync(out, html);
  console.log(`\n  wrote ${out}  ${Math.round(html.length / 1024)}KB`);
})();
