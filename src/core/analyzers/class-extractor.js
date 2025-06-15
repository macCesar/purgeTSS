/**
 * PurgeTSS v7.1.0 - Core Analyzer: Class Extractor
 * Functions for extracting and analyzing CSS classes from XML and controller files
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import chalk from 'chalk'
import convert from 'xml-js'
import traverse from 'traverse'

/**
 * Get unique classes from all XML and controller files - COPIED exactly from original getUniqueClasses() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @returns {Array} Array of unique class names found in project files
 */
export function getUniqueClasses() {
  localStart()

  const allClasses = []
  const viewPaths = getViewPaths()
  _.each(viewPaths, viewPath => {
    const file = fs.readFileSync(viewPath, 'utf8')
    if (file) allClasses.push((configFile.purge.mode === 'all') ? file.match(/[^<>"'`\s]*[^<>"'`\s:]/g) : extractClasses(file, viewPath))
  })

  const controllerPaths = getControllerPaths()
  _.each(controllerPaths, controllerPath => {
    const data = fs.readFileSync(controllerPath, 'utf8')
    if (data) allClasses.push(processControllers(data))
  })

  if (configOptions.safelist) _.each(configOptions.safelist, safe => allClasses.push(safe))

  const uniqueClasses = []
  _.each(_.uniq(_.flattenDeep(allClasses)).sort(), uniqueClass => {
    if (filterCharacters(uniqueClass)) uniqueClasses.push(uniqueClass)
  })

  localFinish('Get Unique Classes')

  return uniqueClasses.sort()
}

/**
 * Extract classes from XML content - COPIED exactly from original extractClasses() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} currentText - XML content to parse
 * @param {string} currentFile - File path for error reporting
 * @returns {Array} Array of class names found in XML
 */
export function extractClasses(currentText, currentFile) {
  try {
    const jsontext = convert.xml2json(encodeHTML(currentText), { compact: true })

    return traverse(JSON.parse(jsontext)).reduce(function(acc, value) {
      if (this.key === 'class' || this.key === 'id') acc.push(value.split(' '))
      return acc
    }, [])
  } catch (error) {
    throw chalk.red(`::Purge TSS:: Error processing: "${currentFile}"\n`, error)
  }
}

/**
 * Extract only classes from XML content - COPIED exactly from original extractClassesOnly() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} currentText - XML content to parse
 * @param {string} currentFile - File path for error reporting
 * @returns {Array} Array of class names found in XML
 */
export function extractClassesOnly(currentText, currentFile) {
  try {
    const jsontext = convert.xml2json(encodeHTML(currentText), { compact: true })

    return traverse(JSON.parse(jsontext)).reduce(function(acc, value) {
      if (this.key === 'class' || this.key === 'classes' || this.key === 'icon' || this.key === 'activeIcon') acc.push(value.split(' '))
      return acc
    }, [])
  } catch (error) {
    throw chalk.red(`::Purge TSS:: Error processing: "${currentFile}"\n`, error)
  }
}

/**
 * Extract words from controller line - COPIED exactly from original extractWordsFromLine() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} line - Line of code from controller file
 * @returns {Array} Array of class names found in line
 */
function extractWordsFromLine(line) {
  const patterns = [
    {
      // apply: 'classes'
      regex: /apply:\s*'([^']+)'/,
      process: match => match[1].split(/\s+/)
    },
    {
      // classes: ['class1', 'class2'] o classes: ['class1 class2']
      regex: /classes:\s*\[([^\]]+)\]/,
      process: match => match[1].split(',').map(item => item.trim().replace(/['"]/g, ''))
    },
    {
      // classes: 'class1 class2'
      regex: /classes:\s*'([^']+)'/,
      process: match => match[1].split(/\s+/)
    }
  ]

  // Process simple patterns
  const words = patterns.reduce((acc, { regex, process }) => {
    const match = regex.exec(line)
    return match ? [...acc, ...process(match)] : acc
  }, [])

  // Process addClass, removeClass, resetClass
  const classFunctionRegex = /(?:\.\w+Class|resetClass)\([^,]+,\s*(?:'([^']+)'|\[([^\]]+)\])/g
  let classFunctionMatch
  while ((classFunctionMatch = classFunctionRegex.exec(line)) !== null) {
    const content = classFunctionMatch[1] || classFunctionMatch[2]
    if (content) {
      const classes = content.includes(',')
        ? content.split(',').map(item => item.trim().replace(/['"]/g, ''))
        : content.replace(/['"]/g, '').split(/\s+/)
      words.push(...classes)
    }
  }

  // Matching generic arrays
  // const genericArrayRegex = /(\w+:\s*\[([^\]]+)\])/g
  // let genericArrayMatch
  // while ((genericArrayMatch = genericArrayRegex.exec(line)) !== null) {
  //   const genericArrayContent = genericArrayMatch[2]
  //   const genericArray = genericArrayContent.split(',').map(item => item.trim().replace(/['"]/g, ''))
  //   words = words.concat(genericArray)
  // }

  return words
}

/**
 * Process controller file content - COPIED exactly from original processControllers() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} data - Controller file content
 * @returns {Array} Array of class names found in controller
 */
function processControllers(data) {
  const allWords = []
  const lines = data.split(/\r?\n/)

  lines.forEach(line => {
    const words = extractWordsFromLine(line)
    if (words.length > 0) {
      allWords.push(...words)
    }
  })

  return allWords
}

/**
 * Encode HTML entities - COPIED exactly from original encodeHTML() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} str - String to encode
 * @returns {string} Encoded string
 */
function encodeHTML(str) {
  const code = {
    '&': '&amp;'
  }
  return str.replace(/&/gm, i => code[i])
}

// TODO: These functions need to be imported from other modules when they're extracted
// For now, they will be available from the main index.js until refactor is complete

// Placeholder imports - these will be replaced with proper imports once modules are extracted
let localStart, localFinish, getViewPaths, getControllerPaths, configFile, configOptions, filterCharacters

/**
 * Initialize function references from main index
 * This is a temporary solution until all modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializeClassExtractorFunctions(functions) {
  localStart = functions.localStart
  localFinish = functions.localFinish
  getViewPaths = functions.getViewPaths
  getControllerPaths = functions.getControllerPaths
  configFile = functions.configFile
  configOptions = functions.configOptions
  filterCharacters = functions.filterCharacters
}
