/**
 * Centralized error reporter for syntax errors detected by PurgeTSS.
 *
 * Visual format matches the patterns already used by:
 *   - XML Syntax Error (src/cli/commands/purge.js, "compact" variant)
 *   - Class Syntax Error (src/cli/utils/unsupported-class-reporter.js)
 *   - XML Syntax Error with Context (src/cli/commands/purge.js, "context" variant)
 *
 * Those call sites are NOT migrated yet — they keep their own inline formatters
 * to avoid any chance of visual regression. New validators (config-validator)
 * use this module so the look is consistent going forward.
 *
 * Two output paths:
 *   - formatSyntaxError(opts) → { header, lines } suitable for logger.block(...)
 *   - throwSyntaxError(opts)  → throws an Error whose .message is the full
 *                               pre-rendered string (for call sites that
 *                               propagate errors via catch handlers).
 */

import chalk from 'chalk'
import path from 'path'
import { logger } from './logger.js'

/**
 * Build the displayable parts of a syntax error.
 *
 * @param {Object} opts
 * @param {string} opts.type      - Short name shown in the header, e.g. 'Config', 'XML', 'Class'.
 * @param {string} [opts.file]    - File path (will be made relative to cwd).
 * @param {string|number} [opts.path] - Dotted JSON path (optional, for config errors).
 * @param {number} [opts.line]    - Line number where the error occurred.
 * @param {string} [opts.content] - One-line snippet of the offending line.
 * @param {string[]} [opts.contextLines] - Full file lines (1-based; pass src.split('\n') OK with 0-based,
 *                                          but `line` must point to a 1-based number; we slice ±2).
 * @param {string} opts.issue     - Description of what is wrong.
 * @param {string} opts.fix       - Suggested correction.
 * @returns {{ header: string, lines: string[] }}
 */
export function formatSyntaxError(opts) {
  const {
    type,
    file,
    path: jsonPath,
    line,
    content,
    contextLines,
    issue,
    fix
  } = opts

  const lines = []

  if (file) {
    const relative = path.relative(process.cwd(), file) || file
    lines.push(`File: ${chalk.yellow(`"${relative}"`)}`)
  }
  if (jsonPath) {
    lines.push(`Path: ${chalk.yellow(jsonPath)}`)
  }
  if (line != null) {
    lines.push(`Line: ${chalk.yellow(line)}`)
  }

  // Context block: ± 2 lines around the offending line.
  if (Array.isArray(contextLines) && line) {
    const total = contextLines.length
    const startLine = Math.max(1, line - 2)
    const endLine = Math.min(total, line + 2)

    lines.push('')
    lines.push(chalk.gray('Context:'))
    for (let i = startLine; i <= endLine; i++) {
      const isTarget = i === line
      const prefix = isTarget ? chalk.red('>>>') : chalk.gray('   ')
      const text = contextLines[i - 1] || ''
      lines.push(`${prefix} ${chalk.gray(String(i).padStart(3, ' '))}: ${text}`)
    }
  } else if (content) {
    lines.push(`Content: ${chalk.yellow(`"${content}"`)}`)
  }

  lines.push('')
  lines.push(chalk.red(`Issue: ${issue}`))
  lines.push(`${chalk.green('Fix:')} ${fix}`)

  return {
    header: chalk.red(`${type} Syntax Error`),
    lines
  }
}

/**
 * Log the syntax error directly via logger.block.
 * Use when you want the error rendered now and execution to continue
 * (or stop via a sentinel afterward).
 */
export function logSyntaxError(opts) {
  const { header, lines } = formatSyntaxError(opts)
  logger.block(header, ...lines)
}

/**
 * Throw an Error whose .message is the fully rendered report.
 * Use when the error must bubble up through a catch handler that prints
 * `error.message` (e.g. the top-level CLI catch in bin/purgetss).
 *
 * The thrown Error includes `isSyntaxError: true` so callers can distinguish
 * presentation-ready errors from generic runtime failures.
 */
export function throwSyntaxError(opts) {
  const { header, lines } = formatSyntaxError(opts)
  const text = `\n::PurgeTSS:: ${header}\n` + lines.map(l => '   ' + l).join('\n') + '\n'
  const err = new Error(text)
  err.isSyntaxError = true
  err.syntaxErrorType = opts.type
  throw err
}
