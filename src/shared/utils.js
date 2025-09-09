/**
 * PurgeTSS v7.1 - Shared Utilities
 *
 * Common utility functions used throughout PurgeTSS.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview General utilities and helper functions
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import {
  projectsFontsFolder
} from './constants.js'
import { logger } from './logger.js'

/**
 * Ensure a folder exists, create if it doesn't
 * Maintains exact same logic as original makeSureFolderExists()
 *
 * @param {string} folder - Path to folder to ensure exists
 */
export function makeSureFolderExists(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true })
  }
}

/**
 * Copy file with existence check
 * Maintains exact same logic as original copyFile()
 *
 * @param {string} src - Source file path
 * @param {string} dest - Destination filename (will be placed in fonts folder)
 * @returns {boolean} True if file was copied
 */
export function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    // Use callback function to match original implementation
    const callback = (err) => {
      if (err) throw err
    }
    fs.copyFile(src, `${projectsFontsFolder}/${dest}`, callback)
    return true
  }
  return false
}

/**
 * Get file modification date
 * Maintains exact same logic as original getFileUpdatedDate()
 *
 * @param {string} thePath - File path to check
 * @returns {Date} File modification date
 */
export function getFileUpdatedDate(thePath) {
  const { mtime } = fs.statSync(thePath)
  return mtime
}

/**
 * Check if running in Alloy project
 * Maintains exact same logic as original alloyProject()
 *
 * @param {boolean} silent - Suppress error messages
 * @returns {boolean} True if in Alloy project
 */
export function alloyProject(silent = false) {
  const cwd = process.cwd()

  if (!fs.existsSync(`${cwd}/app/views`)) {
    if (!silent) {
      logger.info(`Please make sure you are running ${chalk.green('purgetss')} within an Alloy Project.`)
      logger.info(`For more information, visit ${chalk.green('https://purgetss.com')}`)
    }
    return false
  }
  return true
}

/**
 * Check if running in Classic Titanium project
 * Maintains exact same logic as original classicProject()
 *
 * @param {boolean} silent - Suppress error messages
 * @returns {boolean} True if in Classic project
 */
export function classicProject(silent = false) {
  const cwd = process.cwd()

  if (!fs.existsSync(`${cwd}/Resources`)) {
    if (!silent) {
      logger.info(`Please make sure you are running ${chalk.green('purgetss')} within a Titanium's Classic Project.`)
      logger.info(`For more information, visit ${chalk.green('https://purgetss.com')}`)
    }
    return false
  }
  return true
}

/**
 * Clean classes array by removing duplicates and empty values
 * Maintains exact same logic as original cleanClasses()
 *
 * @param {Array} uniqueClasses - Array of classes to clean
 * @returns {Array} Cleaned array of unique classes
 */
export function cleanClasses(uniqueClasses) {
  return [...new Set(uniqueClasses)].filter(cls => cls && cls.trim() !== '')
}

/**
 * Extract Unicode value from FontAwesome 7 CSS custom property value
 * Handles both traditional hex codes and new ASCII symbols from FA7+
 * Supports CSS custom properties (--fa:) and traditional content: properties
 * 
 * @param {string} value - CSS value (e.g., '"\f015"', '"\$"', '"\30 "', '"\\f015"')
 * @returns {string|null} - 4-digit hex Unicode value or null
 */
export function extractUnicodeValue(value) {
  // Remove quotes and trim
  const cleanValue = value.replace(/"/g, '').trim()
  
  // Handle traditional hex Unicode with backslash (e.g., "\f015", "\\f015")
  if (cleanValue.startsWith('\\')) {
    // Remove leading backslashes (could be single or double)
    const withoutSlash = cleanValue.replace(/^\\+/, '')
    
    // If it's a proper hex code (3+ characters)
    if (/^[0-9a-fA-F]{3,}$/.test(withoutSlash)) {
      return ('0000' + withoutSlash).slice(-4)
    }
    
    // Handle ASCII hex codes like "\30" (for "0")
    if (/^[0-9a-fA-F]{1,2}$/.test(withoutSlash)) {
      return ('0000' + withoutSlash).slice(-4)
    }
    
    // Handle direct ASCII symbols (e.g., "\$", "\!", "\%")
    if (withoutSlash.length === 1) {
      const charCode = withoutSlash.charCodeAt(0)
      return ('0000' + charCode.toString(16)).slice(-4)
    }
  }
  
  // Handle single characters without backslash (e.g., "A", "$")
  if (cleanValue.length === 1) {
    const charCode = cleanValue.charCodeAt(0)
    return ('0000' + charCode.toString(16)).slice(-4)
  }
  
  return null
}

/**
 * Project type detection utilities
 */
export const projectDetection = {
  isAlloy: alloyProject,
  isClassic: classicProject,
  getType: () => {
    if (alloyProject(true)) return 'alloy'
    if (classicProject(true)) return 'classic'
    return 'unknown'
  }
}

/**
 * File system utilities
 */
export const fileUtils = {
  ensureFolder: makeSureFolderExists,
  copy: copyFile,
  getModifiedDate: getFileUpdatedDate,
  exists: fs.existsSync
}

/**
 * Export grouped utilities for convenience
 */
export default {
  makeSureFolderExists,
  copyFile,
  getFileUpdatedDate,
  alloyProject,
  classicProject,
  cleanClasses,
  extractUnicodeValue,
  projectDetection,
  fileUtils
}
