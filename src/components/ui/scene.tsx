/**
 * The Lens scene — DRAFT v6 (2026-09-21).
 *
 * The warm-sky gradient and the three blurred tint pools are unchanged. What
 * changed: the five drifting glass lenses are retired. They read as floating
 * spheres on a marketing page, they were the only thing moving, and they were
 * the reason every glass pane on the page had to re-blur on every frame.
 *
 * In their place, a paper grain tile over the ground. It paints once and never
 * animates, so the blur budget note at the foot of globals.css stops applying
 * to a still page.
 *
 * To put the lenses back, restore the LENSES array from git history on main.
 */

export function Scene() {
  return (
    <>
      <div className="sai-scene" aria-hidden="true">
        <div className="sai-tint t1" />
        <div className="sai-tint t2" />
        <div className="sai-tint t3" />
      </div>
      <div className="draft-grain" aria-hidden="true" />
    </>
  );
}
