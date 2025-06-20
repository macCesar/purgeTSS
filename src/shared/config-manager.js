/**
 * PurgeTSS v7.1 - Configuration Manager
 *
 * Centralized configuration management for PurgeTSS project configs.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Configuration loading and management utilities
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import { createRequire } from 'module'
import defaultTheme from 'tailwindcss/defaultTheme.js'
import {
  projectsConfigJS,
  projectsPurgeTSSFolder,
  srcConfigFile
} from './constants.js'
import { logger } from './logger.js'
import { makeSureFolderExists } from './utils.js'

// Create require for ESM compatibility
const require = createRequire(import.meta.url)

/**
 * Migrate config.js to config.cjs for ESM compatibility
 * This must be called BEFORE any config file creation
 */
export function migrateConfigIfNeeded() {
  const oldConfigPath = `${projectsPurgeTSSFolder}/config.js`

  // If only config.js exists, migrate it directly
  if (fs.existsSync(oldConfigPath) && !fs.existsSync(projectsConfigJS)) {
    makeSureFolderExists(projectsPurgeTSSFolder)
    fs.renameSync(oldConfigPath, projectsConfigJS)
    logger.info('Migrated config.js to config.cjs for ESM compatibility')
  }
  // If both exist, preserve config.js (let the user decide)
  else if (fs.existsSync(oldConfigPath) && fs.existsSync(projectsConfigJS)) {
    logger.warn('Both config.js and config.cjs exist. Please manually merge and remove config.js')
  }
}

/**
 * Get configuration file with fallback to default template
 * Maintains exact same logic as original getConfigFile()
 *
 * @returns {Object} Configuration object with defaults applied
 */
export function getConfigFile() {

  const configFile = (fs.existsSync(projectsConfigJS))
    ? require(projectsConfigJS)
    : require(srcConfigFile)

  // Apply default values following template structure
  configFile.purge = configFile.purge ?? {}
  configFile.purge.mode = configFile.purge.mode ?? 'all'
  configFile.purge.method = configFile.purge.method ?? 'sync'
  configFile.purge.options = configFile.purge.options ?? {}
  configFile.purge.options.missing = configFile.purge.options.missing ?? true
  configFile.purge.options.widgets = configFile.purge.options.widgets ?? false
  configFile.purge.options.safelist = configFile.purge.options.safelist ?? []
  configFile.purge.options.plugins = configFile.purge.options.plugins ?? []

  configFile.theme = configFile.theme ?? {}
  configFile.theme.extend = configFile.theme.extend ?? {}

  return configFile
}

/**
 * Get configuration options with defaults
 * Maintains exact same logic as original getConfigOptions()
 *
 * @returns {Object} Configuration options with defaults applied
 */
export function getConfigOptions() {
  const configFile = getConfigFile()
  const configOptions = (configFile.purge && configFile.purge.options)
    ? configFile.purge.options
    : {}

  if (configOptions) {
    // Legacy mode removed in v7.1 - always use modern mode
    configOptions.widgets = configOptions.widgets ?? false
    configOptions.missing = configOptions.missing ?? true
    configOptions.plugins = configOptions.plugins ?? []
  }

  return configOptions
}

/**
 * Check if config file exists in project
 *
 * @returns {boolean} True if project has custom config
 */
export function hasProjectConfig() {
  return fs.existsSync(projectsConfigJS)
}

/**
 * Get config file path (project or default)
 *
 * @returns {string} Path to active config file
 */
export function getActiveConfigPath() {
  return hasProjectConfig() ? projectsConfigJS : srcConfigFile
}

/**
 * Load config file without defaults (raw)
 *
 * @returns {Object} Raw configuration object
 */
export function loadRawConfig() {
  const configPath = getActiveConfigPath()
  return require(configPath)
}

/**
 * Get the global config file instance (lazy-loaded)
 * Maintains compatibility with legacy code that expects `configFile` variable
 *
 * @returns {Object} Configuration file with defaults applied
 */
export function getGlobalConfigFile() {
  return getConfigFile()
}

/**
 * Get the global config options instance (lazy-loaded)
 * Maintains compatibility with legacy code that expects `configOptions` variable
 *
 * @returns {Object} Configuration options with defaults applied
 */
export function getGlobalConfigOptions() {
  const file = getConfigFile()
  const options = (file.purge && file.purge.options) ? file.purge.options : {}

  if (options) {
    options.widgets = options.widgets ?? false
    options.missing = options.missing ?? true
    options.plugins = options.plugins ?? []
  }

  return options
}

// Legacy exports removed - use getConfigFile() and getConfigOptions() functions instead

/**
 * Export defaultTheme from tailwindcss for backward compatibility
 */
export { defaultTheme }

/**
 * Export for backward compatibility
 */
export default {
  getConfigFile,
  getConfigOptions,
  hasProjectConfig,
  getActiveConfigPath,
  loadRawConfig,
  getGlobalConfigFile,
  getGlobalConfigOptions,
  migrateConfigIfNeeded,
  defaultTheme
}
