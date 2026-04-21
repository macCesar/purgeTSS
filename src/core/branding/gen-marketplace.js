/**
 * PurgeTSS - gen-marketplace
 *
 * Store-submission artwork:
 *
 *   iTunesConnect.png      1024×1024 (App Store)
 *   MarketplaceArtwork.png 512×512   (Google Play)
 *
 * Alpha handling depends on whether --bg-color was explicitly provided:
 *   - not provided → alpha preserved (matches `ti create` default template)
 *   - provided     → alpha flattened onto bg-color (safer for dark-mode stores)
 *
 * @fileoverview Marketplace artwork for Titanium branding
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

export async function genMarketplace(tightMaster, paddingPct, outRoot, opts = {}) {
  const { flatten = false, bgColor = '#FFFFFF' } = opts
  fs.mkdirSync(outRoot, { recursive: true })

  const itunesConnect = await renderSquare(
    tightMaster,
    paddingPct,
    1024,
    path.join(outRoot, 'iTunesConnect.png'),
    { flatten, bgColor }
  )
  const marketplaceArtwork = await renderSquare(
    tightMaster,
    paddingPct,
    512,
    path.join(outRoot, 'MarketplaceArtwork.png'),
    { flatten, bgColor }
  )

  return { itunesConnect, marketplaceArtwork }
}

async function renderSquare(tight, paddingPct, canvasSize, outPath, { flatten, bgColor }) {
  const inner = Math.floor((canvasSize * (100 - 2 * paddingPct)) / 100)

  const resized = await sharp(tight)
    .resize({
      width: inner,
      height: inner,
      fit: 'inside',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer()

  let pipeline = sharp({
    create: {
      width: canvasSize,
      height: canvasSize,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite([{ input: resized, gravity: 'center' }])

  if (flatten) {
    pipeline = pipeline.flatten({ background: bgColor }).removeAlpha()
  }

  await pipeline.png({ compressionLevel: 9 }).toFile(outPath)
  return outPath
}
