 
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
import { getConfigOptions, getConfigFile, ensureConfig } from '../../shared/config-manager.js'
import { addHook, deleteHook, createJMKFile } from '../utils/hook-management.js'
import { getFiles } from '../utils/font-utilities.js'
import { buildTailwindBasedOnConfigOptions } from '../../core/builders/tailwind-builder.js'

const cwd = process.cwd()


/**
 * Get command configuration for hooks
 * COPIED exactly from original getCommands() function
 *
 * @returns {Object} Command configuration object
 */
function getCommands() {
  // Use the already imported getConfigFile function
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
      logger.warn('./purgetss/config.cjs', chalk.red('file already exists!'))
    } else {
      fs.copyFileSync(srcConfigFile, projectsConfigJS)
      logger.file('./purgetss/config.cjs')
    }
  }
}

/**
 * Create the definitions.css file with all class definitions
 * COPIED exactly from original createDefinitionsFile() function
 */
function createDefinitionsFile() {
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

  const configOptions = getConfigOptions()
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

  // Ensure styles folder exists before writing
  makeSureFolderExists(`${cwd}/purgetss/styles`)

  fs.writeFileSync(`${cwd}/purgetss/styles/definitions.css`, `/* Class definitions (v${PurgeTSSPackageJSON.version}) */${classDefinitions}`)

  logger.file('./purgetss/styles/definitions.css')
}

/**
 * Initialize PurgeTSS project
 * COPIED exactly from original init() function
 *
 * @param {Object} options - Command options
 * @returns {boolean} Success status
 */
/**
 * Export for use in other modules
 */
export { createDefinitionsFile }

export function init(options) {
  // Check if we're in an Alloy project first
  if (!alloyProject()) {
    return false
  }

  // Check if config.cjs already exists to show appropriate message
  const configExisted = fs.existsSync(projectsConfigJS)

  // SUPER SIMPLE: Ensure config exists (migrate or create)
  ensureConfig()

  // Show warning if config already existed (for init command specifically)
  if (configExisted) {
    logger.warn('./purgetss/config.cjs', chalk.red('file already exists!'))
  }

  // Get commands when needed
  const { methodCommand, oppositeCommand } = getCommands()

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
