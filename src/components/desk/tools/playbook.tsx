"use client";

import "./tools-a.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { ToolFrame } from "@/components/desk/tool-frame";
import { Porthole } from "@/components/ui/lens-primitives";
import { cn } from "@/lib/utils";
import {
  PLAYBOOK_PAGES,
  PLAYBOOK_SECTIONS,
  type PlaybookPage,
  type PlaybookSection,
} from "./playbook-pages";

/**
 * The front desk playbook. This one genuinely works: every page below is
 * searched live in the browser, across title, keywords and every step, and a
 * page added from the empty state joins the search straight away (kept for
 * this visit only). The pages are sample content written for a one-dentist
 * PPO practice on Dentrix; the real thing holds the clinic's own procedures.
 */

const COMMON_QUESTIONS = ["group number", "copay", "no-show", "Delta Care"];
const DEMO_QUERY = "group number";

function matches(page: PlaybookPage, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [
    page.title,
    page.summary,
    page.section,
    page.keywords.join(" "),
    page.steps.join(" "),
    page.watchOut,
    page.source,
  ]
    .join(" ")
    .toLowerCase();
  // Every word typed has to appear somewhere on the page.
  return q.split(/\s+/).every((word) => hay.includes(word));
}

type Draft = { title: string; section: PlaybookSection; steps: string };

export function PlaybookTool({
  initialQuery,
  demo = false,
}: {
  /** Prefills the search box and runs the filter on mount. */
  initialQuery?: string;
  /** Self-running tour: types a search, then opens the first result. */
  demo?: boolean;
} = {}) {
  const [query, setQuery] = useState(initialQuery ?? "");
  const [openId, setOpenId] = useState<string | null>(null);
  const [added, setAdded] = useState<PlaybookPage[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  // Wide = list and page side by side. Narrow = one at a time, so a search
  // must not auto-open a page over the results the reader is looking at.
  const [wide, setWide] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pageRef = useRef<HTMLElement>(null);

  // A new initialQuery from the page replaces the search (adjusted during
  // render, the React way, rather than in an effect).
  const [seenInitial, setSeenInitial] = useState(initialQuery);
  if (initialQuery !== seenInitial) {
    setSeenInitial(initialQuery);
    setQuery(initialQuery ?? "");
    setOpenId(null);
    setDraft(null);
  }

  useEffect(() => {
    if (!demo) inputRef.current?.focus();
    const mq = window.matchMedia("(min-width: 600px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [demo]);

  // The tour: type the search a character at a time, then open the first hit.
  useEffect(() => {
    if (!demo) return;
    const timers: number[] = [];
    const start = 700;
    const step = 60;
    timers.push(
      window.setTimeout(() => {
        setQuery("");
        setOpenId(null);
      }, start - 20),
    );
    for (let i = 1; i <= DEMO_QUERY.length; i++) {
      timers.push(window.setTimeout(() => setQuery(DEMO_QUERY.slice(0, i)), start + i * step));
    }
    timers.push(
      window.setTimeout(
        () => {
          const first = PLAYBOOK_PAGES.find((p) => matches(p, DEMO_QUERY));
          if (first) setOpenId(first.id);
        },
        start + DEMO_QUERY.length * step + 450,
      ),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [demo]);

  const pages = useMemo(() => [...added, ...PLAYBOOK_PAGES], [added]);

  const results = useMemo(() => pages.filter((p) => matches(p, query)), [pages, query]);

  const grouped = useMemo(() => {
    const bySection = new Map<PlaybookSection, PlaybookPage[]>();
    for (const section of PLAYBOOK_SECTIONS) {
      const inSection = results.filter((p) => p.section === section);
      if (inSection.length) bySection.set(section, inSection);
    }
    return bySection;
  }, [results]);

  // Keep the open page in step with the search: if the typed words no longer
  // match the page on screen, show the first result instead (wide only).
  const open: PlaybookPage | null = useMemo(() => {
    if (openId) {
      const still = results.find((p) => p.id === openId);
      if (still) return still;
    }
    return wide && query.trim() && results.length ? results[0] : null;
  }, [openId, results, query, wide]);

  // Narrow widths: when a page replaces the list, bring its top into view.
  useEffect(() => {
    if (!wide && openId && pageRef.current) {
      pageRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [openId, wide]);

  const searching = query.trim().length > 0;
  const showPageOnly = open !== null; // narrow widths: page replaces the list

  function startDraft() {
    const typed = query.trim();
    setDraft({
      title: typed ? typed.charAt(0).toUpperCase() + typed.slice(1) : "",
      section: "Patients",
      steps: "",
    });
  }

  function saveDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!draft || !draft.title.trim()) return;
    const steps = draft.steps
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const page: PlaybookPage = {
      id: `added-${Date.now()}`,
      section: draft.section,
      title: draft.title.trim(),
      summary: steps[0] ?? "A new page, steps still to be written.",
      keywords: [],
      steps: steps.length ? steps : ["Steps still to be written."],
      watchOut: "",
      source: "Added at the desk today",
      updatedBy: "Lori",
      updated: "just now",
    };
    setAdded((a) => [page, ...a]);
    setDraft(null);
    setQuery(page.title);
    setOpenId(page.id);
  }

  return (
    <ToolFrame
      label="Front desk playbook"
      title="Everything the desk knows, one search away"
      note="Lori is learning the job from a 2004 Dentrix manual and a notebook of the last person's notes, with a patient in front of her. This is the book she wanted at her fingertips instead."
      status="working"
    >
      <div className="dta-search">
        <svg viewBox="0 0 18 18" aria-hidden="true">
          <circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          <path d="M11.8 11.8 16 16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          className="dta-input"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setDraft(null);
          }}
          placeholder={wide ? "Try: group number, Delta Care, copay, no-show" : "Try: group number, copay"}
          aria-label="Search the playbook"
          autoComplete="off"
          spellCheck={false}
        />
        {query ? (
          <button
            type="button"
            className="dta-search-clear"
            aria-label="Clear the search"
            onClick={() => {
              setQuery("");
              setOpenId(null);
              setDraft(null);
              inputRef.current?.focus();
            }}
          >
            <svg viewBox="0 0 12 12" aria-hidden="true">
              <path d="M2 2l8 8M10 2 2 10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </div>
      <p className="dta-search-count" aria-live="polite">
        {searching
          ? results.length === 0
            ? "No pages match"
            : `${results.length} of ${pages.length} pages`
          : `${pages.length} pages, in ${PLAYBOOK_SECTIONS.length} sections`}
      </p>

      {searching && results.length === 0 ? (
        draft ? (
          <form className="sai-tile dta-pb-draft" onSubmit={saveDraft}>
            <Porthole>New page</Porthole>
            <div className="dta-grid mt-4">
              <div className="dta-span">
                <label className="dta-label" htmlFor="pb-new-title">
                  Title
                </label>
                <input
                  id="pb-new-title"
                  className="dta-input"
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  autoComplete="off"
                  autoFocus
                />
              </div>
              <div className="dta-span">
                <label className="dta-label" htmlFor="pb-new-section">
                  Section
                </label>
                <select
                  id="pb-new-section"
                  className="dta-input"
                  value={draft.section}
                  onChange={(e) =>
                    setDraft({ ...draft, section: e.target.value as PlaybookSection })
                  }
                >
                  {PLAYBOOK_SECTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="dta-span">
                <label className="dta-label" htmlFor="pb-new-steps">
                  Steps, one per line
                </label>
                <textarea
                  id="pb-new-steps"
                  className="dta-input dta-pb-steps-input"
                  value={draft.steps}
                  onChange={(e) => setDraft({ ...draft, steps: e.target.value })}
                  placeholder={"Ask the patient for...\nOpen the Family File and..."}
                />
              </div>
            </div>
            <div className="dta-el-actions">
              <button type="submit" className="sai-btn primary dta-btn-sm" disabled={!draft.title.trim()}>
                Save the page
              </button>
              <button type="button" className="sai-btn ghost dta-btn-sm" onClick={() => setDraft(null)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="dta-pb-empty">
            <p>
              Not written down yet. Add it once, in plain words, and the next person finds it in
              a search.
            </p>
            <button type="button" className="sai-btn ghost dta-btn-sm" onClick={startDraft}>
              Add a page
            </button>
          </div>
        )
      ) : (
        <div className="dta-pb">
          <div className={cn("dta-pb-list", showPageOnly && "max-[599px]:hidden")}>
            {Array.from(grouped.entries()).map(([section, inSection]) => (
              <div key={section}>
                <div className="dta-pb-section">{section}</div>
                {inSection.map((page) => (
                  <button
                    key={page.id}
                    type="button"
                    className={cn("dta-pb-item", open?.id === page.id && "is-open")}
                    onClick={() => setOpenId(page.id)}
                    aria-current={open?.id === page.id ? "page" : undefined}
                  >
                    {page.title}
                    <span className="sub">{page.summary}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {open ? (
            <article
              ref={pageRef}
              className={cn("sai-tile dta-pb-page", !showPageOnly && "max-[599px]:hidden")}
            >
              <div className="dta-pb-back">
                <button
                  type="button"
                  className="sai-btn ghost dta-btn-sm"
                  onClick={() => setOpenId(null)}
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Back to the list
                </button>
              </div>
              <Porthole>{open.section}</Porthole>
              <h3 className="dta-pb-title">{open.title}</h3>
              <p className="dta-pb-meta">
                Updated by {open.updatedBy} · {open.updated}
              </p>
              <ol className="dta-steps">
                {open.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
              {open.watchOut ? (
                <p className="dta-runin dta-pb-watch">
                  <strong>Watch out.</strong> {open.watchOut}
                </p>
              ) : null}
              <p className="dta-pb-source">{open.source}</p>
            </article>
          ) : (
            <div className="dta-pb-idle max-[599px]:hidden">
              <p>Pick a page, or type what the patient just asked you.</p>
              <p className="dta-label mt-6">Common questions</p>
              <div className="dta-pb-quick">
                {COMMON_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="sai-btn ghost dta-btn-sm"
                    onClick={() => {
                      setQuery(q);
                      setOpenId(null);
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolFrame>
  );
}
