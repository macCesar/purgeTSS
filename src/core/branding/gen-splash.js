/**
 * PurgeTSS - gen-splash
 *
 * Android 12+ SplashScreen API icon × 5 densities.
 *
 * Spec: 288dp canvas, icon occupies central 192dp (~67% of canvas).
 * The OS applies a circular mask automatically — keep pixels transparent
 * outside the 192dp safe-zone.
 *
 * Densities: mdpi=288, hdpi=432, xhdpi=576, xxhdpi=864, xxxhdpi=1152.
 * Output path: drawable-<density>/splash_icon.png
 *
 * @fileoverview Android 12+ splash icons × 5 densities
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const SPLASH_DENSITIES = [
  { name: 'mdpi', size: 288 },
  { name: 'hdpi', size: 432 },
  { name: 'xhdpi', size: 576 },
  { name: 'xxhdpi', size: 864 },
  { name: 'xxxhdpi', size: 1152 }
]

export async function genSplash(tightMaster, resRoot) {
  const generated = []

  for (const { name, size } of SPLASH_DENSITIES) {
    const inner = Math.floor((size * 192) / 288)
    const dir = path.join(resRoot, `drawable-${name}`)
    fs.mkdirSync(dir, { recursive: true })

    const outPath = path.join(dir, 'splash_icon.png')

    const innerLogo = await sharp(tightMaster)
      .resize({
        width: inner,
        height: inner,
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer()

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: innerLogo, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(outPath)

    generated.push(outPath)
  }

  return generated
}
