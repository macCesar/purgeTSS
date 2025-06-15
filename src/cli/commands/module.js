/**
 * PurgeTSS v7.1 - Module Command
 *
 * CLI command to copy PurgeTSS UI module to project.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Module copying command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import { alloyProject, classicProject, makeSureFolderExists } from '../../shared/utils.js'
import {
  projectsLibFolder,
  classicProjectLibFolder,
  srcPurgeTSSLibrary
} from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'

/**
 * Copy PurgeTSS UI module to project lib folder
 * Maintains exact same logic as original copyModulesLibrary() function
 *
 * @returns {boolean} Success status
 */
export function copyModulesLibrary() {
  if (alloyProject(true)) {
    // Copy to Alloy project
    makeSureFolderExists(projectsLibFolder)
    fs.copyFileSync(srcPurgeTSSLibrary, projectsLibFolder + '/purgetss.ui.js')
    logger.info(chalk.yellow('purgetss.ui'), 'module copied to', chalk.yellow('./app/lib'), 'folder')
    return true
  } else if (classicProject(true)) {
    // Copy to Classic project
    makeSureFolderExists(classicProjectLibFolder)
    fs.copyFileSync(srcPurgeTSSLibrary, classicProjectLibFolder + '/purgetss.ui.js')
    logger.info(chalk.yellow('purgetss.ui'), 'module copied to', chalk.yellow('./Resources/lib'), 'folder')
    return true
  } else {
    // Not in a valid project
    logger.info(`Please make sure you are running ${chalk.green('purgetss')} within an Alloy or Classic Project.`)
    logger.info(`For more information, visit ${chalk.green('https://purgetss.com')}`)
    return false
  }
}

/**
 * Export for CLI usage
 */
export default copyModulesLibrary
