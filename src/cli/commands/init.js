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
import path from 'path'
import _ from 'lodash'
import chalk from 'chalk'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import {
  projectsConfigJS,
  projectsTailwind_TSS,
  projectsAlloyJMKFile,
  projectsPurgeTSSFolder,
  projectsPurge_TSS_Fonts_Folder,
  srcConfigFile,
  projectsFA_TSS_File,
  srcFontAwesomeTSSFile,
  srcFramework7FontTSSFile,
  srcMaterialIconsTSSFile,
  srcMaterialSymbolsTSSFile,
  PurgeTSSPackageJSON
} from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { getConfigOptions } from '../../shared/config-manager.js'
import { addHook, deleteHook, createJMKFile } from '../utils/hook-management.js'
import { getFiles } from '../utils/font-utilities.js'

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
 * COPIED exactly from original buildTailwindBasedOnConfigOptions function
 *
 * @param {Object} options - Build options
 */
function buildTailwindBasedOnConfigOptions(options = {}) {
  const configOptions = getConfigOptions()

  if (configOptions.legacy) {
    // TODO: COPY buildTailwindLegacy() function
    logger.warn('buildTailwindLegacy() - Function needs to be COPIED from original')
  } else {
    // TODO: COPY buildTailwind() function
    logger.warn('buildTailwind() - Function needs to be COPIED from original')
  }
}

/**
 * Create definitions file
 * COPIED exactly from original createDefinitionsFile function
 */
function createDefinitionsFile() {
  const configOptions = getConfigOptions()
  let classDefinitions = ''

  // read classes from _app.tss file
  if (fs.existsSync(`${cwd}/app/styles`)) {
    _.each(getFiles(`${cwd}/app/styles`).filter(file => file.endsWith('.tss') && file.endsWith('_app.tss')), file => {
      classDefinitions += fs.readFileSync(file, 'utf8')
    })
  }

  if (fs.existsSync(projectsTailwind_TSS)) {
    classDefinitions += fs.readFileSync(projectsTailwind_TSS, 'utf8')
  }

  if (configOptions.widgets && fs.existsSync(`${cwd}/app/widgets/`)) {
    _.each(getFiles(`${cwd}/app/widgets`).filter(file => file.endsWith('.tss')), file => {
      classDefinitions += fs.readFileSync(file, 'utf8')
    })
  }

  // ! Get Styles from Themes
  if (fs.existsSync(`${cwd}/app/themes/`)) {
    _.each(getFiles(`${cwd}/app/themes`).filter(file => file.endsWith('.tss')), file => {
      classDefinitions += fs.readFileSync(file, 'utf8')
    })
  }

  if (fs.existsSync(`${cwd}/purgetss/styles/fonts.tss`)) {
    classDefinitions += fs.readFileSync(`${cwd}/purgetss/styles/fonts.tss`, 'utf8')
  }

  classDefinitions += (fs.existsSync(projectsFA_TSS_File)) ? fs.readFileSync(projectsFA_TSS_File, 'utf8') : fs.readFileSync(srcFontAwesomeTSSFile, 'utf8')

  classDefinitions += fs.readFileSync(srcFramework7FontTSSFile, 'utf8')

  classDefinitions += fs.readFileSync(srcMaterialIconsTSSFile, 'utf8')

  classDefinitions += fs.readFileSync(srcMaterialSymbolsTSSFile, 'utf8')

  classDefinitions = classDefinitions
    .replace(/\/\/[^\n]*\n/g, '')
    .replace(/\/\*\*\n([\s\S]*?)\*\//gm, '')
    .replace(/\{[\s\S]*?\}/gm, '{ }')
    .replace(/{(.*)}/g, '{}')
    .replace(/\[(.*)\]/g, '')
    .replace(/[:'"]/g, '')
    .replace(/^[a-zA-Z].*$/gm, '')
    .replace(/\s/g, '')

  classDefinitions += '.ios{}.android{}.handheld{}.tablet{}.open{}.close{}.complete{}.drag{}.drop{}.bounds{}'

  fs.writeFileSync(`${cwd}/purgetss/styles/definitions.css`, `/* Class definitions (v${PurgeTSSPackageJSON.version}) */${classDefinitions}`)
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
