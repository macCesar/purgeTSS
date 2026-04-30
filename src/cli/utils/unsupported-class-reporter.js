/**
 * PurgeTSS - Class Syntax Validator
 *
 * Pre-validation helper that runs BEFORE the purge starts. Scans every unique
 * class name pulled from XML views (and JS controllers) for well-known
 * authoring mistakes:
 *
 *   - Inverted negative sign:  top-(-10)   → -top-(10)
 *   - Tailwind-style brackets: top-[10px]  → top-(10px)
 *   - Empty parentheses:       wh-()       → wh-(<value>)
 *   - Whitespace in parens:    wh-( 200 )  → wh-(200)
 *   - Redundant px units:      top-(10px)  → top-(10)
 *
 * On any match the validator collects every offender, prints one block per
 * offender (file + line + fix, mirroring throwPreValidationError) and throws
 * an `isClassSyntaxError` so the CLI exits cleanly without running the purge.
 *
 * Generic unknown classes (typos, vendor utilities not enabled, custom
 * classes not yet defined) are intentionally left alone — they are still
 * captured silently in the "// Unused or unsupported classes" section of
 * app.tss, but never trigger warnings or halts. That's the only way to keep
 * the workflow usable on projects with dozens of in-progress class names.
 *
 * @author César Estrada
 */

import fs from 'fs'
import chalk from 'chalk'
import { logger } from '../../shared/logger.js'

const cwd = process.cwd()

/**
 * Pattern detectors. Each detector receives the className and returns
 * { issue, suggestion } when it recognises the problem, or null otherwise.
 * Order matters: more specific detectors first.
 */
const detectors = [
  // top-(-10) → -top-(10)
  function detectInvertedNegative(className) {
    const m = className.match(/^([a-zA-Z][\w-]*?)-\(-([^()]+)\)$/)
    if (!m) return null
    return {
      issue: 'Negative sign is inside the parentheses',
      suggestion: `Use ${chalk.green(`"-${m[1]}-(${m[2]})"`)} — PurgeTSS expects the "-" prefix BEFORE the rule, not inside the value`
    }
  },

  // top-[10px] → top-(10)
  function detectTailwindBrackets(className) {
    if (!className.includes('[') && !className.includes(']')) return null
    const fixed = className.replace(/\[/g, '(').replace(/\]/g, ')')
    return {
      issue: 'Tailwind-style brackets "[ ]" are not supported',
      suggestion: `Use parentheses instead: ${chalk.green(`"${fixed}"`)}`
    }
  },

  // wh-() → "Add a value"
  function detectEmptyParens(className) {
    const m = className.match(/^([\w-]+)-\(\s*\)$/)
    if (!m) return null
    return {
      issue: 'Empty value inside parentheses',
      suggestion: `Add a value, e.g. ${chalk.green(`"${m[1]}-(10)"`)}`
    }
  },

  // wh-( 200 ) → wh-(200)
  function detectSpacesInParens(className) {
    const m = className.match(/^([\w-]+)-\(\s+([^()]*?)\s*\)$|^([\w-]+)-\(([^()]*?)\s+\)$/)
    if (!m) return null
    const rule = m[1] || m[3]
    const value = (m[2] || m[4] || '').trim()
    if (!value) return null
    return {
      issue: 'Whitespace inside parentheses',
      suggestion: `Remove the spaces: ${chalk.green(`"${rule}-(${value})"`)}`
    }
  },

  // top-(10px) — units inside parens that PurgeTSS would strip anyway.
  // Only flag when value is purely numeric+unit; never blanket-flag because
  // some properties (durations, percentages) accept units.
  function detectRedundantUnits(className) {
    const m = className.match(/^([\w-]+)-\((-?\d+(?:\.\d+)?)px\)$/)
    if (!m) return null
    return {
      issue: 'Explicit "px" unit is redundant',
      suggestion: `PurgeTSS treats unit-less values as pixels: ${chalk.green(`"${m[1]}-(${m[2]})"`)}`
    }
  }
]

function detectIssue(className) {
  for (const detector of detectors) {
    const result = detector(className)
    if (result) return result
  }
  return null
}

/**
 * Find every (file, line) where `className` appears as a whole token inside a
 * class="..." attribute. Uses an attribute-then-split strategy (rather than
 * matching the class name directly) so arbitrary-value class names like
 * "top-(-10)" — which contain regex-special characters — do not need escaping
 * and cannot false-match a partial substring.
 */
function findLocations(className, paths) {
  const locations = []
  const attrRe = /class\s*=\s*["']([^"']*)["']/g

  for (const filePath of paths) {
    let content
    try {
      content = fs.readFileSync(filePath, 'utf8')
    } catch {
      continue
    }
    const lines = content.split(/\r?\n/)
    for (let i = 0; i < lines.length; i++) {
      attrRe.lastIndex = 0
      let match
      while ((match = attrRe.exec(lines[i])) !== null) {
        const tokens = match[1].split(/\s+/).filter(Boolean)
        if (tokens.includes(className)) {
          locations.push({
            filePath,
            lineNumber: i + 1,
            lineContent: lines[i].trim()
          })
          break
        }
      }
    }
  }
  return locations
}

function relativePath(filePath) {
  return filePath.startsWith(cwd + '/') ? filePath.slice(cwd.length + 1) : filePath
}

/**
 * Pre-validate every unique class against the syntax detectors. Collects all
 * offenders (so the dev sees the full list in a single run instead of
 * one-fix-per-attempt), prints a block per offender, then throws.
 *
 * Generic unknown classes are NOT flagged — they fall through silently to
 * the "// Unused or unsupported classes" comment block in app.tss.
 *
 * @param {Object} args
 * @param {string[]} args.classes           Unique classes pulled from views/controllers.
 * @param {string[]} args.viewPaths         Absolute paths to XML view files.
 * @param {string[]} [args.controllerPaths] Absolute paths to JS controller files.
 * @throws {Error} with `isClassSyntaxError === true` if any class matches a detector.
 */
export function validateClassSyntax({ classes, viewPaths, controllerPaths = [] }) {
  if (!classes || classes.length === 0) return

  const allPaths = [...viewPaths, ...controllerPaths]
  const offenders = []

  for (const className of classes) {
    const issue = detectIssue(className)
    if (!issue) continue
    offenders.push({
      className,
      issue,
      locations: findLocations(className, allPaths)
    })
  }

  if (offenders.length === 0) return

  for (const offender of offenders) {
    const lines = []
    lines.push(`Class: ${chalk.yellow(`"${offender.className}"`)}`)

    if (offender.locations.length > 0) {
      const first = offender.locations[0]
      lines.push(`File: ${chalk.yellow(`"${relativePath(first.filePath)}"`)}`)
      lines.push(`Line: ${chalk.yellow(first.lineNumber)}`)
      lines.push(`Content: ${chalk.gray(first.lineContent)}`)
      if (offender.locations.length > 1) {
        const more = offender.locations.length - 1
        lines.push(chalk.gray(`(also used in ${more} other location${more === 1 ? '' : 's'})`))
      }
    } else {
      lines.push(chalk.gray('Location: not found in views — likely from a controller or safelist'))
    }

    lines.push('')
    lines.push(chalk.red(`Issue: ${offender.issue.issue}`))
    lines.push(`${chalk.green('Fix:')} ${offender.issue.suggestion}`)

    logger.block(chalk.red('Class Syntax Error'), ...lines)
  }

  const word = offenders.length === 1 ? 'class syntax error' : 'class syntax errors'
  logger.block(
    chalk.red(`Found ${offenders.length} ${word} — fix the ${offenders.length === 1 ? 'class' : 'classes'} above and re-run purgetss`)
  )

  const error = new Error('Class syntax errors detected')
  error.isClassSyntaxError = true
  throw error
}
