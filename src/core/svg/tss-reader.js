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

const CLASS_LINE = /^\s*'\.([^']+)'\s*:\s*\{([^}]*)\}\s*$/

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
    const stripped = stripLineComment(line)
    const match = stripped.match(CLASS_LINE)
    if (!match) continue

    const className = match[1]
    const body = match[2]
    const props = parsePropBody(body)
    map.set(className, { ...props, _raw: body.trim() })
  }
  return map
}

// Drop trailing `// comment` so it doesn't break the brace-matching regex.
function stripLineComment(line) {
  let inSingle = false
  let inDouble = false
  for (let i = 0; i < line.length - 1; i++) {
    const c = line[i]
    if (c === '\'' && !inDouble) inSingle = !inSingle
    else if (c === '"' && !inSingle) inDouble = !inDouble
    else if (c === '/' && line[i + 1] === '/' && !inSingle && !inDouble) {
      return line.slice(0, i)
    }
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
  let inSingle = false
  let inDouble = false
  let last = 0
  for (let i = 0; i < body.length; i++) {
    const c = body[i]
    if (c === '\'' && !inDouble) inSingle = !inSingle
    else if (c === '"' && !inSingle) inDouble = !inDouble
    else if (!inSingle && !inDouble) {
      if (c === '(' || c === '[' || c === '{') depth++
      else if (c === ')' || c === ']' || c === '}') depth--
      else if (c === ',' && depth === 0) {
        out.push(body.slice(last, i))
        last = i + 1
      }
    }
  }
  out.push(body.slice(last))
  return out.filter(s => s.trim().length > 0)
}

function findTopLevelColon(pair) {
  let inSingle = false
  let inDouble = false
  let depth = 0
  for (let i = 0; i < pair.length; i++) {
    const c = pair[i]
    if (c === '\'' && !inDouble) inSingle = !inSingle
    else if (c === '"' && !inSingle) inDouble = !inDouble
    else if (!inSingle && !inDouble) {
      if (c === '(' || c === '[' || c === '{') depth++
      else if (c === ')' || c === ']' || c === '}') depth--
      else if (c === ':' && depth === 0) return i
    }
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
