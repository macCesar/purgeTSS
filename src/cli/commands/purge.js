
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
import { globSync } from 'glob'
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
import { getConfigOptions, getConfigFile, ensureConfig } from '../../shared/config-manager.js'

// Import purger functions from core modules
import { processControllers } from '../../core/analyzers/class-extractor.js'
import { purgeTailwind } from '../../core/purger/tailwind-purger.js'
import {
  purgeFontAwesome,
  purgeMaterialIcons,
  purgeMaterialSymbols,
  purgeFramework7
} from '../../core/purger/icon-purger.js'
import { purgeFonts } from '../../core/purger/fonts-purger.js'
import { validateClassSyntax } from '../utils/unsupported-class-reporter.js'

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
  viewPaths.push(...globSync(`${cwd}/app/views/**/*.xml`))

  // ! Parse Views from Widgets
  if (configOptions.widgets && fs.existsSync(`${cwd}/app/widgets/`)) {
    viewPaths.push(...globSync(`${cwd}/app/widgets/**/views/*.xml`))
  }

  // ! Parse Views from Themes
  if (fs.existsSync(`${cwd}/app/themes/`)) {
    viewPaths.push(...globSync(`${cwd}/app/themes/**/views/*.xml`))
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
  controllerPaths.push(...globSync(`${cwd}/app/controllers/**/*.js`))

  // ! Parse Controllers from Widgets
  if (configOptions.widgets && fs.existsSync(`${cwd}/app/widgets/`)) {
    controllerPaths.push(...globSync(`${cwd}/app/widgets/**/controllers/*.js`))
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
 * Validate XML syntax before processing
 * Returns true if valid, throws error if invalid
 */
function validateXML(xmlText, filePath) {
  // Pre-validate: check for common Alloy XML malformations
  // preValidateXML will throw a special error that should be caught at a higher level
  const preValidationError = preValidateXML(xmlText, filePath)
  if (preValidationError) {
    throw preValidationError
  }

  try {
    convert.xml2json(encodeHTML(xmlText), { compact: true })
    return true
  } catch (error) {
    // Parse line/column from error message
    const lineMatch = error.message.match(/Line:\s*(\d+)/)
    const columnMatch = error.message.match(/Column:\s*(\d+)/)
    const charMatch = error.message.match(/Char:\s*(.+)/)

    const lines = xmlText.split('\n')
    const parserLine = lineMatch ? parseInt(lineMatch[1]) : null

    // Try to find the real source of the error by scanning for suspicious tags.
    // xml2json often reports errors far from the actual problem (e.g. at EOF)
    // because it only notices the mismatch when nesting fails to close.
    const suspectLine = findSuspectLine(lines)

    const reportLine = suspectLine || parserLine

    let errorMessage = chalk.red(`\n::PurgeTSS:: XML Syntax Error\n`) +
      chalk.yellow(`File: "${filePath}"\n`)

    if (reportLine) {
      errorMessage += chalk.yellow(`Error near line: ${reportLine}\n\n`)

      // Extract and show context: line before, error line, and line after
      const startLine = Math.max(0, reportLine - 2)
      const endLine = Math.min(lines.length, reportLine + 2)

      errorMessage += chalk.gray('Context:\n')
      for (let i = startLine; i < endLine; i++) {
        const lineNumDisplay = i + 1
        const isTargetLine = (lineNumDisplay === reportLine)
        const prefix = isTargetLine ? chalk.red('>>>') : chalk.gray('   ')
        const lineContent = lines[i] || ''

        errorMessage += `${prefix} ${chalk.gray(String(lineNumDisplay).padStart(3, ' '))}: ${lineContent}\n`
      }
      errorMessage += '\n'

      errorMessage += chalk.red(`Error: Unmatched or malformed tag (missing < or >)\n`)
    } else {
      errorMessage += chalk.yellow(`Error details: ${error.message}\n`)
    }

    errorMessage += chalk.gray('\nTip: Check for tags missing opening < or closing >\n')

    throw new Error(errorMessage)
  }
}

// Scan XML lines for common malformations that xml2json can't pinpoint.
// Returns the 1-based line number of the first suspect, or null.
function findSuspectLine(lines) {
  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim()
    if (!trimmed) continue

    // "--" inside XML comments (illegal in XML spec)
    if (trimmed.includes('<!--')) {
      const commentBody = trimmed.replace(/<!--/, '').replace(/-->.*$/, '')
      if (/--/.test(commentBody)) return i + 1
    }

    if (trimmed.startsWith('<!--')) continue

    // Opening tag without tag name: "< class=..."
    if (/^<\s+\w+=/.test(trimmed)) return i + 1

    // Double slash in closing tag: "<//View>"
    if (/^<\/\/\w+>/.test(trimmed)) return i + 1

    // Closing tag with extra characters: "</View/>" or "</View >>" etc.
    if (/^<\/[a-zA-Z0-9_]+[^>]+>/.test(trimmed) && !/^<\/[a-zA-Z0-9_:]+\s*>/.test(trimmed)) return i + 1

    // Opening < immediately followed by non-alpha, non-slash, non-! (e.g. "< >" or "<=>")
    if (/^<[^a-zA-Z/!?\s]/.test(trimmed)) return i + 1

    // Space between < and tag name: "< View"
    if (/^<\s+[A-Z]/.test(trimmed)) return i + 1

    // Backslash instead of forward slash: \>
    if (/\\>/.test(trimmed)) return i + 1

    // Double closing bracket: >>
    if (/>>/.test(trimmed)) return i + 1

    // Unclosed tag: starts with < but doesn't end with > and next line starts a new tag
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.endsWith('>')) {
      const nextTrimmed = (lines[i + 1] || '').trim()
      if (nextTrimmed.startsWith('<')) return i + 1
    }
  }
  return null
}

/**
 * Pre-validate XML for common Alloy malformations
 * Returns Error if problem found, null if OK
 */
function preValidateXML(xmlText, filePath) {
  const lines = xmlText.split('\n')
  const relativePath = filePath.replace(process.cwd() + '/', '')

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()

    // Skip empty lines and Alloy root tag
    if (!trimmed || trimmed.startsWith('<Alloy')) {
      continue
    }

    // Check for "--" inside XML comments (illegal in XML spec)
    // e.g. <!-- Section: --modules Option --> is invalid because of the "--" before "modules"
    if (trimmed.includes('<!--')) {
      const commentBody = trimmed.replace(/<!--/, '').replace(/-->.*$/, '')
      if (/--/.test(commentBody)) {
        const dashMatch = commentBody.match(/--(\S*)/)
        const offender = dashMatch ? `--${dashMatch[1]}` : '--'
        throwPreValidationError({
          relativePath,
          lineNumber: i + 1,
          lineContent: trimmed,
          message: `XML comment contains illegal "--" sequence ("${offender}")`,
          fix: `Replace "--" with "—" (em-dash) or reword the comment to avoid double dashes`
        })
      }
      continue
    }

    // Check for opening tag without tag name: "< class=..." or "< id=..."
    if (/^<\s+(class|id|onClick|onOpen|onClose|height|width|backgroundColor|color|font|text|hintText|imageUrl)=/.test(trimmed)) {
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: 'Opening tag is missing its tag name',
        fix: `Add the tag name after "<", e.g. "<View ${trimmed.slice(1).trim()}"`
      })
    }

    // Check for double slash in closing tags: "<//View>"
    const doubleSlash = trimmed.match(/^<\/\/([a-zA-Z0-9_]+)>/)
    if (doubleSlash) {
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: `Closing tag "</${doubleSlash[1]}>" has an extra "/"`,
        fix: `Change "${trimmed}" to "</${doubleSlash[1]}>"`
      })
    }

    // Check for tags without opening < (common mistake: Label, View, etc. without <)
    // Pattern: "Label id=", "View class=","Button onClick=", etc. WITHOUT opening <
    if (/^[A-Z][a-zA-Z0-9_]+\s+(id|class|onClick|onOpen|onClose|height|width|backgroundColor|color|font|text|hintText|imageUrl)=/.test(trimmed)) {
      const tagName = trimmed.split(/\s+|[>=]/)[0]
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: `Tag "<${tagName}>" is missing opening "<"`,
        fix: `Change "${tagName}" to "<${tagName}>"`
      })
    }

    // Check for closing tag with extra slash: "</View/>"
    const closingExtraSlash = trimmed.match(/^<\/([a-zA-Z0-9_]+)\/>/)
    if (closingExtraSlash) {
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: `Closing tag "</${closingExtraSlash[1]}>" has an extra "/" at the end`,
        fix: `Change "${trimmed}" to "</${closingExtraSlash[1]}>"`
      })
    }

    // Check for space between < and tag name: "< View class=..."
    const spaceBeforeName = trimmed.match(/^<\s+([A-Z][a-zA-Z0-9_]+)\s/)
    if (spaceBeforeName) {
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: `Extra space between "<" and tag name "${spaceBeforeName[1]}"`,
        fix: `Change "< ${spaceBeforeName[1]}" to "<${spaceBeforeName[1]}"`
      })
    }

    // Check for attribute without = sign: <View class"foo">
    const attrNoEquals = trimmed.match(/^<([a-zA-Z0-9_]+)\s+[a-zA-Z]+"/)
    if (attrNoEquals && !trimmed.includes('=')) {
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: `Attribute is missing "=" sign`,
        fix: `Check attributes in this tag — each one needs an "=" before its value`
      })
    }

    // Check for backslash in self-closing tag: <Label text="hi" \>
    if (/\\>/.test(trimmed)) {
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: `Tag has a backslash "\\>" instead of forward slash "/>"`,
        fix: `Change "\\>" to "/>"`
      })
    }

    // Check for double closing bracket: <View class="foo">>
    if (/>>/.test(trimmed) && !trimmed.includes('<!--')) {
      throwPreValidationError({
        relativePath,
        lineNumber: i + 1,
        lineContent: trimmed,
        message: `Tag has a double ">>" closing bracket`,
        fix: `Remove the extra ">"`
      })
    }

    // Check for unclosed opening tag (line ends without > and next line starts a new tag)
    if (trimmed.startsWith('<') && !trimmed.startsWith('</') && !trimmed.startsWith('<!--') && !trimmed.endsWith('>') && !trimmed.endsWith('-->')) {
      const nextTrimmed = (lines[i + 1] || '').trim()
      if (nextTrimmed.startsWith('<')) {
        throwPreValidationError({
          relativePath,
          lineNumber: i + 1,
          lineContent: trimmed,
          message: `Tag is missing its closing ">"`,
          fix: `Add ">" at the end of this tag`
        })
      }
    }
  }

  return false
}

function throwPreValidationError({ relativePath, lineNumber, lineContent, message, fix }) {
  const error = new Error(`XML Syntax Error in ${relativePath}:${lineNumber}`)
  error.isPreValidationError = true
  error.filePath = relativePath
  error.lineNumber = lineNumber
  error.lineContent = lineContent

  logger.block(
    chalk.red('XML Syntax Error'),
    `File: ${chalk.yellow(`"${relativePath}"`)}`,
    `Line: ${chalk.yellow(lineNumber)}`,
    `Content: ${chalk.yellow(`"${lineContent}"`)}`,
    '',
    chalk.red(message),
    '',
    `${chalk.green('Fix:')} ${fix}`
  )

  throw error
}

/**
 * Extract classes from file content
 * COPIED exactly from original extractClasses() function
 */
function extractClasses(currentText, currentFile) {
  try {
    const jsontext = convert.xml2json(encodeHTML(currentText), { compact: true })

    return traverse(JSON.parse(jsontext)).reduce(function (acc, value) {
      if (this.key === 'class' || this.key === 'id') acc.push(value.split(' '))
      return acc
    }, [])
  } catch (error) {
    throw chalk.red(`::PurgeTSS:: Error processing: "${currentFile}"\n`, error)
  }
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
    if (file) {
      // Validate XML syntax first, regardless of mode
      validateXML(file, viewPath)

      // Then extract classes based on mode
      if (configFile.purge.mode === 'all') {
        allClasses.push(file.match(/[^<>"'`\s]*[^<>"'`\s:]/g))
      } else {
        allClasses.push(extractClasses(file, viewPath))
      }
    }
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

    return traverse(JSON.parse(jsontext)).reduce(function (acc, value) {
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
  _.each(viewPaths, viewPath => {
    const file = fs.readFileSync(viewPath, 'utf8')
    // Validate XML before processing
    validateXML(file, viewPath)
    allClasses.push(extractClassesOnly(file, viewPath))
  })

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
    logger.startSection()
    try {
      // Explicit header so every purge run shows which project is being
      // processed — mirrors the Auto-Purging line emitted by the alloy.jmk hook.
      logger.info('Purging', chalk.yellow(cwd))

      init(options)

      backupOriginalAppTss()

      let uniqueClasses

      try {
        uniqueClasses = getUniqueClasses()

        // Pre-validate class syntax. Halts on inverted negatives, Tailwind
        // brackets, empty parens, etc. — but NOT on generic unknown classes
        // (those fall through silently to "// Unused or unsupported classes").
        validateClassSyntax({
          classes: uniqueClasses,
          viewPaths: getViewPaths(),
          controllerPaths: getControllerPaths()
        })
      } catch (error) {
        // Handle pre-validation errors (XML syntax errors detected before
        // parsing) and class-syntax errors (authoring mistakes detected
        // before purging). In both cases the error block was already
        // printed; just exit cleanly.
        if (error.isPreValidationError || error.isClassSyntaxError) {
          // eslint-disable-next-line n/no-process-exit
          process.exit(1)
        }
        // Re-throw other errors
        throw error
      }

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
    } finally {
      logger.endSection()
    }

    return true
  } else {
    logger.warn('Project purged less than 2 seconds ago!')
    return true
  }
}
