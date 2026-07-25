/**
 * The Lens scene: fixed warm-sky gradient, three blurred tint pools, and
 * drifting glass lenses with depth-of-field tiers (near / mid / far).
 * Renders once in the root layout, behind a z-1 content wrapper.
 * Pure CSS animation; prefers-reduced-motion is handled globally.
 */

type LensSpec = {
  size: number;
  style: React.CSSProperties;
  tier?: "near" | "mid" | "far";
  drift: string;
};

const LENSES: LensSpec[] = [
  { size: 220, style: { top: "5%", left: "3%" }, tier: "far", drift: "21s" },
  { size: 132, style: { top: "22%", right: "5%" }, tier: "mid", drift: "14s" },
  { size: 86, style: { top: "56%", left: "7%" }, tier: "near", drift: "11s" },
  { size: 178, style: { top: "74%", right: "9%" }, tier: "far", drift: "24s" },
  { size: 110, style: { top: "40%", right: "24%" }, tier: "mid", drift: "18s" },
];

export function Scene() {
  return (
    <div className="sai-scene" aria-hidden="true">
      <div className="sai-tint t1" />
      <div className="sai-tint t2" />
      <div className="sai-tint t3" />
      {LENSES.map((lens, i) => (
        <div
          key={i}
          className={`sai-lens ${lens.tier === "near" ? "" : lens.tier ?? ""}`.trim()}
          style={{
            width: lens.size,
            height: lens.size,
            ...lens.style,
            ["--drift" as string]: lens.drift,
          }}
        />
      ))}
    </div>
  );
}
