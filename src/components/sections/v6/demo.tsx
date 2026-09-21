import { DEMO } from "@/lib/content";

type ToolIconName = (typeof DEMO.tools)[number]["icon"];

/** Line icons for the four decision tools, drawn to match the live app. */
function ToolIcon({ name }: { name: ToolIconName }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 20 20",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  switch (name) {
    case "doctor":
      return (
        <svg {...common}>
          <circle cx="10" cy="6.5" r="3" />
          <path d="M4 17c.9-3.3 3.2-5.2 6-5.2s5.1 1.9 6 5.2" />
        </svg>
      );
    case "price":
      return (
        <svg {...common}>
          <path d="M3 10.2V4a1 1 0 0 1 1-1h6.2l6.8 6.8a1 1 0 0 1 0 1.4l-5.8 5.8a1 1 0 0 1-1.4 0L3 10.2Z" />
          <circle cx="7" cy="7" r="1.2" />
        </svg>
      );
    case "bill":
      return (
        <svg {...common}>
          <path d="M5 2.8h10v14.4l-2.1-1.3-1.9 1.3-2-1.3-1.9 1.3L5 15.9V2.8Z" />
          <path d="M7.8 7h4.4M7.8 10h4.4" />
        </svg>
      );
    case "pulse":
      return (
        <svg {...common}>
          <path d="M2 10.5h3.4l2-5 3.2 9.5 2.1-4.5H18" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * The one demonstration on the page: the front desk app answering a real
 * question, drawn in its own sage colors. A real object, so it gets to be a
 * lifted surface. Trimmed from v5: the browser chrome dots, the nav pills and
 * two of the four chips are gone.
 */
export function Demo() {
  return (
    <figure className="relative m-0 mx-auto max-w-[760px]">
      {/* The crop marks sit on a wrapper: the card itself is overflow-hidden,
          which would clip them. */}
      <div className="draft-crop-frame">
      <div
        role="img"
        aria-label={`Illustration of the front desk app. The search box reads "${DEMO.query}". The answer page, "${DEMO.resultTitle}", says: ${DEMO.resultBody} Exception: ${DEMO.resultRule} Below it are four tools: ${DEMO.tools.map((t) => t.label).join(", ")}.`}
        className="relative overflow-hidden rounded-[22px] border border-white/90 bg-white shadow-[0_34px_74px_rgba(60,35,20,0.20),0_2px_8px_rgba(60,35,20,0.06)]"
      >
        <div className="bg-[linear-gradient(160deg,#35695A_0%,#2F5D4F_55%,#264C41_100%)] px-6 pb-14 pt-6 md:px-8">
          <div className="flex items-center gap-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-[7px] bg-white/15 text-white" aria-hidden="true">
              <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M4 5h12M4 10h12M4 15h7" />
              </svg>
            </span>
            <span className="font-label text-[15px] font-semibold tracking-[0.04em] text-white/85">{DEMO.app}</span>
          </div>
          <p className="mt-5 text-[22px] font-semibold leading-tight tracking-[-0.015em] text-white md:text-[26px]">
            {DEMO.heading}
          </p>
          <div className="mt-4 flex items-center gap-2.5 rounded-[12px] bg-white px-4 py-3 shadow-[0_8px_20px_rgba(10,30,24,0.28)]">
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="shrink-0">
              <circle cx="7" cy="7" r="4.75" stroke="#2F5D4F" strokeWidth="1.6" />
              <path d="M10.6 10.6 14 14" stroke="#2F5D4F" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <span className="text-[18px] text-[#1C2B27]">{DEMO.query}</span>
            <span aria-hidden="true" className="-ml-1 h-[20px] w-[1.5px] bg-[#2F5D4F] motion-safe:animate-pulse" />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {DEMO.chips.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[15px] font-medium text-white"
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative -mt-9 px-5 md:px-6">
          <div className="rounded-[16px] border border-[#E3EAE7] bg-white p-5 shadow-[0_16px_36px_rgba(31,58,50,0.16)] md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="text-[20px] font-semibold leading-tight tracking-[-0.01em] text-[#1C2B27]">
                {DEMO.resultTitle}
              </p>
              <span className="shrink-0 rounded-full bg-[#E4EDE8] px-3 py-1 font-label text-[15px] font-bold uppercase leading-none tracking-[0.08em] text-[#2F5D4F]">
                {DEMO.resultTag}
              </span>
            </div>
            <p className="mt-3 text-[18px] leading-[1.55] text-[#46554F]">{DEMO.resultBody}</p>
            <div className="mt-4 rounded-[10px] border-l-[3px] border-accent bg-[#FDF0E8] px-4 py-3">
              <p className="font-label text-[15px] font-bold uppercase tracking-[0.1em] text-accent-deep">Exception</p>
              <p className="mt-1.5 text-[18px] font-medium leading-[1.5] text-ink">{DEMO.resultRule}</p>
            </div>
            <p className="mt-4 text-[15px] leading-[1.5] text-[#5E6E68]">{DEMO.resultMeta}</p>
          </div>
        </div>

        <div className="px-5 pb-6 pt-6 md:px-6">
          <div className="grid gap-2.5 sm:grid-cols-2">
            {DEMO.tools.map((t) => (
              <div
                key={t.label}
                className="flex items-center gap-3 rounded-[12px] border border-[#E3EAE7] bg-[#F7FAF8] px-4 py-3"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#E4EDE8] text-[#2F5D4F]">
                  <ToolIcon name={t.icon} />
                </span>
                <span className="text-[18px] font-medium leading-snug text-[#1C2B27]">{t.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>
      <figcaption className="t-fine relative mt-6 max-w-[62ch]">{DEMO.caption}</figcaption>
    </figure>
  );
}
