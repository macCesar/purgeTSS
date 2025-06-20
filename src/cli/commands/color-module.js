/**
 * PurgeTSS v7.1 - Color Module Command
 *
 * CLI command to copy all colors from config.js to the lib folder.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Color module command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import { createRequire } from 'module'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import { projectsConfigJS, projectsLibFolder } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { initIfNotConfig } from '../utils/file-operations.js'
import { cleanDoubleQuotes } from '../utils/file-operations.js'

// Create require for ESM compatibility
const require = createRequire(import.meta.url)

/**
 * Copy all colors from config.js to lib folder
 * COPIED exactly from original colorModule() function
 *
 * @param {Object} options - Command options
 * @returns {boolean} Success status
 */
export function colorModule(options) {
  if (!alloyProject()) {
    return false
  }

  initIfNotConfig()
  const colorModuleConfigFile = require(projectsConfigJS)
  makeSureFolderExists(projectsLibFolder)
  const mainColors = { ...colorModuleConfigFile.theme.colors, ...colorModuleConfigFile.theme.extend.colors }
  fs.writeFileSync(`${projectsLibFolder}/purgetss.colors.js`, 'module.exports = ' + cleanDoubleQuotes(mainColors, {}), 'utf8', err => { throw err })
  logger.info(`All colors copied to ${chalk.yellow('lib/purgetss.colors.js')}`)
  return true
}

/**
 * Export for CLI usage
 */
export default colorModule
