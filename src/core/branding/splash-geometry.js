/**
 * PurgeTSS - splash geometry
 *
 * One rule for every splash canvas, on both platforms: the logo is fitted into
 * a square whose side is a share of the canvas's **shorter** side.
 *
 * Measuring against the shorter side rather than width and height separately is
 * what makes one number work everywhere — at 800×480 the limit comes from the
 * height, at 240×400 from the width, and the logo keeps the same visual weight
 * in portrait, in landscape, and on the tall 1440×2560 default.png.
 *
 * Expressed as padding per side so it reads like every other piece in the
 * `brand:` config: 20% padding leaves the logo at 60% of the shorter side.
 *
 * @fileoverview Shared sizing for the Android and iOS splash generators
 * @author César Estrada
 */

/**
 * Side of the square the logo is fitted into.
 *
 * @param {number} width - Canvas width in px
 * @param {number} height - Canvas height in px
 * @param {number} paddingPct - Padding per side, as a percentage of the shorter side
 * @returns {number} Side length in px, at least 1
 */
export function logoBox(width, height, paddingPct) {
  const shorterSide = Math.min(width, height)
  const share = Math.max(0, 100 - 2 * paddingPct) / 100
  return Math.max(1, Math.floor(shorterSide * share))
}
