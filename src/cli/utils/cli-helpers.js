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
import { logger, getDebugMode } from '../../shared/logger.js'

// Global timing variables
let startTime
let localStartTime

/**
 * Start global timer for command execution
 * Maintains exact same logic as original start() function
 */
export function start() {
  startTime = new Date()
}

/**
 * Finish global timer and log execution time
 * Maintains exact same logic as original finish() function
 *
 * @param {string} customMessage - Custom message to display
 */
export function finish(customMessage = 'Finished purging in') {
  const endTime = new Date(new Date() - startTime)
  logger.info(customMessage, chalk.green(`${endTime.getSeconds()}s ${endTime.getMilliseconds()}ms`))
}

/**
 * Start local timer for sub-operations
 * Maintains exact same logic as original localStart() function
 */
export function localStart() {
  localStartTime = new Date()
}

/**
 * Finish local timer and log execution time (only in debug mode)
 * Maintains exact same logic as original localFinish() function
 *
 * @param {string} customMessage - Custom message to display
 */
export function localFinish(customMessage = 'Finished purging in') {
  const localEndTime = new Date(new Date() - localStartTime)
  if (getDebugMode()) {
    logger.info(customMessage, chalk.green(`${localEndTime.getSeconds()}s ${localEndTime.getMilliseconds()}ms`))
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
