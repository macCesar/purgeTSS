/**
 * PurgeTSS - Brand command config resolver
 *
 * Turns three sources into one resolved piece list, in this precedence order:
 *   1. CLI flags
 *   2. `brand: { ... }` section from purgetss/config.cjs
 *   3. The purgetss/brand/ file convention
 *   4. Built-in defaults
 *
 * The vocabulary is the one in pieces.js: one block per piece, each accepting
 * the same four keys when they apply — `logo`, `padding`, `background`,
 * `enabled`. Files decide the artwork, config decides numbers, colors and
 * activation.
 *
 * Auto-discovery inside `./purgetss/brand/`:
 *   logo.{svg,png}                 required — main logo, source for every piece
 *   logo-mono.{svg,png}            optional — monochrome layer + notifications
 *   logo-<piece>.{svg,png}         optional — overrides that piece's artwork
 *
 * `background` is inherited from `brand.background`; `padding` is not — the
 * defaults answer to different constraints (19% is Android's safe-zone floor,
 * 4% is an iOS aesthetic choice), so one global number would silently break
 * the launcher mask.
 *
 * Unknown keys inside `brand:` are an error, not a shrug: a typo in a padding
 * key would otherwise be indistinguishable from a default.
 *
 * @fileoverview Brand config + logo discovery + piece selection
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { getConfigFile, parsePadding } from '../../shared/config-manager.js'
import {
  BRAND_PIECES,
  BRAND_PIECE_KEYS,
  BRAND_TOP_LEVEL_KEYS,
  getPieceByConfigKey,
  parseOnlySelection
} from './pieces.js'

const BRAND_DIR = 'purgetss/brand'
const SUPPORTED_EXTS = ['svg', 'png']

/**
 * Find the first existing file matching <baseName>.<ext> for each supported ext.
 * @param {string} baseDir - Absolute path to the search directory
 * @param {string} baseName - Filename without extension (e.g. 'logo-mono')
 * @returns {string|null} Absolute path to the first match, or null
 */
function findLogoFile(baseDir, baseName) {
  for (const ext of SUPPORTED_EXTS) {
    const candidate = path.join(baseDir, `${baseName}.${ext}`)
    if (fs.existsSync(candidate)) return candidate
  }
  return null
}

/**
 * Build the final opts object for runBranding().
 *
 * @param {Object} cliOptions - Raw options from Commander
 * @param {string|undefined} cliLogo - Positional logo arg from Commander
 * @param {string} projectRoot - Absolute project root
 * @returns {Object} Resolved options
 * @throws {Error} On an unknown key inside `brand:` or an unknown --only value
 */
export function resolveBrandConfig(cliOptions, cliLogo, projectRoot) {
  const brandConfig = loadBrandSection()
  const brandDir = path.join(projectRoot, BRAND_DIR)

  assertKnownBrandKeys(brandConfig)

  const { pieces, selection, onlySelection, bgColor, bgColorExplicit } =
    resolvePieces(brandConfig, cliOptions, brandDir, projectRoot)

  return {
    logo: pickLogo(cliLogo, brandConfig.logo, brandDir, 'logo', projectRoot),
    monochromeLogo: pickLogo(cliOptions.monochromeLogo, brandConfig.monochromeLogo, brandDir, 'logo-mono', projectRoot),

    bgColor,
    bgColorExplicit,

    pieces,
    selection,
    onlySelection,

    optimize: Boolean(cliOptions.optimize ?? brandConfig.optimize ?? false),

    cleanupLegacy: Boolean(cliOptions.cleanupLegacy),
    aggressive: Boolean(cliOptions.aggressive),
    projectRoot,
    output: cliOptions.output || null,
    dryRun: Boolean(cliOptions.dryRun),
    notes: Boolean(cliOptions.notes),
    confirmOverwrites: brandConfig.confirmOverwrites !== false
  }
}

/**
 * Reject any key `brand:` does not define, at both levels.
 *
 * Keys from an older structure never get this far — `ensureBrandSection()`
 * rewrites the file before the command reads it. What lands here is a typo, and
 * ignoring a misspelled `paddig` would render the whole icon set at the wrong
 * size and still look plausible.
 *
 * @param {Object} brandConfig - The `brand:` section as written by the user
 * @throws {Error} Listing every unknown key it found
 */
export function assertKnownBrandKeys(brandConfig) {
  const problems = []
  const pieceKeys = BRAND_PIECES.map((piece) => piece.configKey)

  for (const key of Object.keys(brandConfig)) {
    if (BRAND_TOP_LEVEL_KEYS.includes(key)) continue

    const piece = getPieceByConfigKey(key)
    if (!piece) {
      problems.push(`brand.${key}`)
      continue
    }

    const block = brandConfig[key]
    if (block === null || typeof block !== 'object' || Array.isArray(block)) {
      problems.push(`brand.${key} (expected an object like { padding: '19%' })`)
      continue
    }

    for (const inner of Object.keys(block)) {
      if (!BRAND_PIECE_KEYS.includes(inner)) problems.push(`brand.${key}.${inner}`)
    }
  }

  if (problems.length === 0) return

  throw new Error([
    'Unknown key(s) in the brand: section of purgetss/config.cjs:',
    ...problems.map((p) => `  • ${p}`),
    '',
    `  Top-level keys: ${BRAND_TOP_LEVEL_KEYS.join(', ')}`,
    `  Piece blocks:   ${pieceKeys.join(', ')}`,
    `  Inside a piece: ${BRAND_PIECE_KEYS.join(', ')}`,
    '',
    '  Check the spelling. Nothing was written.'
  ].join('\n'))
}

/**
 * Resolve every piece and the final selection, with no I/O beyond looking for
 * the logo files. Exported so the precedence rules can be tested directly.
 *
 * @param {Object} brandConfig - The `brand:` section
 * @param {Object} cliOptions - Raw options from Commander
 * @param {string} brandDir - Absolute path to purgetss/brand/
 * @param {string} projectRoot - Absolute project root
 * @returns {{pieces: Object, selection: string[], onlySelection: string[]|null, bgColor: string, bgColorExplicit: boolean}}
 */
export function resolvePieces(brandConfig, cliOptions, brandDir, projectRoot) {
  const bgColor = cliOptions.bgColor ?? brandConfig.background ?? '#FFFFFF'
  const bgColorExplicit = Boolean(cliOptions.bgColor ?? brandConfig.background)

  const pieces = {}
  for (const piece of BRAND_PIECES) {
    pieces[piece.name] = resolvePiece(piece, {
      cliOptions,
      brandConfig,
      brandDir,
      projectRoot,
      bgColor,
      bgColorExplicit
    })
  }

  // --only is a filter over the piece list, and it wins over every activation
  // rule: asking for a piece by name is as explicit as it gets.
  const onlySelection = cliOptions.only ? parseOnlySelection(cliOptions.only) : null
  if (onlySelection) {
    for (const name of onlySelection) pieces[name].enabled = true
  }

  const selection = onlySelection ?? BRAND_PIECES
    .filter((piece) => pieces[piece.name].enabled)
    .map((piece) => piece.name)

  return { pieces, selection, onlySelection, bgColor, bgColorExplicit }
}

/**
 * Resolve one piece: where its artwork comes from, how much padding it gets,
 * what background it sits on, and whether it runs at all.
 *
 * @param {import('./pieces.js').BrandPiece} piece
 * @param {Object} ctx
 * @returns {Object} Resolved piece
 */
function resolvePiece(piece, ctx) {
  const { cliOptions, brandConfig, brandDir, projectRoot, bgColor, bgColorExplicit } = ctx
  const cfg = brandConfig[piece.configKey] ?? {}

  const cliLogoValue = firstDefined(cliOptions, piece.cliLogoOptions)
  const logo = pickLogo(cliLogoValue, cfg.logo, brandDir, piece.logoBase, projectRoot)

  const cliPadding = firstDefined(cliOptions, piece.cliPaddingOptions)
  const padding = cliPadding != null
    ? cliPadding
    : cfg.padding != null
      ? parsePadding(cfg.padding, `brand.${piece.configKey}.padding`)
      : piece.defaultPadding

  const { background, backgroundExplicit } = resolveBackground(piece, cfg, cliOptions, bgColor, bgColorExplicit)

  return {
    name: piece.name,
    configKey: piece.configKey,
    generates: piece.generates,
    section: piece.section,
    mode: piece.mode,
    logo,
    padding,
    background,
    backgroundExplicit,
    enabled: resolveEnabled(piece, cfg, cliOptions, { logo })
  }
}

/**
 * `background` is the only key that cascades from the top-level `brand.background`.
 */
function resolveBackground(piece, cfg, cliOptions, bgColor, bgColorExplicit) {
  const cliBackground = firstDefined(cliOptions, piece.cliBackgroundOptions)
  if (cliBackground != null) {
    return { background: cliBackground, backgroundExplicit: true }
  }
  if (cfg.background !== undefined) {
    return { background: cfg.background, backgroundExplicit: cfg.background != null }
  }
  if (piece.inheritsBackground) {
    return { background: bgColor, backgroundExplicit: bgColorExplicit }
  }
  return { background: piece.defaultBackground, backgroundExplicit: false }
}

/**
 * Default pieces run unless turned off, opt-in pieces run when asked for, and
 * convention pieces run when their logo file is there.
 */
function resolveEnabled(piece, cfg, cliOptions, { logo }) {
  if (piece.mode === 'opt-in') {
    const cliFlag = firstDefined(cliOptions, piece.cliEnableOptions)
    if (cliFlag !== undefined) return Boolean(cliFlag)
    return cfg.enabled === true
  }

  if (piece.mode === 'convention') {
    if (cfg.enabled !== undefined) return Boolean(cfg.enabled)
    return Boolean(logo)
  }

  // 'default' — a --no-<piece> flag is the only CLI opt-out.
  for (const key of piece.cliDisableOptions) {
    if (cliOptions[key] === false) return false
  }
  return cfg.enabled !== false
}

/**
 * @param {Object} source - Commander options
 * @param {string[]} keys - Keys to try, in precedence order
 * @returns {*} The first value that is neither undefined nor null
 */
function firstDefined(source, keys) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) return source[key]
  }
  return undefined
}

/**
 * @returns {Object} The `brand` section of the resolved config, or {} if missing/invalid.
 */
function loadBrandSection() {
  try {
    const cfg = getConfigFile()
    if (cfg && typeof cfg === 'object' && cfg.brand && typeof cfg.brand === 'object') {
      return cfg.brand
    }
  } catch {
    // Config file missing or invalid — fall back to empty defaults.
  }
  return {}
}

/**
 * Resolve a logo path with proper precedence.
 * Config-relative paths are resolved against projectRoot.
 */
function pickLogo(cliValue, configValue, brandDir, baseName, projectRoot) {
  if (cliValue) return path.resolve(cliValue)
  if (configValue) return path.isAbsolute(configValue) ? configValue : path.resolve(projectRoot, configValue)
  if (brandDir && baseName) return findLogoFile(brandDir, baseName)
  return null
}
