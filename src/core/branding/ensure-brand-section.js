/**
 * PurgeTSS - Ensure `brand:` section exists in purgetss/config.cjs
 *
 * When a project was initialized before `brand` was introduced, its
 * config.cjs won't have a `brand:` section. On first invocation of
 * `purgetss brand`, we patch the file to insert the default block
 * between `purge:` and `theme:`. The user's existing keys are untouched.
 *
 * Rationale:
 * - Keeps the config self-documenting — the user sees the defaults in
 *   their own file rather than having to look them up in docs.
 * - Mirrors how `ensureConfig()` creates the file from the template when
 *   it's missing altogether.
 * - Non-destructive: only adds if absent, never overwrites existing values.
 *
 * @fileoverview Auto-injects the `brand:` section on first brand run
 * @author César Estrada
 */

import fs from 'fs'
import chalk from 'chalk'
import { projectsConfigJS, projectsPurge_TSS_Brand_Folder } from '../../shared/constants.js'
import { logger } from './branding-logger.js'

const BRAND_BLOCK = `  brand: {
    splash: false,           // also generate splash_icon.png × 5
    padding: '15%',          // Android safe-zone. Range: 12% tight (mature logos) — 20% conservative. Spec floor 19.44%.
    iosPadding: '4%',        // iOS aesthetic. Range: 2% bold — 8% conservative. No launcher mask.
    darkBgColor: null,       // opaque dark bg for DefaultIcon-Dark.png (null = transparent per Apple HIG)
    bgColor: '#FFFFFF',      // Android adaptive bg + iOS/marketplace flatten
    notification: false,     // also generate ic_stat_notify.png × 5
    confirmOverwrites: true  // prompt before overwriting files (set false to skip)
  },
`

/**
 * If the project's config.cjs exists but has no `brand:` key, inject the
 * default block between `purge:` and `theme:`. Prints a notice when it does.
 *
 * Silently skips if:
 *   - config.cjs doesn't exist (will be created by ensureConfig() elsewhere)
 *   - `brand:` is already present
 *   - file can't be patched safely (structure doesn't match expectation)
 */
export function ensureBrandSection() {
  // Always make sure the logos folder exists — mirrors how init creates
  // `purgetss/fonts/` empty so the user can see where assets go.
  if (!fs.existsSync(projectsPurge_TSS_Brand_Folder)) {
    fs.mkdirSync(projectsPurge_TSS_Brand_Folder, { recursive: true })
  }

  if (!fs.existsSync(projectsConfigJS)) return

  const original = fs.readFileSync(projectsConfigJS, 'utf8')

  // Already present — nothing to do.
  if (/^\s*brand\s*:/m.test(original)) return

  // Insert before the `theme:` key. Regex captures the indentation so we
  // preserve whatever the user's style is (2-space, 4-space, etc.).
  const match = original.match(/(^\s*)theme\s*:/m)
  if (!match) {
    // Non-standard layout — don't risk corrupting it. User can add manually.
    return
  }

  const patched = original.replace(match[0], `${BRAND_BLOCK}${match[0]}`)

  try {
    fs.writeFileSync(projectsConfigJS, patched, 'utf8')
    console.log()
    logger.success(`Added ${chalk.cyan('brand:')} section to ${chalk.cyan('./purgetss/config.cjs')} with default values.`)
    console.log('  Edit that block to customize brand defaults (bgColor, padding, etc.).')
    console.log('  CLI flags always win over config values.')
    console.log()
  } catch (err) {
    logger.warning(`Could not auto-add brand: section to config.cjs (${err.message}).`)
    logger.warning('The command will still run using built-in defaults.')
  }
}
