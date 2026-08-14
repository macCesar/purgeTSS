/**
 * PurgeTSS - `brand:` block renderer
 *
 * Produces the text of the `brand:` section for purgetss/config.cjs, straight
 * from the piece table. Both the first-run injection and the structure
 * migration go through here, so the block a user ends up with can never drift
 * from the vocabulary the command actually speaks.
 *
 * Values that match the built-in default are rendered as the default; anything
 * passed in `overrides` is written in its place, which is how a migrated config
 * keeps the numbers and colors its owner had chosen.
 *
 * @fileoverview Generator for the brand: block of config.cjs
 * @author César Estrada
 */

import { BRAND_PIECES } from './pieces.js'

const DEFAULT_BACKGROUND = '#FFFFFF'

/** Comments stop lining up past this column of the piece body. */
const MAX_BODY_COLUMN = 26

/**
 * @typedef {Object} BrandBlockOverrides
 * @property {string} [background] - top-level brand.background
 * @property {boolean} [confirmOverwrites]
 * @property {string} [logo] - main logo path
 * @property {string} [monochromeLogo]
 * @property {Object<string, Object>} [pieces] - keyed by configKey: { logo, padding, background, enabled }
 */

/**
 * Render the whole `brand:` block, indented to sit inside module.exports.
 *
 * @param {BrandBlockOverrides} [overrides]
 * @param {Object} [opts]
 * @param {string} [opts.indent] - Indentation of the `brand:` key itself
 * @returns {string} The block, ending with `},` and a newline
 */
export function renderBrandBlock(overrides = {}, opts = {}) {
  const indent = opts.indent ?? '  '
  const inner = indent + '  '
  const pieceOverrides = overrides.pieces ?? {}

  const top = [
    [`background: ${literal(overrides.background ?? DEFAULT_BACKGROUND)},`, 'inherited by every piece that doesn\'t set its own'],
    [`confirmOverwrites: ${overrides.confirmOverwrites ?? true},`, 'prompt before overwriting files (set false to skip)']
  ]
  if (overrides.logo) top.push([`logo: ${literal(overrides.logo)},`, 'main logo, when it lives outside purgetss/brand/'])
  if (overrides.monochromeLogo) top.push([`monochromeLogo: ${literal(overrides.monochromeLogo)},`, 'monochrome layer + notification icons'])

  const topWidth = Math.max(...top.map(([code]) => code.length))

  const lines = []
  lines.push(`${indent}brand: {`)
  for (const [code, comment] of top) lines.push(`${inner}${code.padEnd(topWidth)} // ${comment}`)

  lines.push('')
  lines.push(`${inner}// One block per piece. Artwork comes from purgetss/brand/logo-<piece>.{svg,png};`)
  lines.push(`${inner}// these keys are for numbers, colors and activation. Padding is never inherited.`)

  const defaults = BRAND_PIECES.filter((piece) => piece.mode !== 'opt-in')
  const optIn = BRAND_PIECES.filter((piece) => piece.mode === 'opt-in')
  const width = Math.max(...BRAND_PIECES.map((piece) => piece.configKey.length)) + 1

  const bodies = new Map(
    BRAND_PIECES.map((piece) => [piece.configKey, renderPieceBody(piece, pieceOverrides[piece.configKey])])
  )
  // Comments line up, but only up to a point: one long customized body should
  // not push every comment off the right edge of the editor.
  const bodyWidth = Math.min(
    Math.max(...[...bodies.values()].map((body) => body.length)) + 1,
    MAX_BODY_COLUMN
  )

  const pieceLine = (piece, isLast) => {
    const key = `${piece.configKey}:`.padEnd(width)
    const body = `${bodies.get(piece.configKey)}${isLast ? '' : ','}`.padEnd(bodyWidth)
    return `${inner}${key} ${body} // ${piece.generates}`
  }

  defaults.forEach((piece) => lines.push(pieceLine(piece, false)))

  lines.push('')
  lines.push(`${inner}// Opt-in: inert until you edit the Android theme / FCM meta-data by hand.`)
  optIn.forEach((piece, i) => lines.push(pieceLine(piece, i === optIn.length - 1)))

  lines.push(`${indent}},`)

  return lines.join('\n') + '\n'
}

/**
 * The `{ ... }` body of one piece: the keys worth spelling out, plus whatever
 * the caller is carrying over from an older config.
 *
 * @param {import('./pieces.js').BrandPiece} piece
 * @param {Object} [override] - { logo, padding, background, enabled }
 * @returns {string}
 */
function renderPieceBody(piece, override = {}) {
  const parts = []

  if (override.logo !== undefined) parts.push(`logo: ${literal(override.logo)}`)

  const padding = override.padding ?? (piece.showsPadding ? `${piece.defaultPadding}%` : undefined)
  if (padding !== undefined) parts.push(`padding: ${literal(padding)}`)

  const background = override.background !== undefined
    ? override.background
    : (piece.showsBackground ? piece.defaultBackground : undefined)
  if (background !== undefined) parts.push(`background: ${literal(background)}`)

  const enabled = override.enabled ?? (piece.mode === 'opt-in' ? false : undefined)
  if (enabled !== undefined) parts.push(`enabled: ${enabled}`)

  return parts.length > 0 ? `{ ${parts.join(', ')} }` : '{}'
}

/**
 * Config values are written as JS literals with single quotes, matching the
 * style of the rest of config.cjs.
 */
function literal(value) {
  if (typeof value === 'string') return `'${value.replace(/'/g, '\\\'')}'`
  return JSON.stringify(value)
}
