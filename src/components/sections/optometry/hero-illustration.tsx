const W = 600;
const H = 412;

/* Lens v3 palette. Warm ink, translucent glass, terracotta as the only accent,
   warm sky tones for washes, muted stone for tertiary marks. */
const INK = "#171310";
const INK_90 = "#241E19";
const INK_2 = "#6E6258";
const STONE = "#A8988A";
const GLASS = "rgba(255, 255, 255, 0.85)";
const GLASS_SOFT = "rgba(255, 255, 255, 0.66)";
const SPECULAR = "rgba(255, 255, 255, 0.95)";
const RULE = "rgba(23, 19, 16, 0.10)";
const ACCENT = "#DC6843";

/* LEGIBILITY FLOOR MATH (Lens v3: 13px body, 13.5px Schibsted caps, rendered).
   Measured slot widths for this illustration:
     390px viewport  -> 337px  (pane content box is 257px; the wrapper in
                                hero.tsx reclaims the pane's 40px padding on
                                each side below the sm breakpoint)
     1440px viewport -> 407px  (max-w-5xl container, 56px pane padding,
                                2-col grid with a 48px gap)
   Mobile is the binding case, so every <text> must be at least
     13.5 x 600 / 337 = 24.0 user units.
   Both sizes below sit at 27 units => 15.2px mobile / 18.3px desktop, which
   also keeps a 360px-wide phone (310px slot) at 13.9px.
   That ratio is why this scene carries four text runs instead of twenty-one:
   at a readable size, tiny scattered labels no longer fit, and the artwork
   has to say it in shapes. */
const LABEL_FS = 27;
const CAPTION_FS = 27;

const CARD_W = 164;
const CARD_H = 60;

/* The "before" pile: three tilted glass records, big enough to read. */
const CARDS = [
  { label: "claims", x: 40, y: 44, rot: -5.5 },
  { label: "fax #14", x: 60, y: 140, rot: 3 },
  { label: "denial", x: 36, y: 236, rot: -2 },
];

const CX = 440;
const CY = 170;
const R = 112;
const EYE_R = 46;

const ORBIT_ITEMS = [
  { key: "claims", type: "doc", ang: -90, trail: false },
  { key: "auth", type: "chk", ang: -30, trail: true },
  { key: "faxes", type: "inb", ang: 30, trail: true },
  { key: "posting", type: "bill", ang: 90, trail: true },
  { key: "recalls", type: "call", ang: 150, trail: false },
  { key: "benefits", type: "card", ang: 210, trail: false },
] as const;

/* Each thread leaves a card's right edge and lands just short of the ring. */
const THREADS = [
  { sx: 204, sy: 74, ang: 205 },
  { sx: 224, sy: 170, ang: 180 },
  { sx: 200, sy: 266, ang: 155 },
];

type GlyphType = (typeof ORBIT_ITEMS)[number]["type"];

function Glyph({ type, x, y }: { type: GlyphType; x: number; y: number }) {
  const stroke = INK_90;
  const hair = INK_2;
  const sw = 1.4;
  const accent = ACCENT;
  const transform = `translate(${x},${y}) scale(1.35)`;

  switch (type) {
    case "doc":
      return (
        <g transform={transform} filter="url(#saiWarmShadow)">
          <g transform="translate(-10,-12)">
            <path d="M 0 0 L 14 0 L 20 6 L 20 24 L 0 24 Z" fill={GLASS} stroke={stroke} strokeWidth={sw} />
            <path d="M 14 0 L 14 6 L 20 6" fill="none" stroke={stroke} strokeWidth={sw} />
            <line x1="4" y1="12" x2="16" y2="12" stroke={hair} strokeWidth="1" />
            <line x1="4" y1="16" x2="14" y2="16" stroke={hair} strokeWidth="1" />
            <line x1="4" y1="20" x2="12" y2="20" stroke={hair} strokeWidth="1" />
          </g>
        </g>
      );
    case "chk":
      return (
        <g transform={transform} filter="url(#saiWarmShadow)">
          <g transform="translate(-10,-12)">
            <rect width="20" height="24" rx="4" fill={GLASS} stroke={stroke} strokeWidth={sw} />
            <rect x="6" y="-2" width="8" height="4" rx="2" fill={GLASS} stroke={stroke} strokeWidth={sw} />
            <path
              d="M 5 12 L 9 16 L 15 9"
              fill="none"
              stroke={accent}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      );
    case "inb":
      return (
        <g transform={transform} filter="url(#saiWarmShadow)">
          <g transform="translate(-12,-10)">
            <path d="M 0 10 L 4 0 L 20 0 L 24 10 L 24 18 L 0 18 Z" fill={GLASS} stroke={stroke} strokeWidth={sw} />
            <line x1="0" y1="10" x2="8" y2="10" stroke={stroke} strokeWidth={sw} />
            <line x1="16" y1="10" x2="24" y2="10" stroke={stroke} strokeWidth={sw} />
            <line x1="8" y1="10" x2="10" y2="13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
            <line x1="16" y1="10" x2="14" y2="13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          </g>
        </g>
      );
    case "bill":
      /* The old "$" was an 11-unit <text> (6px rendered). Redrawn as a
         terracotta total row so the glyph keeps its meaning without type. */
      return (
        <g transform={transform} filter="url(#saiWarmShadow)">
          <g transform="translate(-10,-12)">
            <rect width="20" height="24" rx="4" fill={GLASS} stroke={stroke} strokeWidth={sw} />
            <line x1="3.5" y1="8" x2="16.5" y2="8" stroke={hair} strokeWidth="1" />
            <line x1="3.5" y1="13" x2="16.5" y2="13" stroke={hair} strokeWidth="1" />
            <rect x="3.5" y="17.5" width="9" height="3.4" rx="1.7" fill={accent} />
          </g>
        </g>
      );
    case "call":
      return (
        <g transform={transform} filter="url(#saiWarmShadow)">
          <path
            d="M -10 -8 Q -12 -12, -8 -12 L -4 -12 Q -1 -12, -1 -8 L -1 -4 Q -1 0, -5 1 Q -4 4, 0 6 Q 4 7, 7 6 Q 8 3, 11 3 L 13 3 Q 14 4, 14 8 Q 14 12, 10 12 Q 0 12, -6 6 Q -10 -2, -10 -8 Z"
            fill={GLASS}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      );
    case "card":
      return (
        <g transform={transform} filter="url(#saiWarmShadow)">
          <g transform="translate(-12,-8)">
            <rect width="24" height="16" rx="4" fill={GLASS} stroke={stroke} strokeWidth={sw} />
            <line x1="0" y1="5" x2="24" y2="5" stroke={stroke} strokeWidth="1" />
            <line x1="3" y1="10" x2="14" y2="10" stroke={hair} strokeWidth="1" />
            <line x1="3" y1="13" x2="10" y2="13" stroke={hair} strokeWidth="1" />
          </g>
        </g>
      );
  }
}

function Trail({ angDeg }: { angDeg: number }) {
  const out = [];
  for (let k = 1; k <= 3; k++) {
    const a = ((angDeg - k * 5.5) * Math.PI) / 180;
    const x = CX + Math.cos(a) * R;
    const y = CY + Math.sin(a) * R;
    out.push(
      <circle
        key={k}
        cx={x}
        cy={y}
        r={Math.max(0.9, 3.2 - k * 0.5)}
        fill={STONE}
        opacity={Math.max(0, 1 - k * 0.22)}
      />
    );
  }
  return <g>{out}</g>;
}

export function HeroIllustration() {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="A scattered pile of practice paperwork resolving into a single orbit of handled work around the Stephens lens."
      className="h-auto w-full max-w-[600px]"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Scene wash: the centre disc is a glass lens refracting the studio sky. */}
        <radialGradient id="saiLensBelly" cx="34%" cy="26%" r="86%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.97" />
          <stop offset="52%" stopColor="#F7E7DA" />
          <stop offset="100%" stopColor="#F2CFB8" />
        </radialGradient>
        <filter id="saiWarmShadow" x="-70%" y="-70%" width="240%" height="240%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#703E28" floodOpacity="0.18" />
        </filter>
        <filter id="saiWarmShadowLg" x="-70%" y="-70%" width="240%" height="240%">
          <feDropShadow dx="0" dy="6" stdDeviation="11" floodColor="#703E28" floodOpacity="0.22" />
        </filter>
      </defs>

      {/* The pile: three tilted records, no accent yet. */}
      <g>
        {CARDS.map((c) => (
          <g
            key={c.label}
            transform={`rotate(${c.rot} ${c.x + CARD_W / 2} ${c.y + CARD_H / 2}) translate(${c.x},${c.y})`}
            filter="url(#saiWarmShadow)"
          >
            <rect
              width={CARD_W}
              height={CARD_H}
              rx="14"
              fill={GLASS_SOFT}
              stroke={RULE}
              strokeWidth="1"
            />
            <text
              x="18"
              y="29"
              fontFamily="var(--font-label)"
              fontSize={LABEL_FS}
              fontWeight="600"
              letterSpacing="0.05em"
              fill={INK_2}
              style={{ textTransform: "uppercase" }}
            >
              {c.label}
            </text>
            <line x1="18" y1="42" x2="112" y2="42" stroke={RULE} strokeWidth="1.4" />
            <line x1="18" y1="50" x2="82" y2="50" stroke={RULE} strokeWidth="1.4" />
          </g>
        ))}
      </g>

      {/* Threads from the pile into the ring. */}
      <g>
        {THREADS.map((t, i) => {
          const a = (t.ang * Math.PI) / 180;
          const ex = CX + Math.cos(a) * (R + 18);
          const ey = CY + Math.sin(a) * (R + 18);
          const mx = (t.sx + ex) / 2;
          const my = (t.sy + ey) / 2 + (i % 2 ? 20 : -20);
          return (
            <path
              key={t.ang}
              d={`M ${t.sx} ${t.sy} Q ${mx} ${my} ${ex} ${ey}`}
              fill="none"
              stroke={STONE}
              strokeWidth="1.2"
              strokeDasharray="2 6"
              opacity="0.85"
            />
          );
        })}
      </g>

      {/* Orbit ring + glyphs + trails. The glyphs carry the meaning now;
          their six micro-labels were the worst floor violation in the scene. */}
      <g>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={STONE} strokeWidth="1.2" strokeDasharray="2 11" />
        {ORBIT_ITEMS.map((it) => {
          const a = (it.ang * Math.PI) / 180;
          const x = CX + Math.cos(a) * R;
          const y = CY + Math.sin(a) * R;
          return (
            <g key={it.key}>
              {it.trail && <Trail angDeg={it.ang} />}
              <Glyph type={it.type} x={x} y={y} />
            </g>
          );
        })}

        {/* Friendly lens at orbit center */}
        <g transform={`translate(${CX},${CY})`} filter="url(#saiWarmShadowLg)">
          <circle r={EYE_R} fill="url(#saiLensBelly)" stroke={INK_90} strokeWidth="2.6" />
          <circle cy="3" r={EYE_R * 0.36} fill={ACCENT} />
          <circle cy="3" r={EYE_R * 0.14} fill={INK} />
          <circle cx={-EYE_R * 0.07} cy="0" r={EYE_R * 0.06} fill={SPECULAR} />
          <path
            d={`M ${-EYE_R * 0.6} ${-EYE_R - 5} Q 0 ${-EYE_R - 16}, ${EYE_R * 0.6} ${-EYE_R - 5}`}
            fill="none"
            stroke={INK_90}
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Caption, set on two lines so it clears the floor at mobile width. */}
      <text
        x={W / 2}
        y={358}
        textAnchor="middle"
        fontFamily="var(--font-sans)"
        fontSize={CAPTION_FS}
        fontWeight="500"
        letterSpacing="0.005em"
        fill={INK_2}
      >
        From the inbox you already have —
        <tspan x={W / 2} dy="36" fill={ACCENT}>
          to one quiet center.
        </tspan>
      </text>
    </svg>
  );
}
