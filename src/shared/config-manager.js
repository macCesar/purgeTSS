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
import {
  projectsConfigJS,
  srcConfigFile
} from './constants.js'

// Create require for ESM compatibility
const require = createRequire(import.meta.url)

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

  // Apply default values
  configFile.purge = configFile.purge ?? { mode: 'all', method: 'sync' }
  configFile.purge.method = configFile.purge.method ?? 'sync'
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
    configOptions.legacy = configOptions.legacy ?? false
    configOptions.widgets = configOptions.widgets ?? false
    configOptions.missing = configOptions.missing ?? true
    configOptions.plugins = configOptions.plugins ?? []

    // Set global legacy option (requires helpers import)
    // TODO: Move this to proper place after helpers refactor
    // helpers.globalOptions.legacy = configOptions.legacy
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
 * Export for backward compatibility
 */
export default {
  getConfigFile,
  getConfigOptions,
  hasProjectConfig,
  getActiveConfigPath,
  loadRawConfig
}
