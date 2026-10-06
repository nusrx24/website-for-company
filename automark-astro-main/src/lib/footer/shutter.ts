/**
 * Maths for the footer's "shutter" (the three-bladed square that stands in
 * for one letter of the wordmark) and for the scramble its links do on hover.
 *
 * Shared by the page build, which draws the shutter at rest, and by the
 * browser, which moves it. Nothing here touches the document.
 */

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

/** Format a number for an SVG attribute: two decimal places at most. */
export const f = (n: number): string => String(Math.round(n * 100) / 100);

/** The shutter is a square, one cap height tall. */
export const SHUTTER = 100;
/** Blade width along the edges it touches. */
const K = 21;
/** Where the pivot rests, in the shutter's own (unrotated) frame. */
export const REST = 77;

/** Rotate (x, y) by `turns` quarter turns clockwise about the shutter's centre. */
export const turn = (x: number, y: number, turns: number): [number, number] => {
  const n = ((turns % 4) + 4) % 4;
  let a = x;
  let b = y;
  for (let i = 0; i < n; i++) {
    const t = a;
    a = SHUTTER - b;
    b = t;
  }
  return [a, b];
};

/** Where the pivot rests for a given rotation. */
export const restPivot = (turns: number): [number, number] =>
  turn(REST, REST, turns);

/**
 * The shutter's three blades for a pivot at (px, py), rotated `turns` quarter
 * turns. Built in the unrotated frame - one thin wedge from the top-left
 * corner, two wide ones along the top and left edges - then turned.
 */
export const blades = (px: number, py: number, turns: number): number[][] => {
  const [qx, qy] = turn(clamp(px, 8, 92), clamp(py, 8, 92), -turns);
  const shapes = [
    [0, 0, K, 0, qx, qy, 0, K],
    [qx, 0, SHUTTER, 0, SHUTTER, K, qx, qy],
    [0, qy, qx, qy, K, SHUTTER, 0, SHUTTER],
  ];
  return shapes.map((s) => {
    const out: number[] = [];
    for (let i = 0; i < s.length; i += 2) out.push(...turn(s[i], s[i + 1], turns));
    return out;
  });
};

/** Frame-rate independent ease toward a target: `k` is the fraction closed per 1/60s. */
export const approach = (from: number, to: number, k: number, dt: number): number =>
  to + (from - to) * Math.pow(1 - clamp(k, 0, 1), clamp(dt, 0, 0.1) * 60);

const NOISE = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>";

/**
 * One frame of the link scramble. Letters left of `progress` (0 to 1) are
 * settled; the rest show a noise glyph picked from `seed`. Spaces and
 * punctuation never scramble, so the line keeps its shape.
 */
export const scramble = (text: string, progress: number, seed: number): string => {
  const chars = Array.from(text);
  const settled = Math.floor(
    clamp(Number.isFinite(progress) ? progress : 1, 0, 1) * chars.length,
  );
  return chars
    .map((ch, i) => {
      if (i < settled || !/[a-z0-9]/i.test(ch)) return ch;
      const r = Math.abs(Math.sin((i + 1) * 12.9898 + seed * 78.233) * 43758.5453) % 1;
      return NOISE[Math.floor(r * NOISE.length)];
    })
    .join("");
};
