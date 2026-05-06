/**
 * PurgeTSS - Semantic Colors Helpers
 *
 * Auto-derivation of semantic color keys with applied alpha for opacity
 * modifiers (e.g. `bg-surface/65`). Mutates `semantic.colors.json` idempotently
 * by adding `<originalKey>_<alphaPercent>` entries with `{ color, alpha }` for
 * `light` and `dark`.
 *
 * Lifecycle:
 *   - Names of semantic colors are tracked via `registerSemanticName()` while
 *     the utilities builder expands `theme.extend.colors`.
 *   - Hooks in `tailwind-purger` and `compileApplyDirectives` call
 *     `deriveAlphaKey()` before falling back to warn/throw on missing hex.
 *   - CLI commands flush the cached JSON to disk via `flushSemanticColors()`
 *     at the end of their run.
 *
 * @fileoverview Semantic color auto-derivation for opacity modifiers
 * @since 7.9.0
 */

import fs from 'fs'
import { getSemanticColorsPath } from '../cli/utils/project-detection.js'

const _semanticNames = new Set()
let _cache = null
let _dirty = false
let _lastMtime = 0
let _lastPath = null

/**
 * Reset all in-memory state. Intended for tests; not part of the public API.
 */
export function _resetSemanticHelpersState() {
  _semanticNames.clear()
  _cache = null
  _dirty = false
  _lastMtime = 0
  _lastPath = null
}

/**
 * Track a name that resolves to a semantic color (string, non-hex). Called by
 * the utilities builder while expanding `theme.extend.colors`.
 *
 * @param {string} name
 */
export function registerSemanticName(name) {
  if (typeof name === 'string' && name.length > 0) _semanticNames.add(name)
}

/**
 * @param {string} name
 * @returns {boolean}
 */
export function isSemanticColorName(name) {
  return _semanticNames.has(name)
}

/**
 * Load `semantic.colors.json` for the current project. Cached by mtime so
 * repeated calls in the same build are cheap. The cache is invalidated when
 * the file mtime changes on disk (relevant for watch-mode cycles where the
 * JSON gets rewritten between runs).
 *
 * @returns {Object} parsed JSON, or `{}` when the file doesn't exist
 */
export function loadSemanticColors() {
  const p = getSemanticColorsPath()
  if (!fs.existsSync(p)) {
    _cache = {}
    _lastMtime = 0
    _lastPath = p
    return _cache
  }
  const mtime = fs.statSync(p).mtimeMs
  if (_cache && _lastPath === p && mtime === _lastMtime) return _cache
  _cache = JSON.parse(fs.readFileSync(p, 'utf8'))
  _lastMtime = mtime
  _lastPath = p
  return _cache
}

/**
 * Derive a semantic key with the requested alpha applied. Idempotent: if the
 * derived key already exists with matching values it's reused; if it exists
 * with conflicting values an Error is thrown so manual edits aren't silently
 * overwritten.
 *
 * @param {string} baseKey - The original semantic key (e.g. `surfaceColor`).
 * @param {number|string} alphaPercent - Integer 0..100 (e.g. 65).
 * @returns {string|null} The derived key, or `null` if `baseKey` isn't in the JSON.
 */
export function deriveAlphaKey(baseKey, alphaPercent) {
  const semantic = loadSemanticColors()
  const base = semantic[baseKey]
  if (!base) return null

  const alphaStr = String(alphaPercent)
  const newKey = `${baseKey}_${alphaStr}`

  const lightHex = typeof base.light === 'string' ? base.light : base.light?.color
  const darkHex = typeof base.dark === 'string' ? base.dark : base.dark?.color

  if (semantic[newKey]) {
    const existing = semantic[newKey]
    const existingLightHex = typeof existing.light === 'string' ? existing.light : existing.light?.color
    const existingDarkHex = typeof existing.dark === 'string' ? existing.dark : existing.dark?.color
    const existingLightAlpha = typeof existing.light === 'string' ? null : existing.light?.alpha
    const existingDarkAlpha = typeof existing.dark === 'string' ? null : existing.dark?.alpha

    if (
      existingLightHex !== lightHex ||
      existingDarkHex !== darkHex ||
      existingLightAlpha !== alphaStr ||
      existingDarkAlpha !== alphaStr
    ) {
      throw new Error(
        `Conflict: "${newKey}" already exists in semantic.colors.json with different values. Manual edit detected — resolve before continuing.`
      )
    }
    return newKey
  }

  semantic[newKey] = {
    light: { color: lightHex, alpha: alphaStr },
    dark: { color: darkHex, alpha: alphaStr }
  }
  _dirty = true
  return newKey
}

/**
 * Persist any pending derivations back to `semantic.colors.json`. No-op when
 * nothing changed. Writes a trailing newline for clean git diffs.
 */
export function flushSemanticColors() {
  if (!_dirty) return
  const p = getSemanticColorsPath()
  fs.writeFileSync(p, JSON.stringify(_cache, null, 2) + '\n')
  _dirty = false
  _lastMtime = fs.statSync(p).mtimeMs
  _lastPath = p
}
