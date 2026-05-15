/**
 * PurgeTSS - SVG dimension deriver
 *
 * Reduces all the references to a single SVG into one final `{ widthDp, heightDp }`
 * pair that the image generator can consume as the `1×` baseline. Strategy:
 *
 *   1. For each reference, resolve the cascade against the purged app.tss
 *      class→props map.
 *   2. Collect every numeric width across references; the SVG's width is the
 *      max (a single view rendered at 800dp can't share PNGs with a view at
 *      128dp without visible blur).
 *   3. Resolve height: explicit numeric width wins; otherwise fall back to a
 *      proportional value derived from the SVG's viewBox aspect ratio.
 *
 * Edge cases handled:
 *   - Every reference resolves to a non-numeric width (`Ti.UI.SIZE`, percentage,
 *     unknown class, etc.) → SVG is skipped with a warning.
 *   - SVG file missing in `purgetss/images/` → skipped with a warning.
 *   - SVG has an invalid/missing viewBox → skipped with an error.
 *
 * @fileoverview Per-SVG dimension reducer that feeds the image generator
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { resolveDimensions } from './resolve-classes.js'
import { readSvgSafely } from '../../shared/svg-utils.js'

// Hard cap on the largest target PNG we are willing to emit, applied at the
// `xxxhdpi` / `@3x` step downstream. Keeps Sharp from producing absurdly large
// PNGs when the user accidentally pins a 4K width to a class.
export const MAX_DIMENSION_PX = 4096

/**
 * Reduce raw SVG references into per-SVG resolved dimensions.
 *
 * @param {Object} args
 * @param {Map<string, Array<{ classes: string[] }>>} args.refsBySvg - Map keyed by SVG relpath
 *   (relative to imagesFolder, normalized to forward slashes), values are the list of
 *   references seen for that SVG.
 * @param {Map} args.tssMap - Output of parseTssMap().
 * @param {string} args.imagesFolder - Absolute path to `purgetss/images/`.
 * @param {Object} args.logger - Logger with `.warning(msg)` and `.info(msg)`.
 * @returns {Promise<Map<string, { widthDp: number, heightDp: number }>>}
 *   Resolved entries only; skipped SVGs are omitted (warnings logged inline).
 */
export async function deriveDimensions({ refsBySvg, tssMap, imagesFolder, logger }) {
  const resolved = new Map()

  for (const [relPath, refs] of refsBySvg) {
    const absPath = path.join(imagesFolder, relPath)
    if (!fs.existsSync(absPath)) {
      logger.warning(`⚠  SVG not found: purgetss/images/${relPath} — skipping`)
      continue
    }

    const numericWidths = []
    const numericHeights = []
    for (const ref of refs) {
      const { width, height } = resolveDimensions(ref.classes, tssMap)
      if (typeof width === 'number' && Number.isFinite(width) && width > 0) {
        numericWidths.push(width)
      }
      if (typeof height === 'number' && Number.isFinite(height) && height > 0) {
        numericHeights.push(height)
      }
    }

    if (numericWidths.length === 0 && numericHeights.length === 0) {
      logger.warning(
        `⚠  ${relPath}: no class resolved width or height to a number — skipping. ` +
        'Add a w-* or h-* utility on the view, or pin the size manually in purgetss/config.cjs > images.files.'
      )
      continue
    }

    try {
      await readViewBox(absPath)
    } catch (err) {
      logger.warning(`⚠  ${relPath}: ${err.message} — skipping`)
      continue
    }

    // Symmetric materialization: only the dimensions the developer pinned
    // explicitly land in config.cjs. The other side is derived from the SVG
    // aspect by gen-scales on every run, so it stays in sync with viewBox
    // edits and class changes without stale "stuck" values getting cemented
    // into config the way auto-derived heights used to.
    const widthDp = numericWidths.length > 0 ? Math.max(...numericWidths) : null
    const heightDp = numericHeights.length > 0 ? Math.max(...numericHeights) : null

    resolved.set(relPath, { widthDp, heightDp })
  }

  return resolved
}

async function readViewBox(absPath) {
  // Plan: error when the SVG declares neither viewBox nor width+height
  // attributes. Sharp can infer a bounding box from the rendered content,
  // but treating that as "valid" hides authoring mistakes (e.g. an export
  // that lost its viewBox), so we enforce the explicit declaration first.
  const head = fs.readFileSync(absPath, 'utf8').slice(0, 4096)
  const svgTag = head.match(/<svg\b[^>]*>/i)?.[0] ?? ''
  const hasViewBox = /\bviewBox\s*=\s*['"][^'"]+['"]/.test(svgTag)
  const hasWidth = /\bwidth\s*=\s*['"][^'"]+['"]/.test(svgTag)
  const hasHeight = /\bheight\s*=\s*['"][^'"]+['"]/.test(svgTag)
  if (!hasViewBox && !(hasWidth && hasHeight)) {
    throw new Error('SVG has no viewBox or explicit width/height attribute')
  }

  const { meta } = await readSvgSafely(absPath, {})
  const vbW = meta.width
  const vbH = meta.height
  if (!Number.isFinite(vbW) || !Number.isFinite(vbH) || vbW <= 0 || vbH <= 0) {
    throw new Error('SVG has no usable viewBox / width / height')
  }
  return { vbW, vbH }
}
