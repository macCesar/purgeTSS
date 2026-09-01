/**
 * PurgeTSS - gen-launch-logo
 *
 * Generates LaunchLogo.png, the source Titanium resizes into the five sizes of
 * LaunchLogo.imageset on every iOS build. The SDK does that resizing itself:
 * it looks for LaunchLogo.png first and falls back to DefaultIcon.png when the
 * project does not provide one.
 *
 * So this file is not about producing the imageset — it is about choosing what
 * the storyboard shows. With only DefaultIcon.png around, the launch screen
 * displays the app icon, safe-zone padding included. A dedicated LaunchLogo.png
 * lets the launch screen show the full logotype instead.
 *
 * The canvas is 1024×1024 exactly: the SDK validates the size and discards the
 * file with a warning when it does not match.
 *
 * The output keeps its alpha — the storyboard paints
 * <default-background-color> behind it.
 *
 * Output paths:
 *   Alloy   -> app/assets/iphone/LaunchLogo.png
 *   Classic -> Resources/iphone/LaunchLogo.png
 *
 * @fileoverview iOS LaunchLogo.png generator
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { roundArtworkCorners } from './round-artwork-corners.js'

const CANVAS = 1024

/**
 * @param {string} masterPng - Path to the prepared master logo (tight)
 * @param {number} paddingPct - Padding per side, as a percentage of the canvas
 * @param {string} iphoneDir - Absolute path to <assets>/iphone
 * @param {Object} [opts]
 * @param {string|null} [opts.bgColor] - Flatten on this color instead of keeping alpha
 * @param {number} [opts.cornerRadiusPct=0] - Artwork corner radius as a percentage of its shorter side
 * @returns {Promise<string>} Absolute path of the file written
 */
export async function genLaunchLogo(masterPng, paddingPct, iphoneDir, opts = {}) {
  const { bgColor = null, cornerRadiusPct = 0 } = opts
  fs.mkdirSync(iphoneDir, { recursive: true })

  const outPath = path.join(iphoneDir, 'LaunchLogo.png')
  const inner = Math.max(1, Math.floor((CANVAS * (100 - 2 * paddingPct)) / 100))

  const resizedLogo = await sharp(masterPng)
    .resize({
      width: inner,
      height: inner,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer()
  const logo = await roundArtworkCorners(resizedLogo, cornerRadiusPct)

  const pipeline = sharp({
    create: {
      width: CANVAS,
      height: CANVAS,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  }).composite([{ input: logo, gravity: 'center' }])

  if (bgColor) pipeline.flatten({ background: bgColor })

  await pipeline.png({ compressionLevel: 9 }).toFile(outPath)

  return outPath
}
