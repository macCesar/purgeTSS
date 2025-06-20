/**
 * PurgeTSS v7.1 - Project Detection Utilities
 *
 * Project type detection and validation utilities.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Project detection and validation utilities
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import { alloyProject, classicProject } from '../../shared/utils.js'
import { projectsConfigJS } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'

/**
 * Check if current directory is an Alloy project
 * Re-export from shared utils for convenience
 *
 * @param {boolean} silent - Suppress error messages
 * @returns {boolean} True if in Alloy project
 */
export { alloyProject } from '../../shared/utils.js'

/**
 * Check if current directory is a Classic Titanium project
 * Re-export from shared utils for convenience
 *
 * @param {boolean} silent - Suppress error messages
 * @returns {boolean} True if in Classic project
 */
export { classicProject } from '../../shared/utils.js'

/**
 * Detect project type
 *
 * @returns {string} Project type: 'alloy', 'classic', or 'unknown'
 */
export function detectProjectType() {
  if (alloyProject(true)) return 'alloy'
  if (classicProject(true)) return 'classic'
  return 'unknown'
}

/**
 * Check if project has PurgeTSS configuration
 *
 * @returns {boolean} True if config exists
 */
export function hasProjectConfig() {
  return fs.existsSync(projectsConfigJS)
}

/**
 * Validate project is suitable for PurgeTSS operations
 *
 * @param {boolean} silent - Suppress error messages
 * @returns {boolean} True if project is valid
 */
export function validateProject(silent = false) {
  const projectType = detectProjectType()

  if (projectType === 'unknown') {
    if (!silent) {
      logger.info('Please make sure you are running purgetss within an Alloy or Classic Project.')
      logger.info('For more information, visit https://purgetss.com')
    }
    return false
  }

  return true
}

/**
 * Project utilities grouped for convenience
 */
export const projectUtils = {
  isAlloy: alloyProject,
  isClassic: classicProject,
  detectType: detectProjectType,
  hasConfig: hasProjectConfig,
  validate: validateProject
}

/**
 * Export for CLI usage
 */
export default {
  alloyProject,
  classicProject,
  detectProjectType,
  hasProjectConfig,
  validateProject,
  projectUtils
}
