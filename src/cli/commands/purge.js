/**
 * PurgeTSS v7.1.0 - CLI Command: purge
 * Main purging command for cleaning up unused classes from app.tss
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import { alloyProject, makeSureFileExists } from '../../shared/utils.js'
import { PATHS } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { start, finish } from '../utils/cli-helpers.js'

/**
 * Main purging command - removes unused CSS classes from app.tss
 * This is the core functionality of PurgeTSS
 *
 * @param {Object} options - CLI options
 * @param {boolean} options.debug - Enable debug mode
 * @returns {void}
 */
export function purgeClasses(options) {
  if (alloyProject()) {
    // Set global debug flag
    global.purgingDebug = options.debug

    const recentlyCreated = makeSureFileExists(PATHS.projectsAppTSS)

    // Only purge if file is older than 2 seconds or was just created
    if (Date.now() > (fs.statSync(PATHS.projectsAppTSS).mtimeMs + 2000) || recentlyCreated) {
      start()

      // Initialize project configuration
      init(options)

      // Backup the original app.tss
      backupOriginalAppTss()

      // Extract unique classes from XML files
      const uniqueClasses = getUniqueClasses()

      // Start with reset template and existing app.tss
      let tempPurged = copyResetTemplateAndAppTSS()

      // Purge different class types
      tempPurged += purgeTailwind(uniqueClasses)

      const cleanUniqueClasses = cleanClasses(uniqueClasses)

      tempPurged += purgeFontAwesome(uniqueClasses, cleanUniqueClasses)
      tempPurged += purgeMaterialIcons(uniqueClasses, cleanUniqueClasses)
      tempPurged += purgeMaterialSymbols(uniqueClasses, cleanUniqueClasses)
      tempPurged += purgeFramework7(uniqueClasses, cleanUniqueClasses)
      tempPurged += purgeFonts(uniqueClasses, cleanUniqueClasses)

      // Process any missing classes
      tempPurged += processMissingClasses(tempPurged)

      // Save the final purged file
      saveFile(PATHS.projectsAppTSS, tempPurged)

      logger.file('app.tss')

      finish()
    } else {
      logger.warn('Project purged less than 2 seconds ago!')
    }
  }
}

// TODO: These functions need to be imported from core modules when they're extracted
// For now, they will be available from the main index.js until core refactor is complete

// Placeholder imports - these will be replaced with proper imports once core modules are extracted
let init, backupOriginalAppTss, getUniqueClasses, copyResetTemplateAndAppTSS
let purgeTailwind, cleanClasses, purgeFontAwesome, purgeMaterialIcons
let purgeMaterialSymbols, purgeFramework7, purgeFonts, processMissingClasses, saveFile

/**
 * Initialize function references from main index
 * This is a temporary solution until core modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializePurgeFunctions(functions) {
  init = functions.init
  backupOriginalAppTss = functions.backupOriginalAppTss
  getUniqueClasses = functions.getUniqueClasses
  copyResetTemplateAndAppTSS = functions.copyResetTemplateAndAppTSS
  purgeTailwind = functions.purgeTailwind
  cleanClasses = functions.cleanClasses
  purgeFontAwesome = functions.purgeFontAwesome
  purgeMaterialIcons = functions.purgeMaterialIcons
  purgeMaterialSymbols = functions.purgeMaterialSymbols
  purgeFramework7 = functions.purgeFramework7
  purgeFonts = functions.purgeFonts
  processMissingClasses = functions.processMissingClasses
  saveFile = functions.saveFile
}
