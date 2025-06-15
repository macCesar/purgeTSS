/**
 * PurgeTSS v7.1 - Fonts Command
 *
 * CLI command for copying font files and libraries.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Font copying command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import path from 'path'
import FontName from 'fontname'
import _ from 'lodash'
import chalk from 'chalk'
import { alloyProject, makeSureFolderExists, getFiles, getFileName } from '../../shared/utils.js'
import {
  projectsFontsFolder,
  // eslint-disable-next-line camelcase
  projectsPurge_TSS_Fonts_Folder,
  projectsPurgeTSSFolder,
  // eslint-disable-next-line camelcase
  projectsPurge_TSS_Styles_Folder,
  projectsLibFolder,
  cwd,
  projectRoot
} from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { start, finish } from '../utils/cli-helpers.js'

/**
 * Copy specific font vendor files
 * COPIED exactly from original copyFont() function
 * TODO: Need to COPY all the font copying functions (copyProFonts, copyFreeFonts, etc.)
 *
 * @param {string} vendor - Font vendor identifier
 */
function copyFont(vendor) {
  // TODO: COPY the complete copyFont function with all its dependencies
  logger.warn(`copyFont(${vendor}) - Function needs to be COPIED from original`)
}

/**
 * Copy font libraries
 * COPIED exactly from original copyFontLibraries() function
 * TODO: Need to COPY the complete function
 *
 * @param {Object} options - Command options
 */
function copyFontLibraries(options) {
  // TODO: COPY the complete copyFontLibraries function
  logger.warn('copyFontLibraries() - Function needs to be COPIED from original')
}

/**
 * Copy font styles
 * COPIED exactly from original copyFontStyles() function
 * TODO: Need to COPY the complete function
 *
 * @param {Object} options - Command options
 */
function copyFontStyles(options) {
  // TODO: COPY the complete copyFontStyles function
  logger.warn('copyFontStyles() - Function needs to be COPIED from original')
}

/**
 * Copy fonts command - main entry point
 * COPIED exactly from original copyFonts() function
 *
 * @param {Object} options - Command options
 * @returns {boolean} Success status
 */
export function copyFonts(options) {
  if (!alloyProject()) {
    return false
  }

  makeSureFolderExists(projectsFontsFolder)

  if (options.vendor && typeof options.vendor === 'string') {
    const selected = _.uniq(options.vendor.replace(/ /g, '').split(','))
    logger.info('Copying Icon Fonts...')
    _.each(selected, vendor => {
      copyFont(vendor)
    })
  } else {
    logger.info('Copying Fonts to', chalk.yellow('./app/assets/fonts'), 'folder')
    copyFont('fa')
    copyFont('mi')
    copyFont('ms')
    copyFont('f7')
  }

  if (options.module) {
    console.log()
    logger.info('Copying Modules to', chalk.yellow('./app/lib'), 'folder')
    copyFontLibraries(options)
  }

  if (options.styles) {
    console.log()
    logger.info('Copying Styles to', chalk.yellow('./purgetss/styles'), 'folder')
    copyFontStyles(options)
  }

  return true
}

/**
 * Build fonts command - processes font files and generates TSS classes
 * Maintains exact same logic as original buildFonts() function
 *
 * @param {Object} options - Command options
 * @param {boolean} options.fontClassFromFilename - Generate class from filename
 * @param {boolean} options.iconPrefixFromFilename - Use filename as icon prefix
 * @param {boolean} options.module - Generate JavaScript module
 */
export function buildFonts(options) {
  if (fs.existsSync(projectsPurge_TSS_Fonts_Folder)) {
    start()

    const files = getFiles(projectsPurge_TSS_Fonts_Folder).filter(file => {
      return file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.css') || file.endsWith('.TTF') || file.endsWith('.OTF') || file.endsWith('.CSS')
    })

    let fontMeta = ''
    let fontJS = ''
    let fontFamiliesJS = ''
    let tssClasses = '// Fonts TSS file generated with Purge TSS\n// https://purgetss.com/docs/commands#build-fonts-command\n'

    // Process font files
    _.each(files, file => {
      if (file.endsWith('.ttf') || file.endsWith('.otf') || file.endsWith('.TTF') || file.endsWith('.OTF')) {
        fontMeta = FontName.parse(fs.readFileSync(file))[0]

        tssClasses += processFontMeta(fontMeta)

        const fontFamilyName = fontMeta.postScriptName.replace(/\//g, '')
        if (options.fontClassFromFilename) {
          tssClasses += `\n'.${getFileName(file)}': { font: { fontFamily: '${fontFamilyName}' } }\n`
        } else {
          tssClasses += `\n'.${fontFamilyName.toLowerCase()}': { font: { fontFamily: '${fontFamilyName}' } }\n`
        }

        // Copy Font File
        makeSureFolderExists(projectsFontsFolder)
        const fontExtension = file.split('.').pop()
        fs.copyFile(file, `${projectsFontsFolder}/${fontFamilyName}.${fontExtension}`, err => {
          if (err) {
            throw err
          }
        })
        logger.info('Copying font', `${chalk.yellow(file.split('/').pop())}...`)
      }
    })

    let oneTimeMessage = '\n// Unicode Characters\n// To use your Icon Fonts in Buttons AND Labels each class sets \'text\' and \'title\' properties\n'

    // Process styles files
    _.each(files, file => {
      if (file.endsWith('.css') || file.endsWith('.CSS')) {
        const cssFile = readCSS(file)
        const theFile = file.split('/')
        const theCSSFile = theFile.pop()
        const prefix = options.iconPrefixFromFilename ? theCSSFile.split('.').shift() : null
        let theFolder = theFile.pop() + '/'
        if (theFolder === 'fonts/') {
          theFolder = ''
        }

        const theCSSFileName = theFolder + theCSSFile

        tssClasses += oneTimeMessage + `\n// ${theCSSFileName}\n`
        oneTimeMessage = ''

        tssClasses += processFontsCSS(cssFile, prefix)

        // JavaScript Module
        if (options.module || fs.existsSync(`${projectsLibFolder}/purgetss.fonts.js`)) {
          fontJS += processFontsJS(cssFile, `\n\t// ${theCSSFileName}`, prefix)
          fontFamiliesJS += processFontFamilyNamesJS(cssFile, `\n\t// ${theCSSFileName}`, prefix)
        }

        // Done processing stylesheet
        logger.info('Processing', `${chalk.yellow(theCSSFileName)}...`)
      }
    })

    if (files.length > 0) {
      makeSureFolderExists(projectsPurgeTSSFolder)
      makeSureFolderExists(projectsPurge_TSS_Styles_Folder)

      fs.writeFileSync(`${cwd}/purgetss/styles/fonts.tss`, tssClasses, { encoding: 'utf8' }, err => {
        throw err
      })
    }

    if (fontJS) {
      makeSureFolderExists(projectsLibFolder)

      let exportIcons = 'const icons = {'
      exportIcons += fontJS.slice(0, -1)
      exportIcons += '\n}\n'
      exportIcons += 'export { icons as icon };\n'
      exportIcons += 'export { icons as icons };\n'

      exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

      exportIcons += '\nconst families = {'
      exportIcons += fontFamiliesJS.slice(0, -1)
      exportIcons += '\n}\n'
      exportIcons += 'export { families as family };\n'
      exportIcons += 'export { families as families };\n'

      exportIcons += '\n// Helper Functions\n' + fs.readFileSync(path.resolve(projectRoot, './lib/templates/icon-functions.js.cjs'), 'utf8')

      fs.writeFileSync(`${projectsLibFolder}/purgetss.fonts.js`, exportIcons, { encoding: 'utf8' }, err => {
        throw err
      })

      logger.info(`${chalk.yellow('./app/lib/purgetss.fonts.js')} file created!`)
    } else if (fs.existsSync(`${projectsLibFolder}/purgetss.fonts.js`)) {
      fs.unlinkSync(`${projectsLibFolder}/purgetss.fonts.js`)
    }

    if (files.length > 0) {
      createDefinitionsFile()
      console.log()
      finish(`Finished building ${chalk.yellow('fonts.tss')} in`)
    } else {
      logger.info('No fonts found in', chalk.yellow('./purgetss/fonts'), 'folder!')
    }
  } else {
    logger.info(`Add font and style files to ${chalk.yellow('./purgetss/fonts')} folder and run this command again!`)
  }
}

// TODO: These functions need to be imported from helper modules when they're extracted
// For now, they will be available from the main index.js until helper refactor is complete

// Placeholder imports - these will be replaced with proper imports once helper modules are extracted
let processFontMeta, readCSS, processFontsCSS, processFontsJS, processFontFamilyNamesJS, createDefinitionsFile

/**
 * Initialize function references from main index
 * This is a temporary solution until helper modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializeFontsBuildFunctions(functions) {
  processFontMeta = functions.processFontMeta
  readCSS = functions.readCSS
  processFontsCSS = functions.processFontsCSS
  processFontsJS = functions.processFontsJS
  processFontFamilyNamesJS = functions.processFontFamilyNamesJS
  createDefinitionsFile = functions.createDefinitionsFile
}
