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
import * as acorn from 'acorn'

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
    throw chalk.red(`::PurgeTSS:: Error processing: "${currentFile}"\n`, error)
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
    throw chalk.red(`::PurgeTSS:: Error processing: "${currentFile}"\n`, error)
  }
}

/**
 * Extract words from controller line - COPIED exactly from original extractWordsFromLine() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} line - Line of code from controller file
 * @returns {Array} Array of class names found in line
 */
function extractWordsFromLineRegex(line) {
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
function processControllersRegex(data) {
  const allWords = []
  const lines = data.split(/\r?\n/)

  lines.forEach(line => {
    const words = extractWordsFromLineRegex(line)
    if (words.length > 0) {
      allWords.push(...words)
    }
  })

  return allWords
}

const AST_META_KEYS = new Set(['type', 'loc', 'range', 'start', 'end', 'sourceType', 'comments'])

function collectLiterals(node, out) {
  if (!node || typeof node !== 'object' || !node.type) return

  switch (node.type) {
    case 'Literal':
      if (typeof node.value === 'string') {
        node.value.split(/\s+/).forEach(token => { if (token) out.push(token) })
      }
      return

    case 'TemplateLiteral':
      if (node.expressions.length === 0 && node.quasis.length > 0) {
        const cooked = node.quasis[0].value.cooked
        if (typeof cooked === 'string') {
          cooked.split(/\s+/).forEach(token => { if (token) out.push(token) })
        }
      }
      return

    case 'ArrayExpression':
      for (const element of node.elements) {
        if (element && element.type !== 'SpreadElement') collectLiterals(element, out)
      }
      return

    case 'ConditionalExpression':
      collectLiterals(node.consequent, out)
      collectLiterals(node.alternate, out)
      return

    default:
      return
  }
}

function walkAST(node, out) {
  if (!node || typeof node !== 'object') return

  if (Array.isArray(node)) {
    for (const child of node) walkAST(child, out)
    return
  }

  if (!node.type) return

  if (node.type === 'Property' && !node.computed && !node.shorthand && node.key) {
    const keyName = node.key.type === 'Identifier'
      ? node.key.name
      : (node.key.type === 'Literal' ? node.key.value : undefined)
    if (keyName === 'classes' || keyName === 'apply') {
      collectLiterals(node.value, out)
    }
  }

  if (node.type === 'CallExpression' && node.callee && node.arguments.length >= 2) {
    const callee = node.callee
    let match = false
    if (
      callee.type === 'MemberExpression' &&
      !callee.computed &&
      callee.property &&
      callee.property.type === 'Identifier' &&
      /Class$/.test(callee.property.name)
    ) {
      match = true
    } else if (callee.type === 'Identifier' && callee.name === 'resetClass') {
      match = true
    }
    if (match) collectLiterals(node.arguments[1], out)
  }

  for (const key of Object.keys(node)) {
    if (AST_META_KEYS.has(key)) continue
    walkAST(node[key], out)
  }
}

/**
 * Process a controller file's source and return utility classes referenced by
 * the whitelisted expression shapes (`classes:`, `apply:`, `.xxxClass(target, value)`,
 * `resetClass(target, value)`). Falls back to the per-line regex scanner when
 * the parser rejects the source.
 *
 * @param {string} data - Controller file content
 * @returns {Array} Array of class name tokens
 */
export function processControllers(data) {
  try {
    const ast = acorn.parse(data, {
      ecmaVersion: 'latest',
      sourceType: 'script',
      allowReturnOutsideFunction: true,
      allowAwaitOutsideFunction: true,
      allowImportExportEverywhere: true,
      allowHashBang: true
    })
    const out = []
    walkAST(ast, out)
    return out
  } catch {
    return processControllersRegex(data)
  }
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
