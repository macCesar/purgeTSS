/**
 * PurgeTSS - config.cjs patcher
 *
 * Small helper for writing a single property into an existing top-level
 * section (e.g. `brand: { ... }` or `images: { ... }`) of the user's
 * purgetss/config.cjs. Used by the interactive "always" confirmation option
 * to persist the user's preference.
 *
 * Deliberately narrow: only touches the target property, preserves the
 * user's indentation style, and leaves every other line byte-identical.
 * If the target section or key can't be located safely, it no-ops rather
 * than risking a corrupted config — the caller falls back to the one-shot
 * `--yes` / PURGETSS_YES behavior.
 *
 * @fileoverview Non-destructive single-property writer for config.cjs
 * @author César Estrada
 */

import fs from 'fs'
import { projectsConfigJS } from './constants.js'

/**
 * Locate a whole top-level section of config.cjs by brace balancing, so a
 * section carrying nested objects is matched in full.
 *
 * Quotes, template literals, escapes and both comment styles are skipped, which
 * is what a plain regex cannot do — `brand: { padding: { ... } }` would
 * otherwise appear to end at the inner closing brace.
 *
 * @param {string} source - Full text of config.cjs
 * @param {string} section - Top-level key ('brand', 'images', …)
 * @returns {{start: number, end: number, indent: string}|null} `end` is exclusive
 *   and includes a trailing comma when there is one. null when not found or unbalanced.
 */
export function findSectionRange(source, section) {
  const header = new RegExp(`^([ \\t]*)${section}\\s*:\\s*\\{`, 'm')
  const match = source.match(header)
  if (!match) return null

  const start = match.index
  let i = start + match[0].length - 1 // sitting on the opening brace
  let depth = 0

  while (i < source.length) {
    const char = source[i]
    const next = source[i + 1]

    if (char === '/' && next === '/') {
      i = source.indexOf('\n', i)
      if (i === -1) return null
      continue
    }
    if (char === '/' && next === '*') {
      i = source.indexOf('*/', i + 2)
      if (i === -1) return null
      i += 2
      continue
    }
    if (char === '\'' || char === '"' || char === '`') {
      i = skipString(source, i)
      if (i === -1) return null
      continue
    }

    if (char === '{') depth += 1
    else if (char === '}') {
      depth -= 1
      if (depth === 0) {
        let end = i + 1
        if (source[end] === ',') end += 1
        return { start, end, indent: match[1] }
      }
    }
    i += 1
  }

  return null
}

/**
 * @param {string} source
 * @param {number} openIdx - Index of the opening quote
 * @returns {number} Index just past the closing quote, or -1 if unterminated
 */
function skipString(source, openIdx) {
  const quote = source[openIdx]
  let i = openIdx + 1
  while (i < source.length) {
    if (source[i] === '\\') { i += 2; continue }
    if (source[i] === quote) return i + 1
    i += 1
  }
  return -1
}

/**
 * Set `section.key = value` inside the user's purgetss/config.cjs, preserving
 * the rest of the file. If the key already exists in that section, its value
 * is replaced in place; otherwise a new line is appended before the section's
 * closing brace.
 *
 * @param {string} section - Top-level section name (e.g. 'brand', 'images').
 * @param {string} key - Property key to set inside the section.
 * @param {*} value - JSON-serializable value (booleans, numbers, strings, null).
 * @returns {boolean} True on success; false if config is missing or the
 *   section couldn't be located.
 */
export function setConfigProperty(section, key, value) {
  if (!fs.existsSync(projectsConfigJS)) return false

  const original = fs.readFileSync(projectsConfigJS, 'utf8')

  // Capture the entire section: `<indent>section: { <body> \n<closeIndent>}`.
  // Non-greedy body match keeps us from swallowing sibling sections.
  const sectionRegex = new RegExp(
    `^(\\s*)${section}\\s*:\\s*\\{([\\s\\S]*?)\\n(\\s*)\\}`,
    'm'
  )
  const match = original.match(sectionRegex)
  if (!match) return false

  const [wholeMatch, sectionIndent, body, closeIndent] = match
  const propIndent = closeIndent + '  '
  const valueLiteral = JSON.stringify(value)

  // If the key already exists inside the body, replace its value in place.
  // Preserves any trailing comment on the same line.
  const keyRegex = new RegExp(`(\\n\\s+${key}\\s*:\\s*)([^,\\n]+?)(\\s*(?:,|(?=\\n|$)))`)
  if (keyRegex.test(body)) {
    const newBody = body.replace(keyRegex, `$1${valueLiteral}$3`)
    const replaced = `${sectionIndent}${section}: {${newBody}\n${closeIndent}}`
    fs.writeFileSync(projectsConfigJS, original.replace(wholeMatch, replaced), 'utf8')
    return true
  }

  // Key missing — append a new line before the closing brace. Ensure the
  // previous property line has a trailing comma so the appended property
  // parses. If that line ends in a // comment, the comma goes between the
  // value and the comment (not after it).
  const lines = body.replace(/\s+$/, '').split('\n')
  const lastIdx = lines.length - 1
  const lastLine = lines[lastIdx]
  const commentMatch = lastLine.match(/^(.*?)(\s*\/\/.*)$/)
  const valuePart = (commentMatch ? commentMatch[1] : lastLine).replace(/\s+$/, '')
  const commentPart = commentMatch ? commentMatch[2] : ''
  const needsComma =
    valuePart &&
    !valuePart.endsWith(',') &&
    !valuePart.endsWith('{')
  lines[lastIdx] = (needsComma ? valuePart + ',' : valuePart) + commentPart

  let newBody = lines.join('\n')
  newBody += `\n${propIndent}${key}: ${valueLiteral}`

  const replaced = `${sectionIndent}${section}: {${newBody}\n${closeIndent}}`
  fs.writeFileSync(projectsConfigJS, original.replace(wholeMatch, replaced), 'utf8')
  return true
}
