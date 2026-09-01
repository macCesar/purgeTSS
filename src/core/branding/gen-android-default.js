/**
 * PurgeTSS - gen-android-default
 *
 * Generates the Android splash Titanium projects carry at
 * app/assets/android/default.png. Still read on Android <12 when the app does
 * not provide a custom windowBackground theme.
 *
 * Sized by the same rule as its 11 per-qualifier siblings and as the iPhone
 * launch images — see splash-geometry.js — so the whole splash set shows the
 * logo at one consistent size.
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
import { logoBox } from './splash-geometry.js'
import { roundArtworkCorners } from './round-artwork-corners.js'

const DEFAULT_WIDTH = 1440
const DEFAULT_HEIGHT = 2560

/**
 * @param {string} masterPng - Path to the prepared master logo (tight)
 * @param {string|Object} bgColor - Background as sharp accepts it
 * @param {string} outDir - Absolute path to <assets>/android
 * @param {number} paddingPct - Padding per side, as a percentage of the shorter side
 * @param {number} [cornerRadiusPct=0] - Artwork corner radius as a percentage of its shorter side
 * @returns {Promise<string>} Absolute path of the file written
 */
export async function genAndroidDefault(masterPng, bgColor, outDir, paddingPct, cornerRadiusPct = 0) {
  fs.mkdirSync(outDir, { recursive: true })

  const outPath = path.join(outDir, 'default.png')
  const logoSide = logoBox(DEFAULT_WIDTH, DEFAULT_HEIGHT, paddingPct)

  const resizedLogo = await sharp(masterPng)
    .resize({
      width: logoSide,
      height: logoSide,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer()
  const innerLogo = await roundArtworkCorners(resizedLogo, cornerRadiusPct)

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
