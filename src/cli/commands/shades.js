/**
 * PurgeTSS v7.1 - Shades Commands
 *
 * CLI commands for color shade generation and management.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Color shades and colorModule commands
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import { projectsConfigJS, projectsLibFolder } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { initIfNotConfig, cleanDoubleQuotes } from '../utils/file-operations.js'

/**
 * Create color module with all colors from config
 * Maintains exact same logic as original colorModule() function
 *
 * @returns {boolean} Success status
 */
export function colorModule() {
  if (!alloyProject()) {
    return false
  }

  initIfNotConfig()

  const colorModuleConfigFile = require(projectsConfigJS)

  makeSureFolderExists(projectsLibFolder)

  const mainColors = {
    ...colorModuleConfigFile.theme.colors,
    ...colorModuleConfigFile.theme.extend.colors
  }

  fs.writeFileSync(
    `${projectsLibFolder}/purgetss.colors.js`,
    'module.exports = ' + cleanDoubleQuotes(mainColors, {}),
    'utf8',
    err => { throw err }
  )

  logger.info(`All colors copied to ${chalk.yellow('lib/purgetss.colors.js')}`)

  return true
}

/**
 * Check if color module exists and update if needed
 * Maintains exact same logic as original checkIfColorModule() function
 */
export function checkIfColorModule() {
  if (fs.existsSync(`${projectsLibFolder}/purgetss.colors.js`)) {
    colorModule()
  }
}

/**
 * Main shades command (placeholder for now)
 * This will be implemented when extracting the full shades functionality
 *
 * @param {Array} args - Command arguments
 * @param {Object} options - Command options
 * @returns {Promise<boolean>} Success status
 */
export async function shades(args, options) {
  // TODO: Implement full shades functionality
  // This function is complex and will need color-shades utilities
  logger.warn('Shades command not yet implemented in refactored version')
  return false
}

/**
 * Export for CLI usage
 */
export default {
  colorModule,
  checkIfColorModule,
  shades
}
