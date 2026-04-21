/**
 * PurgeTSS - gen-android-adaptive
 *
 * Adaptive icon triplet (foreground + background + monochrome) at 5 densities.
 *
 * Android adaptive icon: 108×108dp canvas, 66×66dp safe-zone.
 * Densities: mdpi=108, hdpi=162, xhdpi=216, xxhdpi=324, xxxhdpi=432.
 *
 *   foreground:  logo centered inside safe-zone, transparent outside
 *   background:  solid color filling the full canvas
 *   monochrome:  foreground silhouette in white, alpha preserved
 *                (Android applies themed tint at runtime on API 31+ — this
 *                 layer is Android's dark/light mode mechanism for app icons)
 *
 * @fileoverview Android adaptive icons × 5 densities
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const DENSITIES = [
  { name: 'mdpi', size: 108 },
  { name: 'hdpi', size: 162 },
  { name: 'xhdpi', size: 216 },
  { name: 'xxhdpi', size: 324 },
  { name: 'xxxhdpi', size: 432 }
]

export async function genAndroidAdaptive(tightMaster, bgColor, paddingPct, resRoot, opts = {}) {
  const { monoTight = null } = opts
  const generated = []

  for (const { name, size } of DENSITIES) {
    const inner = Math.floor((size * (100 - 2 * paddingPct)) / 100)
    const dir = path.join(resRoot, `mipmap-${name}`)
    fs.mkdirSync(dir, { recursive: true })

    const foregroundPath = path.join(dir, 'ic_launcher_foreground.png')
    const backgroundPath = path.join(dir, 'ic_launcher_background.png')
    const monochromePath = path.join(dir, 'ic_launcher_monochrome.png')

    // Foreground: logo sized to inner, centered on transparent canvas
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
      .toFile(foregroundPath)

    // Background: solid color
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: bgColor
      }
    })
      .png({ compressionLevel: 9 })
      .toFile(backgroundPath)

    // Monochrome: white silhouette with preserved alpha.
    if (monoTight) {
      const innerMono = await sharp(monoTight)
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
        .composite([{ input: innerMono, gravity: 'center' }])
        .ensureAlpha()
        .linear([0, 0, 0, 1], [255, 255, 255, 0])
        .png({ compressionLevel: 9 })
        .toFile(monochromePath)
    } else {
      await sharp(foregroundPath)
        .ensureAlpha()
        .linear([0, 0, 0, 1], [255, 255, 255, 0])
        .png({ compressionLevel: 9 })
        .toFile(monochromePath)
    }

    generated.push(foregroundPath, backgroundPath, monochromePath)
  }

  fs.mkdirSync(path.join(resRoot, 'mipmap-anydpi-v26'), { recursive: true })

  return generated
}
