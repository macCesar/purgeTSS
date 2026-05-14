/**
 * PurgeTSS - config.cjs sync for SVG-derived dimensions
 *
 * Updates `images.files` inside the user's purgetss/config.cjs to reflect the
 * dimensions resolved from app.tss. Companion to setConfigProperty (which only
 * handles primitives) — this one knows how to upsert into an array of objects
 * while preserving the user's formatting, comments, and any manual overrides.
 *
 * Policy (see plan):
 *   - Entry missing      → insert `{ filename, width [, height] }`.
 *   - Entry present, width < derived → bump width (and height) to derived.
 *   - Entry present, width >= derived → leave alone. Manual overrides win.
 *
 * String-based mutation chosen over `recast` to avoid adding a heavy dep —
 * config.cjs has a controlled shape since `purgetss init` writes it. If we
 * can't safely locate the section we no-op and warn, mirroring setConfigProperty.
 *
 * @fileoverview Upsert image entries in config.cjs while preserving formatting
 * @author César Estrada
 */

import fs from 'fs'
import { projectsConfigJS } from '../../shared/constants.js'

/**
 * Apply the derived dimensions to `images.files` in the user's config.cjs and
 * return the effective per-SVG dimensions after the sync (i.e. the max of the
 * derived value and any pre-existing manual override). Callers should drive
 * PNG generation from the returned `effective` map so manual overrides — like
 * pinning a width above what the class cascade resolves — produce PNGs at the
 * higher resolution.
 *
 * @param {Map<string, { widthDp: number, heightDp: number }>} derived
 *   Keyed by SVG relpath (matches the `filename` field stored in config).
 * @param {Object} [opts]
 * @param {Object} [opts.logger] - Logger with `.warning(msg)` / `.info(msg)`.
 * @param {boolean} [opts.write=true] - When false, computes the effective map
 *   without mutating config.cjs (for users who keep `images.autoSync: false`
 *   and prefer to manage `images.files` by hand).
 * @returns {{
 *   stats: { updated: number, inserted: number, untouched: number },
 *   effective: Map<string, { widthDp: number, heightDp: number }>
 * }}
 */
export function syncConfigImages(derived, { logger, write = true } = {}) {
  const stats = { updated: 0, inserted: 0, untouched: 0 }
  const effective = new Map()
  if (!fs.existsSync(projectsConfigJS)) {
    logger?.warning('config.cjs not found — skipping SVG dimensions sync.')
    // Without config we still want PNGs generated at the derived size — copy
    // the derived map through verbatim.
    for (const [k, v] of derived) effective.set(k, { ...v })
    return { stats, effective }
  }

  let source = fs.readFileSync(projectsConfigJS, 'utf8')

  for (const [relPath, { widthDp, heightDp }] of derived) {
    const filename = toFilename(relPath)
    const existing = findEntry(source, filename)
    if (existing) {
      const desired = { width: Math.max(existing.width || 0, widthDp) }
      if (heightDp || existing.height) {
        desired.height = Math.max(existing.height || 0, heightDp || 0)
      }

      const widthSame = (existing.width || 0) === desired.width
      const heightSame = !desired.height || (existing.height || 0) === desired.height
      if (widthSame && heightSame) {
        stats.untouched++
      } else {
        source = replaceEntry(source, existing, filename, desired)
        stats.updated++
      }
      effective.set(relPath, { widthDp: desired.width, heightDp: desired.height ?? null })
    } else {
      const entry = { width: widthDp }
      if (heightDp) entry.height = heightDp
      const next = insertEntry(source, filename, entry)
      if (next === null) {
        logger?.warning(`Could not insert ${filename} into images.files (section missing or unreadable).`)
        effective.set(relPath, { widthDp, heightDp })
        continue
      }
      source = next
      stats.inserted++
      effective.set(relPath, { widthDp, heightDp })
    }
  }

  if (write) {
    fs.writeFileSync(projectsConfigJS, source, 'utf8')
  }
  return { stats, effective }
}

function toFilename(relPath) {
  // Stored form mirrors the `purgetss images` convention: `images/<subpath>/<name>.svg`
  return `images/${relPath.replace(/^\/+/, '')}`
}

// Locate an entry like `{ filename: 'images/foo.svg', width: 128 }`. Tolerates
// keys in any order and either quoting style.
function findEntry(source, filename) {
  const escaped = filename.replace(/[/.[\]()*+?^$|\\]/g, '\\$&')
  const re = new RegExp(
    `\\{[^{}]*?\\bfilename\\s*:\\s*['"\`]${escaped}['"\`][^{}]*?\\}`,
    'g'
  )
  const matches = [...source.matchAll(re)]
  if (matches.length === 0) return null
  const match = matches[0]
  const body = match[0]
  const width = readNumber(body, 'width')
  const height = readNumber(body, 'height')
  return { match: body, index: match.index, width, height }
}

function readNumber(body, key) {
  const m = body.match(new RegExp(`\\b${key}\\s*:\\s*(\\d+)`))
  return m ? Number(m[1]) : null
}

function replaceEntry(source, existing, filename, desired) {
  const newEntry = renderEntry(filename, desired)
  return source.slice(0, existing.index) + newEntry + source.slice(existing.index + existing.match.length)
}

function renderEntry(filename, { width, height }) {
  const heightPart = height != null ? `, height: ${height}` : ''
  return `{ filename: '${filename}', width: ${width}${heightPart} }`
}

// Insert a new entry into the images.files array. Returns the mutated source
// string, or null if the array can't be located/created safely.
function insertEntry(source, filename, entry) {
  // First pass: make sure the array exists; this may mutate `source` to inject
  // `files: []` into the `images` section when missing.
  const ensured = ensureFilesArray(source)
  if (ensured === null) return null
  source = ensured

  const filesArr = locateFilesArray(source)
  if (!filesArr) return null

  const { openIdx, closeIdx, indent } = filesArr
  const inner = source.slice(openIdx + 1, closeIdx)
  const newEntry = renderEntry(filename, entry)

  const innerTrimmed = inner.replace(/\s+$/, '')
  if (innerTrimmed.trim().length === 0) {
    // Empty array: rewrite as multi-line with one entry.
    const replacement = `[\n${indent}  ${newEntry}\n${indent}]`
    return source.slice(0, openIdx) + replacement + source.slice(closeIdx + 1)
  }

  // Non-empty: ensure the previous entry has a trailing comma and append a
  // new line with the same indent as siblings (heuristic: 2-space extra).
  const lines = innerTrimmed.split('\n')
  const lastIdx = lines.length - 1
  const lastLine = lines[lastIdx]
  const stripped = lastLine.replace(/\s+$/, '')
  if (!stripped.endsWith(',') && !stripped.endsWith('[')) {
    lines[lastIdx] = stripped + ','
  }
  const newInner = lines.join('\n') + `\n${indent}  ${newEntry}\n${indent}`
  return source.slice(0, openIdx + 1) + newInner + source.slice(closeIdx)
}

// If `images.files` is missing, inject an empty `files: []` immediately before
// the section's closing brace, preserving the user's indentation.
function ensureFilesArray(source) {
  const section = matchImagesSection(source)
  if (!section) return null
  if (/(\n\s*)files\s*:\s*\[/.test(section.body)) return source

  const insertion = `\n${section.indent}  files: []`
  const closingIdx = section.end - 1 // position of '}'
  const before = source.slice(0, closingIdx)
  const after = source.slice(closingIdx)
  // Drop trailing horizontal whitespace + newlines so the new line lands flush
  // against the previous sibling line.
  const trimmed = before.replace(/[ \t]+$/, '').replace(/\n+$/, '')
  return appendTrailingCommaIfNeeded(trimmed) + insertion + '\n' + section.indent + after
}

// Ensure the previous property line is followed by a comma so the appended
// line parses. Honors trailing `// comments` by placing the comma between the
// value and the comment, never inside the comment itself.
function appendTrailingCommaIfNeeded(text) {
  const lastLineStart = text.lastIndexOf('\n') + 1
  const head = text.slice(0, lastLineStart)
  const lastLine = text.slice(lastLineStart)
  // Split off a trailing `// comment` (with optional leading whitespace).
  const commentMatch = lastLine.match(/^(.*?)(\s*\/\/.*)$/)
  const valuePart = (commentMatch ? commentMatch[1] : lastLine).replace(/[ \t]+$/, '')
  const commentPart = commentMatch ? commentMatch[2] : ''
  if (!valuePart || valuePart.endsWith(',') || valuePart.endsWith('{')) return text
  return head + valuePart + ',' + commentPart
}

function matchImagesSection(source) {
  const m = source.match(/^([ \t]*)images\s*:\s*\{([\s\S]*?)\n([ \t]*)\}/m)
  if (!m) return null
  return {
    start: m.index,
    end: m.index + m[0].length, // index right after '}'
    indent: m[1],
    body: m[2]
  }
}

// Find the `files: [ ... ]` array inside the `images: { ... }` section.
function locateFilesArray(source) {
  const section = matchImagesSection(source)
  if (!section) return null

  const filesMatch = section.body.match(/(\n\s*)files\s*:\s*\[/)
  if (!filesMatch) return null

  const arrayKeyStart = section.start + section.body.indexOf(filesMatch[0]) + filesMatch[1].length
  const openIdx = source.indexOf('[', arrayKeyStart)
  if (openIdx === -1) return null
  const closeIdx = matchBracket(source, openIdx, '[', ']')
  if (closeIdx === -1) return null

  const lineStart = source.lastIndexOf('\n', arrayKeyStart) + 1
  const indent = source.slice(lineStart, arrayKeyStart).match(/^[ \t]*/)[0]

  return { openIdx, closeIdx, indent }
}

function matchBracket(source, startIdx, open, close) {
  let depth = 0
  let inSingle = false
  let inDouble = false
  let inBacktick = false
  for (let i = startIdx; i < source.length; i++) {
    const c = source[i]
    if (c === '\'' && !inDouble && !inBacktick) inSingle = !inSingle
    else if (c === '"' && !inSingle && !inBacktick) inDouble = !inDouble
    else if (c === '`' && !inSingle && !inDouble) inBacktick = !inBacktick
    else if (!inSingle && !inDouble && !inBacktick) {
      if (c === open) depth++
      else if (c === close) {
        depth--
        if (depth === 0) return i
      }
    }
  }
  return -1
}
