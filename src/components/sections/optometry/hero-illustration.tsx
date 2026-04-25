const W = 780;
const H = 540;

const INK = "#0A0A0A";
const INK_70 = "#3A3A3A";
const INK_60 = "#6B6B6B";
const INK_40 = "#A3A3A3";
const PAPER = "#FFFFFF";
const SALMON = "#F47B6B";
const SALMON_DEEP = "#E35F4D";

const BX = 20;
const BY = 70;
const BW = 230;
const BH = H - 140;

const CX = W - 230;
const CY = H / 2;
const R = 140;

const ORBIT_ITEMS = [
  { type: "doc", label: "Claims", ang: -90 },
  { type: "chk", label: "Auth", ang: -30 },
  { type: "inb", label: "Faxes", ang: 30 },
  { type: "bill", label: "Posting", ang: 90 },
  { type: "call", label: "Recalls", ang: 150 },
  { type: "card", label: "Benefits", ang: 210 },
] as const;

const TARGET_ANGLES = [115, 135, 170, 190, 225, 250];

const THREAD_SOURCES = [
  { sx: BX + BW - 6, sy: BY + 35 },
  { sx: BX + BW - 6, sy: BY + 90 },
  { sx: BX + BW - 6, sy: BY + 150 },
  { sx: BX + BW - 6, sy: BY + 220 },
  { sx: BX + BW - 6, sy: BY + 290 },
  { sx: BX + BW - 6, sy: BY + 370 },
];

const MESS_LABELS = [
  "claims",
  "fax #14",
  "denial",
  "auth",
  "recall",
  "eligibility",
  "ERA",
  "statement",
  "coding",
  "no-show",
  "intake",
  "order",
];

const NO_TRAIL = new Set(["Claims", "Benefits", "Recalls"]);

function seededChips(seed = 331) {
  let s = seed;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return MESS_LABELS.map((label) => {
    const w = label.length * 6.2 + 18;
    const x = BX + 10 + r() * (BW - w - 10);
    const y = BY + 10 + r() * (BH - 28);
    return { label, w, x, y };
  });
}

type GlyphType = (typeof ORBIT_ITEMS)[number]["type"];

function Glyph({ type, x, y }: { type: GlyphType; x: number; y: number }) {
  const stroke = INK;
  const sw = 1.4;
  const accent = SALMON_DEEP;
  const transform = `translate(${x},${y}) scale(0.9)`;

  switch (type) {
    case "doc":
      return (
        <g transform={transform}>
          <g transform="translate(-10,-12)">
            <path d="M 0 0 L 14 0 L 20 6 L 20 24 L 0 24 Z" fill={PAPER} stroke={stroke} strokeWidth={sw} />
            <path d="M 14 0 L 14 6 L 20 6" fill="none" stroke={stroke} strokeWidth={sw} />
            <line x1="4" y1="12" x2="16" y2="12" stroke={stroke} strokeWidth="1" />
            <line x1="4" y1="16" x2="14" y2="16" stroke={stroke} strokeWidth="1" />
            <line x1="4" y1="20" x2="12" y2="20" stroke={stroke} strokeWidth="1" />
          </g>
        </g>
      );
    case "chk":
      return (
        <g transform={transform}>
          <g transform="translate(-10,-12)">
            <rect width="20" height="24" rx="2" fill={PAPER} stroke={stroke} strokeWidth={sw} />
            <rect x="6" y="-2" width="8" height="4" rx="1" fill={PAPER} stroke={stroke} strokeWidth={sw} />
            <path
              d="M 5 12 L 9 16 L 15 9"
              fill="none"
              stroke={accent}
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      );
    case "inb":
      return (
        <g transform={transform}>
          <g transform="translate(-12,-10)">
            <path d="M 0 10 L 4 0 L 20 0 L 24 10 L 24 18 L 0 18 Z" fill={PAPER} stroke={stroke} strokeWidth={sw} />
            <line x1="0" y1="10" x2="8" y2="10" stroke={stroke} strokeWidth={sw} />
            <line x1="16" y1="10" x2="24" y2="10" stroke={stroke} strokeWidth={sw} />
            <line x1="8" y1="10" x2="10" y2="13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
            <line x1="16" y1="10" x2="14" y2="13" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          </g>
        </g>
      );
    case "bill":
      return (
        <g transform={transform}>
          <g transform="translate(-10,-12)">
            <rect width="20" height="24" rx="2" fill={PAPER} stroke={stroke} strokeWidth={sw} />
            <line x1="3" y1="8" x2="17" y2="8" stroke={stroke} strokeWidth="1" />
            <line x1="3" y1="14" x2="17" y2="14" stroke={stroke} strokeWidth="1" />
            <line x1="3" y1="20" x2="12" y2="20" stroke={stroke} strokeWidth="1" />
            <text
              x="14"
              y="22"
              fontFamily="var(--font-sans)"
              fontSize="9"
              fontWeight="700"
              fill={accent}
            >
              $
            </text>
          </g>
        </g>
      );
    case "call":
      return (
        <g transform={transform}>
          <path
            d="M -10 -8 Q -12 -12, -8 -12 L -4 -12 Q -1 -12, -1 -8 L -1 -4 Q -1 0, -5 1 Q -4 4, 0 6 Q 4 7, 7 6 Q 8 3, 11 3 L 13 3 Q 14 4, 14 8 Q 14 12, 10 12 Q 0 12, -6 6 Q -10 -2, -10 -8 Z"
            fill={PAPER}
            stroke={stroke}
            strokeWidth={sw}
            strokeLinejoin="round"
          />
        </g>
      );
    case "card":
      return (
        <g transform={transform}>
          <g transform="translate(-12,-8)">
            <rect width="24" height="16" rx="2" fill={PAPER} stroke={stroke} strokeWidth={sw} />
            <line x1="0" y1="5" x2="24" y2="5" stroke={stroke} strokeWidth="1" />
            <line x1="3" y1="10" x2="14" y2="10" stroke={stroke} strokeWidth="1" />
            <line x1="3" y1="13" x2="10" y2="13" stroke={stroke} strokeWidth="1" />
          </g>
        </g>
      );
  }
}

function Trail({ angDeg }: { angDeg: number }) {
  const out = [];
  for (let k = 1; k <= 3; k++) {
    const a = ((angDeg - k * 5) * Math.PI) / 180;
    const x = CX + Math.cos(a) * R;
    const y = CY + Math.sin(a) * R;
    out.push(
      <circle
        key={k}
        cx={x}
        cy={y}
        r={Math.max(0.8, 3 - k * 0.45)}
        fill={INK_40}
        opacity={Math.max(0, 1 - k * 0.22)}
      />
    );
  }
  return <g>{out}</g>;
}

export function HeroIllustration() {
  const chips = seededChips(331);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="Scattered practice inbox resolving into a single orbit of operations around the Stephens mark."
      className="h-auto w-full max-w-[620px]"
      preserveAspectRatio="xMidYMid meet"
    >

      {/* Side headings */}
      <text
        x={BX + BW / 2}
        y={50}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="22"
        letterSpacing="0.08em"
        fill={INK_60}
        style={{ textTransform: "uppercase" }}
      >
        Inbox · scattered
      </text>
      <text
        x={CX}
        y={50}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="22"
        letterSpacing="0.08em"
        fill={SALMON_DEEP}
        style={{ textTransform: "uppercase" }}
      >
        Stephens · handled
      </text>

      {/* Mess chips */}
      <g>
        {chips.map((c, i) => (
          <g key={i} transform={`translate(${c.x},${c.y})`}>
            <rect
              width={c.w}
              height="20"
              rx="10"
              fill={PAPER}
              stroke={INK_40}
              strokeWidth="0.8"
            />
            <text
              x={c.w / 2}
              y="13"
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="9"
              letterSpacing="0.14em"
              fill={INK_70}
              style={{ textTransform: "uppercase" }}
            >
              {c.label}
            </text>
          </g>
        ))}
      </g>

      {/* Six dashed threads */}
      <g>
        {THREAD_SOURCES.map((s, i) => {
          const a = (TARGET_ANGLES[i] * Math.PI) / 180;
          const ex = CX + Math.cos(a) * (R + 14);
          const ey = CY + Math.sin(a) * (R + 14);
          const mx = (s.sx + ex) / 2;
          const my = (s.sy + ey) / 2 + (i % 2 ? 22 : -22);
          return (
            <path
              key={i}
              d={`M ${s.sx} ${s.sy} Q ${mx} ${my} ${ex} ${ey}`}
              fill="none"
              stroke={INK_60}
              strokeWidth="1"
              strokeDasharray="2 5"
              opacity="0.85"
            />
          );
        })}
      </g>

      {/* Orbit ring + icons + labels + trails */}
      <g>
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={INK_40}
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        {ORBIT_ITEMS.map((it) => {
          const a = (it.ang * Math.PI) / 180;
          const x = CX + Math.cos(a) * R;
          const y = CY + Math.sin(a) * R;
          return (
            <g key={it.label}>
              {!NO_TRAIL.has(it.label) && <Trail angDeg={it.ang} />}
              <Glyph type={it.type} x={x} y={y} />
              <text
                x={x}
                y={y + 28}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="18"
                letterSpacing="0.10em"
                fill={INK}
                style={{ textTransform: "uppercase" }}
              >
                {it.label}
              </text>
            </g>
          );
        })}

        {/* Friendly eye at orbit center */}
        <g transform={`translate(${CX},${CY})`}>
          <circle r={40} fill={PAPER} stroke={INK} strokeWidth="2.4" />
          <circle cy="3" r={40 * 0.36} fill={SALMON} />
          <circle cy="3" r={40 * 0.14} fill={INK} />
          <circle cx={-40 * 0.07} cy="0" r={40 * 0.06} fill={PAPER} />
          <path
            d={`M ${-40 * 0.6} ${-40 - 4} Q 0 ${-40 - 14}, ${40 * 0.6} ${-40 - 4}`}
            fill="none"
            stroke={INK}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      </g>

      {/* Caption */}
      <text
        x={W / 2}
        y={H - 14}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="18"
        letterSpacing="0.10em"
        fill={INK_60}
        style={{ textTransform: "uppercase" }}
      >
        From the inbox you already have —{" "}
        <tspan fill={SALMON_DEEP}>to one quiet center.</tspan>
      </text>
    </svg>
  );
}
