/**
 * PurgeTSS - gen-ios-dark
 *
 * Produces Titanium's iOS 18+ dark-mode root icon:
 *
 *   DefaultIcon-Dark.png   1024×1024, transparent (default) or flattened on dark bg
 *
 * Per Apple HIG (iOS 18+): the dark variant may either (a) omit the background
 * so the system applies its own dark gradient, or (b) use an opaque dark tint.
 * Default here is (a) — transparent — per Apple's recommended approach.
 *
 * Titanium SDK 13.1+ is expected to read this file from the project root, but
 * upstream issue tidev/titanium-sdk#14122 is not yet merged — until then, the
 * user may need to manually place the PNG inside Assets.xcassets/AppIcon.appiconset.
 *
 * @fileoverview iOS 18+ dark icon variant
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const CANVAS = 1024

/**
 * @param {string} tightMaster - Main tight master, or --dark-master output
 * @param {string|null} bgColor - Hex color for opaque flatten, or null for transparent
 * @param {number} paddingPct - Padding per side (0-40)
 * @param {string} outRoot - Output directory
 * @returns {Promise<string>} Path to DefaultIcon-Dark.png
 */
export async function genIosDark(tightMaster, bgColor, paddingPct, outRoot) {
  fs.mkdirSync(outRoot, { recursive: true })

  const inner = Math.floor((CANVAS * (100 - 2 * paddingPct)) / 100)
  const outPath = path.join(outRoot, 'DefaultIcon-Dark.png')

  const resized = await sharp(tightMaster)
    .resize({
      width: inner,
      height: inner,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer()

  const pipeline = sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([{ input: resized, gravity: 'center' }])

  if (bgColor) {
    // Opaque variant: flatten on dark tint, strip alpha entirely.
    await pipeline
      .flatten({ background: bgColor })
      .removeAlpha()
      .png({ compressionLevel: 9 })
      .toFile(outPath)
  } else {
    // Apple-recommended default: preserve alpha. System paints its own dark gradient.
    await pipeline.png({ compressionLevel: 9 }).toFile(outPath)
  }

  return outPath
}
