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
import { getConfigFile, ensureConfig } from '../../shared/config-manager.js'
import {
  addHook,
  autoPurgeHookIsDisabled,
  autoPurgeHookNeedsUpdate,
  createJMKFile,
  deleteHook,
  disableHook,
  enableHook,
  getAutoPurgeCommands,
  updateHook
} from '../utils/hook-management.js'

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

  // Ensure config exists before accessing it
  ensureConfig()

  if (fs.existsSync(projectsAlloyJMKFile)) {
    // Get commands when needed
    const { methodCommand } = getAutoPurgeCommands(getConfigFile().purge.method)
    const hookContents = fs.readFileSync(projectsAlloyJMKFile, 'utf8')

    // TODO: Refactor with readline or line-reader: https://stackabuse.com/reading-a-file-line-by-line-in-node-js/
    if (options.off) {
      disableHook()
    } else if (options.delete) {
      deleteHook()
    } else if (!hookContents.includes('::PurgeTSS::')) {
      addHook(methodCommand)
    } else if (autoPurgeHookNeedsUpdate(hookContents, methodCommand)) {
      const wasDisabled = autoPurgeHookIsDisabled(hookContents)
      updateHook(methodCommand)
      if (wasDisabled) enableHook()
    } else if (autoPurgeHookIsDisabled(hookContents)) {
      enableHook()
    } else {
      logger.warn(chalk.yellow('Auto-Purging hook already present!'))
    }
  } else if (!options.off) {
    const { methodCommand } = getAutoPurgeCommands(getConfigFile().purge.method)
    createJMKFile(methodCommand)
  }

  return true
}

/**
 * Export for CLI usage
 */
export default watchMode
