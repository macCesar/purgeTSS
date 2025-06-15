/**
 * PurgeTSS v7.1 - Init Command
 *
 * CLI command for project initialization.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Project initialization command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import {
  projectsConfigJS,
  projectsTailwind_TSS,
  projectsAlloyJMKFile,
  projectsPurgeTSSFolder,
  projectsPurge_TSS_Fonts_Folder,
  srcConfigFile
} from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { addHook, deleteHook, createJMKFile } from '../utils/hook-management.js'

const cwd = process.cwd()

/**
 * Get command configuration for hooks
 * COPIED exactly from original getCommands() function
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
 * Create PurgeTSS config file
 * COPIED exactly from original createConfigFile() function
 */
export function createConfigFile() {
  if (alloyProject()) {
    makeSureFolderExists(projectsPurgeTSSFolder)
    makeSureFolderExists(projectsPurge_TSS_Fonts_Folder)

    if (fs.existsSync(projectsConfigJS)) {
      logger.warn('./purgetss/config.js', chalk.red('file already exists!'))
    } else {
      fs.copyFileSync(srcConfigFile, projectsConfigJS)
      logger.file('./purgetss/config.js')
    }
  }
}

/**
 * Build Tailwind based on config options
 * TODO: Need to COPY the complete buildTailwindBasedOnConfigOptions function
 *
 * @param {Object} options - Build options
 */
function buildTailwindBasedOnConfigOptions(options) {
  // TODO: COPY the complete buildTailwindBasedOnConfigOptions function
  logger.warn('buildTailwindBasedOnConfigOptions() - Function needs to be COPIED from original')
}

/**
 * Create definitions file
 * TODO: Need to COPY the complete createDefinitionsFile function
 */
function createDefinitionsFile() {
  // TODO: COPY the complete createDefinitionsFile function
  logger.warn('createDefinitionsFile() - Function needs to be COPIED from original')
}

/**
 * Initialize PurgeTSS project
 * COPIED exactly from original init() function
 *
 * @param {Object} options - Command options
 * @returns {boolean} Success status
 */
export function init(options) {
  // Check if we're in an Alloy project first
  if (!alloyProject()) {
    return false
  }

  // Get commands when needed
  const { methodCommand, oppositeCommand } = getCommands()

  // config file
  if (!fs.existsSync(projectsConfigJS)) {
    createConfigFile()
  }

  // tailwind.tss
  if (!fs.existsSync(projectsTailwind_TSS) || options.all) {
    buildTailwindBasedOnConfigOptions(options)
  }

  // definitions file
  if (!fs.existsSync(`${cwd}/purgetss/styles/definitions.css`) || options.all) {
    createDefinitionsFile()
  }

  // auto purge hook
  if (fs.existsSync(projectsAlloyJMKFile)) {
    if (!fs.readFileSync(projectsAlloyJMKFile, 'utf8').includes('::PurgeTSS::')) {
      addHook(methodCommand)
    } else if (fs.readFileSync(projectsAlloyJMKFile, 'utf8').includes(oppositeCommand)) {
      deleteHook()
      addHook(methodCommand)
    }
  } else {
    createJMKFile(methodCommand)
  }

  return true
}

/**
 * Export for CLI usage
 */
export default {
  init,
  createConfigFile
}
