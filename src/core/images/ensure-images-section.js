/**
 * PurgeTSS - Ensure `images:` section exists in purgetss/config.cjs
 *
 * Parallel to ensure-brand-section.js. When a project was initialized before
 * the `images` command was introduced, its config.cjs won't have an `images:`
 * key. On first invocation of `purgetss images`, we patch the file to insert
 * the default block between `brand:` and `theme:` (or before `theme:` if
 * `brand:` is not present yet). The user's existing keys are untouched.
 *
 * Also ensures `purgetss/images/` exists so the user can see where sources go,
 * mirroring the `purgetss/fonts/` and `purgetss/brand/` conventions.
 *
 * @fileoverview Auto-injects the `images:` section on first `images` run
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import { logger } from '../branding/branding-logger.js'

// Exported so the test suite can validate the shipped block against the
// whitelist in images-config.js — a drift between the two would ship a config
// PurgeTSS itself generates and then rejects.
export const IMAGES_BLOCK = `  // Sources in purgetss/images/ are 4x masters: a 1024px file yields
  // 256 (mdpi/@1x), 384 (hdpi), 512 (xhdpi/@2x), 768 (xxhdpi/@3x), 1024 (xxxhdpi).
  // There is no width to configure here — the source's own pixels decide.
  // SVGs have no natural pixels; pin theirs in files: [] below.
  images: {
    quality: 85,             // webp/jpeg/avif/tiff quality (0-100); PNG and GIF ignore it
    format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
    autoSync: true,          // false = SVG pipeline computes dims but doesn't write to images.files
    confirmOverwrites: true, // prompt before overwriting files (set false to skip)
    files: []                // per-file overrides: [{ filename: 'images/<sub>/<name>.<ext>', width, height? }]
  },
`

export function ensureImagesSection({ projectRoot = process.cwd(), createFolder = true } = {}) {
  const configPath = path.join(projectRoot, 'purgetss', 'config.cjs')
  const imagesFolder = path.join(projectRoot, 'purgetss', 'images')

  if (createFolder && !fs.existsSync(imagesFolder)) {
    fs.mkdirSync(imagesFolder, { recursive: true })
  }

  if (!fs.existsSync(configPath)) return

  const original = fs.readFileSync(configPath, 'utf8')

  if (/^\s*images\s*:/m.test(original)) return

  // Insert before the `theme:` key so the order stays purge → brand → images → theme.
  const match = original.match(/(^\s*)theme\s*:/m)
  if (!match) return

  const patched = original.replace(match[0], `${IMAGES_BLOCK}${match[0]}`)

  try {
    fs.writeFileSync(configPath, patched, 'utf8')
    console.log()
    logger.success(`Added ${chalk.cyan('images:')} section to ${chalk.cyan('./purgetss/config.cjs')} with default values.`)
    console.log('  Edit that block to customize defaults (quality, format).')
    console.log('  CLI flags always win over config values.')
    console.log()
  } catch (err) {
    logger.warning(`Could not auto-add images: section to config.cjs (${err.message}).`)
    logger.warning('The command will still run using built-in defaults.')
  }
}
