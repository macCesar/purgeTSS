/**
 * PurgeTSS - `semantic` command
 *
 * Generates Titanium semantic colors (app/assets/semantic.colors.json for
 * Alloy, Resources/semantic.colors.json for Classic) in two modes, dispatched
 * by --single:
 *
 *   Palette mode (no --single):
 *     One base hex → 11-step tonal palette with mirror-by-index Light/Dark
 *     inversion (anchored at shade 500). Writes JSON + config mapping (the
 *     11 shade keys are mechanically derived from the family name, so the
 *     class mapping is unambiguous).
 *
 *   Single mode (--single):
 *     Explicit light + optional dark + optional alpha → one purpose-based
 *     semantic color. Writes JSON ONLY. The class name mapping in config.cjs
 *     is a design-layer decision (designers pick `bg-surface` to point at
 *     `surfaceColor`, `text-on-surface` to point at `textColor`, etc.) and
 *     should not be auto-derived from the semantic key. The command tells
 *     the user how to add the mapping.
 *
 *     If the name matches an existing palette shade (e.g. `amazon50` while
 *     palette `amazon` exists), the operation narrows to an in-place JSON
 *     value edit — no new top-level entry, no config touch.
 *
 * @author César Estrada
 */

import chalk from 'chalk'
import { logger } from '../../shared/logger.js'
import { ensureConfig, getConfigFile } from '../../shared/config-manager.js'
import { validateProject, getSemanticColorsRelPath } from '../utils/project-detection.js'
import {
  toCamelCase,
  buildSemanticPalette,
  buildSingleSemantic,
  writeSemanticColors,
  writeSemanticJSON,
  writeConfigMapping,
  updateSemanticEntry,
  wrapHexWithAlpha,
  detectFamilyShadeConflict,
  normalizeAlpha,
  checkIfColorModule,
  missingHexMessage
} from './shades.js'

/**
 * Normalize a user-supplied name into both kebab and camel forms while
 * preserving the user's case. Handles three input shapes:
 *   - camelCase ('surfaceColor')   → { kebab: 'surface-color', camel: 'surfaceColor' }
 *   - kebab     ('surface-color')  → { kebab: 'surface-color', camel: 'surfaceColor' }
 *   - natural   ('Surface Color')  → { kebab: 'surface-color', camel: 'surfaceColor' }
 */
function parseName(raw) {
  const clean = String(raw).replace(/'/g, '').replace(/\//g, '').trim()
  if (/\s/.test(clean)) {
    const kebab = clean.toLowerCase().split(/\s+/).join('-')
    return { kebab, camel: toCamelCase(kebab) }
  }
  if (clean.includes('-')) {
    const kebab = clean.toLowerCase()
    return { kebab, camel: toCamelCase(kebab) }
  }
  // No space, no hyphen: treat as camelCase or single word, preserve case
  const camel = clean
  const kebab = camel.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
  return { kebab, camel }
}

export async function semantic(args, options) {
  const silent = options.log

  if (options.single) {
    return runSingle(args, options, silent)
  }

  return runPalette(args, options, silent)
}

async function runPalette(args, options, silent) {
  if (!args.hexcode && !options.random) {
    logger.block(...missingHexMessage('semantic'))
    return false
  }

  const chroma = (await import('chroma-js')).default
  const referenceColorFamilies = (await import('../../../lib/color-shades/tailwindColors.js')).default
  const generateColorShades = (await import('../../../lib/color-shades/generateColorShades.js')).default

  const colorFamily = options.random
    ? generateColorShades(chroma.random(), referenceColorFamilies)
    : generateColorShades(args.hexcode, referenceColorFamilies)

  if (args.name) colorFamily.name = args.name
  else if (options.name) colorFamily.name = options.name

  colorFamily.name = colorFamily.name.replace(/'/g, '').replace(/\//g, '').replace(/\s+/g, ' ')

  const { kebab: kebabName } = parseName(colorFamily.name)
  const { semanticEntries, configMapping } = buildSemanticPalette(colorFamily, kebabName)

  // Preview mode: log the JSON, no writes, no project check
  if (silent) {
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} palette preview:\n${JSON.stringify(semanticEntries, null, 2)}`)
    return true
  }

  if (!validateProject(silent)) return false
  ensureConfig()
  writeSemanticColors(semanticEntries, kebabName, configMapping, options)
  logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} palette (11 shades) saved to`, chalk.yellow(getSemanticColorsRelPath()))

  return true
}

function runSingle(args, options, silent) {
  const lightHex = args.hexcode
  const rawName = args.name || options.name
  if (!lightHex) {
    logger.info(`${chalk.red('Missing light hex.')} Usage: ${chalk.green("pt semantic --single '#F9FAFB' surfaceColor [--dark '#0f172a'] [--alpha 50]")}`)
    return false
  }
  if (!rawName) {
    logger.info(`${chalk.red('Missing name.')} Usage: ${chalk.green("pt semantic --single '#F9FAFB' surfaceColor [--dark '#0f172a'] [--alpha 50]")}`)
    return false
  }

  const darkHex = options.dark || lightHex
  const alpha = normalizeAlpha(options.alpha)
  const { kebab: kebabName, camel: camelName } = parseName(rawName)

  // Preview mode: log the JSON, no writes, no Alloy check
  if (silent) {
    const { semanticEntries } = buildSingleSemantic(camelName, lightHex, darkHex, alpha)
    logger.info(`${chalk.hex(lightHex).bold(`"${camelName}"`)} preview:\n${JSON.stringify(semanticEntries, null, 2)}`)
    return true
  }

  if (!validateProject(silent)) return false
  ensureConfig()

  // If the name matches an existing palette shade (e.g. `amazon50` when palette
  // `amazon` is already declared), interpret as an in-place value edit. Update
  // the JSON entry, leave config.cjs alone (palette already maps to this key).
  const conflict = detectFamilyShadeConflict(getConfigFile(), kebabName, camelName)
  if (conflict) {
    const value = {
      light: wrapHexWithAlpha(lightHex, alpha),
      dark: wrapHexWithAlpha(darkHex, alpha)
    }
    updateSemanticEntry(conflict.camelKey, value)
    checkIfColorModule()
    logger.info(`${chalk.hex(lightHex).bold(conflict.camelKey)} updated in ${chalk.yellow(getSemanticColorsRelPath())} — palette ${chalk.yellow(conflict.parentName)} already references this key, config.cjs left unchanged.`)
    return true
  }

  // Fresh single entry: write JSON + auto-map config.cjs to a sensible class name.
  // Convention: strip the trailing 'Color' suffix (Titanium's semantic naming
  // pattern) and kebab-case the rest. Users who want a different class name
  // (`on-surface` for `textColor`, etc.) edit config.cjs after the fact —
  // overriding the auto-mapping is one keystroke; typing it from scratch is many.
  const { semanticEntries } = buildSingleSemantic(camelName, lightHex, darkHex, alpha)
  const className = suggestClassName(camelName)
  writeSemanticJSON(semanticEntries, camelName)
  writeConfigMapping(className, camelName, options)
  logger.info(`${chalk.hex(lightHex).bold(`"${camelName}"`)} saved to ${chalk.yellow(getSemanticColorsRelPath())} and mapped to class ${chalk.green(className)} in ${chalk.yellow('config.cjs')}.`)
  return true
}

/**
 * Derive a class name from a Titanium semantic key by stripping the
 * conventional `Color` suffix and kebab-casing the result.
 *   'surfaceColor'      → 'surface'
 *   'surfaceHighColor'  → 'surface-high'
 *   'borderColor'       → 'border'
 *   'overlay'           → 'overlay'  (no Color suffix → unchanged)
 */
function suggestClassName(camelKey) {
  const stripped = camelKey.replace(/Color$/, '') || camelKey
  return stripped.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

export default { semantic }
