/**
 * Inspect source artwork for the common "finished icon inside another icon"
 * mistake: an opaque, full-bleed square is inset onto a contrasting canvas.
 *
 * The check is advisory only. It never changes the configured background or
 * padding because a splash/marketing composition may intentionally use them.
 */

import sharp from 'sharp'

const SAMPLE_SIDE = 64
const OPAQUE_ALPHA = 250
const OPAQUE_EDGE_RATIO = 0.98
const VISIBLE_RGB_DISTANCE = 48

// These pieces turn padding into a visible canvas around icon-like artwork.
// Splashes are excluded: centering a mark on a launch background is expected.
const FRAME_SENSITIVE_PIECES = new Set([
  'icon',
  'marketplace',
  'adaptive',
  'legacy-icon',
  'appicon'
])

/**
 * Sample the source perimeter and report whether artwork reaches it opaquely.
 * SVG and raster inputs use the same small Sharp raster, so the result is
 * deterministic and cheap.
 *
 * @param {string|Buffer} input
 * @returns {Promise<{opaqueToEdges: boolean, edgeOpacity: number, edgeColor: string, edgeRgb: number[]}>}
 */
export async function analyzeArtworkEdges(input) {
  const { data, info } = await sharp(input)
    .resize(SAMPLE_SIDE, SAMPLE_SIDE, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const pixels = []
  const add = (x, y) => {
    const offset = (y * info.width + x) * info.channels
    pixels.push([
      data[offset],
      data[offset + 1],
      data[offset + 2],
      data[offset + 3]
    ])
  }

  for (let x = 0; x < info.width; x++) {
    add(x, 0)
    add(x, info.height - 1)
  }
  for (let y = 1; y < info.height - 1; y++) {
    add(0, y)
    add(info.width - 1, y)
  }

  const opaque = pixels.filter((pixel) => pixel[3] >= OPAQUE_ALPHA)
  const edgeOpacity = opaque.length / pixels.length
  const edgeRgb = [0, 1, 2].map((channel) => median(opaque.map((pixel) => pixel[channel])))

  return {
    opaqueToEdges: edgeOpacity >= OPAQUE_EDGE_RATIO,
    edgeOpacity,
    edgeColor: toHex(edgeRgb),
    edgeRgb
  }
}

/**
 * Return configured pieces that would expose a contrasting border around the
 * shared main artwork. Piece-specific logos are analyzed by their author and
 * are deliberately excluded from this main-source warning.
 *
 * @param {Object} analysis - Result from analyzeArtworkEdges()
 * @param {string[]} selected - Runnable piece names
 * @param {Object} pieces - Resolved piece configuration
 * @returns {Array<{name: string, padding: number, background: string}>}
 */
export function findVisibleFrameRisks(analysis, selected, pieces) {
  if (!analysis.opaqueToEdges) return []

  return selected.flatMap((name) => {
    const piece = pieces[name]
    if (!FRAME_SENSITIVE_PIECES.has(name) || piece?.logo || !(piece?.padding > 0)) return []

    const background = parseHex(piece.background)
    if (!background || rgbDistance(analysis.edgeRgb, background) < VISIBLE_RGB_DISTANCE) return []

    return [{ name, padding: piece.padding, background: piece.background }]
  })
}

function parseHex(value) {
  const match = /^#([0-9a-f]{6})$/i.exec(value ?? '')
  if (!match) return null
  return [0, 2, 4].map((offset) => parseInt(match[1].slice(offset, offset + 2), 16))
}

function rgbDistance(left, right) {
  return Math.sqrt(left.reduce((sum, value, index) => sum + ((value - right[index]) ** 2), 0))
}

function median(values) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

function toHex(rgb) {
  return `#${rgb.map((value) => value.toString(16).padStart(2, '0')).join('').toUpperCase()}`
}
