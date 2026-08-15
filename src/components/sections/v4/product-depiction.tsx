/**
 * A small, honest depiction of the product: a search box and the answer it
 * returns. The live instance holds a client's real prices and rules, so this
 * shows the interaction rather than real client data.
 */
export function ProductDepiction() {
  return (
    <figure className="m-0">
      <div className="sai-pane rounded-window p-3.5 md:p-4">
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.14)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.10)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[rgba(23,19,16,0.07)]" />
          <span className="ml-2 text-[13px] font-medium text-ink-2">
            Front desk knowledge base
          </span>
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
          <span className="text-[15px] text-ink">vision plan, medical complaint</span>
        </div>

        <div className="mt-3 rounded-tile border border-[rgba(255,255,255,0.9)] bg-white/72 p-4 shadow-[inset_0_1px_0_#fff,0_6px_18px_rgba(112,62,40,0.07)]">
          <p className="font-heading text-[17px] font-medium leading-tight text-ink">
            Refraction: collect or bill
          </p>
          <p className="mt-2 text-[14.5px] leading-[1.55] text-ink-2">
            The vision plan covers the refraction only when the visit bills as a
            routine exam.
          </p>
          <p className="mt-2.5 text-[14.5px] leading-[1.55] text-ink">
            Exception: if the visit bills medical, the refraction is not covered.
            Collect at checkout.
          </p>
          <p className="mt-3 text-[13px] leading-[1.5] text-ink-2">
            Last updated by your office manager.
          </p>
        </div>
      </div>
    </figure>
  );
}
