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
import { purgeFontIcons } from './icon-purger.js'

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
