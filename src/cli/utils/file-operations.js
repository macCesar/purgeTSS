/**
 * PurgeTSS v7.1 - File Operations Utilities
 *
 * File and folder operations used throughout PurgeTSS commands.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview File system operation utilities
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import util from 'util'
import { projectsConfigJS } from '../../shared/constants.js'
import { createConfigFile } from '../commands/init.js'

/**
 * Initialize config if it doesn't exist
 * Maintains exact same logic as original initIfNotConfig() function
 */
export function initIfNotConfig() {
  if (!fs.existsSync(projectsConfigJS)) {
    createConfigFile()
  }
}

/**
 * Ensure a file exists, create empty if it doesn't
 * Maintains exact same logic as original makeSureFileExists() function
 *
 * @param {string} file - File path to ensure exists
 * @returns {boolean} True if file was created
 */
export function makeSureFileExists(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '')
    return true
  }
  return false
}

/**
 * Clean double quotes and handle Unicode characters
 * Maintains exact same logic as original cleanDoubleQuotes() function
 *
 * @param {Object} configFile - Configuration object to serialize
 * @param {Object} options - Options object with quotes flag
 * @returns {string} Cleaned string representation
 */
export function cleanDoubleQuotes(configFile, options) {
  // eslint-disable-next-line no-control-regex
  const regexUnicode = /[^\u0000-\u00FF]/g

  if (options.quotes) {
    return JSON.stringify(configFile, null, 2).replace(regexUnicode, match => `\\u${match.charCodeAt(0).toString(16)}`)
  }

  const inspected = util.inspect(configFile, false, 10)

  if (inspected === 'undefined') return '{}'

  return inspected.replace(regexUnicode, match => `\\u${match.charCodeAt(0).toString(16)}`)
}

/**
 * Create color object for color generation
 * Maintains exact same logic as original createColorObject() function
 *
 * @param {Object} family - Color family object
 * @param {string} hexcode - Base hexcode
 * @param {Object} options - Options for color generation
 * @returns {Object} Color object
 */
export function createColorObject(family, hexcode, options) {
  const colors = {}
  const name = family.name.toLowerCase().split(' ').join('-')

  if (options.json) {
    const shades = {}
    colors.global = {}
    shades[name] = hexcode
    family.shades.forEach((shade) => {
      shades[`${name}-${shade.number}`] = shade.hexcode
    })
    colors.global.colors = (options.single) ? { [name]: hexcode } : shades
  } else if (options.single) {
    colors.name = name
    colors.shades = hexcode
  } else {
    const shades = { default: hexcode }
    family.shades.forEach((shade) => {
      shades[shade.number] = shade.hexcode
    })
    colors.name = name
    colors.shades = shades
  }

  return colors
}

/**
 * Export grouped utilities for convenience
 */
export default {
  initIfNotConfig,
  makeSureFileExists,
  cleanDoubleQuotes,
  createColorObject
}
