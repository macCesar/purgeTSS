/**
 * PurgeTSS v7.1 - Font Utilities
 *
 * Font processing utilities for buildFonts command.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Font processing and management utilities
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import _ from 'lodash'

/**
 * Get all files recursively from directory
 * COPIED exactly from original getFiles() function
 *
 * @param {string} dir - Directory to scan
 * @returns {Array} Array of file paths
 */
export function getFiles(dir) {
  return fs.readdirSync(dir).flatMap((item) => {
    const thePath = `${dir}/${item}`
    if (fs.statSync(thePath).isDirectory()) {
      return getFiles(thePath)
    }

    return thePath
  })
}

/**
 * Extract filename without extension and clean it
 * COPIED exactly from original getFileName() function
 *
 * @param {string} file - File path
 * @returns {string} Cleaned filename
 */
export function getFileName(file) {
  return file.split('/').pop().split('.').shift().replace(/ /g, '-').toLowerCase()
}

/**
 * Process font metadata into TSS comment
 * COPIED exactly from original processFontMeta() function
 *
 * @param {Object} fontMeta - Font metadata object
 * @returns {string} Formatted TSS comment string
 */
export function processFontMeta(fontMeta) {
  let fontMetaString = `\n/**\n * ${fontMeta.fullName}`

  fontMetaString += `\n * ${fontMeta.version}`

  if (fontMeta.urlVendor) {
    fontMetaString += `\n * ${fontMeta.urlVendor}`
  }

  // if (fontMeta.description) {
  // fontMetaString += `\n * Description: ${fontMeta.description}`;
  // }

  if (fontMeta.designer) {
    fontMetaString += `\n * ${fontMeta.designer}`
    if (fontMeta.urlDesigner) {
      fontMetaString += ` - ${fontMeta.urlDesigner}`
    }
  }

  if (fontMeta.copyright) {
    fontMetaString += `\n * ${fontMeta.copyright}`
  }

  if (fontMeta.trademark) {
    fontMetaString += `\n * ${fontMeta.trademark}`
  }

  if (fontMeta.licence) {
    fontMetaString += `\n * ${fontMeta.licence.split('\n')[0]}`
    if (fontMeta.licenceURL) {
      fontMetaString += ` - ${fontMeta.licenceURL}`
    }
  }

  fontMetaString += '\n */'

  return fontMetaString
}

/**
 * Get CSS rules from parsed stylesheet
 * COPIED exactly from original getRules() function
 *
 * @param {Object} data - Parsed CSS data
 * @returns {Array} Array of CSS rules
 */
export function getRules(data) {
  return _.map(data.stylesheet.rules, rule => {
    if (rule.type === 'rule' && rule.declarations[0].property === 'content' && rule.selectors[0].includes('before')) {
      return {
        selector: '.' + rule.selectors[0].replace('.', '').replace('::before', '').replace(':before', ''),
        property: rule.declarations[0].value.replace(/"/g, '').replace(/'/g, '').replace(/\\/g, '')
      }
    }
  }).filter(n => n)
}

/**
 * Font utilities grouped for convenience
 */
export const fontUtils = {
  getFiles,
  getFileName,
  processMeta: processFontMeta,
  getRules
}

/**
 * Export for font processing usage
 */
export default {
  getFiles,
  getFileName,
  processFontMeta,
  getRules,
  fontUtils
}
