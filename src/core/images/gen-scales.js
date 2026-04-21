/**
 * PurgeTSS - gen-scales
 *
 * For a single source image, generate the 8 Titanium multi-density variants:
 *
 *   Android (5 densities, each in its own mipmap/drawable folder):
 *     res-mdpi    = 1/4 of source  (1× baseline)
 *     res-hdpi    = 1.5/4 of source
 *     res-xhdpi   = 2/4 of source  (2×)
 *     res-xxhdpi  = 3/4 of source  (3×)
 *     res-xxxhdpi = full source    (4×, maximum density)
 *
 *   iPhone (3 scales in one folder, suffix in filename):
 *     @1x = 1/4 of source
 *     @2x = 2/4 of source
 *     @3x = 3/4 of source
 *
 * Convention inherited from Titanium Alloy: source images are treated as
 * 4× (xxxhdpi/@4x) masters, and all other scales are derived from them.
 *
 * @fileoverview Scale a source image into the 8 Titanium density variants
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { logger } from '../branding/branding-logger.js'
import { computeSvgDensity, readSvgSafely } from '../../shared/svg-utils.js'

/**
 * Read source image: for SVGs, uses readSvgSafely (buffer + metadata + viewBox
 * warning); for raster images, reads metadata directly from the file path.
 *
 * @returns {Promise<{path: string, meta: Object, isSvg: boolean, buffer: Buffer|null}>}
 */
async function readSource(sourceFile) {
  const isSvg = path.extname(sourceFile).toLowerCase() === '.svg'
  if (isSvg) {
    const { buffer, meta } = await readSvgSafely(sourceFile, { logger })
    return { path: sourceFile, meta, isSvg: true, buffer }
  }
  const meta = await sharp(sourceFile).metadata()
  return { path: sourceFile, meta, isSvg: false, buffer: null }
}

/**
 * Build a Sharp pipeline for the requested scale. For SVG sources, density is
 * computed so the rasterization lands at ~2× target — avoiding the pixel limit
 * regardless of viewBox size.
 */
function buildScalePipeline(src, targetMax) {
  if (src.isSvg) {
    const naturalMax = Math.max(src.meta.width, src.meta.height)
    // 2× target for antialiasing headroom before Sharp's downsample.
    const density = computeSvgDensity(naturalMax, targetMax * 2)
    return sharp(src.buffer, { density, limitInputPixels: false })
  }
  return sharp(src.path)
}

export const ANDROID_SCALES = Object.freeze([
  { name: 'res-mdpi',    factor: 1 / 4 },
  { name: 'res-hdpi',    factor: 1.5 / 4 },
  { name: 'res-xhdpi',   factor: 2 / 4 },
  { name: 'res-xxhdpi',  factor: 3 / 4 },
  { name: 'res-xxxhdpi', factor: 4 / 4 }
])

export const IPHONE_SCALES = Object.freeze([
  { suffix: '',    factor: 1 / 4 },
  { suffix: '@2x', factor: 2 / 4 },
  { suffix: '@3x', factor: 3 / 4 }
])

/**
 * Scale a source image into all Android density variants.
 *
 * @param {string} sourceFile - Absolute path to source image
 * @param {string} relPath - Path inside the source root (e.g. 'buttons/btn.png')
 * @param {string} androidBaseDir - e.g. <project>/app/assets/android/images
 * @param {Object} opts
 * @param {string|null} [opts.format] - 'webp'|'jpeg'|'png'|null (null = keep original)
 * @param {number} [opts.quality=85]
 * @returns {Promise<string[]>} Paths written
 */
export async function genAndroidScales(sourceFile, relPath, androidBaseDir, opts = {}) {
  const { format = null, quality = 85 } = opts
  const src = await readSource(sourceFile)
  const written = []

  for (const { name, factor } of ANDROID_SCALES) {
    const targetWidth = Math.max(1, Math.round(src.meta.width * factor))
    const targetHeight = Math.max(1, Math.round(src.meta.height * factor))

    const outDir = path.join(androidBaseDir, name, path.dirname(relPath))
    fs.mkdirSync(outDir, { recursive: true })

    const outPath = path.join(outDir, renameWithFormat(path.basename(relPath), format, src.isSvg))
    await writeScaled(src, outPath, targetWidth, targetHeight, format, quality)
    written.push(outPath)
  }
  return written
}

/**
 * Scale a source image into all iPhone scale variants.
 *
 * @param {string} sourceFile - Absolute path to source image
 * @param {string} relPath - Path inside the source root (e.g. 'buttons/btn.png')
 * @param {string} iphoneBaseDir - e.g. <project>/app/assets/iphone/images
 * @param {Object} opts - Same shape as genAndroidScales
 * @returns {Promise<string[]>} Paths written
 */
export async function genIphoneScales(sourceFile, relPath, iphoneBaseDir, opts = {}) {
  const { format = null, quality = 85 } = opts
  const src = await readSource(sourceFile)
  const written = []

  const parsed = path.parse(relPath)
  const outDir = path.join(iphoneBaseDir, parsed.dir)
  fs.mkdirSync(outDir, { recursive: true })

  for (const { suffix, factor } of IPHONE_SCALES) {
    const targetWidth = Math.max(1, Math.round(src.meta.width * factor))
    const targetHeight = Math.max(1, Math.round(src.meta.height * factor))

    // SVG sources can't be written as SVG by Sharp — fall back to PNG if the
    // user didn't specify an explicit output format.
    const ext = format ? `.${format}` : (src.isSvg ? '.png' : parsed.ext)
    const outName = `${parsed.name}${suffix}${ext}`
    const outPath = path.join(outDir, outName)

    await writeScaled(src, outPath, targetWidth, targetHeight, format, quality)
    written.push(outPath)
  }
  return written
}

function renameWithFormat(filename, format, isSvg = false) {
  if (format) {
    const parsed = path.parse(filename)
    return `${parsed.name}.${format}`
  }
  // SVG masters can't be written back as SVG by Sharp — coerce to PNG.
  if (isSvg) {
    const parsed = path.parse(filename)
    return `${parsed.name}.png`
  }
  return filename
}

async function writeScaled(src, outPath, width, height, format, quality) {
  const targetMax = Math.max(width, height)
  let pipeline = buildScalePipeline(src, targetMax).resize({
    width,
    height,
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  })

  // For SVG sources without an explicit format, coerce output to PNG
  // (Sharp cannot write SVG).
  const fallbackExt = src.isSvg ? 'png' : path.extname(src.path).slice(1).toLowerCase()
  const fmt = format || fallbackExt
  pipeline = applyFormat(pipeline, fmt === 'jpg' ? 'jpeg' : fmt, quality)

  await pipeline.toFile(outPath)
}

function applyFormat(pipeline, format, quality) {
  switch (format) {
    case 'png':  return pipeline.png({ quality, compressionLevel: 9 })
    case 'webp': return pipeline.webp({ quality })
    case 'avif': return pipeline.avif({ quality })
    case 'tiff': return pipeline.tiff({ quality, compression: 'lzw' })
    case 'gif':  return pipeline.gif()
    case 'jpeg': return pipeline.flatten({ background: '#ffffff' }).jpeg({ quality })
    default:     return pipeline
  }
}
