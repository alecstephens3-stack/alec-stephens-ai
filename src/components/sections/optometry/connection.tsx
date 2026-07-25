import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { Porthole } from "@/components/ui/lens-primitives";
import { OPTOMETRY_CONNECTION } from "@/lib/optometry";

export function OptometryConnection() {
  const { eyebrow, headline, body } = OPTOMETRY_CONNECTION;

  return (
    <section
      id="connection"
      className="py-24 md:py-32"
      aria-label="How the modules fit together"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <Porthole>{eyebrow}</Porthole>

          <h2
            className="mt-6 max-w-[18ch] font-heading font-medium text-ink-90"
            style={{
              fontSize: "clamp(2rem, 3.8vw, 3rem)",
              lineHeight: 1.06,
              letterSpacing: "-0.025em",
            }}
          >
            {headline.before}
            <em className="not-italic text-accent">{headline.accent}</em>
            {headline.after}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={80}>
          <div className="sai-pane sai-streak mt-12 rounded-panel p-6 md:mt-16 md:p-12">
            {/* Mobile: stacked vertical flow. The SVG below renders at md+ widths only. */}
            <div
              className="relative flex flex-col items-center gap-3 md:hidden"
              aria-label="Data flow: four modules feed the dashboard, which emails the Monday briefing to the clinic owner"
            >
              <div className="grid w-full grid-cols-2 gap-3">
                {["Booking Guardian", "Recall Engine", "Insurance Verify", "Reputation & Reviews"].map((m) => (
                  <div
                    key={m}
                    className="sai-tile rounded-tile px-4 py-4 text-center text-[15.5px] font-medium text-ink-90"
                  >
                    {m}
                  </div>
                ))}
              </div>
              <span aria-hidden="true" className="text-lg text-accent">&darr;</span>
              <div className="sai-pane-strong w-full rounded-tile px-4 py-5 text-center text-base font-medium text-ink-90">
                Dashboard
                <div className="mt-1.5 font-label text-[13.5px] font-semibold uppercase tracking-[0.05em] text-accent">Flagship</div>
              </div>
              <span aria-hidden="true" className="text-lg text-accent">&darr;</span>
              <div className="w-full rounded-tile border border-accent-line bg-accent-soft px-4 py-4 text-center text-base font-medium text-ink-90">
                Monday briefing, 7 AM
              </div>
              <span aria-hidden="true" className="text-lg text-accent">&darr;</span>
              <div className="sai-tile rounded-tile px-6 py-3.5 text-center text-[15.5px] font-medium text-ink-90">
                Clinic Owner
              </div>
            </div>

            <div className="relative hidden md:block" aria-label="Data flow diagram of five modules around a central dashboard">
              <svg
                viewBox="0 0 900 440"
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto h-auto w-full max-w-3xl"
                role="img"
                aria-labelledby="connection-title"
              >
                <title id="connection-title">
                  Five modules connect to a central Practice Intelligence Dashboard
                </title>

                <defs>
                  <marker
                    id="arrow"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                    fill="rgba(23,19,16,0.35)"
                  >
                    <path d="M0,0 L10,5 L0,10 z" />
                  </marker>
                </defs>

                {/* Edges */}
                <g stroke="rgba(23,19,16,0.18)" strokeWidth="1" fill="none" markerEnd="url(#arrow)">
                  <line x1="450" y1="95" x2="450" y2="185" />
                  <line x1="180" y1="95" x2="370" y2="185" />
                  <line x1="720" y1="95" x2="530" y2="185" />
                  <line x1="180" y1="345" x2="370" y2="260" />
                  <line x1="720" y1="345" x2="530" y2="260" />
                  <line x1="450" y1="345" x2="450" y2="260" />
                </g>

                {/* Center node */}
                <g>
                  <rect
                    x="340"
                    y="180"
                    width="220"
                    height="80"
                    rx="18"
                    fill="rgba(255,255,255,0.86)"
                    stroke="#DC6843"
                    strokeWidth="1.5"
                  />
                  <text
                    x="450"
                    y="212"
                    textAnchor="middle"
                    fontFamily="var(--font-inter-tight), 'Inter Tight', sans-serif"
                    fontSize="18"
                    fontWeight="500"
                    fill="#241E19"
                  >
                    Dashboard
                  </text>
                  <text
                    x="450"
                    y="238"
                    textAnchor="middle"
                    fontFamily="var(--font-schibsted), 'Schibsted Grotesk', sans-serif"
                    fontSize="13.5"
                    fontWeight="600"
                    letterSpacing="0.7"
                    fill="#DC6843"
                  >
                    FLAGSHIP
                  </text>
                </g>

                {/* Top-left: Booking Guardian */}
                <g>
                  <rect x="70" y="50" width="220" height="50" rx="16" fill="rgba(255,255,255,0.62)" stroke="rgba(255,255,255,0.85)" />
                  <text x="180" y="82" textAnchor="middle" fontFamily="var(--font-inter-tight), 'Inter Tight', sans-serif" fontSize="15.5" fontWeight="500" fill="#241E19">
                    Booking Guardian
                  </text>
                </g>

                {/* Top: Recall Engine */}
                <g>
                  <rect x="340" y="50" width="220" height="50" rx="16" fill="rgba(255,255,255,0.62)" stroke="rgba(255,255,255,0.85)" />
                  <text x="450" y="82" textAnchor="middle" fontFamily="var(--font-inter-tight), 'Inter Tight', sans-serif" fontSize="15.5" fontWeight="500" fill="#241E19">
                    Recall Engine
                  </text>
                </g>

                {/* Top-right: Insurance Verify */}
                <g>
                  <rect x="610" y="50" width="220" height="50" rx="16" fill="rgba(255,255,255,0.62)" stroke="rgba(255,255,255,0.85)" />
                  <text x="720" y="82" textAnchor="middle" fontFamily="var(--font-inter-tight), 'Inter Tight', sans-serif" fontSize="15.5" fontWeight="500" fill="#241E19">
                    Insurance Verify
                  </text>
                </g>

                {/* Bottom-left: Reviews */}
                <g>
                  <rect x="70" y="340" width="220" height="50" rx="16" fill="rgba(255,255,255,0.62)" stroke="rgba(255,255,255,0.85)" />
                  <text x="180" y="372" textAnchor="middle" fontFamily="var(--font-inter-tight), 'Inter Tight', sans-serif" fontSize="15.5" fontWeight="500" fill="#241E19">
                    Reputation &amp; Reviews
                  </text>
                </g>

                {/* Bottom-right: Clinic Owner */}
                <g>
                  <rect x="610" y="340" width="220" height="50" rx="16" fill="rgba(255,255,255,0.62)" stroke="rgba(255,255,255,0.85)" />
                  <text x="720" y="372" textAnchor="middle" fontFamily="var(--font-inter-tight), 'Inter Tight', sans-serif" fontSize="15.5" fontWeight="500" fill="#241E19">
                    Clinic Owner
                  </text>
                </g>

                {/* Bottom-center: Monday briefing */}
                <g>
                  <rect x="340" y="340" width="220" height="50" rx="16" fill="rgba(23,19,16,0.92)" stroke="rgba(23,19,16,0.92)" />
                  <text x="450" y="372" textAnchor="middle" fontFamily="var(--font-inter-tight), 'Inter Tight', sans-serif" fontSize="15.5" fontWeight="500" fill="#F5F1E8">
                    Monday briefing, 7 AM
                  </text>
                </g>
              </svg>
            </div>

            <p className="relative mx-auto mt-12 max-w-[60ch] text-base leading-relaxed text-ink-2 md:text-lg">
              {body}
            </p>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
