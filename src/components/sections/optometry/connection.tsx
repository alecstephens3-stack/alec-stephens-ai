import { AnimateOnScroll } from "@/components/ui/animate-on-scroll";
import { OPTOMETRY_CONNECTION } from "@/lib/optometry";

export function OptometryConnection() {
  const { eyebrow, headline, body } = OPTOMETRY_CONNECTION;

  return (
    <section
      id="connection"
      className="bg-paper-raised py-24 md:py-36"
      aria-label="How the modules fit together"
    >
      <div className="mx-auto max-w-5xl px-6">
        <AnimateOnScroll>
          <div className="mb-10 flex items-center gap-5">
            <span className="font-mono text-xs uppercase tracking-[0.08em] text-ink-60">
              <span className="text-ink-40">{eyebrow.split(" · ")[0]}</span> ·{" "}
              {eyebrow.split(" · ")[1]}
            </span>
            <span className="h-px flex-1 bg-border" aria-hidden="true" />
          </div>

          <h2
            className="max-w-[18ch] font-heading font-medium text-black"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
            }}
          >
            {headline.before}
            <span className="text-salmon">{headline.accent}</span>
            {headline.after}
          </h2>
        </AnimateOnScroll>

        <AnimateOnScroll delay={150}>
          {/* Mobile: stacked vertical flow. The SVG below renders at md+ widths only. */}
          <div
            className="mt-12 flex flex-col items-center gap-3 md:hidden"
            aria-label="Data flow: four modules feed the dashboard, which emails the Monday briefing to the clinic owner"
          >
            <div className="grid w-full grid-cols-2 gap-2">
              {["Booking Guardian", "Recall Engine", "Insurance Verify", "Reputation & Reviews"].map((m) => (
                <div
                  key={m}
                  className="rounded-lg border border-border bg-paper px-3 py-3 text-center font-heading text-sm font-medium text-black"
                >
                  {m}
                </div>
              ))}
            </div>
            <span aria-hidden="true" className="font-mono text-lg text-ink-40">&darr;</span>
            <div className="w-full rounded-lg bg-salmon px-4 py-4 text-center font-heading text-base font-medium text-paper">
              Dashboard
              <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-paper/80">Flagship</div>
            </div>
            <span aria-hidden="true" className="font-mono text-lg text-ink-40">&darr;</span>
            <div className="w-full rounded-lg bg-ink px-4 py-4 text-center font-heading text-base font-medium text-paper">
              Monday briefing, 7 AM
            </div>
            <span aria-hidden="true" className="font-mono text-lg text-ink-40">&darr;</span>
            <div className="rounded-lg border border-border bg-paper px-6 py-3 text-center font-heading text-sm font-medium text-black">
              Clinic Owner
            </div>
          </div>

          <div className="mt-12 hidden md:mt-16 md:block" aria-label="Data flow diagram of five modules around a central dashboard">
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
                  fill="#A3A3A3"
                >
                  <path d="M0,0 L10,5 L0,10 z" />
                </marker>
              </defs>

              {/* Edges */}
              <g stroke="#D4D4D4" strokeWidth="1" fill="none" markerEnd="url(#arrow)">
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
                  rx="8"
                  fill="#F47B6B"
                  stroke="#F47B6B"
                  strokeWidth="1.5"
                />
                <text
                  x="450"
                  y="212"
                  textAnchor="middle"
                  fontFamily="Inter Tight, sans-serif"
                  fontSize="18"
                  fontWeight="500"
                  fill="#FFFFFF"
                >
                  Dashboard
                </text>
                <text
                  x="450"
                  y="238"
                  textAnchor="middle"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="10"
                  letterSpacing="1.2"
                  fill="#FFFFFF"
                >
                  FLAGSHIP
                </text>
              </g>

              {/* Top-left: Booking Guardian */}
              <g>
                <rect x="70" y="50" width="220" height="50" rx="8" fill="#FFFFFF" stroke="#D4D4D4" />
                <text x="180" y="82" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="500" fill="#1A1A1A">
                  Booking Guardian
                </text>
              </g>

              {/* Top: Recall Engine */}
              <g>
                <rect x="340" y="50" width="220" height="50" rx="8" fill="#FFFFFF" stroke="#D4D4D4" />
                <text x="450" y="82" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="500" fill="#1A1A1A">
                  Recall Engine
                </text>
              </g>

              {/* Top-right: Insurance Verify */}
              <g>
                <rect x="610" y="50" width="220" height="50" rx="8" fill="#FFFFFF" stroke="#D4D4D4" />
                <text x="720" y="82" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="500" fill="#1A1A1A">
                  Insurance Verify
                </text>
              </g>

              {/* Bottom-left: Reviews */}
              <g>
                <rect x="70" y="340" width="220" height="50" rx="8" fill="#FFFFFF" stroke="#D4D4D4" />
                <text x="180" y="372" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="500" fill="#1A1A1A">
                  Reputation &amp; Reviews
                </text>
              </g>

              {/* Bottom-right: Clinic Owner */}
              <g>
                <rect x="610" y="340" width="220" height="50" rx="8" fill="#FFFFFF" stroke="#D4D4D4" />
                <text x="720" y="372" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="500" fill="#1A1A1A">
                  Clinic Owner
                </text>
              </g>

              {/* Bottom-center: Monday briefing */}
              <g>
                <rect x="340" y="340" width="220" height="50" rx="8" fill="#0A0A0A" stroke="#0A0A0A" />
                <text x="450" y="372" textAnchor="middle" fontFamily="Inter Tight, sans-serif" fontSize="15" fontWeight="500" fill="#FAFAFA">
                  Monday briefing, 7 AM
                </text>
              </g>
            </svg>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll delay={250}>
          <p className="mx-auto mt-14 max-w-[60ch] text-base leading-relaxed text-ink-60 md:text-lg">
            {body}
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
