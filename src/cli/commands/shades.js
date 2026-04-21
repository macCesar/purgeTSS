 
/**
 * PurgeTSS v7.1 - Shades Commands
 *
 * CLI commands for color shade generation and management.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Color shades and colorModule commands
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import { createRequire } from 'module'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import { projectsConfigJS, projectsLibFolder, projectsSemanticColorsJSON } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { ensureConfig, getConfigFile } from '../../shared/config-manager.js'
import { cleanDoubleQuotes } from '../utils/file-operations.js'

// Create require for ESM compatibility
const require = createRequire(import.meta.url)

/**
 * Create color module with all colors from config
 * Maintains exact same logic as original colorModule() function
 *
 * @returns {boolean} Success status
 */
export function colorModule() {
  if (!alloyProject()) {
    return false
  }

  ensureConfig()

  const colorModuleConfigFile = require(projectsConfigJS)

  makeSureFolderExists(projectsLibFolder)

  const mainColors = {
    ...colorModuleConfigFile.theme.colors,
    ...colorModuleConfigFile.theme.extend.colors
  }

  fs.writeFileSync(
    `${projectsLibFolder}/purgetss.colors.js`,
    'module.exports = ' + cleanDoubleQuotes(mainColors, {}),
    'utf8',
    err => { throw err }
  )

  logger.info(`All colors copied to ${chalk.yellow('lib/purgetss.colors.js')}`)

  return true
}

/**
 * Check if color module exists and update if needed
 * Maintains exact same logic as original checkIfColorModule() function
 */
export function checkIfColorModule() {
  if (fs.existsSync(`${projectsLibFolder}/purgetss.colors.js`)) {
    colorModule()
  }
}

/**
 * Build the "missing hex" error message shown when the user invokes `shades`
 * or `semantic` without a hex argument and without `--random`. The common
 * cause is an unquoted `#` on the command line — bash/zsh treat everything
 * from `#` onward as a comment, so `pt shades #6A2489` reaches the CLI as
 * `pt shades` with no argument. We surface the shell behavior explicitly so
 * the user isn't mystified by a silent random color.
 */
export function missingHexMessage(commandName) {
  return [
    chalk.red('No hex color provided.'),
    `If you typed ${chalk.yellow(`pt ${commandName} #6A2489`)} (unquoted), your shell stripped ${chalk.yellow('#6A2489')}`,
    'as a comment — the CLI never received it.',
    '',
    'Try one of these instead:',
    `  ${chalk.green(`pt ${commandName} '#6A2489'`)}   ${chalk.gray('(quoted)')}`,
    `  ${chalk.green(`pt ${commandName} 6A2489`)}      ${chalk.gray('(no hash)')}`,
    `  ${chalk.green(`pt ${commandName} --random`)}    ${chalk.gray('(random color)')}`
  ]
}

/**
 * Main shades command - generates color shades from hex codes
 * Maintains exact same logic as original shades() function
 *
 * @param {Object} args - Command arguments
 * @param {string} args.hexcode - Hex color code
 * @param {string} args.name - Color name
 * @param {Object} options - Command options
 * @param {boolean} options.random - Generate random color
 * @param {string} options.name - Color name from options
 * @param {boolean} options.override - Override existing colors
 * @param {boolean} options.tailwind - Tailwind output format
 * @param {boolean} options.json - JSON output format
 * @param {boolean} options.log - Log output
 * @param {boolean} options.quotes - Use quotes in output
 * @param {boolean} options.single - Single color format
 * @returns {Promise<boolean>} Success status
 */
export async function shades(args, options) {
  if (!args.hexcode && !options.random) {
    logger.block(...missingHexMessage('shades'))
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

  const silent = options.tailwind || options.json || options.log
  const inAlloyProject = !silent && alloyProject(silent)

  const colorObject = createColorObject(colorFamily, colorFamily.hexcode, options)

  if (inAlloyProject) {
    ensureConfig()
    const configFile = getConfigFile()

    if (options.override) {
      if (!configFile.theme.colors) configFile.theme.colors = {}
      configFile.theme.colors[colorObject.name] = colorObject.shades

      if (configFile.theme.extend.colors) {
        if (configFile.theme.extend.colors[colorObject.name]) delete configFile.theme.extend.colors[colorObject.name]
        if (Object.keys(configFile.theme.extend.colors).length === 0) delete configFile.theme.extend.colors
      }
    } else {
      if (!configFile.theme.extend.colors) configFile.theme.extend.colors = {}
      configFile.theme.extend.colors[colorObject.name] = colorObject.shades

      if (configFile.theme.colors) {
        if (configFile.theme.colors[colorObject.name]) delete configFile.theme.colors[colorObject.name]
        if (Object.keys(configFile.theme.colors).length === 0) delete configFile.theme.colors
      }
    }

    fs.writeFileSync(projectsConfigJS, 'module.exports = ' + cleanDoubleQuotes(configFile, options), 'utf8', err => { throw err })
    checkIfColorModule()
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)}) saved in`, chalk.yellow('config.js'))
  } else if (options.json) {
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)})\n${JSON.stringify(colorObject, null, 2)}`)
  } else {
    if (options.tailwind) delete colorObject.shades.default
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)})\n${cleanDoubleQuotes({ colors: { [colorObject.name]: colorObject.shades } }, options)}`)
  }

  return true
}

/**
 * Create color object from color family and options
 * Maintains exact same logic as original createColorObject() function
 *
 * @param {Object} family - Color family object
 * @param {string} hexcode - Hex color code
 * @param {Object} options - Command options
 * @returns {Object} Color object
 */
function createColorObject(family, hexcode, options) {
  const colors = {}
  const name = family.name.toLowerCase().split(' ').join('-')

  if (options.json) {
    const shades = {}
    colors.global = {}
    shades[name] = hexcode
    family.shades.forEach((shade) => {
      shades[`${name}-${shade.number}`] = shade.hexcode
    })
    colors.global.colors = (options.single) ? { [name]: hexcode } : shades
  } else if (options.single) {
    colors.name = name
    colors.shades = hexcode
  } else {
    const shades = { default: hexcode }
    family.shades.forEach((shade) => {
      shades[shade.number] = shade.hexcode
    })
    colors.name = name
    colors.shades = shades
  }

  return colors
}

/**
 * Convert a kebab-case color name to camelCase for semantic JSON keys.
 * Example: 'amazon-green' → 'amazonGreen'. Leaves single-word names untouched.
 * Exported because the `semantic` command imports it for shade-conflict detection.
 *
 * @param {string} kebabName - kebab-case color name
 * @returns {string} camelCase name
 */
export function toCamelCase(kebabName) {
  return kebabName.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase())
}

/**
 * Validate and normalize the --alpha CLI input.
 * Returns undefined when no alpha was supplied; throws on invalid input.
 * Per the Titanium semantic.colors.json spec, alpha is a string in 0.0-100.0
 * (integer or float). See ti-expert/references/theming.md.
 *
 * @param {string|number|undefined} input - raw CLI value
 * @returns {string|undefined} normalized alpha as string, or undefined
 */
export function normalizeAlpha(input) {
  if (input === undefined || input === null || input === '') return undefined
  const n = Number(input)
  if (!Number.isFinite(n) || n < 0 || n > 100) {
    throw new Error(`--alpha must be a number between 0 and 100 (got "${input}")`)
  }
  return String(n)
}

/**
 * Wrap a hex value in the Titanium semantic-color extended form when alpha is
 * present, or return the bare hex string otherwise. Both forms are valid per
 * the Titanium spec (a single semantic.colors.json may mix them).
 *
 * @param {string} hex - hex color
 * @param {string|undefined} alpha - normalized alpha string, or undefined
 * @returns {string|{color: string, alpha: string}}
 */
function wrapValue(hex, alpha) {
  return alpha === undefined ? hex : { color: hex, alpha }
}

export const SHADE_NUMBERS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
const SHADE_SUFFIX_RE = new RegExp(`^(.+?)(${SHADE_NUMBERS.join('|')})$`)

/**
 * Detect when a name like 'amazon50' refers to an existing palette shade.
 * The `semantic --single` command uses this to decide between in-place update
 * (when the name matches a shade of a palette already declared in config) and
 * the normal full write flow (when the name is independent). Returns the
 * conflict descriptor (parentName + shadeNum + camelKey) or null.
 *
 * Checks BOTH the kebab and camel forms — kebab matches config.cjs keys,
 * camel matches semantic.colors.json keys for multi-word families like
 * `amazonGreen500`.
 *
 * @param {Object} configFile - parsed purgetss/config.cjs
 * @param {string} kebabName - kebab-case name (config.cjs key style)
 * @param {string} camelName - camelCase name (semantic.colors.json key style)
 * @returns {{ parentName: string, shadeNum: string, camelKey: string }|null}
 */
export function detectFamilyShadeConflict(configFile, kebabName, camelName) {
  for (const candidate of [kebabName, camelName]) {
    const match = candidate.match(SHADE_SUFFIX_RE)
    if (!match) continue
    const [, parentName, shadeNum] = match

    const extend = configFile?.theme?.extend?.colors?.[parentName]
    const main = configFile?.theme?.colors?.[parentName]
    const parentMapping = extend ?? main

    if (parentMapping && typeof parentMapping === 'object' && parentMapping[shadeNum] !== undefined) {
      return { parentName, shadeNum, camelKey: candidate === kebabName ? camelName : candidate }
    }
  }
  return null
}

/**
 * Remove all keys in `existing` that belong to the named semantic family —
 * the bare camelName (single form) plus camelName + each of the 11 shade
 * numbers (palette form). Keys outside the family are left untouched, so
 * unrelated palettes and manually-defined entries (`surfaceColor`, etc.)
 * survive a re-run. This makes `shades --semantic` consistent with the
 * non-semantic flow: regenerating a family fully replaces it.
 *
 * @param {Object} existing - parsed semantic.colors.json
 * @param {string} camelName - camelCase family name (e.g., 'amazon', 'glassSurface')
 * @returns {Object} new object without the family's keys
 */
export function stripFamilyKeys(existing, camelName) {
  const familyKeys = new Set([camelName, ...SHADE_NUMBERS.map(n => `${camelName}${n}`)])
  const cleaned = {}
  for (const [key, value] of Object.entries(existing)) {
    if (!familyKeys.has(key)) cleaned[key] = value
  }
  return cleaned
}

/**
 * Build a semantic palette with mirror-by-index light/dark inversion,
 * anchored at shade 500. Pure function — no I/O.
 *
 * For each slot at index i in the sorted (50→950) shade list:
 *   light = shade[last - i].hexcode  (inverted)
 *   dark  = shade[i].hexcode          (original)
 * Slot 500 is the anchor (same light/dark).
 *
 * When alpha is provided, every value is wrapped as { color, alpha }.
 *
 * @param {Object} family - Color family from generateColorShades()
 * @param {string} kebabName - Normalized color name (e.g., 'amazon-green')
 * @param {string|undefined} alpha - Optional alpha string (0-100)
 * @returns {{ semanticEntries: Object, configMapping: Object }}
 */
export function buildSemanticPalette(family, kebabName, alpha) {
  const camelName = toCamelCase(kebabName)
  const sorted = [...family.shades].sort((a, b) => a.number - b.number)
  const semanticEntries = {}
  const configMapping = {}

  sorted.forEach((shade, i) => {
    const mirror = sorted[sorted.length - 1 - i]
    const key = `${camelName}${shade.number}`
    semanticEntries[key] = {
      light: wrapValue(mirror.hexcode, alpha),
      dark: wrapValue(shade.hexcode, alpha)
    }
    configMapping[shade.number] = key
  })

  return { semanticEntries, configMapping }
}

/**
 * Build a single-entry purpose-based semantic color from explicit per-mode
 * hex values. Used by `pt semantic --single`. Light and dark are independent;
 * if `darkHex` is omitted the same value is used for both modes (useful for
 * overlays/glass surfaces where alpha is the variation, not hue).
 *
 * The JSON key is taken VERBATIM — caller is responsible for passing the exact
 * camelCase form expected in semantic.colors.json (e.g. 'surfaceColor'), since
 * Titanium's conventions are case-sensitive and the design-layer class name
 * (config.cjs) is a separate decision that the caller owns.
 *
 * @param {string} camelKey - exact JSON key (e.g. 'surfaceColor', 'overlay')
 * @param {string} lightHex - hex for light mode (required)
 * @param {string|undefined} darkHex - hex for dark mode (defaults to lightHex)
 * @param {string|undefined} alpha - normalized alpha string (0-100), wraps both modes
 * @returns {{ semanticEntries: Object }}
 */
export function buildSingleSemantic(camelKey, lightHex, darkHex, alpha) {
  const dark = darkHex ?? lightHex
  return {
    semanticEntries: {
      [camelKey]: {
        light: wrapValue(lightHex, alpha),
        dark: wrapValue(dark, alpha)
      }
    }
  }
}

/**
 * Wrap a hex value with optional alpha — exposed so the `semantic` command
 * can format individual entries without re-importing the building blocks.
 *
 * @param {string} hex
 * @param {string|undefined} alpha
 * @returns {string|{color:string,alpha:string}}
 */
export function wrapHexWithAlpha(hex, alpha) {
  return wrapValue(hex, alpha)
}

/**
 * Read + parse semantic.colors.json if present. Returns {} for missing/empty.
 * Rethrows on invalid JSON after logging, to protect user data.
 */
function readSemanticJSON() {
  if (!fs.existsSync(projectsSemanticColorsJSON)) return {}
  const raw = fs.readFileSync(projectsSemanticColorsJSON, 'utf8')
  if (!raw.trim()) return {}
  try {
    return JSON.parse(raw)
  } catch (err) {
    logger.info(`${chalk.red('Warning:')} ${chalk.yellow('app/assets/semantic.colors.json')} is not valid JSON. Aborting to avoid data loss.`)
    throw err
  }
}

/**
 * Write the semantic-colors JSON (caller provides the fully-merged object).
 * Ensures app/assets/ exists first.
 */
function persistSemanticJSON(data) {
  const assetsFolder = projectsSemanticColorsJSON.replace(/\/semantic\.colors\.json$/, '')
  makeSureFolderExists(assetsFolder)
  fs.writeFileSync(projectsSemanticColorsJSON, JSON.stringify(data, null, 2) + '\n', 'utf8')
}

/**
 * Write new entries into semantic.colors.json, replacing any prior keys that
 * belong to the same camelName family (single form + 11 shade form). Unrelated
 * keys survive untouched. Used by both palette and single-mode fresh writes.
 *
 * @param {Object} semanticEntries - new entries to merge in
 * @param {string} camelName - family name (for stripping)
 */
export function writeSemanticJSON(semanticEntries, camelName) {
  const existing = readSemanticJSON()
  const cleaned = stripFamilyKeys(existing, camelName)
  const merged = { ...cleaned, ...semanticEntries }
  persistSemanticJSON(merged)
}

/**
 * Update one entry in semantic.colors.json in place, preserving the existing
 * key order. Used when `pt semantic --single` is invoked with a name that
 * matches an existing palette shade — the user is editing a shade value, not
 * creating a new top-level color, so we must NOT touch config.cjs (the
 * palette already maps to this key) and we must NOT shift the key to the end.
 *
 * Spread-merge with an existing key updates the value while keeping the
 * original insertion position (V8/spec object key ordering).
 *
 * @param {string} camelKey - the JSON key to update (already camelCase)
 * @param {string|{color:string,alpha:string}} value - new value (bare hex or wrapped form)
 */
export function updateSemanticEntry(camelKey, value) {
  const existing = readSemanticJSON()
  const updated = { ...existing, [camelKey]: value }
  persistSemanticJSON(updated)
}

/**
 * Write the family-name → configMapping entry into purgetss/config.cjs under
 * theme.extend.colors (or theme.colors when --override is set). Cleans up the
 * opposite branch so the mapping doesn't duplicate.
 *
 * @param {string} kebabName - key in theme.extend.colors / theme.colors
 * @param {Object|string} configMapping - palette object or single string
 * @param {Object} options - CLI options (reads .override and .quotes)
 */
export function writeConfigMapping(kebabName, configMapping, options) {
  const configFile = getConfigFile()

  if (options.override) {
    if (!configFile.theme.colors) configFile.theme.colors = {}
    configFile.theme.colors[kebabName] = configMapping

    if (configFile.theme.extend.colors) {
      if (configFile.theme.extend.colors[kebabName]) delete configFile.theme.extend.colors[kebabName]
      if (Object.keys(configFile.theme.extend.colors).length === 0) delete configFile.theme.extend.colors
    }
  } else {
    if (!configFile.theme.extend.colors) configFile.theme.extend.colors = {}
    configFile.theme.extend.colors[kebabName] = configMapping

    if (configFile.theme.colors) {
      if (configFile.theme.colors[kebabName]) delete configFile.theme.colors[kebabName]
      if (Object.keys(configFile.theme.colors).length === 0) delete configFile.theme.colors
    }
  }

  fs.writeFileSync(projectsConfigJS, 'module.exports = ' + cleanDoubleQuotes(configFile, options), 'utf8', err => { throw err })
  checkIfColorModule()
}

/**
 * Combined write for palette mode (JSON entries + config mapping in one call).
 * Single mode uses writeSemanticJSON alone — class naming is a design-layer
 * decision that belongs to the user, not auto-derived from the semantic key.
 *
 * @param {Object} semanticEntries - Output of buildSemanticPalette().semanticEntries
 * @param {string} kebabName - Color family name as config.cjs key
 * @param {Object} configMapping - palette's 11-shade mapping
 * @param {Object} options - CLI options (reads .override and .quotes)
 */
export function writeSemanticColors(semanticEntries, kebabName, configMapping, options) {
  const camelName = toCamelCase(kebabName)
  writeSemanticJSON(semanticEntries, camelName)
  writeConfigMapping(kebabName, configMapping, options)
}

/**
 * Export for CLI usage
 */
export default {
  colorModule,
  checkIfColorModule,
  shades,
  missingHexMessage,
  toCamelCase,
  buildSemanticPalette,
  buildSingleSemantic,
  detectFamilyShadeConflict,
  updateSemanticEntry,
  writeSemanticJSON,
  writeConfigMapping,
  wrapHexWithAlpha,
  normalizeAlpha,
  stripFamilyKeys,
  writeSemanticColors
}
