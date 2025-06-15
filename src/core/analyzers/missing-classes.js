/**
 * PurgeTSS v7.1.0 - Core Analyzer: Missing Classes
 * Functions for finding missing classes in the purged output
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import _ from 'lodash'
import { cwd } from '../../shared/constants.js'

/**
 * Find missing classes - COPIED exactly from original findMissingClasses() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} tempPurged - Current purged content to check against
 * @returns {Array} Array of missing class names that should be included
 */
export function findMissingClasses(tempPurged) {
  // Get Styles from App - Minus `app.tss`
  if (fs.existsSync(`${cwd}/app/styles`)) {
    _.each(getFiles(`${cwd}/app/styles`).filter(file => file.endsWith('.tss') && !file.endsWith('app.tss') && !file.endsWith('_app.tss')), file => {
      tempPurged += '\n' + fs.readFileSync(file, 'utf8')
    })
  }

  // Get Styles from Widgets
  if (configOptions.widgets && fs.existsSync(`${cwd}/app/widgets/`)) {
    _.each(getFiles(`${cwd}/app/widgets`).filter(file => file.endsWith('.tss')), file => {
      tempPurged += '\n' + fs.readFileSync(file, 'utf8')
    })
  }

  // Get Views from Themes
  if (fs.existsSync(`${cwd}/app/themes/`)) {
    _.each(getFiles(`${cwd}/app/themes`).filter(file => file.endsWith('.tss')), file => {
      tempPurged += '\n' + fs.readFileSync(file, 'utf8')
    })
  }

  if (configOptions.safelist) {
    _.each(configOptions.safelist, safe => {
      tempPurged += safe + '\n'
    })
  }

  const classesFromXmlFiles = getClassesOnlyFromXMLFiles().filter(item => !tempPurged.includes(item))

  let classesFromJsFiles = []
  const controllerPaths = getControllerPaths()
  _.each(controllerPaths, controllerPath => {
    const data = fs.readFileSync(controllerPath, 'utf8')
    if (data) classesFromJsFiles.push(processControllers(data))
  })
  const reservedWords = 'Alloy.isTablet Alloy.isHandheld ? ,'
  classesFromJsFiles = [...new Set([...classesFromJsFiles.flat().filter(item => !reservedWords.includes(item))])]

  classesFromJsFiles = classesFromJsFiles.filter(item => !reservedWords.includes(item))

  return [...new Set([...classesFromJsFiles.filter(item => !tempPurged.includes(item)), ...classesFromXmlFiles])]
}

// TODO: These functions need to be imported from other modules when they're extracted
// For now, they will be available from the main index.js until refactor is complete

// Placeholder imports - these will be replaced with proper imports once modules are extracted
let getFiles, configOptions, getClassesOnlyFromXMLFiles, getControllerPaths, processControllers

/**
 * Initialize function references from main index
 * This is a temporary solution until all modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializeMissingClassesFunctions(functions) {
  getFiles = functions.getFiles
  configOptions = functions.configOptions
  getClassesOnlyFromXMLFiles = functions.getClassesOnlyFromXMLFiles
  getControllerPaths = functions.getControllerPaths
  processControllers = functions.processControllers
}
