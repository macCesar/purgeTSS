/**
 * PurgeTSS - gen-notification
 *
 * White-on-transparent notification icons × 5 densities.
 *
 * Android status bar applies runtime tint based on the notification's color
 * property, so all non-transparent pixels become white. Color info is discarded.
 *
 * Sizes: mdpi=24, hdpi=36, xhdpi=48, xxhdpi=72, xxxhdpi=96.
 * Output path: drawable-<density>/ic_stat_notify.png
 *
 * Notification icons are NOT masked by the launcher, so they render as drawn.
 * Trim any transparent padding in the master first, then scale the logo to
 * fill the canvas edge-to-edge with a 1px anti-aliasing margin per side.
 *
 * @fileoverview Status-bar notification icons × 5 densities
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export const NOTIFICATION_DENSITIES = [
  { name: 'mdpi', size: 24 },
  { name: 'hdpi', size: 36 },
  { name: 'xhdpi', size: 48 },
  { name: 'xxhdpi', size: 72 },
  { name: 'xxxhdpi', size: 96 }
]

const EDGE_MARGIN = 2

export async function genNotification(tightMaster, resRoot) {
  const generated = []

  const trimmedMaster = await sharp(tightMaster)
    .trim()
    .png()
    .toBuffer()

  for (const { name, size } of NOTIFICATION_DENSITIES) {
    const inner = Math.max(1, size - EDGE_MARGIN)
    const dir = path.join(resRoot, `drawable-${name}`)
    fs.mkdirSync(dir, { recursive: true })

    const outPath = path.join(dir, 'ic_stat_notify.png')

    const whitened = await sharp(trimmedMaster)
      .resize({
        width: inner,
        height: inner,
        fit: 'inside',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .ensureAlpha()
      .linear([0, 0, 0, 1], [255, 255, 255, 0])
      .toBuffer()

    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: whitened, gravity: 'center' }])
      .png({ compressionLevel: 9 })
      .toFile(outPath)

    generated.push(outPath)
  }

  return generated
}
