/**
 * PurgeTSS - gen-feature-graphic
 *
 * Google Play Feature Graphic:
 *   MarketplaceArtworkFeature.png  1024×500  (Play Store listing top banner)
 *
 * Always flattened on bgColor — Google Play requires opaque artwork.
 *
 * Layout: a square logo block centered both horizontally and vertically inside
 * the 1024×500 canvas. Padding is vertical-driven (top/bottom) — the inner
 * box becomes side = 500 - 2*pad. The logo is scaled with `fit: 'inside'`
 * so wide/tall logos preserve aspect ratio inside that square.
 *
 * @fileoverview Google Play Feature Graphic for Titanium branding
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { roundArtworkCorners } from './round-artwork-corners.js'

const CANVAS_WIDTH = 1024
const CANVAS_HEIGHT = 500

export async function genFeatureGraphic(featureMaster, paddingPct, outRoot, opts = {}) {
  const { bgColor = '#FFFFFF', cornerRadiusPct = 0 } = opts
  fs.mkdirSync(outRoot, { recursive: true })

  const padPx = Math.floor((CANVAS_HEIGHT * paddingPct) / 100)
  const inner = CANVAS_HEIGHT - 2 * padPx
  const outPath = path.join(outRoot, 'MarketplaceArtworkFeature.png')

  const resized = await sharp(featureMaster)
    .resize({
      width: inner,
      height: inner,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer()
  const artwork = await roundArtworkCorners(resized, cornerRadiusPct)

  await sharp({
    create: {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: artwork, gravity: 'center' }])
    .flatten({ background: bgColor })
    .removeAlpha()
    .png({ compressionLevel: 9 })
    .toFile(outPath)

  return outPath
}
