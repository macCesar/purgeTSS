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
import { colores } from '../../lib/colores.js'

// Get the purge label from colores
const purgeLabel = colores.purgeLabel

// Debug mode flag (can be set externally)
let purgingDebug = false

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
    console.log(purgeLabel, args.join(' '))
  },

  /**
   * Log warning messages in yellow
   * @param {...any} args - Arguments to log
   */
  warn: function(...args) {
    console.log(purgeLabel, chalk.yellow(args.join(' ')))
  },

  /**
   * Log error messages in red
   * @param {...any} args - Arguments to log
   */
  error: function(...args) {
    console.log(purgeLabel, chalk.red(args.join(' ')))
  },

  /**
   * Log file creation messages with success indicator
   * @param {...any} args - Arguments to log
   */
  file: function(...args) {
    console.log(purgeLabel, chalk.yellow(args.join(' ')), 'file created!')
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
