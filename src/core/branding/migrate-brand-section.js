/**
 * PurgeTSS - `brand:` structure migration
 *
 * Rewrites an out-of-date `brand:` block in purgetss/config.cjs to the current
 * per-piece structure, carrying over every value the owner had changed away
 * from the defaults.
 *
 * This is the one place the old key names live. It runs **on the file**, once,
 * and then the file is current — as opposed to translating on every read, which
 * would leave the command's own code littered with legacy branches forever.
 * Delete this module and its call sites and nothing else has to change.
 *
 * Two historical shapes are recognized:
 *
 *   flat      brand.padding as a plain number, brand.iosPadding, brand.bgColor,
 *             brand.darkBgColor, top-level brand.notification / brand.splash
 *   grouped   brand.logos / .padding / .android / .ios / .colors  (7.7.0)
 *
 * Only values that differ from the current defaults are written into the new
 * block, so a config that was never customized comes out clean.
 *
 * @fileoverview One-shot config.cjs structure migration for the brand: section
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { createRequire } from 'module'
import chalk from 'chalk'
import { logger } from './branding-logger.js'
import { findSectionRange } from '../../shared/config-writer.js'
import { renderBrandBlock } from './render-brand-block.js'
import { BRAND_PIECES, BRAND_PIECE_KEYS, BRAND_TOP_LEVEL_KEYS, getPieceByConfigKey } from './pieces.js'

const require = createRequire(import.meta.url)

/** The four square iOS/marketplace pieces the old single `padding.ios` drove. */
const IOS_PADDING_PIECES = ['icon', 'dark', 'tinted', 'marketplace']

/**
 * Top-level keys from the shapes this module knows how to translate. A key
 * outside this list is not "old", it is wrong — most likely a typo — and must
 * reach the validator instead of being quietly rewritten away.
 */
const LEGACY_TOP_LEVEL_KEYS = [
  'logos', 'padding', 'android', 'ios', 'colors', // grouped (7.7.0)
  'iosPadding', 'bgColor', 'darkBgColor', 'notification', 'splash' // flat (pre-7.7.0)
]

/**
 * Is this `brand:` object written in a structure we can translate?
 *
 * Returns false both when the config is already current and when it carries a
 * key from no known structure: rewriting the block in that case would drop
 * whatever the user meant to write, with no way to notice.
 *
 * @param {Object} brand - The parsed `brand` section
 * @returns {boolean}
 */
export function needsBrandMigration(brand) {
  if (!brand || typeof brand !== 'object') return false

  let sawLegacy = false

  for (const key of Object.keys(brand)) {
    if (LEGACY_TOP_LEVEL_KEYS.includes(key)) {
      // `padding` is legacy as a number or as a group of old keys; as a piece
      // key it does not exist, so any object shape here is the 7.7.0 group.
      sawLegacy = true
      continue
    }
    if (BRAND_TOP_LEVEL_KEYS.includes(key)) continue

    const piece = getPieceByConfigKey(key)
    if (!piece) return false // unknown key — let the validator report it

    const block = brand[key]
    if (block === null || typeof block !== 'object' || Array.isArray(block)) return false
    if (Object.keys(block).some((inner) => !BRAND_PIECE_KEYS.includes(inner))) return false
  }

  return sawLegacy
}

/**
 * Translate an older `brand:` object into the overrides the renderer takes.
 * Anything equal to the current default is dropped, so the rewritten block only
 * carries real choices.
 *
 * @param {Object} brand - The parsed `brand` section, in any historical shape
 * @returns {{overrides: Object, carried: string[], dropped: string[]}}
 */
export function translateBrandSection(brand) {
  const overrides = { pieces: {} }
  const carried = []
  const dropped = []

  const setPiece = (configKey, field, value, label) => {
    if (value === undefined || value === null) return
    const piece = getPieceByConfigKey(configKey)
    if (!piece) return
    if (field === 'padding' && normalizePadding(value) === piece.defaultPadding) return
    if (field === 'enabled' && value === (piece.mode === 'opt-in' ? false : true)) return

    overrides.pieces[configKey] = overrides.pieces[configKey] ?? {}
    overrides.pieces[configKey][field] = field === 'padding' ? `${normalizePadding(value)}%` : value
    if (label) carried.push(`${label} → brand.${configKey}.${field}`)
  }

  // ---- Already-current keys pass straight through -------------------------
  if (brand.background !== undefined) overrides.background = brand.background
  if (brand.artworkCornerRadius !== undefined) overrides.artworkCornerRadius = brand.artworkCornerRadius
  if (brand.splashCornerRadius !== undefined) overrides.splashCornerRadius = brand.splashCornerRadius
  if (brand.confirmOverwrites !== undefined) overrides.confirmOverwrites = brand.confirmOverwrites
  if (brand.optimize !== undefined) overrides.optimize = brand.optimize
  if (brand.logo !== undefined) overrides.logo = brand.logo
  if (brand.monochromeLogo !== undefined) overrides.monochromeLogo = brand.monochromeLogo

  for (const piece of BRAND_PIECES) {
    const block = brand[piece.configKey]
    if (!block || typeof block !== 'object') continue
    for (const field of BRAND_PIECE_KEYS) {
      if (block[field] !== undefined) setPiece(piece.configKey, field, block[field], null)
    }
  }

  // ---- Flat shape (pre-7.7.0) --------------------------------------------
  if (typeof brand.padding === 'number' || typeof brand.padding === 'string') {
    setPiece('legacyIcon', 'padding', brand.padding, 'brand.padding')
    setPiece('adaptive', 'padding', brand.padding, 'brand.padding')
  }
  if (brand.iosPadding !== undefined) {
    for (const key of IOS_PADDING_PIECES) setPiece(key, 'padding', brand.iosPadding, 'brand.iosPadding')
  }
  if (brand.bgColor !== undefined) {
    overrides.background = brand.bgColor
    carried.push('brand.bgColor → brand.background')
  }
  if (brand.darkBgColor !== undefined) setPiece('dark', 'background', brand.darkBgColor, 'brand.darkBgColor')
  if (brand.notification !== undefined) setPiece('notificationIcon', 'enabled', brand.notification, 'brand.notification')
  if (brand.splash !== undefined) setPiece('splashIcon', 'enabled', brand.splash, 'brand.splash')

  // ---- Grouped shape (7.7.0) ---------------------------------------------
  const logos = objectOrNull(brand.logos)
  if (logos) {
    if (logos.primary !== undefined) {
      overrides.logo = logos.primary
      carried.push('brand.logos.primary → brand.logo')
    }
    if (logos.monochrome !== undefined) {
      overrides.monochromeLogo = logos.monochrome
      carried.push('brand.logos.monochrome → brand.monochromeLogo')
    }
    setPiece('adaptive', 'logo', logos.androidLauncher, 'brand.logos.androidLauncher')
    setPiece('dark', 'logo', logos.iosDark, 'brand.logos.iosDark')
    setPiece('tinted', 'logo', logos.iosTinted, 'brand.logos.iosTinted')
    setPiece('featureGraphic', 'logo', logos.featureGraphic, 'brand.logos.featureGraphic')
    // The old logo-splash fed both the Android 12+ icon and the <12 artwork.
    setPiece('splashIcon', 'logo', logos.androidSplash, 'brand.logos.androidSplash')
    setPiece('androidSplash', 'logo', logos.androidSplash, 'brand.logos.androidSplash')
  }

  const padding = objectOrNull(brand.padding)
  if (padding) {
    for (const key of IOS_PADDING_PIECES) setPiece(key, 'padding', padding.ios, 'brand.padding.ios')
    setPiece('legacyIcon', 'padding', padding.androidLegacy, 'brand.padding.androidLegacy')
    setPiece('adaptive', 'padding', padding.androidAdaptive, 'brand.padding.androidAdaptive')
    setPiece('featureGraphic', 'padding', padding.featureGraphic, 'brand.padding.featureGraphic')
  }

  const android = objectOrNull(brand.android)
  if (android) {
    setPiece('splashIcon', 'enabled', android.splash, 'brand.android.splash')
    setPiece('notificationIcon', 'enabled', android.notification, 'brand.android.notification')
    if (android.legacySplash !== undefined) {
      dropped.push('brand.android.legacySplash (the per-qualifier splashes are part of androidSplash now, always generated)')
    }
  }

  const ios = objectOrNull(brand.ios)
  if (ios) {
    setPiece('dark', 'enabled', ios.dark, 'brand.ios.dark')
    setPiece('tinted', 'enabled', ios.tinted, 'brand.ios.tinted')
    setPiece('dark', 'background', ios.darkBackground, 'brand.ios.darkBackground')
  }

  const colors = objectOrNull(brand.colors)
  if (colors && colors.background !== undefined) {
    overrides.background = colors.background
    carried.push('brand.colors.background → brand.background')
  }

  return { overrides, carried, dropped }
}

/**
 * Rewrite the `brand:` block of a config.cjs in place when its structure is out
 * of date. A no-op when the file is missing, has no `brand:` block, or already
 * uses the current structure.
 *
 * @param {string} configPath - Absolute path to purgetss/config.cjs
 * @returns {boolean} True when the file was rewritten
 */
export function migrateBrandSection(configPath) {
  if (!fs.existsSync(configPath)) return false

  let parsed
  try {
    delete require.cache[require.resolve(configPath)]
    parsed = require(configPath)
  } catch {
    return false // unparseable config — leave it alone, the caller will report it
  }

  const brand = parsed?.brand
  if (!needsBrandMigration(brand)) return false

  const original = fs.readFileSync(configPath, 'utf8')
  const range = findSectionRange(original, 'brand')
  if (!range) {
    logger.warning(`Could not locate the brand: block in ${path.basename(configPath)} to update its structure.`)
    return false
  }

  const { overrides, carried, dropped } = translateBrandSection(brand)
  const rendered = renderBrandBlock(overrides, { indent: range.indent })
  const patched = original.slice(0, range.start) + rendered.replace(/\n$/, '') + original.slice(range.end)

  fs.writeFileSync(configPath, patched, 'utf8')
  delete require.cache[require.resolve(configPath)]

  console.log()
  logger.success(`Updated the ${chalk.cyan('brand:')} structure in ${chalk.cyan('./purgetss/config.cjs')}.`)
  if (carried.length > 0) {
    console.log('  Your values were carried over:')
    for (const line of unique(carried)) console.log(`    ${chalk.gray('•')} ${line}`)
  }
  for (const line of dropped) console.log(`    ${chalk.gray('•')} dropped ${line}`)
  console.log()

  return true
}

function objectOrNull(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null
}

/**
 * Accepts 20, '20' and '20%'.
 * @returns {number|null}
 */
function normalizePadding(value) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d+)%?$/)
    if (match) return parseInt(match[1], 10)
  }
  return null
}

function unique(list) {
  return [...new Set(list)]
}
