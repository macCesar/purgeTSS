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
import path from 'path'
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
 * Resolve the absolute path to `semantic.colors.json` for the current project.
 *
 * Titanium SDK convention:
 *   - Alloy   → app/assets/semantic.colors.json
 *   - Classic → Resources/semantic.colors.json
 *
 * Defaults to the Alloy path when the project type can't be detected so callers
 * that failed the earlier validateProject() guard still get a deterministic
 * value back.
 *
 * @returns {string} Absolute path
 */
export function getSemanticColorsPath() {
  const projectType = detectProjectType()
  if (projectType === 'classic') {
    return path.join(process.cwd(), 'Resources', 'semantic.colors.json')
  }
  return path.join(process.cwd(), 'app', 'assets', 'semantic.colors.json')
}

/**
 * Display-friendly relative path for `semantic.colors.json` (used in logger
 * output so Classic users see `Resources/...` instead of `app/assets/...`).
 *
 * @returns {string} Relative path from cwd
 */
export function getSemanticColorsRelPath() {
  const projectType = detectProjectType()
  return projectType === 'classic'
    ? 'Resources/semantic.colors.json'
    : 'app/assets/semantic.colors.json'
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
      logger.block(
        'Please make sure you are running purgetss within an Alloy or Classic Project.',
        'For more information, visit https://purgetss.com'
      )
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
  getSemanticColorsPath,
  getSemanticColorsRelPath,
  hasProjectConfig,
  validateProject,
  projectUtils
}
