// Bans the "tinted card with a coloured bar down the left" callout (Alec: retired 2026-06-08,
// "banned forever" 2026-09-22). It is the default every LLM emits, so it reads as AI-generated.
// Use corner crop-marks (.draft-crop / .sai-callout) or a plain run-in sentence instead.
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ["src"];
const SKIP = /node_modules|\.next|lens-hero\.js$/;
const bad = [];

function walk(p) {
  if (SKIP.test(p)) return;
  const st = statSync(p);
  if (st.isDirectory()) return readdirSync(p).forEach((f) => walk(join(p, f)));
  const ext = extname(p);
  if (![".tsx", ".ts", ".jsx", ".js", ".css", ".html", ".mdx"].includes(ext)) return;
  const text = readFileSync(p, "utf8");
  const lines = text.split("\n");

  // Tailwind: one class string carrying a left border of 2px or more AND a background fill.
  lines.forEach((line, i) => {
    for (const m of line.matchAll(/["'`]([^"'`]*(?:^|[\s:])border-l-(?:\[(?:[2-9]|\d{2,})px\]|[2-8])(?=[\s"'`])[^"'`]*)["'`]/g)) {
      if (/\bbg-/.test(m[1])) bad.push(`${p}:${i + 1}  left bar + fill: ${m[1].trim().slice(0, 90)}`);
    }
  });

  // CSS: a rule with a solid left border of 2px+ and a background, that is not a corner mark
  // (corner marks also set border-top or border-bottom and live on ::before / ::after).
  if (ext === ".css" || ext === ".html") {
    for (const m of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const sel = m[1].trim(), body = m[2];
      if (!/border-left:\s*(?:[2-9]|\d{2,})px\s+solid/.test(body)) continue;
      if (/::?(before|after)/.test(sel) || /border-(top|bottom):/.test(body)) continue;
      if (/background(-color)?:/.test(body)) {
        const ln = text.slice(0, m.index).split("\n").length;
        bad.push(`${p}:${ln}  left bar + fill in CSS rule: ${sel.slice(0, 70)}`);
      }
    }
  }
}

roots.forEach(walk);
if (bad.length) {
  console.error("Banned callout (tinted box with a left bar):\n" + bad.map((b) => "  " + b).join("\n"));
  process.exit(1);
}
console.log("no left-bar callouts");
