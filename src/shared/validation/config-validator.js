/**
 * Config validator for purgetss/config.cjs.
 *
 * Validates known fields in the user's config and, on type mismatch, throws an
 * error formatted via the shared error-reporter so that File / Path / Line /
 * Context / Issue / Fix are obvious instead of crashing downstream with
 * cryptic messages like `rule.startsWith is not a function`.
 *
 * Currently validates:
 *   - theme.fontFamily.* and theme.extend.fontFamily.*
 *       Expected: string. Detects Tailwind-style arrays (`['Inter', 'sans-serif']`)
 *       and reports with a fix snippet.
 *
 * Extend by adding entries to FIELD_RULES below. Each rule names the JSON
 * path, the expected JS type, and a tip explaining the fix.
 */

import fs from 'fs'
import * as acorn from 'acorn'
import chalk from 'chalk'
import { throwSyntaxError } from '../error-reporter.js'

// ─── Field rules ────────────────────────────────────────────────────────────
const FIELD_RULES = [
  {
    parent: 'theme.fontFamily',
    expected: 'string',
    tipFor: (key, value) => buildFontFamilyTip(key, value)
  },
  {
    parent: 'theme.extend.fontFamily',
    expected: 'string',
    tipFor: (key, value) => buildFontFamilyTip(key, value)
  }
]

function buildFontFamilyTip(key, value) {
  if (Array.isArray(value)) {
    const first = value.length > 0 ? value[0] : 'FontName'
    return `Use a string instead of an array. Tailwind-style fallback fonts are not supported — Titanium accepts a single font family per element. Change to: ${chalk.green(`${quoteKey(key)}: '${first}'`)}`
  }
  return `Expected a string. Change to: ${chalk.green(`${quoteKey(key)}: 'FontName'`)}`
}

function quoteKey(key) {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `'${key}'`
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Validate the loaded config object against FIELD_RULES.
 * Throws a formatted Error (via error-reporter) on the first mismatch found.
 *
 * @param {Object} configObject - The required()'d config object.
 * @param {string} configPath - Absolute path to the config.cjs file.
 */
export function validateConfig(configObject, configPath) {
  for (const rule of FIELD_RULES) {
    const parent = getByPath(configObject, rule.parent)
    if (!parent || typeof parent !== 'object') continue

    for (const key of Object.keys(parent)) {
      const value = parent[key]
      if (typeof value === rule.expected) continue

      const jsonPath = `${rule.parent}.${key}`
      const source = safeReadFile(configPath)
      const contextLines = source ? source.split('\n') : null
      const line = contextLines ? findPropertyLine(source, jsonPath) : null

      throwSyntaxError({
        type: 'Config',
        file: configPath,
        path: jsonPath,
        line,
        contextLines,
        issue: `Expected ${rule.expected}, got ${describeType(value)} (${previewValue(value)})`,
        fix: rule.tipFor(key, value)
      })
    }
  }
}

// ─── AST scan to find the line where a dotted-path property is declared ─────

function findPropertyLine(source, dottedPath) {
  let ast
  try {
    ast = acorn.parse(source, { ecmaVersion: 'latest', locations: true })
  } catch (_e) {
    return null
  }

  let found = null

  function walk(node, currentPath) {
    if (found || !node || typeof node !== 'object') return

    if (node.type === 'ObjectExpression') {
      for (const prop of node.properties) {
        if (prop.type !== 'Property') continue
        const keyName = prop.key.name || prop.key.value
        if (keyName == null) continue
        const nextPath = currentPath ? `${currentPath}.${keyName}` : keyName

        if (nextPath === dottedPath && prop.loc) {
          found = prop.loc.start.line
          return
        }
        walk(prop.value, nextPath)
        if (found) return
      }
      return
    }

    if (node.type === 'AssignmentExpression') {
      walk(node.right, currentPath)
      return
    }

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'range') continue
      const child = node[key]
      if (Array.isArray(child)) {
        for (const c of child) {
          walk(c, currentPath)
          if (found) return
        }
      } else if (child && typeof child === 'object') {
        walk(child, currentPath)
      }
    }
  }

  walk(ast, '')
  return found
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function describeType(value) {
  if (value === null) return 'null'
  if (Array.isArray(value)) return 'Array'
  return typeof value
}

function previewValue(value) {
  try {
    const json = JSON.stringify(value)
    return json && json.length > 60 ? json.slice(0, 57) + '...' : json
  } catch (_e) {
    return String(value)
  }
}

function getByPath(obj, dottedPath) {
  return dottedPath.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}

function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8')
  } catch (_e) {
    return null
  }
}
