/**
 * PurgeTSS - PNG optimization
 *
 * Re-encodes the generated PNGs with a quantized palette, the same trick
 * TinyPNG and pngquant use. Logos are flat artwork with few distinct colors,
 * which is exactly the case where a 256-color palette is indistinguishable
 * from truecolor at a fraction of the size — measured at ~71% smaller across
 * a full brand set.
 *
 * It is lossy, which is why it is opt-in. A logo with wide gradients is the
 * case to watch: banding can appear where truecolor was smooth.
 *
 * Runs as a post-pass over the files the pipeline just wrote rather than
 * inside each generator, so every piece — including ones added later — is
 * covered from one place.
 *
 * Worth knowing about the platforms: iOS re-encodes every PNG in the bundle
 * with `pngcrush -iphone` at package time, but that is lossless, so the saving
 * here is not something the SDK would have done anyway. On Android nothing in
 * Titanium touches these files.
 *
 * @fileoverview Opt-in palette quantization for generated branding assets
 * @author César Estrada
 */

import fs from 'fs'
import sharp from 'sharp'

/** Palette quality handed to sharp. High enough that flat artwork is untouched to the eye. */
const PALETTE_QUALITY = 90

/**
 * Re-encode PNGs in place with a quantized palette.
 *
 * Files that come out larger are left as they were — quantization does not pay
 * off on every image, and never making a file worse is the cheaper promise to
 * keep. Anything that is not a PNG (ic_launcher.xml) is skipped.
 *
 * @param {string[]} paths - Absolute paths written by the pipeline
 * @returns {Promise<{files: number, before: number, after: number}>} Byte totals
 *   over the files actually rewritten
 */
export async function optimizePngs(paths) {
  const pngs = paths.filter((file) => file.toLowerCase().endsWith('.png') && fs.existsSync(file))

  let files = 0
  let before = 0
  let after = 0

  for (const file of pngs) {
    const originalSize = fs.statSync(file).size

    let optimized
    try {
      optimized = await sharp(file)
        .png({ compressionLevel: 9, palette: true, quality: PALETTE_QUALITY })
        .toBuffer()
    } catch {
      continue // unreadable or unsupported — leave the file exactly as it was
    }

    if (optimized.length >= originalSize) continue

    fs.writeFileSync(file, optimized)
    files += 1
    before += originalSize
    after += optimized.length
  }

  return { files, before, after }
}

/**
 * @param {number} bytes
 * @returns {string} e.g. '105.1 KB'
 */
export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
