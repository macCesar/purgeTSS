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
