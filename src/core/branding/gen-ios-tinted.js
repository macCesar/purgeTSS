/**
 * PurgeTSS - gen-ios-tinted
 *
 * Produces Titanium's iOS 18+ tinted root icon:
 *
 *   DefaultIcon-Tinted.png   1024×1024, grayscale flattened on black
 *
 * Per Apple HIG (iOS 18+): the tinted variant must be a fully opaque grayscale
 * image over a BLACK (#000000) background. iOS composites its own gradient
 * background and accent color on top of the grayscale luminance at runtime.
 *
 * @fileoverview iOS 18+ tinted icon variant
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const CANVAS = 1024

export async function genIosTinted(tightMaster, paddingPct, outRoot) {
  fs.mkdirSync(outRoot, { recursive: true })

  const inner = Math.floor((CANVAS * (100 - 2 * paddingPct)) / 100)
  const outPath = path.join(outRoot, 'DefaultIcon-Tinted.png')

  // Grayscale the master while keeping alpha — iOS needs luminance info,
  // not color, to apply the system accent tint at runtime.
  const resized = await sharp(tightMaster)
    .grayscale()
    .resize({
      width: inner,
      height: inner,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer()

  await sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: resized, gravity: 'center' }])
    .flatten({ background: '#000000' })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  return outPath
}
