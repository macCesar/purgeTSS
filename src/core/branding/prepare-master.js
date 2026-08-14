/**
 * PurgeTSS - prepare-master
 *
 * Produces two normalized masters from a single input:
 *
 *   1. <base>_square.png — square PNG, logo centered in a transparent canvas.
 *      Used for iOS DefaultIcon + marketplace artwork.
 *
 *   2. <base>_tight.png — logo rasterized with native aspect preserved (no
 *      padding). Used for Android adaptive icons so a horizontal wordmark fills
 *      the safe-zone by width instead of being double-padded inside a square.
 *
 * Both are sized to MAX_DIMENSION on their longest side. Whatever whitespace
 * the source already carries — an SVG viewBox wider than its artwork, a PNG
 * exported with its own margin — is preserved, not trimmed: the padding a
 * designer baked in adds to the padding configured per piece.
 *
 * Accepts SVG or PNG/JPG/WebP. SVG is rasterized by Sharp at high density,
 * then downsampled to 1024 for clean high-DPI output.
 *
 * @fileoverview Master-image preparation for the branding pipeline
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { logger } from './branding-logger.js'
import { computeSvgDensity, readSvgSafely } from '../../shared/svg-utils.js'

/**
 * Longest side of the intermediate masters when the caller does not ask for a
 * specific size. Every generator scales down from here, so this is the ceiling
 * on output sharpness: a destination asking for more pixels than the master
 * would be upscaled from a raster instead of drawn from the source.
 *
 * Callers that know their largest destination pass `maxDimension` instead —
 * see `requiredMasterPx()` in index.js. Sizing the master to what the run
 * actually needs keeps a default run fast (every destination is a reduction)
 * while removing the ceiling for runs that ask for bigger artwork.
 */
const MAX_DIMENSION = 1024

/** The SVG is drawn at master × this before being reduced, which is what keeps curve edges clean. */
const SVG_SUPERSAMPLE = 4

/**
 * Prepare dual masters (square + tight) from a single input.
 * @param {string} inputPath - Path to SVG or PNG master
 * @param {string} basePath - Output base path (no extension, e.g. /tmp/foo/_master)
 * @param {number} [maxDimension] - Longest side of the masters (defaults to MAX_DIMENSION)
 * @returns {Promise<{square: string, tight: string}>} Paths to both outputs
 */
export async function prepareMaster(inputPath, basePath, maxDimension = MAX_DIMENSION) {
  const ext = path.extname(inputPath).toLowerCase().slice(1)
  const squarePath = `${basePath}_square.png`
  const tightPath = `${basePath}_tight.png`
  const side = Math.max(1, Math.round(maxDimension))

  fs.mkdirSync(path.dirname(basePath), { recursive: true })

  if (ext === 'svg') {
    await rasterizeSvgToTight(inputPath, tightPath, side)
  } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') {
    await downsamplePngToTight(inputPath, tightPath, side)
  } else {
    throw new Error(`Unsupported master format: .${ext} (expected .svg or .png)`)
  }

  await padTightToSquare(tightPath, squarePath, side)

  return { square: squarePath, tight: tightPath }
}

async function rasterizeSvgToTight(svgPath, outPath, side) {
  const { buffer: svgBuffer, naturalMax } = await readSvgSafely(svgPath, {
    logger,
    withAdvice: true
  })

  // Supersample above MAX_DIMENSION so the final downsample yields clean edges.
  const density = computeSvgDensity(naturalMax, side * SVG_SUPERSAMPLE)
  const hiRes = await sharp(svgBuffer, { density, limitInputPixels: false })
    .png()
    .toBuffer()

  const meta = await sharp(hiRes).metadata()
  const { width: w, height: h } = meta

  await sharp(hiRes)
    .resize({
      width: w >= h ? side : null,
      height: h > w ? side : null,
      fit: 'inside',
      withoutEnlargement: false
    })
    .png({ compressionLevel: 9 })
    .toFile(outPath)
}

async function downsamplePngToTight(inputPath, outPath, side) {
  const meta = await sharp(inputPath).metadata()
  const { width: w, height: h } = meta

  await sharp(inputPath)
    .resize({
      width: w >= h ? side : null,
      height: h > w ? side : null,
      fit: 'inside',
      withoutEnlargement: true
    })
    .png({ compressionLevel: 9 })
    .toFile(outPath)
}

async function padTightToSquare(tightPath, squarePath, side) {
  await sharp(tightPath)
    .resize({
      width: side,
      height: side,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(squarePath)
}

export { MAX_DIMENSION }
