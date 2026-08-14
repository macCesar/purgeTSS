/**
 * PurgeTSS - gen-appicon
 *
 * Generates the 128×128 appicon.png a Titanium project carries under
 * assets/android/. Titanium reads it as the fallback for tiapp.xml's <icon>
 * when the Android manifest does not declare android:icon, so on a project
 * that never touched the manifest it is the launcher icon.
 *
 * It ships with the template showing the grey Alloy logo, which is reason
 * enough to regenerate it whether or not a given project still reads it.
 *
 * Output paths:
 *   Alloy   -> app/assets/android/appicon.png
 *   Classic -> Resources/android/appicon.png
 *
 * @fileoverview Android appicon.png generator
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

const CANVAS = 128

/**
 * @param {string} masterPng - Path to the prepared master logo (square)
 * @param {string|Object} bgColor - Background as sharp accepts it
 * @param {number} paddingPct - Padding per side, as a percentage of the canvas
 * @param {string} outDir - Absolute path to <assets>/android
 * @returns {Promise<string>} Absolute path of the file written
 */
export async function genAppicon(masterPng, bgColor, paddingPct, outDir) {
  fs.mkdirSync(outDir, { recursive: true })

  const outPath = path.join(outDir, 'appicon.png')
  const inner = Math.max(1, Math.floor((CANVAS * (100 - 2 * paddingPct)) / 100))

  const logo = await sharp(masterPng)
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
      background: bgColor
    }
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  return outPath
}
