/**
 * PurgeTSS - SVG pipeline cache
 *
 * Tracks the last successful generation of each SVG so subsequent runs can
 * skip work when nothing changed. Cached file: `purgetss/.cache/svg-images.json`.
 *
 * An entry is invalidated (regen) when any of these change:
 *   - The SVG file content (sha1 hash).
 *   - The resolved widthDp / heightDp.
 *   - The list of target PNG paths.
 *   - Any of the target PNGs is missing on disk.
 *
 * Stale entries for SVGs no longer referenced are left untouched here — the
 * planned `purgetss clean` command is responsible for purging orphans.
 *
 * @fileoverview Idempotency cache for the SVG pipeline
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { projectsPurgeTSSFolder } from '../../shared/constants.js'

const CACHE_DIR = path.join(projectsPurgeTSSFolder, '.cache')
const CACHE_FILE = path.join(CACHE_DIR, 'svg-images.json')

/**
 * Load the on-disk cache as a plain object. Returns `{}` if the file is
 * missing or unreadable — corrupted caches simply force a regen rather than
 * halting the build.
 */
export function loadCache() {
  try {
    if (!fs.existsSync(CACHE_FILE)) return {}
    const raw = fs.readFileSync(CACHE_FILE, 'utf8')
    const parsed = JSON.parse(raw)
    return (parsed && typeof parsed === 'object') ? parsed : {}
  } catch {
    return {}
  }
}

/**
 * Persist the cache to disk, creating `.cache/` if needed.
 */
export function saveCache(cache) {
  fs.mkdirSync(CACHE_DIR, { recursive: true })
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n', 'utf8')
}

/**
 * Compute the sha1 hash of an SVG file. Reads the bytes verbatim so
 * whitespace-only edits also bust the cache (desired — they may change rendering).
 */
export function hashFile(absPath) {
  const buf = fs.readFileSync(absPath)
  return crypto.createHash('sha1').update(buf).digest('hex')
}

/**
 * Decide whether the cached entry is still valid for the given resolved inputs.
 *
 * @param {Object} cached - Previous cache entry (or undefined).
 * @param {string} svgHash - sha1 of the current SVG.
 * @param {number} widthDp - Currently resolved widthDp.
 * @param {number} heightDp - Currently resolved heightDp.
 * @param {string[]} targets - Absolute paths the pipeline would emit this run.
 * @returns {boolean} True if every target PNG is present and inputs match.
 */
export function isCacheHit(cached, svgHash, widthDp, heightDp, targets) {
  if (!cached) return false
  if (cached.svgHash !== svgHash) return false
  if (cached.widthDp !== widthDp) return false
  if (cached.heightDp !== heightDp) return false
  if (!Array.isArray(cached.targets) || cached.targets.length !== targets.length) return false

  const cachedPaths = new Set(cached.targets.map(t => (typeof t === 'string' ? t : t.path)))
  for (const t of targets) {
    if (!cachedPaths.has(t)) return false
    if (!fs.existsSync(t)) return false
  }
  return true
}

/**
 * Build the cache entry shape we persist after a successful generation.
 */
export function makeCacheEntry(svgHash, widthDp, heightDp, targets) {
  return {
    svgHash,
    widthDp,
    heightDp,
    targets: [...targets]
  }
}
