/**
 * PurgeTSS - Keep the `brand:` section of config.cjs present and current
 *
 * Two jobs, both on the file rather than in memory:
 *
 *   1. A config.cjs written before `brand` existed has no `brand:` section at
 *      all — insert the default block between `purge:` and `theme:`.
 *   2. A config.cjs whose `brand:` uses an older structure is rewritten to the
 *      current one, carrying over every value its owner had customized.
 *
 * Rationale:
 * - Keeps the config self-documenting — the user sees the current defaults in
 *   their own file rather than having to look them up in docs.
 * - Mirrors how `ensureConfig()` creates the file from the template when it is
 *   missing, and how it renames config.js to config.cjs.
 * - The command itself then reads exactly one structure. No fallbacks, no
 *   translation on every run.
 *
 * @fileoverview Injects / updates the `brand:` section of config.cjs
 * @author César Estrada
 */

import fs from 'fs'
import chalk from 'chalk'
import { projectsConfigJS, projectsPurge_TSS_Brand_Folder } from '../../shared/constants.js'
import { logger } from './branding-logger.js'
import { renderBrandBlock } from './render-brand-block.js'
import { migrateBrandSection } from './migrate-brand-section.js'

/**
 * Make sure purgetss/brand/ exists, then make sure config.cjs carries a
 * `brand:` block in the current structure.
 *
 * Silently skips if:
 *   - config.cjs doesn't exist (will be created by ensureConfig() elsewhere)
 *   - the file can't be patched safely (structure doesn't match expectation)
 *
 * @param {Object} [opts]
 * @param {boolean} [opts.createFolder] - Also create purgetss/brand/ (default true)
 * @returns {boolean} True when config.cjs was written
 */
export function ensureBrandSection(opts = {}) {
  const { createFolder = true } = opts

  // Mirrors how init creates `purgetss/fonts/` empty so the user can see where
  // assets go.
  if (createFolder && !fs.existsSync(projectsPurge_TSS_Brand_Folder)) {
    fs.mkdirSync(projectsPurge_TSS_Brand_Folder, { recursive: true })
  }

  if (!fs.existsSync(projectsConfigJS)) return false

  const original = fs.readFileSync(projectsConfigJS, 'utf8')

  // Present already — bring its structure up to date if needed.
  if (/^\s*brand\s*:/m.test(original)) {
    return migrateBrandSection(projectsConfigJS)
  }

  // Insert before the `theme:` key. The regex captures the indentation so we
  // preserve whatever the user's style is (2-space, 4-space, etc.).
  const match = original.match(/(^[ \t]*)theme\s*:/m)
  if (!match) {
    // Non-standard layout — don't risk corrupting it. User can add manually.
    return false
  }

  const patched = original.replace(match[0], `${renderBrandBlock({}, { indent: match[1] })}${match[0]}`)

  try {
    fs.writeFileSync(projectsConfigJS, patched, 'utf8')
    console.log()
    logger.success(`Added ${chalk.cyan('brand:')} section to ${chalk.cyan('./purgetss/config.cjs')} with default values.`)
    console.log('  Edit that block to customize brand defaults (logos, padding, colors, etc.).')
    console.log('  CLI flags always win over config values.')
    console.log()
    return true
  } catch (err) {
    logger.warning(`Could not auto-add brand: section to config.cjs (${err.message}).`)
    logger.warning('The command will still run using built-in defaults.')
    return false
  }
}
