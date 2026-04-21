/**
 * PurgeTSS v7.1 - Logger System
 *
 * Centralized logging system for PurgeTSS with consistent formatting.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Logger utilities with color support
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import chalk from 'chalk'
import { colores } from './brand-colors.js'

// Get the purge label from colores
const purgeLabel = colores.purgeLabel

// Debug mode flag (can be set externally)
let purgingDebug = false

// Section mode: when active, the first info/warn/error/file call acts as a
// ::PurgeTSS:: header and every subsequent call prints indented 3 spaces
// without the prefix. Used by long-running flows (e.g. purge) that want a
// single signed line per run instead of one per step. Always wrap with
// try/finally in the caller to guarantee endSection() runs.
let _sectionMode = false
let _sectionHeaderEmitted = false

function _emit(text) {
  if (_sectionMode) {
    if (_sectionHeaderEmitted) {
      console.log('   ' + text)
    } else {
      console.log(purgeLabel, text)
      _sectionHeaderEmitted = true
    }
  } else {
    console.log(purgeLabel, text)
  }
}

/**
 * Main logger object with different log levels
 * Maintains exact same API as original for compatibility
 */
export const logger = {
  /**
   * Log info messages in default color
   * @param {...any} args - Arguments to log
   */
  info: function(...args) {
    _emit(args.join(' '))
  },

  /**
   * Log warning messages in yellow
   * @param {...any} args - Arguments to log
   */
  warn: function(...args) {
    _emit(chalk.yellow(args.join(' ')))
  },

  /**
   * Log error messages in red
   * @param {...any} args - Arguments to log
   */
  error: function(...args) {
    _emit(chalk.red(args.join(' ')))
  },

  /**
   * Log file creation messages with success indicator
   * @param {...any} args - Arguments to log
   */
  file: function(...args) {
    _emit(chalk.yellow(args.join(' ')) + ' file created!')
  },

  /**
   * Enable section mode. The next info/warn/error/file call becomes the
   * ::PurgeTSS:: header; subsequent calls print indented without prefix.
   * MUST be paired with endSection() via try/finally to avoid state leaks.
   */
  startSection: function() {
    _sectionMode = true
    _sectionHeaderEmitted = false
  },

  /**
   * Exit section mode. Safe to call even if section wasn't started.
   */
  endSection: function() {
    _sectionMode = false
    _sectionHeaderEmitted = false
  },

  /**
   * Log a multi-line block with a single ::PurgeTSS:: header.
   * First arg is the header (printed next to purgeLabel); remaining args are
   * continuation lines indented 3 spaces. Pass '' for a blank separator line.
   *
   * @param {string} header - Header line (printed after purgeLabel)
   * @param {...string} lines - Continuation lines (indented, or '' for blank)
   */
  block: function(header, ...lines) {
    console.log(purgeLabel, header)
    for (const line of lines) {
      console.log(line === '' ? '' : '   ' + line)
    }
  },

  /**
   * Log a sub-line without the ::PurgeTSS:: prefix, indented 3 spaces.
   * Use inside sequential flows where a prior logger.info emitted the header.
   * Prints synchronously, preserving timing with logger.info.
   *
   * @param {...any} args - Arguments to log
   */
  item: function(...args) {
    console.log('   ' + args.join(' '))
  }
}

/**
 * Get current debug mode status
 * @returns {boolean} Current debug status
 */
export function getDebugMode() {
  return purgingDebug
}

/**
 * Set debug mode status
 * @param {boolean} debug - Debug mode flag
 */
export function setDebugMode(debug) {
  purgingDebug = debug
}

/**
 * Export for backward compatibility
 */
export { purgingDebug }

/**
 * Default export for convenience
 */
export default logger
