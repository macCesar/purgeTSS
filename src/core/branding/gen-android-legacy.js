/**
 * PurgeTSS - gen-android-legacy
 *
 * Flat ic_launcher.png for pre-adaptive Android (API 21–25, ~3% of users in 2026).
 * Composites foreground over background, scaled to legacy launcher sizes.
 *
 * Legacy densities: mdpi=48, hdpi=72, xhdpi=96, xxhdpi=144, xxxhdpi=192.
 *
 * @fileoverview Legacy ic_launcher.png × 5 densities
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const LEGACY_DENSITIES = [
  { name: 'mdpi', size: 48 },
  { name: 'hdpi', size: 72 },
  { name: 'xhdpi', size: 96 },
  { name: 'xxhdpi', size: 144 },
  { name: 'xxxhdpi', size: 192 }
]

export async function genAndroidLegacy(masterPng, bgColor, paddingPct, resRoot) {
  const generated = []

  for (const { name, size } of LEGACY_DENSITIES) {
    const inner = Math.floor((size * (100 - 2 * paddingPct)) / 100)
    const dir = path.join(resRoot, `mipmap-${name}`)
    fs.mkdirSync(dir, { recursive: true })

    const outPath = path.join(dir, 'ic_launcher.png')

    const innerLogo = await sharp(masterPng)
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
        background: bgColor
      }
    })
      .composite([{ input: innerLogo, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(outPath)

    generated.push(outPath)
  }

  return generated
}
