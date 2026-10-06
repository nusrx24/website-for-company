/**
 * The display alphabet the footer's wordmark is set in. Every letter is built
 * from rectangles, slanted strokes and elliptical bands, so it looks the same
 * on any device and no font is loaded for it.
 *
 * Used only while the page is built: the letters end up in the HTML as SVG
 * paths.
 */
import { SHUTTER, f } from "./shutter";

/** Cap height of every glyph, in SVG units. The wordmark's viewBox is this tall. */
export const CAP = 100;
const S = 19; // stem
const B = 17; // bar

/** Axis-aligned box. */
const rect = (x: number, y: number, w: number, h: number): string =>
  "M" + f(x) + " " + f(y) + "H" + f(x + w) + "V" + f(y + h) + "H" + f(x) + "Z";

/** A slanted stroke `t` wide measured horizontally, from (x1, y1) at the top to (x2, y2) at the bottom. */
const slant = (x1: number, y1: number, x2: number, y2: number, t: number): string =>
  "M" + f(x1) + " " + f(y1) + "H" + f(x1 + t) + "L" + f(x2 + t) + " " + f(y2) + "H" + f(x2) + "Z";

const at = (cx: number, cy: number, rx: number, ry: number, deg: number): string => {
  const a = (deg * Math.PI) / 180;
  return f(cx + rx * Math.cos(a)) + " " + f(cy + ry * Math.sin(a));
};

/**
 * A band between an outer ellipse (rx, ry) and an inner one (rx - tx, ry - ty),
 * from angle a0 to a1 in degrees. Angles grow clockwise on screen (0 = right,
 * 90 = bottom); a1 < a0 runs the other way.
 */
const band = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  tx: number,
  ty: number,
  a0: number,
  a1: number,
): string => {
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  const cw = a1 > a0 ? 1 : 0;
  const irx = rx - tx;
  const iry = ry - ty;
  return (
    "M" + at(cx, cy, rx, ry, a0) +
    "A" + f(rx) + " " + f(ry) + " 0 " + large + " " + cw + " " + at(cx, cy, rx, ry, a1) +
    "L" + at(cx, cy, irx, iry, a1) +
    "A" + f(irx) + " " + f(iry) + " 0 " + large + " " + (1 - cw) + " " + at(cx, cy, irx, iry, a0) +
    "Z"
  );
};

/** A full elliptical ring (needs fill-rule evenodd). */
const ring = (cx: number, cy: number, rx: number, ry: number, tx: number, ty: number): string => {
  const e = (r1: number, r2: number) =>
    "M" + f(cx - r1) + " " + f(cy) +
    "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx + r1) + " " + f(cy) +
    "A" + f(r1) + " " + f(r2) + " 0 1 1 " + f(cx - r1) + " " + f(cy) + "Z";
  return e(rx, ry) + e(rx - tx, ry - ty);
};

/** A D-shaped bowl: flat on the left, half an ellipse on the right (needs evenodd). */
const bowl = (x: number, y: number, w: number, h: number, t: number, tb: number): string => {
  const ry = h / 2;
  const rx = Math.min(w - t, ry * 0.95);
  const sx = x + w - rx;
  return (
    "M" + f(x) + " " + f(y) + "H" + f(sx) +
    "A" + f(rx) + " " + f(ry) + " 0 0 1 " + f(sx) + " " + f(y + h) + "H" + f(x) + "Z" +
    "M" + f(x + t) + " " + f(y + tb) + "H" + f(sx) +
    "A" + f(rx - t) + " " + f(ry - tb) + " 0 0 1 " + f(sx) + " " + f(y + h - tb) + "H" + f(x + t) + "Z"
  );
};

export type Glyph = { w: number; d: string[] };

const SPACE: Glyph = { w: 42, d: [] };

/** The display alphabet, A-Z. Each glyph is CAP tall; its shapes overlap into one letter. */
export const GLYPHS: Record<string, Glyph> = {
  A: { w: 96, d: [slant(37, 0, 0, 100, 23), slant(37, 0, 73, 100, 23), rect(18, 60, 60, 16)] },
  B: { w: 84, d: [rect(0, 0, S, 100), bowl(0, 0, 78, 52, S, B), bowl(0, 52 - B, 84, 100 - 52 + B, S, B)] },
  C: { w: 90, d: [band(45, 50, 45, 50, S + 2, B, -40, -320)] },
  D: { w: 90, d: [rect(0, 0, S + 1, 100), bowl(0, 0, 90, 100, S + 2, B)] },
  E: { w: 72, d: [rect(0, 0, S, 100), rect(0, 0, 72, B), rect(0, 41.5, 64, B), rect(0, 100 - B, 72, B)] },
  F: { w: 70, d: [rect(0, 0, S, 100), rect(0, 0, 70, B), rect(0, 43, 62, B)] },
  G: { w: 94, d: [band(47, 50, 47, 50, S + 2, B, -38, -360), rect(48, 46, 46, B)] },
  H: { w: 86, d: [rect(0, 0, S, 100), rect(86 - S, 0, S, 100), rect(0, 42, 86, B)] },
  I: { w: S + 2, d: [rect(0, 0, S + 2, 100)] },
  J: { w: 72, d: [rect(72 - S, 0, S, 64), band(36, 62, 36, 38, S, B, 0, 180)] },
  K: { w: 86, d: [rect(0, 0, S, 100), slant(62, 0, 10, 62, 24), slant(30, 42, 62, 100, 24)] },
  L: { w: 68, d: [rect(0, 0, S, 100), rect(0, 100 - B, 68, B)] },
  M: { w: 112, d: [rect(0, 0, S + 3, 100), slant(0, 0, 46, 100, 9), slant(68, 0, 40, 100, 22), rect(112 - S - 3, 0, S + 3, 100)] },
  N: { w: 88, d: [rect(0, 0, S, 100), rect(88 - S, 0, S, 100), slant(0, 0, 63, 100, 25)] },
  O: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B)] },
  P: { w: 80, d: [rect(0, 0, S, 100), bowl(0, 0, 80, 60, S, B)] },
  Q: { w: 100, d: [ring(50, 50, 50, 50, S + 2, B), slant(50, 62, 78, 100, 22)] },
  R: { w: 84, d: [rect(0, 0, S, 100), bowl(0, 0, 82, 58, S, B), slant(34, 50, 62, 100, 22)] },
  // Two bands that meet on the spine: r = (CAP + B) / 4 makes it exactly B thick.
  S: { w: 80, d: [band(40, 29.25, 40, 29.25, S, B, -22, -273), band(40, 70.75, 40, 29.25, S, B, -93, 158)] },
  T: { w: 82, d: [rect(0, 0, 82, B), rect(41 - S / 2 - 1, 0, S + 2, 100)] },
  // Stems run 2 past the band so the joins never show a hairline.
  U: { w: 86, d: [rect(0, 0, S, 60), rect(86 - S, 0, S, 60), band(43, 58, 43, 42, S, B, 0, 180)] },
  V: { w: 94, d: [slant(0, 0, 36, 100, 22), slant(72, 0, 36, 100, 22)] },
  W: { w: 132, d: [slant(0, 0, 26, 100, 20), slant(56, 0, 26, 100, 20), slant(56, 0, 86, 100, 20), slant(112, 0, 86, 100, 20)] },
  X: { w: 92, d: [slant(0, 0, 68, 100, 24), slant(68, 0, 0, 100, 24)] },
  Y: { w: 92, d: [slant(0, 0, 35, 56, 22), slant(70, 0, 35, 56, 22), rect(35, 50, 22, 50)] },
  Z: { w: 80, d: [rect(0, 0, 80, B), rect(0, 100 - B, 80, B), slant(56, B - 1, 0, 100 - B + 1, 24)] },
};

/** Any character outside A-Z is a gap. */
export const glyphOf = (ch: string): Glyph => GLYPHS[ch.toUpperCase()] ?? SPACE;

export type Placed = { ch: string; x: number; w: number; shutter: boolean };

/** Lay the word out left to right with a fixed gap. `shutterAt` swaps that letter for the shutter. */
export const layout = (
  word: string,
  shutterAt: number,
  gap: number = 12,
): { items: Placed[]; width: number } => {
  const items: Placed[] = [];
  let x = 0;
  Array.from(word).forEach((ch, i) => {
    const shutter = i === shutterAt && ch.trim() !== "";
    const w = shutter ? SHUTTER : glyphOf(ch).w;
    items.push({ ch, x, w, shutter });
    x += w + gap;
  });
  return { items, width: Math.max(1, x - (items.length ? gap : 0)) };
};
