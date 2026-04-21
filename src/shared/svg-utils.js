/**
 * PurgeTSS - Shared SVG/Sharp utilities
 *
 * Centralizes the logic for safely rasterizing SVGs with Sharp — specifically,
 * handling SVGs that come out of vector editors (Affinity, Illustrator) with
 * absurdly large viewBoxes that would otherwise trigger Sharp's pixel limit.
 *
 * Shared by:
 *   - src/core/branding/prepare-master.js (brand pipeline)
 *   - src/core/images/gen-scales.js       (images pipeline)
 *
 * @fileoverview SVG rasterization helpers for the Sharp pipeline
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

// SVGs with natural dimensions above this (in points) are almost always the
// result of a vector editor baking in transforms — e.g. Affinity exporting a
// "pliego" as 29559×13542 pt. Callers compensate with adaptive density; this
// threshold only controls the user-facing warning.
export const VIEWBOX_WARN_THRESHOLD = 4096

/**
 * Compute a Sharp density (DPI) so that rasterization of an SVG lands at
 * approximately `targetSupersampledMax` pixels on the longest side, regardless
 * of the SVG's intrinsic viewBox. Clamped to Sharp's valid range (1..2400).
 *
 * @param {number} naturalMax - Largest SVG dimension in points (at 72 DPI).
 * @param {number} targetSupersampledMax - Desired raster size on the longest side.
 * @returns {number} A safe density value in [1, 2400].
 */
export function computeSvgDensity(naturalMax, targetSupersampledMax) {
  return Math.min(
    2400,
    Math.max(1, Math.round((targetSupersampledMax / naturalMax) * 72))
  )
}

/**
 * Read an SVG safely — buffer + metadata with the pixel-limit check disabled
 * (Sharp enforces it even during header parsing for SVG inputs). Optionally
 * emits a warning via the provided logger when the viewBox is disproportionate.
 *
 * The caller is responsible for computing a bounded density (via
 * computeSvgDensity) before actually rendering — this keeps the real pixel
 * output inside Sharp's limit even though the limit was disabled at read time.
 *
 * @param {string} svgPath - Absolute path to the SVG file.
 * @param {Object} [opts]
 * @param {Object} [opts.logger] - Logger exposing a .warning(msg) method. If
 *   omitted, no warning is emitted (silent mode, for unit tests).
 * @param {boolean} [opts.withAdvice=false] - Include the "re-export" advice
 *   line. Enable for the brand pipeline (where the logo is central); keep
 *   false for the images pipeline (which may process many files).
 * @returns {Promise<{buffer: Buffer, meta: Object, naturalMax: number}>}
 */
export async function readSvgSafely(svgPath, { logger, withAdvice = false } = {}) {
  const buffer = fs.readFileSync(svgPath)
  const meta = await sharp(buffer, { limitInputPixels: false }).metadata()
  const naturalMax = Math.max(meta.width, meta.height)

  if (logger && naturalMax > VIEWBOX_WARN_THRESHOLD) {
    logger.warning(
      `⚠  ${path.basename(svgPath)} has a disproportionate viewBox (${meta.width}×${meta.height} pt).`
    )
    if (withAdvice) {
      logger.warning(
        `   Re-export from your vector editor with a canvas-sized viewBox if possible.`
      )
    }
    logger.warning(
      `   Adapting rasterization density to compensate.`
    )
  }

  return { buffer, meta, naturalMax }
}
