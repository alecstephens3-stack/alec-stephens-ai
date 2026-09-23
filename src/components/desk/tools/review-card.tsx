"use client";

import "./tools-b.css";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import QRCode from "qrcode";
import { ToolFrame } from "@/components/desk/tool-frame";
import { cn } from "@/lib/utils";

/**
 * The printable QR review card. This one really works: the QR is drawn in the
 * browser from whatever link is typed in, Print puts the card alone on a
 * 5 by 7 inch sheet, and Download renders the whole card to a PNG.
 * Asked for on the Tri-Valley discovery call (2026-09-22): a printed code that
 * takes a patient straight to the review page instead of hunting for it.
 */

const DEFAULTS = {
  name: "Your practice name",
  url: "https://g.page/r/your-review-link",
  headline: "Enjoyed your visit?",
  line: "Scan to leave us a review. It takes a minute and it helps a small practice more than you know.",
};

const subscribeNever = () => () => {};
const useMounted = () =>
  useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false,
  );

function cssVar(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "review-card";
}

/** The card itself. Rendered twice: the live preview and the print copy. */
function Card({
  name,
  headline,
  line,
  qr,
  cardRef,
}: {
  name: string;
  headline: string;
  line: string;
  qr: string;
  cardRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="dtb-paper-wrap">
      <div className="dtb-paper" ref={cardRef}>
        <div>
          <div className="dtb-paper-name">{name || DEFAULTS.name}</div>
          <div className="dtb-paper-head">{headline || DEFAULTS.headline}</div>
        </div>
        {qr ? (
          // A data URL drawn in the browser; next/image has nothing to optimise here.
          // eslint-disable-next-line @next/next/no-img-element
          <img className="dtb-paper-qr" src={qr} alt="QR code for the review link" />
        ) : (
          <div className="dtb-paper-qr is-empty" aria-hidden="true" />
        )}
        <div className="dtb-paper-foot">
          <div className="dtb-paper-line">{line || DEFAULTS.line}</div>
          <div className="dtb-paper-thanks">Thank you</div>
        </div>
      </div>
    </div>
  );
}

export function ReviewCardTool({ demo = false }: { demo?: boolean } = {}) {
  const mounted = useMounted();
  const [name, setName] = useState(DEFAULTS.name);
  const [url, setUrl] = useState(DEFAULTS.url);
  const [headline, setHeadline] = useState(DEFAULTS.headline);
  const [line, setLine] = useState(DEFAULTS.line);
  const [qr, setQr] = useState("");
  const [busy, setBusy] = useState<"" | "png">("");
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Redraw the code a beat after typing stops.
  useEffect(() => {
    let alive = true;
    const t = window.setTimeout(() => {
      const text = url.trim() || DEFAULTS.url;
      QRCode.toDataURL(text, {
        errorCorrectionLevel: "M",
        margin: 1,
        width: 720,
        color: { dark: cssVar("--color-ink", "#171310"), light: "#00000000" },
      })
        .then((data) => {
          if (alive) setQr(data);
        })
        .catch(() => {
          if (alive) setQr("");
        });
    }, 160);
    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [url]);

  // The self-running tour retypes the headline, one letter at a time, so the
  // card is seen changing as it is typed.
  useEffect(() => {
    if (!demo) return;
    const target = "Thanks for coming in!";
    const ids: number[] = [];
    for (let i = 1; i <= target.length; i++) {
      ids.push(window.setTimeout(() => setHeadline(target.slice(0, i)), 700 + (i - 1) * 60));
    }
    return () => ids.forEach((id) => window.clearTimeout(id));
  }, [demo]);

  const print = () => {
    if (!qr) return;
    window.print();
  };

  /** Draw the card at 300 dpi (5 by 7 inches, 1500 by 2100 pixels) and save it. */
  const downloadPng = async () => {
    if (!qr || busy) return;
    setBusy("png");
    try {
      await document.fonts.ready;
      const W = 1500;
      const H = 2100;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no canvas");

      const card = cardRef.current;
      const faceOf = (sel: string, fallback: string) => {
        const el = card?.querySelector<HTMLElement>(sel);
        return el ? getComputedStyle(el).fontFamily : fallback;
      };
      const sans = faceOf(".dtb-paper-line", "Inter Tight, Helvetica Neue, Arial, sans-serif");
      const label = faceOf(".dtb-paper-name", "Schibsted Grotesk, Inter Tight, sans-serif");
      const heading = faceOf(".dtb-paper-head", sans);
      const cream = cssVar("--color-cream", "#F5F1E8");
      const ink = cssVar("--color-ink", "#171310");
      const ink2 = cssVar("--color-ink-2", "#5A4F46");
      const deep = cssVar("--color-accent-deep", "#8F3616");
      const rule = cssVar("--color-rule", "rgba(23, 19, 16, 0.10)");

      // 1 cqw on the card is 15px here.
      const u = 15;
      const wrap = (text: string, maxW: number) => {
        const lines: string[] = [];
        let cur = "";
        for (const w of text.split(/\s+/).filter(Boolean)) {
          const t = cur ? `${cur} ${w}` : w;
          if (ctx.measureText(t).width > maxW && cur) {
            lines.push(cur);
            cur = w;
          } else cur = t;
        }
        if (cur) lines.push(cur);
        return lines;
      };
      const spaced = (px: number) => {
        if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${px}px`;
      };

      ctx.fillStyle = cream;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = rule;
      ctx.lineWidth = 2;
      ctx.strokeRect(4 * u, 4 * u, W - 8 * u, H - 8 * u);
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";

      // Practice name
      let y = 9 * u + 4 * u;
      ctx.fillStyle = ink2;
      ctx.font = `600 ${4 * u}px ${label}`;
      spaced(4 * u * 0.14);
      for (const l of wrap((name || DEFAULTS.name).toUpperCase(), W - 16 * u)) {
        ctx.fillText(l, W / 2, y);
        y += 4 * u * 1.3;
      }
      spaced(0);

      // Headline
      y += 3 * u + 9 * u * 0.9;
      ctx.fillStyle = ink;
      ctx.font = `500 ${9 * u}px ${heading}`;
      spaced(-9 * u * 0.025);
      const headLines = wrap(headline || DEFAULTS.headline, W - 16 * u);
      for (const l of headLines) {
        ctx.fillText(l, W / 2, y);
        y += 9 * u * 1.05;
      }
      spaced(0);

      // Footer block, measured from the bottom up so the code sits between.
      ctx.font = `400 ${5 * u}px ${sans}`;
      const lineLines = wrap(line || DEFAULTS.line, 78 * u);
      const lineH = 5 * u * 1.4;
      const thanksBase = H - 8 * u;
      const lastLineBase = thanksBase - 3.9 * u - 5 * u;
      const firstLineBase = lastLineBase - (lineLines.length - 1) * lineH;
      const footTop = firstLineBase - 5 * u;

      // QR, centered in what is left between the headline and the footer.
      const qrSize = 48 * u;
      const img = new Image();
      img.src = qr;
      await img.decode();
      const headBottom = y - 9 * u * 1.05 + 2.5 * u;
      const qrTop = headBottom + (footTop - headBottom - qrSize) / 2;
      ctx.drawImage(img, (W - qrSize) / 2, qrTop, qrSize, qrSize);

      // Second line
      let fy = firstLineBase;
      ctx.fillStyle = ink2;
      ctx.font = `400 ${5 * u}px ${sans}`;
      for (const l of lineLines) {
        ctx.fillText(l, W / 2, fy);
        fy += lineH;
      }
      // Thank you
      ctx.fillStyle = deep;
      ctx.font = `600 ${3.9 * u}px ${label}`;
      spaced(3.9 * u * 0.14);
      ctx.fillText("THANK YOU", W / 2, thanksBase);
      spaced(0);

      const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/png"));
      if (!blob) throw new Error("no blob");
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `${slug(name)}-review-card.png`;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    } catch {
      // Fall back to the code on its own.
      const a = document.createElement("a");
      a.href = qr;
      a.download = `${slug(name)}-review-qr.png`;
      a.click();
    } finally {
      setBusy("");
    }
  };

  return (
    <ToolFrame
      label="Review card"
      title="A review, one scan after checkout"
      note="Patients who go hunting for the review page on their phone never finish, so the card sits at the desk and in the treatment room, and the code takes them straight there."
      status="working"
      footer={
        <p className="dtb-fine">
          The code is drawn here in your browser from the link you type. Print puts the card alone on a 5 by 7 inch sheet; the PNG is the same card at print resolution.
        </p>
      }
    >
      <div className="dtb-rc-grid">
        <div>
          <div className="dtb-field">
            <label className="dtb-k" htmlFor="dtb-rc-name">
              Practice name
            </label>
            <input
              id="dtb-rc-name"
              className="dtb-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={60}
            />
          </div>
          <div className="dtb-field">
            <label className="dtb-k" htmlFor="dtb-rc-url">
              Review link
            </label>
            <input
              id="dtb-rc-url"
              className="dtb-input"
              type="url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              spellCheck={false}
            />
            <span className="dtb-fine">
              Google Business Profile has an &ldquo;Ask for reviews&rdquo; button that copies this link. Yelp and Healthgrades links work the same way.
            </span>
          </div>
          <div className="dtb-field">
            <label className="dtb-k" htmlFor="dtb-rc-head">
              Headline
            </label>
            <input
              id="dtb-rc-head"
              className="dtb-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              maxLength={48}
            />
          </div>
          <div className="dtb-field">
            <label className="dtb-k" htmlFor="dtb-rc-line">
              Second line
            </label>
            <textarea
              id="dtb-rc-line"
              className="dtb-input"
              rows={3}
              value={line}
              onChange={(e) => setLine(e.target.value)}
              maxLength={160}
            />
          </div>
        </div>

        <div className="dtb-rc-preview">
          <Card name={name} headline={headline} line={line} qr={qr} cardRef={cardRef} />
          <div className="dtb-actions dtb-rc-actions">
            <button type="button" className="sai-btn primary dtb-btn" onClick={print} disabled={!qr}>
              Print the card
            </button>
            <button
              type="button"
              className={cn("sai-btn ghost dtb-btn")}
              onClick={downloadPng}
              disabled={!qr || busy !== ""}
            >
              {busy === "png" ? "Drawing" : "Download PNG"}
            </button>
          </div>
        </div>
      </div>

      {mounted
        ? createPortal(
            <div className="dtb-print-only" aria-hidden="true">
              <Card name={name} headline={headline} line={line} qr={qr} />
            </div>,
            document.body,
          )
        : null}
    </ToolFrame>
  );
}
