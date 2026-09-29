/** Types for the vendored `desk-scene.js` (a fork of lens-hero.js, 2026-09-23). */

export interface DeskHover {
  id: string;
  tool: string | null;
  name: string;
  verb: string;
  /** Pointer position in CSS pixels (clientX / clientY). */
  x: number;
  y: number;
}

export interface DeskLight {
  hour: number;
  night: number;
  warm: number;
  pinned: boolean;
}

export interface DeskObject {
  id: string;
  tool: string;
  name: string;
  verb: string;
}

export interface DeskSceneOptions {
  handFont?: string;
  handFont2?: string;
  textFont?: string;
  labelFont?: string;
  pageColor?: [number, number, number];
  nightPageColor?: [number, number, number];
  /** null = the real clock; a number pins the light. */
  hour?: number | null;
  reducedMotion?: boolean | null;
  followPointer?: boolean;
  onOpen?: (id: string, tool: string, info: { name: string; verb: string }) => void;
  onHover?: (info: DeskHover | null) => void;
  onLight?: (light: DeskLight) => void;
  /** A different set of objects on the same desk (the sandbox). */
  items?: (painters: Record<string, unknown>) => unknown[];
  stops?: { wide: number[][]; tall: number[][] };
  deskColor?: string;
}

export interface DeskScene {
  readonly stats: { fps: number; frameMs: number; quality: number; mode: string; layout: "wide" | "tall" };
  readonly hour: number | null;
  readonly light: { ld: [number, number]; warm: number; night: number };
  objects(): DeskObject[];
  flyTo(id: string, ms?: number): boolean;
  nudge(id: string): void;
  open(id: string): void;
  shake(strength?: number): void;
  setHour(h: number | null): void;
  addNote(text: string): { id: string; lines: string[] } | null;
  setProgress(p: number): void;
  destroy(): void;
}

export function init(canvas: HTMLCanvasElement, options?: DeskSceneOptions): DeskScene;
export const painters: Record<string, unknown>;
