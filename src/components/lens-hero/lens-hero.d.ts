/**
 * Minimal types for the vendored `lens-hero.js`. Deliberately not a rewrite of
 * the module: it is copied in byte for byte, so its types live here instead.
 * Only the surface the site uses is declared.
 */

export interface LensHeroOptions {
  progress?: number;
  maxDpr?: number;
  sceneScale?: number;
  lensRadius?: number;
  magnification?: number;
  blurRadius?: number;
  grain?: number;
  tallBelow?: number;
  handFont?: string;
  handFont2?: string;
  textFont?: string;
  labelFont?: string;
  power?: string;
  reducedMotion?: boolean | null;
  followPointer?: boolean;
  /** Linear rgb 0..1 that the feathered window edge melts into. */
  pageColor?: [number, number, number];
}

export interface LensHeroStats {
  fps: number;
  frameMs: number;
  quality: number;
  mode: "webgl" | "2d";
  layout: "wide" | "tall";
}

export interface LensHero {
  setProgress(p: number): void;
  readonly stats: LensHeroStats;
  destroy(): void;
}

export interface PinScrollOptions {
  growVh?: number;
  holdVh?: number;
  phoneGrowVh?: number;
  phoneHoldVh?: number;
  phoneBelow?: number;
}

export function init(canvas: HTMLCanvasElement, options?: LensHeroOptions): LensHero;

/** Sets the track's height and drives setProgress from scroll. Returns a disposer. */
export function pinScroll(
  track: HTMLElement,
  hero: LensHero,
  options?: PinScrollOptions
): () => void;

declare const _default: { init: typeof init; pinScroll: typeof pinScroll };
export default _default;
