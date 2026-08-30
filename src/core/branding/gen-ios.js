/**
 * PurgeTSS - gen-ios
 *
 * Produces Titanium's two root-level universal/iOS icons:
 *
 *   DefaultIcon.png       1024×1024, alpha flattened on bg-color (fallback)
 *   DefaultIcon-ios.png   1024×1024, alpha flattened on bg-color (iOS)
 *
 * Both files belong to the `icon` piece and therefore use its one configured
 * padding. Android safe-zone padding belongs to the separate `adaptive` piece.
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

export async function genIos(tightMaster, bgColor, iconPadding, outRoot) {
  fs.mkdirSync(outRoot, { recursive: true })

  const defaultIconPath = path.join(outRoot, 'DefaultIcon.png')
  const defaultIconIosPath = path.join(outRoot, 'DefaultIcon-ios.png')

  // Keep the universal fallback opaque so platform-generated variants never
  // inherit transparent regions.
  await renderSquare(tightMaster, iconPadding, bgColor, defaultIconPath)

  await renderSquare(tightMaster, iconPadding, bgColor, defaultIconIosPath)

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
