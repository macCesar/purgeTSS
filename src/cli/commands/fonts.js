/* eslint-disable camelcase */
/* eslint-disable no-useless-escape */
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
import readCSS from 'read-css'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import { getFiles, getFileName } from '../utils/font-utilities.js'
import {
  projectsFontsFolder,
  projectsPurge_TSS_Fonts_Folder,
  projectsPurgeTSSFolder,
  projectsPurge_TSS_Styles_Folder,
  projectsLibFolder,
  cwd,
  projectRoot,
  // FontAwesome Pro constants
  srcFA_Pro_CSS,
  srcFA_ProFontFamilies,
  srcFA_Pro_Web_Fonts_Folder,
  // FontAwesome Beta constants
  srcFA_Beta_CSSFile,
  srcFA_Beta_FontFamilies,
  srcFA_Beta_Web_Fonts_Folder,
  // Library files
  srcLibFA,
  srcLibMI,
  srcLibMS,
  srcLibF7
} from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { start, finish } from '../utils/cli-helpers.js'
import { createDefinitionsFile } from './init.js'
import { buildFontAwesomeJS } from '../../dev/builders/fontawesome-builder.js'

// Additional constants needed for font operations
const srcFonts_Folder = path.resolve(projectRoot, './assets/fonts')
const callback = (err) => { if (err) throw err }

/**
 * Copy file helper function
 * COPIED exactly from original
 */
function copyFile(src, dest) {
  try {
    const fullSrc = path.resolve(src)
    const fullDest = path.resolve(projectsFontsFolder, dest)
    fs.copyFileSync(fullSrc, fullDest)
    return true
  } catch (error) {
    logger.error(`Error copying file ${src} to ${dest}:`, error.message)
    return false
  }
}

/**
 * Process font metadata for TSS comments
 * COPIED exactly from original processFontMeta() function
 *
 * @param {Object} fontMeta - Font metadata object
 * @returns {string} - Formatted font metadata string
 */
function processFontMeta(fontMeta) {
  let fontMetaString = `\n/**\n * ${fontMeta.fullName}`

  fontMetaString += `\n * ${fontMeta.version}`

  if (fontMeta.urlVendor) {
    fontMetaString += `\n * ${fontMeta.urlVendor}`
  }

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
 * Get CSS rules for icon fonts
 * COPIED exactly from original getRules() function
 *
 * @param {Object} data - CSS data object
 * @returns {Array} - Array of font rules
 */
function getRules(data) {
  return _.map(data.stylesheet.rules, rule => {
    if (rule.type === 'rule' && rule.declarations[0].property === 'content' && rule.selectors[0].includes('before')) {
      return {
        selector: '.' + rule.selectors[0].replace('.', '').replace('::before', '').replace(':before', ''),
        property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '').replace('\'\\', '').replace('\'', '')).slice(-4)
      }
    }
  }).filter(rule => rule)
}

/**
 * Get font family from CSS data
 * COPIED exactly from original getFontFamily() function
 *
 * @param {Object} data - CSS data object
 * @returns {Array} - Array of font families
 */
function getFontFamily(data) {
  return _.map(data.stylesheet.rules, rule => {
    if (rule.type === 'font-face') {
      let something = rule.declarations.filter(declaration => declaration.property === 'font-family').map(declaration => declaration.value)[0]
      something = something.replace(/['"](.*?)['"]/g, (_match, p1) => p1)
      return something
    }
  }).filter(rule => rule)
}

/**
 * Find common prefix in CSS rules
 * COPIED exactly from original findPrefix() function
 *
 * @param {Array} rules - Array of CSS rules
 * @returns {string} - Common prefix
 */
function findPrefix(rules) {
  const arrayOfRules = rules.map(function(item) {
    return item.selector.replace('.', '').split('-')
  })

  let firstPrefix = ''
  let firstCounter = 0
  let secondPrefix = ''
  let secondCounter = 0
  let thirdPrefix = ''
  let thirdCounter = 0

  _.each(arrayOfRules, item => {
    if (item[0] !== firstPrefix) {
      firstPrefix = item[0]
      firstCounter++
    }
    if (item.length > 1 && secondPrefix !== item[1]) {
      secondPrefix = item[1]
      secondCounter++
    }
    if (item.length > 2 && thirdPrefix !== item[2]) {
      thirdPrefix = item[2]
      thirdCounter++
    }
  })

  if (firstCounter === 1 && secondCounter === 1 && thirdCounter === 1) {
    return `${firstPrefix}-${secondPrefix}-${thirdPrefix}`
  } else if (firstCounter === 1 && secondCounter === 1) {
    return `${firstPrefix}-${secondPrefix}`
  } else if (firstCounter === 1) {
    return `${firstPrefix}`
  }
}

/**
 * Prettify font icon names
 * COPIED exactly from original prettifyFontName() function
 *
 * @param {string} str - Font name string
 * @param {string} prefix - Font prefix
 * @returns {string} - Prettified name
 */
function prettifyFontName(str, prefix) {
  const temp = str.replace(/_/g, '-').replace(prefix, '').replace(/\s/g, '').split('-')

  const withoutPrefix = []

  let i = 1
  if (prefix === undefined) {
    i = 0
  }

  for (i; i < temp.length; i++) {
    withoutPrefix.push(temp[i].charAt(0).toUpperCase() + temp[i].slice(1))
  }

  const pretty = withoutPrefix.join('').replace(':', '')
  return pretty.replace(/^.{1}/g, pretty[0].toLowerCase())
}

/**
 * Process CSS data into TSS classes
 * COPIED exactly from original processFontsCSS() function
 *
 * @param {Object} data - CSS data object
 * @param {string} prefix - Font prefix
 * @returns {string} - TSS classes string
 */
function processFontsCSS(data, prefix) {
  const rules = getRules(data)
  const fontsPrefix = findPrefix(rules)

  let processedRules = ''
  _.each(rules, rule => {
    if (rule) {
      if (prefix) {
        processedRules += `'${rule.selector.replace(fontsPrefix, prefix)}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`
      } else {
        processedRules += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`
      }
    }
  })

  return processedRules
}

/**
 * Process CSS data into JavaScript module format
 * COPIED exactly from original processFontsJS() function
 *
 * @param {Object} data - CSS data object
 * @param {string} fontFamily - Font family name
 * @param {string} prefix - Font prefix
 * @returns {string} - JavaScript module string
 */
function processFontsJS(data, fontFamily = '', prefix) {
  const rules = getRules(data)

  let exportIcons = '\n'

  let fontsPrefix = findPrefix(rules)

  _.each(rules, rule => {
    if (rule) {
      exportIcons += `\t\t'${prettifyFontName(rule.selector.replace('.', ''), fontsPrefix)}': '\\u${rule.property}',\n`
    }
  })

  if (prefix) {
    fontsPrefix = prefix
  } else if (fontsPrefix === undefined) {
    fontsPrefix = fontFamily
  }

  return `${fontFamily}\n\t'${_.camelCase(fontsPrefix)}': {${exportIcons}\t},`
}

/**
 * Process font family names for JavaScript module
 * COPIED exactly from original processFontFamilyNamesJS() function
 *
 * @param {Object} data - CSS data object
 * @param {string} fontFamily - Font family name
 * @param {string} prefix - Font prefix
 * @returns {string} - Font family JavaScript string
 */
function processFontFamilyNamesJS(data, fontFamily = '', prefix) {
  const rules = getRules(data)

  let fontsPrefix = prefix ?? findPrefix(rules)

  if (fontsPrefix === undefined) {
    fontsPrefix = fontFamily
  }

  return `${fontFamily}\n\t'${_.camelCase(fontsPrefix)}': '${getFontFamily(data)}',`
}

/**
 * Build fonts TSS file from font and CSS files
 * COPIED exactly from original buildFonts() function
 *
 * @param {Object} options - Build options
 * @returns {boolean} - Success status
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
    let tssClasses = '// Fonts TSS file generated with PurgeTSS\n// https://purgetss.com/docs/commands#build-fonts-command\n'

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
        const prefix = options.fontClassFromFilename ? theCSSFile.split('.').shift() : null
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
      exportIcons += 'exports.icon = icons;\n'
      exportIcons += 'exports.icons = icons;\n'

      exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

      exportIcons += '\nconst families = {'
      exportIcons += fontFamiliesJS.slice(0, -1)
      exportIcons += '\n}\n'
      exportIcons += 'exports.family = families;\n'
      exportIcons += 'exports.families = families;\n'

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

/**
 * Copy FontAwesome Free fonts
 * COPIED exactly from original copyFreeFonts() function
 */
function copyFreeFonts() {
  fs.copyFile(srcFonts_Folder + '/FontAwesome6Brands-Regular.ttf', projectsFontsFolder + '/FontAwesome6Brands-Regular.ttf', callback)
  fs.copyFile(srcFonts_Folder + '/FontAwesome6Free-Regular.ttf', projectsFontsFolder + '/FontAwesome6Free-Regular.ttf', callback)
  fs.copyFile(srcFonts_Folder + '/FontAwesome6Free-Solid.ttf', projectsFontsFolder + '/FontAwesome6Free-Solid.ttf', callback)

  logger.warn(' - Font Awesome Free')
}

/**
 * Copy FontAwesome Pro fonts
 * COPIED exactly from original copyProFonts() function
 *
 * @param {Object} fontFamilies - Font family mappings
 * @param {string} webFonts - Web fonts folder path
 */
function copyProFonts(fontFamilies, webFonts) {
  _.each(fontFamilies, (dest, src) => {
    if (copyFile(`${webFonts}/${src}`, dest)) {
      logger.warn(` - ${dest} Font copied to`, chalk.yellow('./app/assets/fonts'), 'folder')
    }
  })
}

/**
 * Copy Material Icons fonts
 * COPIED exactly from original copyMaterialIconsFonts() function
 */
function copyMaterialIconsFonts() {
  // Material Icons Font
  const fontFamilies = [
    'MaterialIcons-Regular.ttf',
    'MaterialIconsOutlined-Regular.otf',
    'MaterialIconsRound-Regular.otf',
    'MaterialIconsSharp-Regular.otf',
    'MaterialIconsTwoTone-Regular.otf'
  ]

  _.each(fontFamilies, familyName => {
    copyFile(`${srcFonts_Folder}/${familyName}`, familyName)
  })

  logger.warn(' - Material Icons')
}

/**
 * Copy Material Symbols fonts
 * COPIED exactly from original copyMaterialSymbolsFonts() function
 */
function copyMaterialSymbolsFonts() {
  // Material Symbols Icons Font
  const fontFamilies = [
    'MaterialSymbolsOutlined-Regular.ttf',
    'MaterialSymbolsRounded-Regular.ttf',
    'MaterialSymbolsSharp-Regular.ttf'
  ]

  _.each(fontFamilies, familyName => {
    copyFile(`${srcFonts_Folder}/${familyName}`, familyName)
  })

  logger.warn(' - Material Symbols')
}

/**
 * Copy Framework7 Icons fonts
 * COPIED exactly from original copyFramework7IconsFonts() function
 */
function copyFramework7IconsFonts() {
  // Framework7 Font
  copyFile(srcFonts_Folder + '/Framework7-Icons.ttf', 'Framework7-Icons.ttf')
  logger.warn(' - Framework 7')
}

/**
 * Copy specific font vendor files
 * COPIED exactly from original copyFont() function
 *
 * @param {string} vendor - Font vendor identifier
 */
export function copyFont(vendor) {
  makeSureFolderExists(projectsFontsFolder)

  switch (vendor) {
    case 'fa':
    case 'fontawesome':
      if (fs.existsSync(srcFA_Beta_CSSFile)) {
        copyProFonts(srcFA_Beta_FontFamilies, srcFA_Beta_Web_Fonts_Folder)
      } else if (fs.existsSync(srcFA_Pro_CSS)) {
        copyProFonts(srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder)
      } else {
        copyFreeFonts()
      }
      break
    case 'mi':
    case 'materialicons':
      copyMaterialIconsFonts()
      break
    case 'ms':
    case 'materialsymbol':
      copyMaterialSymbolsFonts()
      break
    case 'f7':
    case 'framework7':
      copyFramework7IconsFonts()
      break
  }
}

/**
 * Copy font libraries to project
 * COPIED exactly from original copyFontLibraries() function
 *
 * @param {Object} options - Copy options
 */
export function copyFontLibraries(options) {
  if (alloyProject()) {
    makeSureFolderExists(projectsLibFolder)

    if (options.vendor && typeof options.vendor === 'string') {
      const selected = _.uniq(options.vendor.replace(/ /g, '').split(','))
      _.each(selected, vendor => {
        copyFontLibrary(vendor)
      })
    } else {
      copyFontLibrary('fa')
      copyFontLibrary('mi')
      copyFontLibrary('ms')
      copyFontLibrary('f7')
    }
  }
}

/**
 * Copy individual font library
 * COPIED exactly from original copyFontLibrary() function
 *
 * @param {string} vendor - Font vendor identifier
 */
function copyFontLibrary(vendor) {
  switch (vendor) {
    case 'fa':
    case 'fontawesome':
      if (fs.existsSync(srcFA_Beta_CSSFile) || fs.existsSync(srcFA_Pro_CSS)) {
        buildFontAwesomeJS()
      } else {
        fs.copyFileSync(srcLibFA, projectsLibFolder + '/fontawesome.js')
        logger.warn(' - fontawesome.js')
      }
      break
    case 'mi':
    case 'materialicons':
      fs.copyFileSync(srcLibMI, projectsLibFolder + '/materialicons.js')
      logger.warn(' - materialicons.js')
      break
    case 'ms':
    case 'materialsymbol':
      fs.copyFileSync(srcLibMS, projectsLibFolder + '/materialsymbols.js')
      logger.warn(' - materialsymbols.js')
      break
    case 'f7':
    case 'framework7':
      fs.copyFileSync(srcLibF7, projectsLibFolder + '/framework7icons.js')
      logger.warn(' - framework7icons.js')
      break
  }
}

/**
 * Copy font libraries
 * COPIED exactly from original copyFont() function
 * TODO: Need to COPY all the font copying functions (copyProFonts, copyFreeFonts, etc.)
 *
 * @param {string} vendor - Font vendor identifier
 */
export function copyFonts(options) {
  // TODO: Complete copyFonts implementation
  logger.warn('copyFonts() - Function needs to be completed with all dependencies')
  return false
}
