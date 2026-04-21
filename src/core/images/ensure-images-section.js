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
import chalk from 'chalk'
import { projectsConfigJS, projectsPurge_TSS_Images_Folder } from '../../shared/constants.js'
import { logger } from '../branding/branding-logger.js'

const IMAGES_BLOCK = `  images: {
    quality: 85,             // JPEG/WebP/AVIF quality (0-100)
    format: null,            // null = keep original; 'webp' | 'jpeg' | 'png' to convert every image
    confirmOverwrites: true  // prompt before overwriting files (set false to skip)
  },
`

export function ensureImagesSection() {
  if (!fs.existsSync(projectsPurge_TSS_Images_Folder)) {
    fs.mkdirSync(projectsPurge_TSS_Images_Folder, { recursive: true })
  }

  if (!fs.existsSync(projectsConfigJS)) return

  const original = fs.readFileSync(projectsConfigJS, 'utf8')

  if (/^\s*images\s*:/m.test(original)) return

  // Insert before the `theme:` key so the order stays purge → brand → images → theme.
  const match = original.match(/(^\s*)theme\s*:/m)
  if (!match) return

  const patched = original.replace(match[0], `${IMAGES_BLOCK}${match[0]}`)

  try {
    fs.writeFileSync(projectsConfigJS, patched, 'utf8')
    console.log()
    logger.success(`Added ${chalk.cyan('images:')} section to ${chalk.cyan('./purgetss/config.cjs')} with default values.`)
    console.log(`  Edit that block to customize defaults (quality, format).`)
    console.log(`  CLI flags always win over config values.`)
    console.log()
  } catch (err) {
    logger.warning(`Could not auto-add images: section to config.cjs (${err.message}).`)
    logger.warning(`The command will still run using built-in defaults.`)
  }
}
