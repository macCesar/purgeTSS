/**
 * PurgeTSS v7.1 - Fonts Command
 *
 * CLI command for copying font files and libraries.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Font copying command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import _ from 'lodash'
import chalk from 'chalk'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import { projectsFontsFolder } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'

/**
 * Copy specific font vendor files
 * COPIED exactly from original copyFont() function
 * TODO: Need to COPY all the font copying functions (copyProFonts, copyFreeFonts, etc.)
 *
 * @param {string} vendor - Font vendor identifier
 */
function copyFont(vendor) {
  // TODO: COPY the complete copyFont function with all its dependencies
  logger.warn(`copyFont(${vendor}) - Function needs to be COPIED from original`)
}

/**
 * Copy font libraries
 * COPIED exactly from original copyFontLibraries() function
 * TODO: Need to COPY the complete function
 *
 * @param {Object} options - Command options
 */
function copyFontLibraries(options) {
  // TODO: COPY the complete copyFontLibraries function
  logger.warn('copyFontLibraries() - Function needs to be COPIED from original')
}

/**
 * Copy font styles
 * COPIED exactly from original copyFontStyles() function
 * TODO: Need to COPY the complete function
 *
 * @param {Object} options - Command options
 */
function copyFontStyles(options) {
  // TODO: COPY the complete copyFontStyles function
  logger.warn('copyFontStyles() - Function needs to be COPIED from original')
}

/**
 * Copy fonts command - main entry point
 * COPIED exactly from original copyFonts() function
 *
 * @param {Object} options - Command options
 * @returns {boolean} Success status
 */
export function copyFonts(options) {
  if (!alloyProject()) {
    return false
  }

  makeSureFolderExists(projectsFontsFolder)

  if (options.vendor && typeof options.vendor === 'string') {
    const selected = _.uniq(options.vendor.replace(/ /g, '').split(','))
    logger.info('Copying Icon Fonts...')
    _.each(selected, vendor => {
      copyFont(vendor)
    })
  } else {
    logger.info('Copying Fonts to', chalk.yellow('./app/assets/fonts'), 'folder')
    copyFont('fa')
    copyFont('mi')
    copyFont('ms')
    copyFont('f7')
  }

  if (options.module) {
    console.log()
    logger.info('Copying Modules to', chalk.yellow('./app/lib'), 'folder')
    copyFontLibraries(options)
  }

  if (options.styles) {
    console.log()
    logger.info('Copying Styles to', chalk.yellow('./purgetss/styles'), 'folder')
    copyFontStyles(options)
  }

  return true
}

/**
 * Export for CLI usage
 */
export default copyFonts
