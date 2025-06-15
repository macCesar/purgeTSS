/**
 * PurgeTSS v7.1 - Watch Command
 *
 * CLI command for watch mode functionality.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Watch mode command for auto-purging
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import { alloyProject } from '../../shared/utils.js'
import { projectsAlloyJMKFile } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { disableHook, deleteHook, addHook, enableHook, createJMKFile } from '../utils/hook-management.js'

/**
 * Get command configuration for hooks
 * Maintains exact same logic as original getCommands() function
 * TODO: Move this to a shared utility when extracting more hook-related functions
 *
 * @returns {Object} Command configuration object
 */
function getCommands() {
  // Import config manager dynamically to avoid circular imports
  const { getConfigFile } = require('../../shared/config-manager.js')
  const configFile = getConfigFile()

  let methodCommand
  let oppositeCommand

  if (configFile.purge.method === 'sync' || configFile.purge.method === '') {
    oppositeCommand = 'require(\'child_process\').exec(\'purgetss'
    methodCommand = '\trequire(\'child_process\').execSync(\'purgetss\', logger.warn(\'::PurgeTSS:: Auto-Purging \' + event.dir.project));'
  } else {
    oppositeCommand = 'require(\'child_process\').execSync(\'purgetss'
    methodCommand = '\trequire(\'child_process\').exec(\'purgetss\', logger.warn(\'::PurgeTSS:: Auto-Purging \' + event.dir.project));'
  }

  return { methodCommand, oppositeCommand }
}

/**
 * Watch mode command for auto-purging setup
 * Maintains exact same logic as original watchMode() function
 *
 * TODO: Extract hook-related functions (disableHook, deleteHook, addHook, enableHook, createJMKFile)
 * when implementing the full purge system
 *
 * @param {Object} options - Command options
 * @returns {boolean} Success status
 */
export function watchMode(options) {
  if (!alloyProject()) {
    return false
  }

  if (fs.existsSync(projectsAlloyJMKFile)) {
    // Get commands when needed
    const { methodCommand } = getCommands()

    // TODO: Refactor with readline or line-reader: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
    if (options.off) {
      disableHook()
    } else if (options.delete) {
      deleteHook()
    } else if (!fs.readFileSync(projectsAlloyJMKFile, 'utf8').includes('::PurgeTSS::')) {
      addHook(methodCommand)
    } else if (fs.readFileSync(projectsAlloyJMKFile, 'utf8').includes(`//${methodCommand}`)) {
      enableHook()
    } else {
      logger.warn(chalk.yellow('Auto-Purging hook already present!'))
    }
  } else if (!options.off) {
    const { methodCommand } = getCommands()
    createJMKFile(methodCommand)
  }

  return true
}

/**
 * Export for CLI usage
 */
export default watchMode
