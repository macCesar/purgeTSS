/**
 * PurgeTSS - gen-ios
 *
 * Produces Titanium's two root-level iOS/Android icons:
 *
 *   DefaultIcon.png       1024×1024, alpha preserved (universal fallback)
 *   DefaultIcon-ios.png   1024×1024, alpha flattened on bg-color (iOS)
 *
 * Two distinct paddings — `DefaultIcon.png` is the universal fallback (iOS +
 * Android when no adaptive icons exist), so it uses the Android safe-zone
 * padding to stay inside launcher masks. `DefaultIcon-ios.png` is iOS-only
 * (no launcher mask), so it uses the looser aesthetic iOS padding.
 *
 * Apple rejects alpha on App Store icon uploads, so DefaultIcon-ios.png is
 * always flattened onto the bg-color.
 *
 * @fileoverview Root iOS icons for Titanium projects
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const CANVAS = 1024

export async function genIos(tightMaster, bgColor, androidPadding, iosPadding, outRoot) {
  fs.mkdirSync(outRoot, { recursive: true })

  const defaultIconPath = path.join(outRoot, 'DefaultIcon.png')
  const defaultIconIosPath = path.join(outRoot, 'DefaultIcon-ios.png')

  // DefaultIcon.png — alpha preserved, Android safe-zone padding so it stays
  // launcher-mask-safe when Android falls back to it.
  await renderSquare(tightMaster, androidPadding, null, defaultIconPath)

  // DefaultIcon-ios.png — flattened on bg-color, iOS aesthetic padding.
  await renderSquare(tightMaster, iosPadding, bgColor, defaultIconIosPath)

  return { defaultIcon: defaultIconPath, defaultIconIos: defaultIconIosPath }
}

async function renderSquare(tightMaster, paddingPct, flattenBg, outPath) {
  const inner = Math.floor((CANVAS * (100 - 2 * paddingPct)) / 100)

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

  if (flattenBg) {
    await pipeline.flatten({ background: flattenBg }).removeAlpha().png({ compressionLevel: 9 }).toFile(outPath)
  } else {
    await pipeline.png({ compressionLevel: 9 }).toFile(outPath)
  }
}
