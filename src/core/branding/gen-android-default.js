/**
 * PurgeTSS - gen-android-default
 *
 * Generates the legacy Android splash fallback used by Titanium projects via
 * app/assets/android/default.png. This path is still relevant on Android <12
 * when the app does not provide a custom windowBackground theme.
 *
 * Output path:
 *   Alloy   -> app/assets/android/default.png
 *   Classic -> Resources/android/default.png
 *
 * @fileoverview Legacy Android default.png splash generator
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const DEFAULT_WIDTH = 1440
const DEFAULT_HEIGHT = 2560

export async function genAndroidDefault(masterPng, bgColor, outDir) {
  fs.mkdirSync(outDir, { recursive: true })

  const outPath = path.join(outDir, 'default.png')
  const innerWidth = Math.floor(DEFAULT_WIDTH * 0.72)
  const innerHeight = Math.floor(DEFAULT_HEIGHT * 0.26)

  const innerLogo = await sharp(masterPng)
    .resize({
      width: innerWidth,
      height: innerHeight,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer()

  await sharp({
    create: {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{ input: innerLogo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  return outPath
}
