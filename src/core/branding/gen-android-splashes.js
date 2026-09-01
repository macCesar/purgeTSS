/**
 * PurgeTSS - gen-android-splashes
 *
 * Generates the per-orientation, per-density splash screens that Titanium
 * projects carry under app/assets/android/images/res-*\/default.png.
 *
 * These are the files a new project inherits from the template still showing
 * the grey Alloy logo. They are not dead weight: `process-splashes-task.js`
 * maps res-<qualifier>/default.png to res/drawable-<qualifier>/background.png,
 * and Android below 12 uses that as the splash. Verified on an Android 10
 * emulator with an app built on SDK 13.4.0 — the Alloy logo showed full screen.
 *
 * Android 12 and above ignore the image and draw the app icon instead, so this
 * only affects API 23-30. A project theme that points windowBackground at a
 * colour also overrides it.
 *
 * Output paths (Alloy):
 *   app/assets/android/images/res-<long|notlong>-<port|land>-<density>/default.png
 *
 * @fileoverview Legacy Android per-qualifier splash generator
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { logoBox } from './splash-geometry.js'
import { roundArtworkCorners } from './round-artwork-corners.js'

/**
 * The exact set shipped by the Titanium template, with the sizes it uses.
 * Kept as-is on purpose: the goal is to replace those files one by one, so a
 * project ends up with its own artwork where the Alloy logo used to be.
 *
 * Note there is no res-long-port-mdpi in the template. Not adding one keeps
 * the generated set identical to what the project already expects.
 */
const SPLASH_TARGETS = [
  { folder: 'res-long-land-hdpi', width: 800, height: 480 },
  { folder: 'res-long-land-ldpi', width: 400, height: 240 },
  { folder: 'res-long-land-mdpi', width: 480, height: 320 },
  { folder: 'res-long-port-hdpi', width: 480, height: 800 },
  { folder: 'res-long-port-ldpi', width: 240, height: 400 },
  { folder: 'res-notlong-land-hdpi', width: 800, height: 480 },
  { folder: 'res-notlong-land-ldpi', width: 320, height: 240 },
  { folder: 'res-notlong-land-mdpi', width: 480, height: 320 },
  { folder: 'res-notlong-port-hdpi', width: 480, height: 800 },
  { folder: 'res-notlong-port-ldpi', width: 240, height: 320 },
  { folder: 'res-notlong-port-mdpi', width: 320, height: 480 }
]

/**
 * Generates every per-qualifier splash screen.
 *
 * @param {string} masterPng - Path to the prepared master logo (tight)
 * @param {string|Object} bgColor - Background as sharp accepts it
 * @param {string} imagesDir - Absolute path to <assets>/android/images
 * @param {number} paddingPct - Padding per side, as a percentage of the shorter side
 * @param {number} [cornerRadiusPct=0] - Artwork corner radius as a percentage of its shorter side
 * @returns {Promise<string[]>} Absolute paths of the files written
 */
export async function genAndroidSplashes(masterPng, bgColor, imagesDir, paddingPct, cornerRadiusPct = 0) {
  const written = []

  for (const target of SPLASH_TARGETS) {
    const outDir = path.join(imagesDir, target.folder)
    fs.mkdirSync(outDir, { recursive: true })

    const logoSide = logoBox(target.width, target.height, paddingPct)

    const resizedLogo = await sharp(masterPng)
      .resize({
        width: logoSide,
        height: logoSide,
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .toBuffer()
    const logo = await roundArtworkCorners(resizedLogo, cornerRadiusPct)

    const outPath = path.join(outDir, 'default.png')

    await sharp({
      create: {
        width: target.width,
        height: target.height,
        channels: 4,
        background: bgColor
      }
    })
      .composite([{ input: logo, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(outPath)

    written.push(outPath)
  }

  return written
}

/**
 * The folders this generator writes to, for dry-run output and for callers
 * that need to report what would be touched without generating anything.
 *
 * @returns {string[]} Folder names, in the order they are generated
 */
export function listSplashFolders() {
  return SPLASH_TARGETS.map((target) => target.folder)
}

/**
 * Canvas sizes, so callers can work out how many pixels the largest one needs.
 * @returns {Array<[number, number]>} [width, height] pairs
 */
export function listSplashSizes() {
  return SPLASH_TARGETS.map((target) => [target.width, target.height])
}
