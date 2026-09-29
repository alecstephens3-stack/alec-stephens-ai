/**
 * The lower half's drawings, in the hero's hand (hero-ambient.tsx): one fine
 * line, no fills, no text inside, real things from a practice. Each one says
 * the step it sits on, and nothing a default prompt would draw:
 *
 * 01  the Opportunity Map: where the hours go, longest bar ringed, a fix for each
 * 02  a screen share of the job, and the flat price on paper (double rule = total)
 * 03  a small tool standing next to the practice software, not inside it
 * 04  the answers page with a cursor in it, earlier versions stacked behind
 *
 * All are drawn in a 200 x 100 box. The parent owns the stroke colour.
 */

export const DRAW_W = 200;
export const DRAW_H = 106;

export function MapSheet({ ringClass }: { ringClass?: string }) {
  const rows = [36, 52, 68, 84];
  const bars = [62, 38, 48, 24];
  return (
    <>
      <rect x="4.5" y="4.5" width="124" height="94" rx="6" />
      <path d="M16 18H56" strokeWidth="1.8" />
      {rows.map((y, i) => (
        <g key={y}>
          <path d={`M16 ${y}H28`} opacity=".7" />
          <rect x="34.5" y={y - 3.5} width={bars[i]} height="7" rx="2" />
          <path d={`M106 ${y}H116M112.5 ${y - 3.5}L116 ${y}L112.5 ${y + 3.5}`} opacity=".8" />
        </g>
      ))}
      <ellipse className={ringClass} cx="65.5" cy="36" rx="37" ry="9.5" pathLength={1} />
    </>
  );
}

export function ScreenShare() {
  return (
    <>
      <rect x="4.5" y="4.5" width="96" height="66" rx="6" />
      <path d="M44 71V82M61 71V82M34 82.5H71" />
      <rect x="13.5" y="13.5" width="78" height="48" rx="3" opacity=".8" />
      <path d="M13.5 21.5H91.5" opacity=".8" />
      <path d="M20 32H56M20 40H70M20 48H50" opacity=".6" />
      <path d="M66 36.5L66 49.5L69.2 46.6L72 52.3L74.3 51.3L71.6 45.7L76 45.5Z" />
      <g transform="rotate(-4 128 60)">
        <rect x="110.5" y="34.5" width="36" height="50" rx="3" />
        <path d="M117 45H135" strokeWidth="1.8" />
        <path d="M117 53H140M117 60H133" opacity=".7" />
        <path d="M117 71H140M117 74.5H140" />
      </g>
    </>
  );
}

export function BesideSoftware() {
  return (
    <>
      {/* the small tool we build, standing beside it */}
      <rect x="4.5" y="34.5" width="40" height="58" rx="5" />
      <path d="M4.5 43.5H44.5" />
      <rect x="9.5" y="49.5" width="30" height="8" rx="3" opacity=".8" />
      <path d="M10 67H39M10 75H34M10 83H38" opacity=".6" />
      {/* the practice software, untouched */}
      <rect x="54.5" y="6.5" width="92" height="86" rx="6" />
      <path d="M54.5 18.5H146.5M76 18.5V92.5" />
      <path d="M61 29H69M61 38H69M61 47H69" opacity=".7" />
      <path d="M83 30H138M83 41H138M83 52H126M83 63H138M83 74H116" opacity=".6" />
    </>
  );
}

export function EditedPages() {
  return (
    <>
      <rect x="22.5" y="2.5" width="84" height="82" rx="5" opacity=".45" />
      <rect x="13.5" y="8.5" width="84" height="82" rx="5" opacity=".7" />
      <rect x="4.5" y="14.5" width="84" height="82" rx="5" />
      <path d="M14 28H48" strokeWidth="1.8" />
      <path d="M14 42H26M30 42H52M56 42H76M14 75H34M38 75H72M14 86H44" opacity=".6" />
      {/* the line being edited, with the cursor at its end */}
      <path d="M14 58H30M34 58H48" />
      <path d="M52.5 51.5V64.5" strokeWidth="1.6" />
    </>
  );
}

/** Where each drawing's note is attached, and the leader down the right margin. */
export const HOW_LEADERS: { d: string; at: [number, number] }[] = [
  { d: "M102.5 39C115 44 128 44 148 44C164 44 172 52 172 66V104", at: [102.5, 39] },
  { d: "M147 50C162 52 172 58 172 72V104", at: [147, 50] },
  { d: "M147 30C162 32 172 40 172 54V104", at: [147, 30] },
  { d: "M107 20C150 22 172 30 172 48V104", at: [107, 20] },
];

export const HOW_DRAWINGS: ((p: { ringClass?: string }) => React.ReactElement)[] = [
  MapSheet,
  ScreenShare,
  BesideSoftware,
  EditedPages,
];
