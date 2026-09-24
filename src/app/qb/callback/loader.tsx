"use client";

import dynamic from "next/dynamic";

/** The connection code is read from the address bar, which only exists in the browser. */
const ConnectionCode = dynamic(() => import("./connection-code"), {
  ssr: false,
  loading: () => (
    <section className="rounded-panel sai-pane px-7 py-9 md:px-10 md:py-11">
      <p className="font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent-deep">
        File Invoices · QuickBooks
      </p>
      <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.1] tracking-[-0.02em] text-ink md:text-[38px]">
        One moment…
      </h1>
    </section>
  ),
});

export function ConnectionCodeLoader() {
  return <ConnectionCode />;
}
