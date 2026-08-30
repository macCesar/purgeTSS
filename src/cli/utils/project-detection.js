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
 * @param {string} projectRoot - Project root to inspect
 * @returns {string} Project type: 'alloy', 'classic', or 'unknown'
 */
export function detectProjectType(projectRoot = process.cwd()) {
  if (fs.existsSync(path.join(projectRoot, 'app', 'views'))) return 'alloy'
  if (fs.existsSync(path.join(projectRoot, 'Resources'))) return 'classic'
  return 'unknown'
}

/**
 * Resolve the project-owned destinations used by standalone asset commands.
 * Alloy sources are compiled from app/, while Classic resources are consumed
 * directly from Resources/.
 *
 * @param {string} projectRoot - Project root to inspect
 * @returns {Object} Project type and canonical destination paths
 */
export function getProjectPaths(projectRoot = process.cwd()) {
  const root = path.resolve(projectRoot)
  const projectType = detectProjectType(root)
  const isClassic = projectType === 'classic'

  return {
    projectRoot: root,
    projectType,
    fontsFolder: isClassic
      ? path.join(root, 'Resources', 'fonts')
      : path.join(root, 'app', 'assets', 'fonts'),
    libFolder: isClassic
      ? path.join(root, 'Resources', 'lib')
      : path.join(root, 'app', 'lib'),
    semanticColorsPath: isClassic
      ? path.join(root, 'Resources', 'semantic.colors.json')
      : path.join(root, 'app', 'assets', 'semantic.colors.json'),
    semanticColorsRelPath: isClassic
      ? path.join('Resources', 'semantic.colors.json')
      : path.join('app', 'assets', 'semantic.colors.json')
  }
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
export function getSemanticColorsPath(projectRoot = process.cwd()) {
  return getProjectPaths(projectRoot).semanticColorsPath
}

/**
 * Display-friendly relative path for `semantic.colors.json` (used in logger
 * output so Classic users see `Resources/...` instead of `app/assets/...`).
 *
 * @returns {string} Relative path from cwd
 */
export function getSemanticColorsRelPath(projectRoot = process.cwd()) {
  return getProjectPaths(projectRoot).semanticColorsRelPath
}

/**
 * Check if project has PurgeTSS configuration
 *
 * @returns {boolean} True if config exists
 */
export function hasProjectConfig(projectRoot = process.cwd()) {
  return fs.existsSync(path.join(projectRoot, 'purgetss', 'config.cjs'))
}

/**
 * Validate project is suitable for PurgeTSS operations
 *
 * @param {boolean} silent - Suppress error messages
 * @returns {boolean} True if project is valid
 */
export function validateProject(silent = false, projectRoot = process.cwd()) {
  const projectType = detectProjectType(projectRoot)

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
  paths: getProjectPaths,
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
  getProjectPaths,
  getSemanticColorsPath,
  getSemanticColorsRelPath,
  hasProjectConfig,
  validateProject,
  projectUtils
}
