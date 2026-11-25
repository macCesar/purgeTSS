/**
 * PurgeTSS - TSS reader for the SVG pipeline
 *
 * Lightweight parser for the controlled TSS output PurgeTSS generates. Used by
 * the SVG image pipeline to resolve final width/height per class after a
 * regular purge run. It reads single-line rules from the generated stylesheet.
 *
 * Recognized line shape:
 *   '.classname, .another-class': { prop: value, prop: value },
 *
 * The SVG pipeline resolves dimensions from unqualified class selectors.
 *
 * @fileoverview Class → properties map extracted from purged app.tss
 * @author César Estrada
 */

// Matches up to (and including) the opening brace. The body is delimited by
// brace-balancing rather than a `[^}]*` character class, which could not see
// past a nested object — `'.text-xs': { font: { fontSize: 12 } }` and every
// other class carrying a `font: { ... }` never made it into the map.
const STYLE_LINE_START = /^\s*(?:'([^']+)'|"([^"]+)")\s*:\s*\{/
const SIMPLE_CLASS_SELECTOR = /^\.([^\s[\],]+)$/

/**
 * Parse the controlled TSS string emitted by the purger into a class → props
 * map. Values are returned in a normalized form:
 *
 *   - number             → finite numeric value (e.g. 128)
 *   - 'auto'             → Ti.UI.SIZE
 *   - 'fill'             → Ti.UI.FILL
 *   - 'percent'          → percentage or any other non-resolvable value
 *
 * Later rules replace only the dimensions they declare for the same class.
 * `_raw` contains the body of the last rule for that class.
 *
 * @param {string} tssContent - The full purged TSS (in-memory string).
 * @returns {Map<string, { width?: number|'auto'|'fill'|'percent', height?: number|'auto'|'fill'|'percent', _raw: string }>}
 */
export function parseTssMap(tssContent) {
  const map = new Map()
  if (typeof tssContent !== 'string' || !tssContent) return map

  const lines = tssContent.split(/\r?\n/)
  for (const line of lines) {
    const parsed = parseStyleLine(stripLineComment(line))
    if (!parsed) continue

    const props = { ...parsePropBody(parsed.body), _raw: parsed.body.trim() }
    for (const className of parsed.classes) {
      map.set(className, { ...map.get(className), ...props })
    }
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

// Find the class selectors and balance braces around the rule body.
function parseStyleLine(line) {
  const match = line.match(STYLE_LINE_START)
  if (!match) return null

  const classes = splitSelectors(match[1] ?? match[2])
    .map(selector => selector.trim().match(SIMPLE_CLASS_SELECTOR)?.[1])
    .filter(Boolean)
  if (classes.length === 0) return null

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
  const trailing = line.slice(closeIdx + 1).trim()
  if (trailing && trailing !== ',') return null

  return { classes, body: line.slice(openIdx + 1, closeIdx) }
}

function splitSelectors(selectors) {
  const list = []
  let depth = 0
  let start = 0
  for (let index = 0; index < selectors.length; index++) {
    const char = selectors[index]
    if (char === '[') depth++
    else if (char === ']') depth--
    else if (char === ',' && depth === 0) {
      list.push(selectors.slice(start, index))
      start = index + 1
    }
  }
  list.push(selectors.slice(start))
  return list
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
