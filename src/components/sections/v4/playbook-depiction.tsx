/**
 * A depiction of the playbook as the front desk sees it: search, a situation
 * answer, and the exception the decision tool forces open.
 *
 * Deliberately generic content. The live instance holds a client's real
 * pricing and insurance rules and none of that belongs on a public page.
 * The interaction pattern shown here is the real one.
 */
export function PlaybookDepiction() {
  return (
    <figure className="m-0">
      <div className="sai-pane sai-streak rounded-window p-3.5 md:p-4">
        {/* window chrome */}
        <div className="relative mb-3 flex items-center gap-2 px-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.14)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.10)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.07)]" />
          <span className="ml-2 font-label text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink-2">
            Front Desk Playbook
          </span>
        </div>

        {/* search */}
        <div className="relative flex items-center gap-2.5 rounded-tile border border-[rgba(255,255,255,0.9)] bg-white/85 px-3.5 py-3 shadow-[inset_0_1px_0_#fff]">
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
          <span className="text-[15px] text-ink">
            vision plan, medical complaint
          </span>
          <span className="ml-auto hidden font-label text-[11.5px] font-semibold uppercase tracking-[0.06em] text-ink-2 sm:inline">
            3 results
          </span>
        </div>

        {/* answer card */}
        <div className="mt-3 rounded-tile border border-[rgba(255,255,255,0.9)] bg-white/72 p-4 shadow-[inset_0_1px_0_#fff,0_6px_18px_rgba(112,62,40,0.07)]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-heading text-[17px] font-medium leading-tight text-ink">
              Refraction: collect or bill
            </h3>
            <span className="inline-flex overflow-hidden rounded-chip border border-[rgba(46,122,86,0.28)] font-label text-[11.5px] font-semibold uppercase tracking-[0.05em]">
              <span className="bg-[rgba(46,122,86,0.12)] px-2 py-1 text-[#2E7A56]">
                Answer
              </span>
              <span className="bg-white/70 px-2 py-1 text-ink">Collect</span>
            </span>
          </div>

          <p className="mt-2.5 text-[14.5px] leading-[1.55] text-ink-2">
            The vision plan covers the refraction only when the visit bills as a
            routine exam.
          </p>

          {/* the exception the tool forces open */}
          <div className="mt-3 rounded-flag border-l-[3px] border-l-accent bg-[rgba(220,104,67,0.07)] py-2.5 pl-3 pr-3">
            <p className="font-label text-[11.5px] font-semibold uppercase tracking-[0.06em] text-accent">
              Exception
            </p>
            <p className="mt-1 text-[14.5px] leading-[1.5] text-ink">
              If the visit bills medical, the refraction is not covered. Collect
              at checkout.
            </p>
          </div>

          <p className="mt-3 font-label text-[11.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
            Updated 4 days ago by your office manager
          </p>
        </div>
      </div>

      <figcaption className="mt-3 text-center font-label text-[12.5px] font-semibold uppercase tracking-[0.05em] text-ink-2">
        The playbook, as the front desk sees it
      </figcaption>
    </figure>
  );
}
