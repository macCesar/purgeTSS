/**
 * PurgeTSS v7.1 - CLI Utilities
 *
 * Common utilities for CLI commands like timing and project detection.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview CLI helper utilities
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import chalk from 'chalk'
import { beginPhase, endPhase } from './profile.js'
import { logger, getDebugMode } from '../../shared/logger.js'


/**
 * Start global timer for command execution
 * Maintains exact same logic as original start() function
 */
export function start() {
  return beginPhase()
}

/**
 * Finish global timer and log execution time
 * Maintains exact same logic as original finish() function
 *
 * @param {string} customMessage - Custom message to display
 */
export function finish(customMessage = 'Finished purging in', token = beginPhase()) {
  const elapsed = Math.round(endPhase(token, customMessage))
  logger.info(customMessage, chalk.green(`${Math.floor(elapsed / 1000)}s ${elapsed % 1000}ms`))
}

/**
 * Start local timer for sub-operations
 * Maintains exact same logic as original localStart() function
 */
export function localStart() {
  return beginPhase()
}

/**
 * Finish local timer and log execution time (only in debug mode).
 *
 * Pass an empty string to print only the timing (without re-emitting the
 * label) — useful when the caller already showed the section title via
 * `logger.info` before calling `localStart()`. Anything else is printed
 * verbatim with the timing appended.
 *
 * @param {string} customMessage - Label to print alongside the timing, or
 *   `''` for timing-only mode.
 */
export function localFinish(customMessage = 'Finished purging in', token = beginPhase()) {
  const elapsed = Math.round(endPhase(token, customMessage))
  if (!getDebugMode()) return
  const timing = chalk.green(`${Math.floor(elapsed / 1000)}s ${elapsed % 1000}ms`)
  if (customMessage === '') {
    // Timing-only mode: caller already printed the label.
    logger.info(timing)
  } else {
    logger.info(customMessage, timing)
  }
}

/**
 * Timer utilities grouped for convenience
 */
export const timer = {
  start,
  finish,
  localStart,
  localFinish
}

/**
 * Export for CLI usage
 */
export default {
  start,
  finish,
  localStart,
  localFinish,
  timer
}
