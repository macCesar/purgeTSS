/**
 * PurgeTSS - prepare-master
 *
 * Produces two normalized masters from a single input:
 *
 *   1. <base>_square.png — 1024×1024 PNG, logo centered in a transparent square
 *      canvas. Used for iOS DefaultIcon + marketplace artwork.
 *
 *   2. <base>_tight.png — logo rasterized at 1024-px max dimension with native
 *      aspect preserved (no padding). Used for Android adaptive icons so a
 *      horizontal wordmark fills the safe-zone by width instead of being
 *      double-padded inside a square.
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

const MAX_DIMENSION = 1024

/**
 * Prepare dual masters (square + tight) from a single input.
 * @param {string} inputPath - Path to SVG or PNG master
 * @param {string} basePath - Output base path (no extension, e.g. /tmp/foo/_master)
 * @returns {Promise<{square: string, tight: string}>} Paths to both outputs
 */
export async function prepareMaster(inputPath, basePath) {
  const ext = path.extname(inputPath).toLowerCase().slice(1)
  const squarePath = `${basePath}_square.png`
  const tightPath = `${basePath}_tight.png`

  fs.mkdirSync(path.dirname(basePath), { recursive: true })

  if (ext === 'svg') {
    await rasterizeSvgToTight(inputPath, tightPath)
  } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg' || ext === 'webp') {
    await downsamplePngToTight(inputPath, tightPath)
  } else {
    throw new Error(`Unsupported master format: .${ext} (expected .svg or .png)`)
  }

  await padTightToSquare(tightPath, squarePath)

  return { square: squarePath, tight: tightPath }
}

async function rasterizeSvgToTight(svgPath, outPath) {
  const { buffer: svgBuffer, naturalMax } = await readSvgSafely(svgPath, {
    logger,
    withAdvice: true
  })

  // Supersample to ~4× MAX_DIMENSION so the final downsample yields clean edges.
  const density = computeSvgDensity(naturalMax, MAX_DIMENSION * 4)
  const hiRes = await sharp(svgBuffer, { density, limitInputPixels: false })
    .png()
    .toBuffer()

  const meta = await sharp(hiRes).metadata()
  const { width: w, height: h } = meta

  await sharp(hiRes)
    .resize({
      width: w >= h ? MAX_DIMENSION : null,
      height: h > w ? MAX_DIMENSION : null,
      fit: 'inside',
      withoutEnlargement: false
    })
    .png({ compressionLevel: 9 })
    .toFile(outPath)
}

async function downsamplePngToTight(inputPath, outPath) {
  const meta = await sharp(inputPath).metadata()
  const { width: w, height: h } = meta

  await sharp(inputPath)
    .resize({
      width: w >= h ? MAX_DIMENSION : null,
      height: h > w ? MAX_DIMENSION : null,
      fit: 'inside',
      withoutEnlargement: true
    })
    .png({ compressionLevel: 9 })
    .toFile(outPath)
}

async function padTightToSquare(tightPath, squarePath) {
  await sharp(tightPath)
    .resize({
      width: MAX_DIMENSION,
      height: MAX_DIMENSION,
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png({ compressionLevel: 9 })
    .toFile(squarePath)
}

export { MAX_DIMENSION }
