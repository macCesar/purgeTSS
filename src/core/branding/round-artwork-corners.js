/**
 * Round the corners of already-resized non-icon artwork.
 *
 * The percentage is measured against the artwork's shorter side, so 50%
 * produces a circle for square artwork and a capsule for a wordmark. A zero
 * radius returns the original buffer untouched to preserve legacy output.
 *
 * @fileoverview Shared Sharp mask for non-icon branding artwork
 */

import sharp from 'sharp'

/**
 * @param {Buffer} artwork - Resized PNG buffer
 * @param {number} cornerRadiusPct - Integer percentage in the 0-50 range
 * @returns {Promise<Buffer>}
 */
export async function roundArtworkCorners(artwork, cornerRadiusPct) {
  if (cornerRadiusPct === 0) return artwork

  const { width, height } = await sharp(artwork).metadata()
  const radius = Math.min(width, height) * cornerRadiusPct / 100
  const mask = Buffer.from([
    `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`,
    `  <rect width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff"/>`,
    '</svg>'
  ].join('\n'))

  return sharp(artwork)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}
