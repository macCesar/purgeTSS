/**
 * PurgeTSS - Images command config validation
 *
 * Parallel to assertKnownBrandKeys() in ../branding/brand-config.js, and for
 * the same reason: an ignored `qualty: 95` is indistinguishable from the
 * default, so a typo silently produces the wrong output instead of an error.
 *
 * The section stays deliberately small. A source image already carries its own
 * configuration — its pixels are the width, its subfolder is the destination,
 * its extension is the format — so `images:` only holds what no file can say.
 *
 * `autoSync` belongs to this section but is read by the SVG pipeline
 * (../svg/index.js), not by the images command.
 *
 * @fileoverview Whitelist + validator for the `images:` section
 * @author César Estrada
 */

export const IMAGES_KEYS = ['quality', 'format', 'autoSync', 'confirmOverwrites', 'files']

// ../svg/sync-images.js rewrites entries from scratch (renderEntry), so an
// extra key would be dropped on the next autoSync run anyway.
export const IMAGES_FILE_KEYS = ['filename', 'width', 'height']

/**
 * Reject any key the `images:` section does not define, at both levels.
 *
 * @param {Object} imagesConfig - The `images:` section as written by the user
 * @throws {Error} Listing every unknown key it found
 */
export function assertKnownImagesKeys(imagesConfig) {
  if (!imagesConfig || typeof imagesConfig !== 'object') return

  const problems = []

  for (const key of Object.keys(imagesConfig)) {
    if (!IMAGES_KEYS.includes(key)) problems.push(`images.${key}`)
  }

  const files = imagesConfig.files
  if (files !== undefined && !Array.isArray(files)) {
    problems.push('images.files (expected an array of { filename, width })')
  } else if (Array.isArray(files)) {
    files.forEach((entry, index) => {
      if (entry === null || typeof entry !== 'object' || Array.isArray(entry)) {
        problems.push(`images.files[${index}] (expected an object like { filename: 'images/logo.svg', width: 128 })`)
        return
      }
      for (const inner of Object.keys(entry)) {
        if (!IMAGES_FILE_KEYS.includes(inner)) problems.push(`images.files[${index}].${inner}`)
      }
      // Without a filename the entry matches nothing and is dropped in silence
      // by buildOverridesMap() — the same failure this validator exists to stop.
      if (typeof entry.filename !== 'string') {
        problems.push(`images.files[${index}].filename (required, a string like 'images/logo.svg')`)
      }
    })
  }

  if (problems.length === 0) return

  throw new Error([
    'Unknown key(s) in the images: section of purgetss/config.cjs:',
    ...problems.map((problem) => `  • ${problem}`),
    '',
    `  Top-level keys: ${IMAGES_KEYS.join(', ')}`,
    `  Inside files[]: ${IMAGES_FILE_KEYS.join(', ')}`,
    '',
    '  Check the spelling. No images were generated.'
  ].join('\n'))
}
