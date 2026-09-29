"use client";

import "./build-card.css";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { BracketStamp, BubbleList } from "@/components/ui/lens-primitives";
import { cn } from "@/lib/utils";
import { SITE, type BuildCase } from "./cases";

/**
 * The window for one build on Alec's bench. It replaces the two-sided card of
 * the old /alec page: "The build" is the business side (the number, the
 * screenshot, what was broken, what I built, what changed), "The engineering"
 * is the back of the card. Every word comes from cases.yaml via cases.ts.
 *
 * It renders inside DeskWindow, which owns the glass pane, the close button
 * and the scroll. Layout answers to the window's width (container queries),
 * so it reads the same in a 760px pane and on a 340px phone.
 */
export function BuildCard({ c }: { c: BuildCase }) {
  const [side, setSide] = useState<"build" | "eng">("build");
  const uid = useId();
  const rootRef = useRef<HTMLElement>(null);
  const titleId = `${uid}-title`;
  const panelId = `${uid}-panel`;

  const flip = (next: "build" | "eng") => {
    if (next === side) return;
    setSide(next);
    // Keep the switch in view: if the reader flipped from further down, bring
    // the top of the new side back up inside the window's own scroll.
    const sw = rootRef.current?.querySelector<HTMLElement>(".bc-switch");
    if (!sw) return;
    const scroller = sw.closest(".dw-scroll");
    const top = scroller ? scroller.getBoundingClientRect().top : 0;
    if (sw.getBoundingClientRect().top < top) sw.scrollIntoView({ block: "start" });
  };

  return (
    <article className="bc" aria-labelledby={titleId} ref={rootRef}>
      <header className="bc-head">
        <BracketStamp>{c.kicker}</BracketStamp>
        <h2 id={titleId} className="t-title bc-title">
          {c.title}
        </h2>
        <p className="bc-meta">
          <span>{c.client_short}</span>
          <span aria-hidden="true"> · </span>
          <span>{c.shipped}</span>
          <span aria-hidden="true"> · </span>
          <span>{c.duration}</span>
        </p>
      </header>

      <div className="bc-switch" role="group" aria-label="Which side of this build">
        <button
          type="button"
          className={cn("bc-seg", side === "build" && "is-on")}
          aria-pressed={side === "build"}
          aria-controls={panelId}
          onClick={() => flip("build")}
        >
          The build
        </button>
        <button
          type="button"
          className={cn("bc-seg", side === "eng" && "is-on")}
          aria-pressed={side === "eng"}
          aria-controls={panelId}
          onClick={() => flip("eng")}
        >
          The engineering
        </button>
      </div>

      <div id={panelId} className="bc-side" key={side}>
        {side === "build" ? <BuildSide c={c} /> : <EngineeringSide c={c} />}
      </div>

      <footer className="bc-foot">
        <p className="bc-role">
          <b>My role.</b> {c.attribution}
        </p>
        <div className="bc-acts">
          <Link className="sai-btn primary" href={`/alec/${c.slug}`}>
            Open the full page
          </Link>
          <a className="sai-btn ghost" href={SITE.calendly} target="_blank" rel="noopener noreferrer">
            Talk to us
          </a>
        </div>
      </footer>
    </article>
  );
}

function Figure({ v, unit, className }: { v: string; unit: string; className: string }) {
  return (
    <span className={className}>
      {v}
      {unit ? <span className="bc-unit"> {unit}</span> : null}
    </span>
  );
}

function BuildSide({ c }: { c: BuildCase }) {
  return (
    <>
      <div className="bc-figures">
        <div className="bc-fig is-main">
          <Figure v={c.number.value} unit={c.number.unit} className="bc-v" />
          <span className="bc-l">{c.number.label}</span>
          {c.number.basis ? <p className="bc-basis">{c.number.basis}</p> : null}
        </div>
        <div className="bc-fig is-second">
          <Figure v={c.second.value} unit={c.second.unit} className="bc-v" />
          <span className="bc-l">{c.second.label}</span>
        </div>
      </div>

      {c.media.hero ? (
        <figure className="bc-shot">
          {/* Static webp pairs already sized for the page (1600 + 800); next/image adds nothing here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={c.media.hero}
            srcSet={`${c.media.hero.replace(/\.webp$/, "-800.webp")} 800w, ${c.media.hero} 1600w`}
            sizes="(max-width: 800px) 92vw, 700px"
            width={1600}
            height={1200}
            alt={c.media.alt ?? ""}
            loading="lazy"
            decoding="async"
          />
          {c.media.caption ? <figcaption>{c.media.caption}</figcaption> : null}
        </figure>
      ) : c.slug === "curriculum-system" ? (
        <CurriculumFigure />
      ) : null}

      <p className="bc-pull">{c.oneliner}</p>

      <section className="bc-sec">
        <h3 className="bc-h">What was broken</h3>
        <p className="bc-p">{c.broken}</p>
      </section>

      <section className="bc-sec">
        <h3 className="bc-h">What I built</h3>
        <BubbleList className="bc-list" items={c.built} />
      </section>

      <section className="bc-sec">
        <h3 className="bc-h">What changed</h3>
        <table className="bc-table">
          <thead>
            <tr>
              <th scope="col">
                <span className="bc-sr">What</span>
              </th>
              <th scope="col">Before</th>
              <th scope="col">After</th>
            </tr>
          </thead>
          <tbody>
            {c.changed.map((r) => (
              <tr key={r.k}>
                <th scope="row">{r.k}</th>
                <td data-label="Before">{r.before}</td>
                <td data-label="After">{r.after}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="bc-note">
          <b>Where the numbers come from.</b> {c.math_note}
        </p>
      </section>

      {c.quote ? (
        <blockquote className="bc-quote">
          <p>&ldquo;{c.quote.text}&rdquo;</p>
          <footer>{c.quote.who}</footer>
        </blockquote>
      ) : null}

      {c.compliance ? (
        <p className="bc-p bc-comp">
          <b>Compliance.</b> {c.compliance}
        </p>
      ) : null}
    </>
  );
}

function EngineeringSide({ c }: { c: BuildCase }) {
  const e = c.engineer;
  return (
    <>
      <p className="bc-p bc-users">
        <b>Who uses it.</b> {c.users}.
      </p>
      <dl className="bc-eng">
        <div className="is-wide">
          <dt>Architecture</dt>
          <dd>{e.architecture}</dd>
        </div>
        <div>
          <dt>Where it runs</dt>
          <dd>{e.runs_where}</dd>
        </div>
        <div>
          <dt>Tests and evals</dt>
          <dd>{e.tests}</dd>
        </div>
        <div>
          <dt>Cost</dt>
          <dd>{e.cost}</dd>
        </div>
        <div>
          <dt>Guardrails</dt>
          <dd>{e.guardrails}</dd>
        </div>
      </dl>

      <div className="draft-crop is-block bc-tradeoff">
        <h3 className="bc-h">The tradeoff we chose</h3>
        <p className="bc-p">{e.tradeoff}</p>
      </div>

      {e.repo || e.repo_note ? (
        <section className="bc-sec">
          <h3 className="bc-h">Code</h3>
          {e.repo ? (
            <p className="bc-p">
              <a className="bc-repo" href={e.repo} target="_blank" rel="noopener noreferrer">
                {e.repo.replace(/^https?:\/\//, "")}
              </a>
            </p>
          ) : null}
          {e.repo_note ? <p className="bc-note">{e.repo_note}</p> : null}
        </section>
      ) : null}

      <section className="bc-sec">
        <h3 className="bc-h">Stack</h3>
        <ul className="bc-chips">
          {c.stack.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </section>

      {c.links.length ? (
        <div className="bc-links">
          {c.links.map((l) => (
            <a key={l.url} className="sai-btn ghost" href={l.url} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          ))}
        </div>
      ) : null}
    </>
  );
}

/** The one build with no screenshot: the same production line, before and after. */
function CurriculumFigure() {
  return (
    <figure className="bc-shot bc-drawn">
      <svg
        viewBox="0 0 360 232"
        role="img"
        aria-label="Share of the curriculum work: before, all by hand; after, about 80 percent by AI with a human last pass"
      >
        <text x="0" y="18" className="lbl">BEFORE · 2020</text>
        <rect x="0" y="30" width="360" height="48" rx="10" className="frame" />
        <text x="14" y="60" className="txt">All of it written by hand</text>
        <text x="0" y="118" className="lbl">AFTER · 2024</text>
        <rect x="0" y="130" width="360" height="48" rx="10" className="frame" />
        <rect x="0" y="130" width="288" height="48" rx="10" className="share" />
        <text x="14" y="160" className="txt">~80% drafted by the pipeline</text>
        <text x="298" y="160" className="txt sm">Human</text>
        <line x1="288" y1="186" x2="288" y2="206" className="tick" />
        <text x="288" y="226" textAnchor="middle" className="lbl acc">~80%</text>
      </svg>
      <figcaption>The same production line, before and after. Width is share of the work.</figcaption>
    </figure>
  );
}
