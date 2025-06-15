/**
 * PurgeTSS v7.1.0 - Core Analyzer: File Scanner
 * Functions for scanning and reading XML files in the project
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import _ from 'lodash'

/**
 * Read all XML files recursively - COPIED exactly from original readAllXMLFiles() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} currentDirPath - Directory path to scan
 * @param {Function} callback - Callback function to execute for each XML file
 */
export function readAllXMLFiles(currentDirPath, callback) {
  const files = fs.readdirSync(currentDirPath)

  files.filter(isNotJunk).forEach(name => {
    const filePath = path.join(currentDirPath, name)

    const stat = fs.statSync(filePath)

    if (stat.isFile()) {
      if (name.includes('xml')) {
        callback(filePath, stat)
      }
    } else if (stat.isDirectory()) {
      readAllXMLFiles(filePath, callback)
    }
  })
}

/**
 * Get classes only from XML files - COPIED exactly from original getClassesOnlyFromXMLFiles() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @returns {Array} Array of unique class names found only in XML files
 */
export function getClassesOnlyFromXMLFiles() {
  const allClasses = []
  const viewPaths = getViewPaths()
  _.each(viewPaths, viewPath => allClasses.push(extractClassesOnly(fs.readFileSync(viewPath, 'utf8'), viewPath)))

  const uniqueClasses = []
  _.each(_.uniq(_.flattenDeep(allClasses)).sort(), uniqueClass => {
    if (filterCharacters(uniqueClass)) uniqueClasses.push(uniqueClass)
  })

  return uniqueClasses.sort()
}

// TODO: These functions need to be imported from other modules when they're extracted
// For now, they will be available from the main index.js until refactor is complete

// Placeholder imports - these will be replaced with proper imports once modules are extracted
let isNotJunk, getViewPaths, extractClassesOnly, filterCharacters

/**
 * Initialize function references from main index
 * This is a temporary solution until all modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializeFileScannerFunctions(functions) {
  isNotJunk = functions.isNotJunk
  getViewPaths = functions.getViewPaths
  extractClassesOnly = functions.extractClassesOnly
  filterCharacters = functions.filterCharacters
}
