/**
 * PurgeTSS - TSS reader for the SVG pipeline
 *
 * Lightweight parser for the controlled TSS output PurgeTSS generates. Used by
 * the SVG image pipeline to resolve final width/height per class after a
 * regular purge run. NOT a general-purpose TSS parser — only the shapes the
 * purger emits are recognized.
 *
 * Recognized line shape:
 *   '.classname': { prop: value, prop: value }
 *
 * Tag selectors (e.g. 'View': { ... }, 'ImageView[platform=ios]': { ... }) and
 * '#id': { ... } selectors are skipped — the SVG pipeline resolves only by
 * class cascade in V1.
 *
 * @fileoverview Class → properties map extracted from purged app.tss
 * @author César Estrada
 */

// Matches up to (and including) the opening brace. The body is delimited by
// brace-balancing rather than a `[^}]*` character class, which could not see
// past a nested object — `'.text-xs': { font: { fontSize: 12 } }` and every
// other class carrying a `font: { ... }` never made it into the map.
const CLASS_LINE_START = /^\s*'\.([^']+)'\s*:\s*\{/

/**
 * Parse the controlled TSS string emitted by the purger into a class → props
 * map. Values are returned in a normalized form:
 *
 *   - number             → finite numeric value (e.g. 128)
 *   - 'auto'             → Ti.UI.SIZE
 *   - 'fill'             → Ti.UI.FILL
 *   - 'percent'          → percentage or any other non-resolvable value
 *
 * Only the `width` and `height` properties are normalized; other props are
 * captured verbatim as the raw RHS string (callers don't currently need them).
 *
 * @param {string} tssContent - The full purged TSS (in-memory string).
 * @returns {Map<string, { width?: number|'auto'|'fill'|'percent', height?: number|'auto'|'fill'|'percent', _raw: string }>}
 */
export function parseTssMap(tssContent) {
  const map = new Map()
  if (typeof tssContent !== 'string' || !tssContent) return map

  const lines = tssContent.split(/\r?\n/)
  for (const line of lines) {
    const parsed = parseClassLine(stripLineComment(line))
    if (!parsed) continue

    const props = parsePropBody(parsed.body)
    map.set(parsed.className, { ...props, _raw: parsed.body.trim() })
  }
  return map
}

// Yield only the characters that are structural — outside string literals and
// past escape sequences. All scanners in this file share it so a single `\'`
// or a backtick can't desynchronize one of them: before, an escaped quote
// flipped the string state permanently and every property after it was
// silently dropped.
function * codeChars(text) {
  let inSingle = false
  let inDouble = false
  let inBacktick = false

  for (let i = 0; i < text.length; i++) {
    const c = text[i]
    if ((inSingle || inDouble || inBacktick) && c === '\\') {
      i++
      continue
    }
    if (c === '\'' && !inDouble && !inBacktick) {
      inSingle = !inSingle
      continue
    }
    if (c === '"' && !inSingle && !inBacktick) {
      inDouble = !inDouble
      continue
    }
    if (c === '`' && !inSingle && !inDouble) {
      inBacktick = !inBacktick
      continue
    }
    if (inSingle || inDouble || inBacktick) continue

    yield [i, c]
  }
}

// Split `'.name': { body }` into its class name and body, balancing braces so
// nested objects stay inside the body. Returns null for anything that isn't a
// class line (tag/id selectors, comments, blank lines, trailing junk).
function parseClassLine(line) {
  const match = line.match(CLASS_LINE_START)
  if (!match) return null

  const openIdx = match[0].length - 1
  let depth = 0
  let closeIdx = -1

  for (const [i, c] of codeChars(line)) {
    if (i < openIdx) continue
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        closeIdx = i
        break
      }
    }
  }

  if (closeIdx === -1) return null
  if (line.slice(closeIdx + 1).trim() !== '') return null

  return { className: match[1], body: line.slice(openIdx + 1, closeIdx) }
}

// Drop trailing `// comment` so it doesn't break brace matching.
function stripLineComment(line) {
  for (const [i, c] of codeChars(line)) {
    if (c === '/' && line[i + 1] === '/') return line.slice(0, i)
  }
  return line
}

function parsePropBody(body) {
  const out = {}
  for (const pair of splitTopLevelCommas(body)) {
    const colon = findTopLevelColon(pair)
    if (colon === -1) continue
    const key = pair.slice(0, colon).trim()
    const value = pair.slice(colon + 1).trim()
    if (key === 'width' || key === 'height') {
      out[key] = normalizeDimensionValue(value)
    }
  }
  return out
}

function splitTopLevelCommas(body) {
  const out = []
  let depth = 0
  let last = 0
  for (const [i, c] of codeChars(body)) {
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    else if (c === ',' && depth === 0) {
      out.push(body.slice(last, i))
      last = i + 1
    }
  }
  out.push(body.slice(last))
  return out.filter(s => s.trim().length > 0)
}

function findTopLevelColon(pair) {
  let depth = 0
  for (const [i, c] of codeChars(pair)) {
    if (c === '(' || c === '[' || c === '{') depth++
    else if (c === ')' || c === ']' || c === '}') depth--
    else if (c === ':' && depth === 0) return i
  }
  return -1
}

// Recognize: numeric literals, Ti.UI.SIZE/FILL, quoted percentages or other
// non-numeric strings. Anything else falls into 'percent' (the catch-all for
// "this can't be turned into a dp number"). The label is historic — it
// originally only meant "string with %" — keeping it avoids ripple changes.
function normalizeDimensionValue(raw) {
  const trimmed = raw.trim()
  if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed)
  if (/^Ti\.UI\.SIZE$/i.test(trimmed)) return 'auto'
  if (/^Ti\.UI\.FILL$/i.test(trimmed)) return 'fill'
  return 'percent'
}
