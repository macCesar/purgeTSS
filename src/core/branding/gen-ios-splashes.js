/**
 * PurgeTSS - gen-ios-splashes
 *
 * Generates the 16 Default*.png launch images a Titanium project carries under
 * assets/iphone/. They ship with the template still showing the grey Alloy
 * logo, so a project that never touched them advertises Alloy on every screen
 * size iOS decides to read them from.
 *
 * With <enable-launch-screen-storyboard> on (the default since Titanium 8) iOS
 * draws the storyboard instead and these files stop being read. They are
 * regenerated anyway: they are part of the project tree, and the user should
 * not have to know which API consumes which file.
 *
 * Output paths:
 *   Alloy   -> app/assets/iphone/Default*.png
 *   Classic -> Resources/iphone/Default*.png
 *
 * @fileoverview iPhone launch image generator
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { logoBox } from './splash-geometry.js'
import { roundArtworkCorners } from './round-artwork-corners.js'

/**
 * The exact set shipped by the Titanium template, with the sizes it uses.
 * Sizes verified against a project created with Titanium SDK 14.
 */
const SPLASH_TARGETS = [
  { file: 'Default.png', width: 320, height: 480 },
  { file: 'Default@2x.png', width: 640, height: 960 },
  { file: 'Default-568h@2x.png', width: 640, height: 1136 },
  { file: 'Default-667h@2x.png', width: 750, height: 1334 },
  { file: 'Default-Landscape.png', width: 1024, height: 768 },
  { file: 'Default-Landscape@2x.png', width: 2048, height: 1536 },
  { file: 'Default-Landscape-736h@3x.png', width: 2208, height: 1242 },
  { file: 'Default-Landscape-1792h@2x.png', width: 1792, height: 828 },
  { file: 'Default-Landscape-2436h@3x.png', width: 2436, height: 1125 },
  { file: 'Default-Landscape-2688h@3x.png', width: 2688, height: 1242 },
  { file: 'Default-Portrait.png', width: 768, height: 1024 },
  { file: 'Default-Portrait@2x.png', width: 1536, height: 2048 },
  { file: 'Default-Portrait-736h@3x.png', width: 1242, height: 2208 },
  { file: 'Default-Portrait-1792h@2x.png', width: 828, height: 1792 },
  { file: 'Default-Portrait-2436h@3x.png', width: 1125, height: 2436 },
  { file: 'Default-Portrait-2688h@3x.png', width: 1242, height: 2688 }
]

/**
 * Generates every iPhone launch image.
 *
 * @param {string} masterPng - Path to the prepared master logo (tight)
 * @param {string|Object} bgColor - Background as sharp accepts it
 * @param {string} iphoneDir - Absolute path to <assets>/iphone
 * @param {number} paddingPct - Padding per side, as a percentage of the shorter side
 * @param {number} [cornerRadiusPct=0] - Artwork corner radius as a percentage of its shorter side
 * @returns {Promise<string[]>} Absolute paths of the files written
 */
export async function genIosSplashes(masterPng, bgColor, iphoneDir, paddingPct, cornerRadiusPct = 0) {
  fs.mkdirSync(iphoneDir, { recursive: true })

  const written = []

  for (const target of SPLASH_TARGETS) {
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

    const outPath = path.join(iphoneDir, target.file)

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
 * The files this generator writes, for dry-run output and for callers that
 * need to report what would be touched without generating anything.
 *
 * @returns {string[]} File names, in the order they are generated
 */
export function listIosSplashTargets() {
  return SPLASH_TARGETS.map((target) => target.file)
}

/**
 * Canvas sizes, so callers can work out how many pixels the largest one needs.
 * @returns {Array<[number, number]>} [width, height] pairs
 */
export function listIosSplashSizes() {
  return SPLASH_TARGETS.map((target) => [target.width, target.height])
}
