/* eslint-disable camelcase */
/**
 * PurgeTSS v7.1 - Purge Command
 *
 * Main CLI command for purging unused classes from Titanium Alloy projects.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Main purging command - the core functionality of PurgeTSS
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'
import glob from 'glob'
import convert from 'xml-js'
import traverse from 'traverse'
import { alloyProject, cleanClasses } from '../../shared/utils.js'
import {
  projectsAppTSS,
  projects_AppTSS,
  srcReset_TSS_File,
  PurgeTSSPackageJSON,
  cwd
} from '../../shared/constants.js'
import { logger, setDebugMode } from '../../shared/logger.js'
import { start, finish, localStart, localFinish } from '../utils/cli-helpers.js'
import { init } from './init.js'
import { getConfigOptions, getConfigFile } from '../../shared/config-manager.js'

// Import purger functions from core modules
import { purgeTailwind } from '../../core/purger/tailwind-purger.js'
import {
  purgeFontAwesome,
  purgeMaterialIcons,
  purgeMaterialSymbols,
  purgeFramework7
} from '../../core/purger/icon-purger.js'
import { purgeFonts } from '../../core/purger/fonts-purger.js'

// Global variables (EXACT copies from original src/index.js)
let configOptions = {}
let purgingDebug = false

/**
 * Make sure a file exists, create it if it doesn't
 * COPIED exactly from original makeSureFileExists() function
 *
 * @param {string} file - File path
 * @returns {boolean} - True if file was created
 */
function makeSureFileExists(file) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, '')
    return true
  }
}

/**
 * Backup original app.tss to _app.tss
 * COPIED exactly from original backupOriginalAppTss() function
 */
function backupOriginalAppTss() {
  if (!fs.existsSync(projects_AppTSS) && fs.existsSync(projectsAppTSS)) {
    logger.warn('Backing up app.tss into _app.tss\n             FROM NOW ON, add, update or delete your original classes in _app.tss')
    fs.copyFileSync(projectsAppTSS, projects_AppTSS)
  } else if (!fs.existsSync(projects_AppTSS)) {
    fs.appendFileSync(projects_AppTSS, '// Empty _app.tss\n')
  }
}

/**
 * Get view file paths from the project
 * COPIED exactly from original getViewPaths() function
 */
function getViewPaths() {
  const viewPaths = []

  // ! Parse Views from App
  viewPaths.push(...glob.sync(`${cwd}/app/views/**/*.xml`))

  // ! Parse Views from Widgets
  if (configOptions.widgets && fs.existsSync(`${cwd}/app/widgets/`)) {
    viewPaths.push(...glob.sync(`${cwd}/app/widgets/**/views/*.xml`))
  }

  // ! Parse Views from Themes
  if (fs.existsSync(`${cwd}/app/themes/`)) {
    viewPaths.push(...glob.sync(`${cwd}/app/themes/**/views/*.xml`))
  }

  return viewPaths
}

/**
 * Get controller file paths from the project
 * COPIED exactly from original getControllerPaths() function
 */
function getControllerPaths() {
  const controllerPaths = []

  // ! Parse Controllers from App
  controllerPaths.push(...glob.sync(`${cwd}/app/controllers/**/*.js`))

  // ! Parse Controllers from Widgets
  if (configOptions.widgets && fs.existsSync(`${cwd}/app/widgets/`)) {
    controllerPaths.push(...glob.sync(`${cwd}/app/widgets/**/controllers/*.js`))
  }

  return controllerPaths
}

/**
 * Encode HTML entities in string
 * COPIED exactly from original encodeHTML() function
 */
function encodeHTML(str) {
  const code = {
    '&': '&amp;'
  }
  return str.replace(/&/gm, i => code[i])
}

/**
 * Extract classes from file content
 * COPIED exactly from original extractClasses() function
 */
function extractClasses(currentText, currentFile) {
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
 * Process controller files for classes
 * COPIED exactly from original processControllers() function
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
 * Extract words from a line of controller code
 * COPIED exactly from original extractWordsFromLine() function
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

  return words
}

/**
 * Filter invalid characters from class names
 * COPIED exactly from original filterCharacters() function
 */
function filterCharacters(uniqueClass) {
  if (uniqueClass.length === 1 && !/^[a-zA-Z_]/.test(uniqueClass)) {
    return false
  }

  return uniqueClass !== '(' && isNaN(uniqueClass.charAt(0)) &&
    !uniqueClass.startsWith('--') &&
    !uniqueClass.startsWith(',') &&
    !uniqueClass.startsWith('!') &&
    !uniqueClass.startsWith('(') &&
    !uniqueClass.startsWith('[') &&
    !uniqueClass.startsWith('{') &&
    !uniqueClass.startsWith('/') &&
    !uniqueClass.startsWith('\\') &&
    !uniqueClass.startsWith('#') &&
    !uniqueClass.startsWith('$') &&
    !uniqueClass.startsWith('Ti.') &&
    !uniqueClass.includes('\\n') &&
    !uniqueClass.includes('=') &&
    !uniqueClass.includes('http') &&
    !uniqueClass.includes('L(') &&
    !uniqueClass.includes('www') &&
    !uniqueClass.endsWith(',') &&
    !uniqueClass.endsWith('.') &&
    !uniqueClass.endsWith('/')
}

/**
 * Get unique classes from all project files
 * COPIED exactly from original getUniqueClasses() function
 */
function getUniqueClasses() {
  localStart()

  const allClasses = []
  const viewPaths = getViewPaths()
  const configFile = getConfigFile()
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
 * Copy reset template and _app.tss content
 * COPIED exactly from original copyResetTemplateAnd_appTSS() function
 */
function copyResetTemplateAnd_appTSS() {
  localStart()

  logger.info('Copying Reset styles...')

  let tempPurged = `// PurgeTSS v${PurgeTSSPackageJSON.version}\n` + fs.readFileSync(srcReset_TSS_File, 'utf8')

  if (fs.existsSync(projects_AppTSS)) {
    const appTSSContent = fs.readFileSync(projects_AppTSS, 'utf8')

    if (appTSSContent.length) {
      logger.info('Copying', chalk.yellow('_app.tss'), 'styles...')
      tempPurged += '\n// _app.tss styles\n' + appTSSContent
    }
  }

  localFinish('Copying Reset and ' + chalk.yellow('_app.tss') + ' styles...')

  return tempPurged
}

/**
 * Get all files recursively from a directory
 * COPIED exactly from original getFiles() function
 */
function getFiles(dir) {
  return fs.readdirSync(dir).flatMap((item) => {
    const thePath = `${dir}/${item}`
    if (fs.statSync(thePath).isDirectory()) {
      return getFiles(thePath)
    }

    return thePath
  })
}

/**
 * Extract classes only (for missing classes detection)
 * COPIED exactly from original extractClassesOnly() function
 */
function extractClassesOnly(currentText, currentFile) {
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
 * Get classes only from XML files
 * COPIED exactly from original getClassesOnlyFromXMLFiles() function
 */
function getClassesOnlyFromXMLFiles() {
  const allClasses = []
  const viewPaths = getViewPaths()
  _.each(viewPaths, viewPath => allClasses.push(extractClassesOnly(fs.readFileSync(viewPath, 'utf8'), viewPath)))

  const uniqueClasses = []
  _.each(_.uniq(_.flattenDeep(allClasses)).sort(), uniqueClass => {
    if (filterCharacters(uniqueClass)) uniqueClasses.push(uniqueClass)
  })

  return uniqueClasses.sort()
}

/**
 * Find missing classes in the purged output
 * COPIED exactly from original findMissingClasses() function
 */
function findMissingClasses(tempPurged) {
  // ! Get Styles from App - Minus `app.tss`
  if (fs.existsSync(`${cwd}/app/styles`)) {
    _.each(getFiles(`${cwd}/app/styles`).filter(file => file.endsWith('.tss') && !file.endsWith('app.tss') && !file.endsWith('_app.tss')), file => {
      tempPurged += '\n' + fs.readFileSync(file, 'utf8')
    })
  }

  // ! Get Styles from Widgets
  if (configOptions.widgets && fs.existsSync(`${cwd}/app/widgets/`)) {
    _.each(getFiles(`${cwd}/app/widgets`).filter(file => file.endsWith('.tss')), file => {
      tempPurged += '\n' + fs.readFileSync(file, 'utf8')
    })
  }

  // ! Get Views from Themes
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

/**
 * Process missing classes and add them as comments
 * COPIED exactly from original processMissingClasses() function
 */
function processMissingClasses(tempPurged) {
  let unusedOrMissingClasses = ''

  if (configOptions.missing) {
    const missingClasses = findMissingClasses(tempPurged)

    if (missingClasses.length > 0) {
      unusedOrMissingClasses += '\n'
      unusedOrMissingClasses += '// Unused or unsupported classes\n'

      _.each(missingClasses, (missingClass) => {
        unusedOrMissingClasses += `// '.${missingClass}': { }\n`
      })
    }
  }

  return unusedOrMissingClasses
}

/**
 * Save file to disk
 * COPIED exactly from original saveFile() function
 *
 * @param {string} file - File path
 * @param {string} data - File content
 */
function saveFile(file, data) {
  localStart()

  fs.writeFileSync(file, data, err => {
    throw err
  })

  localFinish(`Saving ${chalk.yellow('app.tss')}...`)
}

/**
 * Main purge command - removes unused classes from Titanium Alloy projects
 * COPIED exactly from original purgeClasses() function
 *
 * @param {Object} options - Command options
 * @returns {boolean} - Success status
 */
export function purgeClasses(options) {
  // Initialize configOptions first (includes auto-migration)
  configOptions = getConfigOptions()

  if (!alloyProject()) {
    return false
  }

  purgingDebug = options.debug

  const recentlyCreated = makeSureFileExists(projectsAppTSS)

  if (Date.now() > (fs.statSync(projectsAppTSS).mtimeMs + 2000) || recentlyCreated) {
    start()

    init(options)

    backupOriginalAppTss()

    const uniqueClasses = getUniqueClasses()

    let tempPurged = copyResetTemplateAnd_appTSS()

    tempPurged += purgeTailwind(uniqueClasses, purgingDebug)

    const cleanUniqueClasses = cleanClasses(uniqueClasses)

    tempPurged += purgeFontAwesome(uniqueClasses, cleanUniqueClasses, purgingDebug)

    tempPurged += purgeMaterialIcons(uniqueClasses, cleanUniqueClasses, purgingDebug)

    tempPurged += purgeMaterialSymbols(uniqueClasses, cleanUniqueClasses, purgingDebug)

    tempPurged += purgeFramework7(uniqueClasses, cleanUniqueClasses, purgingDebug)

    tempPurged += purgeFonts(uniqueClasses, cleanUniqueClasses, purgingDebug)

    tempPurged += processMissingClasses(tempPurged)

    saveFile(projectsAppTSS, tempPurged)

    logger.file('app.tss')

    finish()

    return true
  } else {
    logger.warn('Project purged less than 2 seconds ago!')
    return true
  }
}
