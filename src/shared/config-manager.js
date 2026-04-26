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
  projectsPurge_TSS_Fonts_Folder,
  projectsPurge_TSS_Brand_Folder,
  projectsPurge_TSS_Images_Folder,
  srcConfigFile
} from './constants.js'
import { logger } from './logger.js'
import { makeSureFolderExists } from './utils.js'

// Create require for ESM compatibility
const require = createRequire(import.meta.url)

/**
 * Parse a padding value from either a number or a percentage string.
 *
 *   20     → 20
 *   '20'   → 20
 *   '20%'  → 20
 *
 * Used for the `brand.padding.*` values so users can write
 * self-documenting values like `androidAdaptive: '19%'` in their config.
 *
 * @param {number|string} value
 * @param {string} fieldName - Config path for error messages (e.g. 'brand.padding.androidAdaptive')
 * @returns {number} Integer 0-40
 */
function parsePadding(value, fieldName) {
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const match = value.trim().match(/^(\d+)%?$/)
    if (match) return parseInt(match[1], 10)
  }
  throw new Error(`Invalid ${fieldName}: expected number or '<N>%' string, got ${JSON.stringify(value)}`)
}

/**
 * Ensure config file exists - SIMPLE logic
 * 1. If config.cjs exists → use it
 * 2. If config.js exists → rename to config.cjs
 * 3. If nothing exists → create config.cjs
 */
export function ensureConfig() {
  // Ensure the full purgetss/ subfolder layout exists on every init — keeps
  // fonts/, brand/, and images/ discoverable from day one instead of
  // appearing lazily on first use of their respective commands.
  makeSureFolderExists(projectsPurgeTSSFolder)
  makeSureFolderExists(projectsPurge_TSS_Fonts_Folder)
  makeSureFolderExists(projectsPurge_TSS_Brand_Folder)
  makeSureFolderExists(projectsPurge_TSS_Images_Folder)

  // 1. ¿Existe config.cjs? → Úsalo
  if (fs.existsSync(projectsConfigJS)) {
    return
  }

  // 2. ¿Existe config.js? → Renómbralo
  const oldConfigPath = `${projectsPurgeTSSFolder}/config.js`
  if (fs.existsSync(oldConfigPath)) {
    makeSureFolderExists(projectsPurgeTSSFolder)
    fs.renameSync(oldConfigPath, projectsConfigJS)
    logger.info('Migrated config.js to config.cjs for ESM compatibility')
    return
  }

  // 3. No existe nada → Crear config.cjs
  makeSureFolderExists(projectsPurgeTSSFolder)
  fs.copyFileSync(srcConfigFile, projectsConfigJS)
  logger.file('./purgetss/config.cjs')
}

/**
 * @deprecated Use ensureConfig() instead
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

  configFile.brand = configFile.brand ?? {}
  configFile.brand.logos = configFile.brand.logos ?? {}
  configFile.brand.padding = configFile.brand.padding ?? {}
  configFile.brand.padding.ios = parsePadding(configFile.brand.padding.ios ?? 4, 'brand.padding.ios')
  configFile.brand.padding.androidLegacy = parsePadding(configFile.brand.padding.androidLegacy ?? 10, 'brand.padding.androidLegacy')
  configFile.brand.padding.androidAdaptive = parsePadding(configFile.brand.padding.androidAdaptive ?? 19, 'brand.padding.androidAdaptive')
  configFile.brand.android = configFile.brand.android ?? {}
  configFile.brand.android.notification = configFile.brand.android.notification ?? false
  configFile.brand.android.splash = configFile.brand.android.splash ?? false
  configFile.brand.ios = configFile.brand.ios ?? {}
  configFile.brand.ios.dark = configFile.brand.ios.dark ?? true
  configFile.brand.ios.tinted = configFile.brand.ios.tinted ?? true
  configFile.brand.ios.darkBackground = configFile.brand.ios.darkBackground ?? null
  configFile.brand.colors = configFile.brand.colors ?? {}
  configFile.brand.colors.background = configFile.brand.colors.background ?? '#FFFFFF'

  configFile.images = configFile.images ?? {}
  configFile.images.quality = configFile.images.quality ?? 85
  configFile.images.format = configFile.images.format ?? null

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
