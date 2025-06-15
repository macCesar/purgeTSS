/**
 * PurgeTSS v7.1.0 - Core Purger: Custom Fonts
 * Custom font purging engine for user-generated font styles
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import { cwd } from '../../shared/constants.js'

/**
 * Purge custom font classes - COPIED exactly from original purgeFonts() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged custom font CSS classes as string
 */
export function purgeFonts(uniqueClasses, cleanUniqueClasses) {
  if (fs.existsSync(`${cwd}/purgetss/styles/fonts.tss`)) {
    let purgedClasses = '\n// Font Styles\n'
    purgedClasses += purgeFontIcons(`${cwd}/purgetss/styles/fonts.tss`, uniqueClasses, 'Purging Font styles...', cleanUniqueClasses, [])
    return (purgedClasses === '\n// Font Styles\n') ? '' : purgedClasses
  }

  return ''
}

// TODO: These functions need to be imported from other modules when they're extracted
// For now, they will be available from the main index.js until refactor is complete

// Placeholder imports - these will be replaced with proper imports once modules are extracted
let purgeFontIcons

/**
 * Initialize function references from main index
 * This is a temporary solution until all modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializeFontsPurgerFunctions(functions) {
  purgeFontIcons = functions.purgeFontIcons
}
