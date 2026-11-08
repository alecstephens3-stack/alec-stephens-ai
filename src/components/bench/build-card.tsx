"use client";

import "./build-card.css";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { SITE, type BuildCase, type FlowStep, type Img, type Result } from "./cases";

/**
 * The window a build opens in on Alec's bench: "the stage turns" (V2, Alec's pick, 8 Nov 2026).
 *
 * The first view is a glance, about 40 to 60 words: the name, the status, one line, the lead
 * number, and the product on a framed stage. Under the words, a short menu. Each entry turns the
 * stage into that view in place (the flow step by step with its screens, what changed, their
 * words, the engineering) while the stage keeps its size. A highlight glides to the chosen entry.
 *
 * Every word comes from cases.yaml through cases.ts. It renders inside DeskWindow, which owns the
 * glass pane, the close button and the scroll.
 */

type ViewId = "see" | "how" | "changed" | "words" | "eng";

function menuFor(c: BuildCase): { id: ViewId; label: string }[] {
  const m: { id: ViewId; label: string }[] = [{ id: "see", label: c.media.animation ? "See it working" : "See it" }];
  if (c.flow.length) m.push({ id: "how", label: "How it works" });
  const changed = c.before_after.length > 0 || c.results.length > 1;
  if (changed || c.built.length) m.push({ id: "changed", label: changed ? "What changed" : "What I built" });
  if (c.quote) m.push({ id: "words", label: "In their words" });
  m.push({ id: "eng", label: "Engineering" });
  return m;
}

/** The live scene only where it reads well: a fine pointer, a wide screen, motion allowed. */
const LIVE_Q = "(min-width: 641px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
function useMedia(q: string) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [q]);
  return on;
}

export function BuildCard({ c }: { c: BuildCase }) {
  const menu = menuFor(c);
  const [view, setView] = useState<ViewId>("see");
  const idx = Math.max(0, menu.findIndex((m) => m.id === view));
  const a = c.media.animation;
  const ratio = a ? a.w / a.h : c.media.hero.w / c.media.hero.h;
  const lead = c.results[0];
  const stageRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  // A sheet longer than the stage scrolls inside it; mark it so its foot fades instead of cutting text.
  useEffect(() => {
    const el = viewRef.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    const check = () => {
      el.classList.remove("is-overflow");
      if (el.scrollHeight > el.clientHeight + 2) el.classList.add("is-overflow");
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [view]);
  const pick = (id: ViewId) => {
    setView(id);
    // On a phone the menu sits under the stage: bring the stage back into view so the tap shows something.
    if (window.matchMedia("(max-width: 640px)").matches) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Land on the lead number when there is one, so its line is never cut under the close button.
      const target = (stageRef.current?.parentElement?.querySelector(".bc-lead") as HTMLElement | null) ?? stageRef.current;
      requestAnimationFrame(() => target?.scrollIntoView({ block: "start", behavior: smooth ? "smooth" : "auto" }));
    }
  };

  return (
    <article
      className={cn("bc", view !== "see" && "is-tall")}
      aria-labelledby={`bc-${c.slug}`}
      style={{ ["--i" as string]: idx, ["--ratio" as string]: ratio }}
    >
      <div className="bc-words">
        <h2 id={`bc-${c.slug}`} className="bc-name">{c.name.replace(/-/g, "\u2011")}</h2>
        <StatusChip status={c.status} />
        <p className="bc-line">{c.line}</p>
        {lead ? <Figure r={lead} lead basis={false} className="bc-lead" /> : null}

        <nav className="bc-menu" aria-label={`More about ${c.name}`}>
          <span className="bc-menu-glide" aria-hidden="true" />
          {menu.map((m) => (
            <button key={m.id} type="button" aria-pressed={view === m.id} className={cn(view === m.id && "on")} onClick={() => pick(m.id)}>
              <span>{m.label}</span>
              <Chevron />
            </button>
          ))}
        </nav>
        <a className="bc-page" href={`/alec/${c.slug}`}>
          Full page
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M5 11l6-6M6 5h5v5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      <div className="bc-stage" ref={stageRef}>
        <div className="bc-frame" aria-live="polite">
          <div className="bc-view" key={view} ref={viewRef}>
            {view === "see" ? <See c={c} /> : null}
            {view === "how" ? <Steps c={c} ratio={ratio} /> : null}
            {view === "changed" ? <Changed c={c} /> : null}
            {view === "words" ? <Words c={c} /> : null}
            {view === "eng" ? <Eng c={c} /> : null}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ── the views ───────────────────────────────────────────────────────────────── */

function See({ c }: { c: BuildCase }) {
  const live = useMedia(LIVE_Q);
  const phone = useMedia("(max-width: 640px)");
  const a = c.media.animation;
  if (!a) {
    const ph = c.media.hero.phone;
    if (phone && ph) return <TallFigure img={ph} alt={c.media.hero.alt} />;
    return <Shot img={c.media.hero} alt={c.media.hero.alt} eager className="bc-see" />;
  }
  if (live) return <Scene a={a} />;
  const p = phone ? a.poster.phone : a.poster.desktop;
  return (
    // Posters are single stills sized for their slot; next/image adds nothing here.
    // eslint-disable-next-line @next/next/no-img-element
    <img className="bc-poster" src={p.src} width={p.w} height={p.h} alt={a.title} loading="eager" fetchPriority="high" decoding="async" />
  );
}

/** A dense figure's stacked phone twin: its top shows, and one tap opens the whole thing. */
function TallFigure({ img, alt }: { img: Img; alt: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("bc-app bc-tall", open && "is-open")}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} width={img.w} height={img.h} alt={alt} loading="eager" fetchPriority="high" decoding="async" />
      <button type="button" className="bc-tall-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
        {open ? "Show less" : "Show all"}
      </button>
    </div>
  );
}

/** The scene is drawn for its own width and reflows below it, so it renders at that size and is scaled to the box. */
function Scene({ a }: { a: NonNullable<BuildCase["media"]["animation"]> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / a.w));
    ro.observe(el);
    return () => ro.disconnect();
  }, [a.w]);
  return (
    <div ref={ref} className="bc-scene" style={{ aspectRatio: `${a.w} / ${a.h}` }}>
      <iframe src={`/animations/${a.scene}/index.html`} title={a.title} style={{ width: a.w, height: a.h, transform: `scale(${scale})` }} />
    </div>
  );
}

function Steps({ c, ratio }: { c: BuildCase; ratio: number }) {
  const [on, setOn] = useState(0);
  const fine = useRef(false);
  useEffect(() => {
    fine.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  }, []);
  const st = c.flow[on];
  return (
    <div className="bc-steps" style={{ ["--sn" as string]: c.flow.length }}>
      <div className="bc-steps-rail" role="group" aria-label="Step by step">
        {c.flow.map((f, i) => (
          <button
            key={f.step}
            type="button"
            aria-pressed={on === i}
            className={cn(on === i && "on")}
            onClick={() => setOn(i)}
            onMouseEnter={() => { if (fine.current) setOn(i); }}
          >
            {f.step}
          </button>
        ))}
      </div>
      {st ? (
        <div className="bc-steps-shot" key={on}>
          <StepPicture c={c} f={st} ratio={ratio} />
        </div>
      ) : null}
      {st ? (
        <p className="bc-steps-note" key={`n${on}`}>
          <b>{st.step}</b> {st.how}
        </p>
      ) : null}
    </div>
  );
}

function StepPicture({ c, f, ratio }: { c: BuildCase; f: FlowStep; ratio: number }) {
  const a = c.media.animation;
  if (f.shows.kind === "anim") {
    if (!a) return null;
    const p = a.poster.desktop;
    return (
      <div className="bc-app">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="bc-fill" src={p.src} width={p.w} height={p.h} alt={a.title} decoding="async" />
      </div>
    );
  }
  const s = f.shows;
  return <Shot img={s} alt={f.step} crop={s.crop ? [s.crop[0], s.crop[1], s.crop[2], Math.round(s.crop[2] / ratio)] : undefined} fit={!s.crop} />;
}

function Changed({ c }: { c: BuildCase }) {
  const rest = c.results.slice(1);
  return (
    <div className="bc-sheet bc-changed">
      {rest.map((r) => <Figure key={r.label} r={r} className="bc-second" />)}
      {c.before_after.length ? <BeforeAfter rows={c.before_after} /> : null}
      <ul className={cn("bc-built", c.built.length === 4 ? "is-four" : "is-stack")}>
        {c.built.map((b) => (
          <li key={b.lead}>
            <h3>{b.lead}</h3>
            <p>{b.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Words({ c }: { c: BuildCase }) {
  return (
    <div className="bc-words-view">
      {c.quote ? (
        <figure className="bc-quote">
          <blockquote>{c.quote.text}</blockquote>
          <figcaption>{c.quote.who}</figcaption>
        </figure>
      ) : null}
      <Foot c={c} />
    </div>
  );
}

function Eng({ c }: { c: BuildCase }) {
  const e = c.eng;
  const facts: [string, string | undefined][] = [
    ["How it fits together", e.architecture],
    ["Tested", e.tests],
    ["Cost to run", e.cost],
    ["Runs on", e.runs_where],
  ];
  return (
    <div className="bc-sheet bc-eng">
      <p className="bc-choice">{e.choice}</p>
      <dl className="bc-facts">
        {facts
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
      </dl>
      <ul className="bc-chips" aria-label="Stack">
        {c.stack.map((s) => <li key={s}>{s}</li>)}
      </ul>
      {c.repos.length ? (
        <div className="bc-repos">
          {c.repos.map((r) => <RepoCard key={r.url} url={r.url} />)}
        </div>
      ) : null}
      {!c.quote ? <Foot c={c} /> : null}
    </div>
  );
}

/* ── pieces ──────────────────────────────────────────────────────────────────── */

function Foot({ c }: { c: BuildCase }) {
  return (
    <div className="bc-foot">
      <p className="bc-role">{c.role}</p>
      <div className="bc-acts">
        <a className="sai-btn primary" href={SITE.calendly} target="_blank" rel="noopener noreferrer">Talk to me</a>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path d="M6 3.5l4.5 4.5L6 12.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** A ledger status chip: the keyword on a tint, the rest as the fact. Never a dot-pill. */
function StatusChip({ status }: { status: string }) {
  const m = status.match(/^(Live|Early access|Delivered|Passing practice runs|In daily use|Runs every pay period)\b\s*(.*)$/);
  // A status that isn't one of the state keywords (a date range, say) is a plain fact: no tinted keyword.
  if (!m) {
    return (
      <span className="bc-status">
        <span className="detail">{status}</span>
      </span>
    );
  }
  return (
    <span className="bc-status">
      <span className="kw">{m[1]}</span>
      {m[2] ? <span className="detail">{m[2]}</span> : null}
    </span>
  );
}

/** A result in display type. The whole figure, unit included, is one colour. */
function Figure({ r, lead = false, basis = true, className }: { r: Result; lead?: boolean; basis?: boolean; className?: string }) {
  return (
    <div className={cn("bc-fig", lead && "is-lead", className)}>
      <p className="bc-fig-n">
        {r.value}
        {r.unit ? <span className="bc-fig-u"> {r.unit}</span> : null}
      </p>
      <p className="bc-fig-l">{r.label}</p>
      {basis && r.basis ? <p className="bc-fig-b">{r.basis}</p> : null}
    </div>
  );
}

function BeforeAfter({ rows }: { rows: BuildCase["before_after"] }) {
  return (
    <div className="bc-ba" role="table" aria-label="Before and after">
      <div className="bc-ba-head" role="row">
        <span role="columnheader"><span className="bc-sr">What</span></span>
        <span role="columnheader">Before</span>
        <span role="columnheader">After</span>
      </div>
      {rows.map((r) => (
        <div className="bc-ba-row" role="row" key={r.k}>
          <span role="rowheader" className="bc-ba-k">{r.k}</span>
          <span role="cell" className="bc-ba-was">{r.before}</span>
          <span role="cell" className="bc-ba-now">{r.after}</span>
        </div>
      ))}
    </div>
  );
}

function RepoCard({ url }: { url: string }) {
  const [owner, name] = url.replace(/^https?:\/\/(www\.)?github\.com\//, "").split("/");
  return (
    <a className="bc-repo" href={url} target="_blank" rel="noopener noreferrer">
      <svg width="22" height="22" viewBox="0 0 16 16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        />
      </svg>
      <span className="bc-repo-nm">
        <span className="bc-repo-ow">{owner} /</span>
        <span>{name}</span>
      </span>
    </a>
  );
}

/** A screen, a crop of one ([x, y, w, h] in its own pixels), or the whole screen fitted to the stage. */
function Shot({
  img,
  alt,
  crop,
  fit = false,
  eager = false,
  className,
}: {
  img: Img;
  alt: string;
  crop?: [number, number, number, number];
  fit?: boolean;
  eager?: boolean;
  className?: string;
}) {
  const small = img.src.replace(/\.webp$/, "-800.webp");
  const srcSet = `${small} 800w, ${img.src} ${img.w}w`;
  const load = eager ? ({ loading: "eager", fetchPriority: "high" } as const) : ({ loading: "lazy" } as const);
  if (crop) {
    const [x, y, w, h] = crop;
    return (
      <div className={cn("bc-app", className)}>
        <div className="bc-crop" style={{ aspectRatio: `${w} / ${h}` }} role="img" aria-label={alt}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img.src}
            srcSet={srcSet}
            sizes="(max-width: 640px) 160vw, 1100px"
            alt=""
            decoding="async"
            {...load}
            style={{ width: `${(img.w / w) * 100}%`, left: `${(-x / w) * 100}%`, top: `${(-y / h) * 100}%` }}
          />
        </div>
      </div>
    );
  }
  return (
    <div className={cn("bc-app", fit && "is-fit", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img.src} srcSet={srcSet} sizes="(max-width: 640px) 92vw, 680px" width={img.w} height={img.h} alt={alt} decoding="async" {...load} />
    </div>
  );
}
