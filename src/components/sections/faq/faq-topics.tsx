import { FAQ_GROUPS } from "@/lib/content";

/**
 * The FAQ body ("Topics", picked by Alec on 16 Nov 2026 from three versions): a topic
 * list that follows the reader on desktop, and answers that open on click. The patient
 * data answers start open, so that answer is never hidden behind a click.
 */
const LABEL =
  "font-[family-name:var(--font-label)] text-[13.5px] font-bold uppercase tracking-[.08em]";

export function FaqTopics() {
  return (
    <div className="grid gap-10 md:grid-cols-[210px_1fr] md:gap-14">
      <nav aria-label="Topics" className="hidden self-start md:sticky md:top-[120px] md:block">
        <p className={`${LABEL} text-ink-2`}>Topics</p>
        <ul className="mt-4 space-y-1">
          {FAQ_GROUPS.map((g) => (
            <li key={g.id}>
              <a
                href={`#${g.id}`}
                className="block rounded-[10px] px-3 py-2 text-[17px] text-ink-2 transition-colors hover:bg-white/70 hover:text-ink"
              >
                {g.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-10">
        {FAQ_GROUPS.map((g) => (
          <section key={g.id} id={g.id} className="scroll-mt-[120px]">
            <h2 className={`${LABEL} text-accent-deep`}>{g.title}</h2>
            <div className="mt-4 divide-y divide-rule rounded-[22px] border border-white/85 bg-white/65 shadow-[var(--shadow-pane)] backdrop-blur-xl">
              {g.items.map((item) => (
                <details key={item.q} open={g.id === "data"} className="group px-6 md:px-7">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-heading text-[19px] font-medium leading-[1.35] text-ink md:text-[20px] [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <span
                      aria-hidden
                      className="relative block h-[22px] w-[22px] shrink-0 rounded-full border border-rule-strong transition-transform duration-200 before:absolute before:left-1/2 before:top-1/2 before:h-[1.5px] before:w-[10px] before:-translate-x-1/2 before:-translate-y-1/2 before:bg-ink after:absolute after:left-1/2 after:top-1/2 after:h-[10px] after:w-[1.5px] after:-translate-x-1/2 after:-translate-y-1/2 after:bg-ink group-open:rotate-45"
                    />
                  </summary>
                  <p className="t-body max-w-[62ch] pb-6">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
