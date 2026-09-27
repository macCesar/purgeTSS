import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import _ from 'lodash'

import { logger } from '../../shared/logger.js'
import { makeSureFolderExists } from '../../shared/utils.js'
import { getProjectPaths, validateProject } from '../utils/project-detection.js'
import { buildFontAwesome, buildFontAwesomeJS } from '../../dev/builders/fontawesome-builder.js'

// Get current directory info
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const cwd = process.cwd()

// Folder paths
const projectsPurgeTSSFolder = `${cwd}/purgetss`
const projectsPurge_TSS_Styles_Folder = `${cwd}/purgetss/styles`

// Source paths
const srcFonts_Folder = path.resolve(projectRoot, './assets/fonts')
const srcLibFA = path.resolve(projectRoot, './dist/fontawesome.js')
const srcLibMI = path.resolve(projectRoot, './dist/materialicons.js')
const srcLibMS = path.resolve(projectRoot, './dist/materialsymbols.js')
const srcLibF7 = path.resolve(projectRoot, './dist/framework7icons.js')

// Font Awesome paths
const srcFA_Beta_CSSFile = `${cwd}/purgetss/fontawesome-beta/css/all.css`
const srcFA_Pro_CSS = `${cwd}/node_modules/@fortawesome/fontawesome-pro/css/all.css`
const srcFA_Beta_Web_Fonts_Folder = `${cwd}/purgetss/fontawesome-beta/webfonts/`
const srcFA_Pro_Web_Fonts_Folder = `${cwd}/node_modules/@fortawesome/fontawesome-pro/webfonts/`

const srcFA_ProFontFamilies = {
  'fa-brands-400.ttf': 'FontAwesome7Brands-Regular.ttf',
  'fa-brands-400.woff2': 'FontAwesome7Brands-Regular.woff2',
  'fa-regular-400.ttf': 'FontAwesome7Pro-Regular.ttf',
  'fa-regular-400.woff2': 'FontAwesome7Pro-Regular.woff2',
  'fa-solid-900.ttf': 'FontAwesome7Pro-Solid.ttf',
  'fa-solid-900.woff2': 'FontAwesome7Pro-Solid.woff2'
}

const srcFA_Beta_FontFamilies = {
  'fa-brands-400.ttf': 'FontAwesome7Brands-Regular.ttf',
  'fa-brands-400.woff2': 'FontAwesome7Brands-Regular.woff2',
  'fa-regular-400.ttf': 'FontAwesome7Beta-Regular.ttf',
  'fa-regular-400.woff2': 'FontAwesome7Beta-Regular.woff2',
  'fa-solid-900.ttf': 'FontAwesome7Beta-Solid.ttf',
  'fa-solid-900.woff2': 'FontAwesome7Beta-Solid.woff2'
}

// TSS file paths
const srcFontAwesomeTSSFile = path.resolve(projectRoot, './dist/fontawesome.tss')
const srcFramework7FontTSSFile = path.resolve(projectRoot, './dist/framework7icons.tss')
const srcMaterialIconsTSSFile = path.resolve(projectRoot, './dist/materialicons.tss')
const srcMaterialSymbolsTSSFile = path.resolve(projectRoot, './dist/materialsymbols.tss')

/**
 * Callback function for file operations
 * @param {Error} err - Error object if operation failed
 */
function callback(err) {
  if (err) throw err
}

/**
 * Copy a file from source to destination in fonts folder
 * @param {string} src - Source file path
 * @param {string} dest - Destination filename
 * @param {string} fontsFolder - Destination fonts folder
 * @returns {boolean} - True if file exists and was copied
 */
function copyFile(src, dest, fontsFolder) {
  if (fs.existsSync(src)) {
    fs.copyFile(src, path.join(fontsFolder, dest), callback)
    return true
  }
  return false
}

/**
 * Copy Font Awesome Free fonts to project
 */
function copyFreeFonts(fontsFolder) {
  fs.copyFile(srcFonts_Folder + '/FontAwesome7Brands-Regular.ttf', path.join(fontsFolder, 'FontAwesome7Brands-Regular.ttf'), callback)
  fs.copyFile(srcFonts_Folder + '/FontAwesome7Free-Regular.ttf', path.join(fontsFolder, 'FontAwesome7Free-Regular.ttf'), callback)
  fs.copyFile(srcFonts_Folder + '/FontAwesome7Free-Solid.ttf', path.join(fontsFolder, 'FontAwesome7Free-Solid.ttf'), callback)

  logger.item(chalk.green('Font Awesome Free'))
}

/**
 * Copy Font Awesome Pro fonts to project
 * @param {Object} fontFamilies - Mapping of source to destination font names
 * @param {string} webFonts - Path to web fonts folder
 * @param {string} fontsFolder - Destination fonts folder
 */
function copyProFonts(fontFamilies, webFonts, fontsFolder) {
  _.each(fontFamilies, (dest, src) => {
    if (copyFile(`${webFonts}/${src}`, dest, fontsFolder)) {
      logger.item(`${dest} copied to ${chalk.yellow(path.relative(cwd, fontsFolder))}`)
    }
  })
}

/**
 * Copy Material Icons fonts to project
 */
function copyMaterialIconsFonts(fontsFolder) {
  // Material Icons Font
  const fontFamilies = [
    'MaterialIcons-Regular.ttf',
    'MaterialIconsOutlined-Regular.otf',
    'MaterialIconsRound-Regular.otf',
    'MaterialIconsSharp-Regular.otf',
    'MaterialIconsTwoTone-Regular.otf'
  ]

  _.each(fontFamilies, familyName => {
    copyFile(`${srcFonts_Folder}/${familyName}`, familyName, fontsFolder)
  })

  logger.item(chalk.green('Material Icons'))
}

/**
 * Copy Material Symbols fonts to project
 */
function copyMaterialSymbolsFonts(fontsFolder) {
  // Material Symbols Icons Font
  const fontFamilies = [
    'MaterialSymbolsOutlined-Regular.ttf',
    'MaterialSymbolsRounded-Regular.ttf',
    'MaterialSymbolsSharp-Regular.ttf'
  ]

  _.each(fontFamilies, familyName => {
    copyFile(`${srcFonts_Folder}/${familyName}`, familyName, fontsFolder)
  })

  logger.item(chalk.green('Material Symbols'))
}

/**
 * Copy Framework7 Icons font to project
 */
function copyFramework7IconsFonts(fontsFolder) {
  // Framework7 Font
  copyFile(srcFonts_Folder + '/Framework7-Icons.ttf', 'Framework7-Icons.ttf', fontsFolder)
  logger.item(chalk.green('Framework 7'))
}

// Every accepted --vendor spelling, mapped to its canonical code
const VENDOR_ALIASES = {
  fa: 'fa',
  fontawesome: 'fa',
  mi: 'mi',
  materialicons: 'mi',
  ms: 'ms',
  materialsymbol: 'ms',
  materialsymbols: 'ms',
  f7: 'f7',
  framework7: 'f7'
}

/**
 * Parse the --vendor option into canonical vendor codes
 * @param {string} vendorOption - Comma-separated vendors, e.g. "fa,materialsymbols"
 * @returns {{ vendors: string[], unknown: string[] }} Canonical codes and unrecognized values
 */
export function parseVendors(vendorOption) {
  // Clean vendor string - remove leading = and spaces
  const names = vendorOption.replace(/^=/, '').replace(/ /g, '').split(',').filter(Boolean)
  const unknown = names.filter(name => !VENDOR_ALIASES[name.toLowerCase()])
  const vendors = _.uniq(names.map(name => VENDOR_ALIASES[name.toLowerCase()]).filter(Boolean))
  return { vendors, unknown }
}

/**
 * Copy font files based on vendor
 * @param {string} vendor - Font vendor (fa, mi, ms, f7)
 * @param {string} fontsFolder - Destination fonts folder
 */
function copyFont(vendor, fontsFolder) {
  makeSureFolderExists(fontsFolder)

  switch (vendor) {
    case 'fa':
      if (fs.existsSync(srcFA_Beta_CSSFile)) {
        copyProFonts(srcFA_Beta_FontFamilies, srcFA_Beta_Web_Fonts_Folder, fontsFolder)
      } else if (fs.existsSync(srcFA_Pro_CSS)) {
        copyProFonts(srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder, fontsFolder)
      } else {
        copyFreeFonts(fontsFolder)
      }
      break
    case 'mi':
      copyMaterialIconsFonts(fontsFolder)
      break
    case 'ms':
      copyMaterialSymbolsFonts(fontsFolder)
      break
    case 'f7':
      copyFramework7IconsFonts(fontsFolder)
      break
  }
}

/**
 * Copy font library modules based on vendor
 * @param {string} vendor - Font vendor (fa, mi, ms, f7)
 * @param {string} libFolder - Destination module folder
 */
function copyFontLibrary(vendor, libFolder) {
  switch (vendor) {
    case 'fa':
      if (fs.existsSync(srcFA_Beta_CSSFile) || fs.existsSync(srcFA_Pro_CSS)) {
        buildFontAwesomeJS(libFolder)
      } else {
        fs.copyFileSync(srcLibFA, path.join(libFolder, 'fontawesome.js'))
        logger.item(chalk.yellow('fontawesome.js'))
      }
      break
    case 'mi':
      fs.copyFileSync(srcLibMI, path.join(libFolder, 'materialicons.js'))
      logger.item(chalk.yellow('materialicons.js'))
      break
    case 'ms':
      fs.copyFileSync(srcLibMS, path.join(libFolder, 'materialsymbols.js'))
      logger.item(chalk.yellow('materialsymbols.js'))
      break
    case 'f7':
      fs.copyFileSync(srcLibF7, path.join(libFolder, 'framework7icons.js'))
      logger.item(chalk.yellow('framework7icons.js'))
      break
  }
}

/**
 * Copy font style files based on vendor
 * @param {string} vendor - Font vendor (fa, mi, ms, f7)
 */
function copyFontStyle(vendor) {
  switch (vendor) {
    case 'fa':
      if (fs.existsSync(srcFA_Beta_CSSFile) || fs.existsSync(srcFA_Pro_CSS)) {
        buildFontAwesome()
      } else {
        fs.copyFileSync(srcFontAwesomeTSSFile, projectsPurge_TSS_Styles_Folder + '/fontawesome.tss')
        logger.item(chalk.yellow('fontawesome.tss'))
      }
      break
    case 'mi':
      fs.copyFileSync(srcMaterialIconsTSSFile, projectsPurge_TSS_Styles_Folder + '/materialicons.tss')
      logger.item(chalk.yellow('materialicons.tss'))
      break
    case 'ms':
      fs.copyFileSync(srcMaterialSymbolsTSSFile, projectsPurge_TSS_Styles_Folder + '/materialsymbols.tss')
      logger.item(chalk.yellow('materialsymbols.tss'))
      break
    case 'f7':
      fs.copyFileSync(srcFramework7FontTSSFile, projectsPurge_TSS_Styles_Folder + '/framework7icons.tss')
      logger.item(chalk.yellow('framework7icons.tss'))
      break
  }
}

/**
 * Copy font libraries to project lib folder
 * @param {string[]} vendors - Canonical vendor codes
 * @param {string} libFolder - Destination module folder
 */
function copyFontLibraries(vendors, libFolder) {
  makeSureFolderExists(libFolder)
  _.each(vendors, vendor => copyFontLibrary(vendor, libFolder))
}

/**
 * Copy font styles to project styles folder
 * @param {string[]} vendors - Canonical vendor codes
 */
function copyFontStyles(vendors) {
  makeSureFolderExists(projectsPurgeTSSFolder)
  makeSureFolderExists(projectsPurge_TSS_Styles_Folder)
  _.each(vendors, vendor => copyFontStyle(vendor))
}

/**
 * Main command: Copy icon fonts to project
 * @param {Object} options - Command options
 * @param {string} options.vendor - Specific vendors to copy (comma-separated)
 * @param {boolean} options.module - Copy corresponding JS modules
 * @param {boolean} options.styles - Copy corresponding TSS styles
 * @returns {Promise<boolean>} - Success status
 */
export async function copyFonts(options = {}) {
  try {
    if (!validateProject()) return false

    const { projectType, fontsFolder, libFolder } = getProjectPaths()

    const hasVendorOption = options.vendor && typeof options.vendor === 'string'
    let vendors = ['fa', 'mi', 'ms', 'f7']

    if (hasVendorOption) {
      const parsed = parseVendors(options.vendor)
      if (parsed.unknown.length || !parsed.vendors.length) {
        const invalid = parsed.unknown.length ? parsed.unknown.join(', ') : options.vendor
        logger.error(`Unknown --vendor value: ${chalk.yellow(invalid)}. Valid values: ${Object.keys(VENDOR_ALIASES).join(', ')}`)
        return false
      }
      vendors = parsed.vendors
    }

    makeSureFolderExists(fontsFolder)

    if (hasVendorOption) {
      logger.info('Copying Icon Fonts...')
    } else {
      logger.info('Copying Fonts to', chalk.yellow(path.relative(cwd, fontsFolder)), 'folder')
    }
    _.each(vendors, vendor => copyFont(vendor, fontsFolder))

    if (options.module) {
      console.log()
      logger.info('Copying Modules to', chalk.yellow(path.relative(cwd, libFolder)), 'folder')
      copyFontLibraries(vendors, libFolder)
    }

    if (options.styles) {
      if (projectType === 'classic') {
        logger.info(chalk.yellow('--styles is Alloy-only; no TSS files were created in this Classic project.'))
      } else {
        console.log()
        logger.info('Copying Styles to', chalk.yellow('./purgetss/styles'), 'folder')
        copyFontStyles(vendors)
      }
    }

    return true
  } catch (error) {
    logger.error('Error in copyFonts:', error.message)
    return false
  }
}

/**
 * Copy PurgeTSS UI module to project
 * @returns {Promise<boolean>} - Success status
 */
export async function copyModulesLibrary() {
  try {
    const srcPurgeTSSLibrary = path.resolve(projectRoot, './dist/purgetss.ui.js')
    if (!validateProject()) return false

    const { libFolder } = getProjectPaths()
    makeSureFolderExists(libFolder)
    fs.copyFileSync(srcPurgeTSSLibrary, path.join(libFolder, 'purgetss.ui.js'))
    logger.info(chalk.yellow('purgetss.ui'), 'module copied to', chalk.yellow(path.relative(cwd, libFolder)), 'folder')
    return true
  } catch (error) {
    logger.error('Error in copyModulesLibrary:', error.message)
    return false
  }
}
