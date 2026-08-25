"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { DEPICTION } from "@/lib/content";

/**
 * A small, honest depiction of the product: a search box and the answer it
 * returns. The live instance holds a client's real prices and rules, so this
 * shows the interaction rather than real client data.
 *
 * It plays itself. A query types, the list narrows to the page that answers it,
 * a cursor opens that page, it rests, then it replays. Nothing is asked of the
 * visitor, because the reader we care about is on a phone between patients and
 * will not press anything to find out what we sell.
 *
 * Three things keep that from being annoying:
 *   - it only runs while it is actually on screen
 *   - prefers-reduced-motion gets the finished state, drawn once, no loop
 *   - the answer card holds its space at all times, so the hero never reflows
 */

const TYPE_MS = 55;
const AFTER_TYPE_MS = 420;
const CURSOR_TRAVEL_MS = 620;
const TAP_MS = 150;
const REST_MS = 5200;

/**
 * A media query is external state, so it is subscribed to rather than copied
 * into state from an effect. The server snapshot assumes motion is fine; the
 * first client render corrects it before anything animates.
 */
function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
}

type Phase = "typing" | "filtering" | "opening" | "resting";

export function ProductDepiction() {
  const rootRef = useRef<HTMLElement | null>(null);
  const targetRef = useRef<HTMLLIElement | null>(null);
  const cursorRef = useRef<HTMLSpanElement | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const [typed, setTyped] = useState("");
  // First frame is the finished state, the same one prefers-reduced-motion
  // gets. A reader who lands on the demo mid-type sees a half typed query
  // and an empty answer card, which reads as broken rather than as a demo.
  const [phase, setPhase] = useState<Phase>("resting");
  const primedRef = useRef(false);
  const [primed, setPrimed] = useState(false);
  const [cursorOn, setCursorOn] = useState(false);
  const [tapping, setTapping] = useState(false);
  const still = usePrefersReducedMotion();

  const { title, query, results, answer } = DEPICTION;
  const matchId = results[0].id;

  useEffect(() => {
    if (still) return;

    const at = (ms: number, fn: () => void) => {
      timers.current.push(setTimeout(fn, ms));
    };
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };

    const run = () => {
      clear();
      setTyped("");
      setPhase("typing");
      setCursorOn(false);
      setTapping(false);

      let i = 0;
      const step = () => {
        if (i > query.length) return afterType();
        setTyped(query.slice(0, i));
        i += 1;
        at(TYPE_MS, step);
      };
      step();

      const afterType = () => {
        at(AFTER_TYPE_MS, () => {
          setPhase("filtering");
          setCursorOn(true);
          at(CURSOR_TRAVEL_MS, () => {
            setTapping(true);
            at(TAP_MS, () => {
              setTapping(false);
              setPhase("opening");
              at(320, () => setCursorOn(false));
              at(REST_MS, run);
            });
          });
        });
      };
    };

    const el = rootRef.current;
    if (!el) return;

    // A demo playing to a background tab is just battery.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (!primedRef.current) {
              primedRef.current = true;
              at(1400, () => {
                setPrimed(true);
                run();
              });
            } else {
              run();
            }
          }
          else {
            clear();
            setTyped("");
            setPhase("typing");
            setCursorOn(false);
          }
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clear();
    };
  }, [query, still]);

  // Walk the cursor to the row it is about to open.
  useEffect(() => {
    if (!cursorOn || still) return;
    const root = rootRef.current;
    const target = targetRef.current;
    const cursor = cursorRef.current;
    if (!root || !target || !cursor) return;
    const r = root.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    cursor.style.transform = `translate(${t.left - r.left + 30}px, ${t.top - r.top + 14}px)`;
  }, [cursorOn, still]);

  const shownQuery = still || !primed ? query : typed;
  const answerOpen = still || phase === "opening" || phase === "resting";
  const filtered = still || phase !== "typing";

  return (
    <figure
      className="relative m-0"
      ref={rootRef as React.RefObject<HTMLElement>}
      aria-label={`${title}. A search for "${query}" returns the page "${answer.title}": ${answer.lines.join(" ")}`}
    >
      {/* The whole depiction is decorative to assistive tech: the figure label
          above says what it shows, so nothing has to announce a half typed
          string on every loop. */}
      <div className="sai-pane rounded-window p-3.5 md:p-4" aria-hidden="true">
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.14)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.10)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.07)]" />
          <span className="ml-2 text-[13px] font-medium text-ink-2">{title}</span>
        </div>

        <div className="flex items-center gap-2.5 rounded-tile border border-[rgba(255,255,255,0.9)] bg-white/85 px-3.5 py-3 shadow-[inset_0_1px_0_#fff]">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <circle cx="7" cy="7" r="4.75" stroke="#DC6843" strokeWidth="1.6" />
            <path
              d="M10.6 10.6 14 14"
              stroke="#DC6843"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="text-[15px] text-ink" data-kb="query" data-kb-full={query}>
            {shownQuery}
            {!still && (
              <span
                aria-hidden="true"
                data-kb="caret"
                className="ml-px inline-block h-[1.05em] w-[1.5px] translate-y-[0.15em] bg-ink motion-safe:animate-[sai-caret_1s_steps(1)_infinite]"
              />
            )}
          </span>
        </div>

        {/* The result list. It narrows to the page that answers the query. */}
        <ul className="mt-2 grid gap-0.5">
          {results.map((r) => {
            const isMatch = r.id === matchId;
            const gone = filtered && !isMatch;
            return (
              <li
                key={r.id}
                data-kb="row"
                data-kb-match={isMatch ? "1" : undefined}
                ref={isMatch ? targetRef : undefined}
                className={
                  // Non matches dim rather than collapse. Collapsing them changed
                  // the figure height by 79px on every loop, which shifted the
                  // whole hero while someone was reading it.
                  "rounded-chip px-3 py-2.5 text-[14px] leading-[1.4] transition-all duration-[220ms] ease-brand " +
                  (gone ? "text-ink-2 opacity-25 " : "text-ink-2 opacity-100 ") +
                  (isMatch && filtered
                    ? "bg-accent-soft !text-ink ring-1 ring-accent-line"
                    : "")
                }
              >
                {r.label}
              </li>
            );
          })}
        </ul>

        {/* Always in flow, so opening it never reflows the hero. */}
        <div
          data-kb="answer"
          className={
            "mt-3 rounded-tile border border-[rgba(255,255,255,0.9)] bg-white/72 p-4 shadow-[inset_0_1px_0_#fff,0_6px_18px_rgba(112,62,40,0.07)] transition-opacity duration-[220ms] ease-brand " +
            (answerOpen ? "opacity-100" : "opacity-0")
          }
        >
          <p className="font-heading text-[17px] font-medium leading-tight text-ink">
            {answer.title}
          </p>
          {answer.lines.map((line, i) => (
            <p
              key={i}
              className={
                (i === 0 ? "mt-2 text-ink-2" : "mt-2.5 text-ink") +
                " text-[14.5px] leading-[1.55]"
              }
            >
              {line}
            </p>
          ))}
          <p className="mt-3 text-[13px] leading-[1.5] text-ink-2">{answer.meta}</p>
        </div>
      </div>

      {!still && (
        <span
          ref={cursorRef}
          aria-hidden="true"
          className={
            "pointer-events-none absolute left-0 top-0 h-[19px] w-[14px] bg-ink transition-[transform,opacity] duration-[620ms] ease-brand " +
            (cursorOn ? "opacity-70 " : "opacity-0 ") +
            (tapping ? "scale-75" : "")
          }
          style={{
            clipPath:
              "polygon(0 0, 0 15px, 4px 11.5px, 6.5px 17px, 9px 16px, 6.5px 10.5px, 11px 10.5px)",
          }}
        />
      )}
    </figure>
  );
}
