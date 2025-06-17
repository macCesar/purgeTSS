/**
 * PurgeTSS v7.1 - FontAwesome Builder (Development)
 * 
 * Builds FontAwesome TSS and JS files for development/distribution.
 * Extracted from src/index.js - supports Pro, Beta, and Free versions.
 * 
 * @since 7.1.0 (extracted from index.js)
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import _ from 'lodash'
import readCSS from 'read-css'
import { logger } from '../../shared/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')

// Get current working directory
const cwd = process.cwd()

// Project paths
const projectsFA_TSS_File = `${cwd}/purgetss/styles/fontawesome.tss`
const projectsFontsFolder = `${cwd}/app/assets/fonts`
const projectsLibFolder = `${cwd}/app/lib`
const projectsFontAwesomeJS = `${cwd}/app/lib/fontawesome.js`

// FontAwesome Pro CSS paths
const srcFA_Pro_CSS = `${cwd}/node_modules/@fortawesome/fontawesome-pro/css/all.css`
const srcFA_Pro_Web_Fonts_Folder = `${cwd}/node_modules/@fortawesome/fontawesome-pro/webfonts/`
const srcFA_Pro_CSS_Alt = `${cwd}/app/lib/node_modules/@fortawesome/fontawesome-pro/css/all.css`
const srcFA_Pro_Web_Fonts_Folder_Alt = `${cwd}/app/lib/node_modules/@fortawesome/fontawesome-pro/webfonts/`

// FontAwesome Pro template paths
const srcFA_ProReset_TSS_File = './lib/templates/fontawesome/pro-reset.tss'
const srcFA_ProTemplateTSS_File = './lib/templates/fontawesome/pro-template.tss'
const srcFA_ProFontFamilies = {
  'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
  'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
  'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
  'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
  'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf'
}

// FontAwesome Beta paths
const srcFA_Beta_CSSFile = `${cwd}/purgetss/fontawesome-beta/css/all.css`
const srcFA_Beta_Web_Fonts_Folder = `${cwd}/purgetss/fontawesome-beta/webfonts/`
const srcFA_Beta_ResetTSS = './lib/templates/fontawesome/beta-reset.tss'
const srcFA_Beta_TemplateTSS = './lib/templates/fontawesome/beta-template.tss'
const srcFA_Beta_FontFamilies = {
  'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
  'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
  'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
  'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
  'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf'
}

/**
 * Helper function to ensure folder exists
 * @param {string} folder - Folder path to create if it doesn't exist
 */
function makeSureFolderExists(folder) {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
  }
}

/**
 * Callback function for file operations
 * @param {Error} err - Error object
 */
function callback(err) {
  if (err) throw err
}

/**
 * Copy Pro fonts to project folder
 * @param {Object} fontFamilies - Font family mappings
 * @param {string} webFonts - Source web fonts folder
 */
function copyProFonts(fontFamilies, webFonts) {
  _.each(fontFamilies, (dest, src) => {
    fs.copyFile(webFonts + src, projectsFontsFolder + '/' + dest, callback)
  })
  logger.warn(' - Font Awesome Pro')
}

/**
 * Prettify font name for JS usage
 * @param {string} str - Font name to prettify
 * @param {string} prefix - Font prefix to remove
 * @returns {string} Prettified name
 */
export function prettifyFontName(str, prefix) {
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
 * Process FontAwesome CSS data to TSS format
 * @param {Object} data - CSS data from readCSS
 * @returns {string} Processed TSS classes
 */
export function processFontawesomeStyles(data) {
  let convertedTSSClasses = ''

  const rules = _.map(data.stylesheet.rules, rule => {
    // Without Duotones
    if (rule.type === 'rule' && rule.selectors[0].includes(':before') && !rule.selectors[0].includes('.fad')) {
      return {
        selector: rule.selectors[0].replace(':before', '').replace(':', ''),
        property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
      }
    }
  })

  _.each(rules, rule => {
    if (rule) {
      convertedTSSClasses += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`
    }
  })

  return convertedTSSClasses
}

/**
 * Process FontAwesome TSS generation
 * @param {string} CSSFile - Path to CSS file
 * @param {string} templateTSS - Path to template TSS file
 * @param {string} resetTSS - Path to reset TSS file
 * @param {Object} fontFamilies - Font family mappings
 * @param {string} webFonts - Web fonts folder path
 */
export function processFontAwesomeTSS(CSSFile, templateTSS, resetTSS, fontFamilies, webFonts) {
  readCSS(CSSFile, (err, data) => {
    if (err) throw err

    let tssClasses = fs.readFileSync(path.resolve(projectRoot, templateTSS), 'utf8') + '\n'

    tssClasses += fs.readFileSync(path.resolve(projectRoot, resetTSS), 'utf8') + '\n'

    tssClasses += processFontawesomeStyles(data)

    fs.writeFileSync(projectsFA_TSS_File, tssClasses, err2 => {
      throw err2
    })

    logger.file('./purgetss/styles/fontawesome.tss')

    makeSureFolderExists(projectsFontsFolder)

    copyProFonts(fontFamilies, webFonts)
  })
}

/**
 * Process FontAwesome JS generation
 * @param {string} CSSFile - Path to CSS file
 * @param {string} faJS - Path to FontAwesome JS template
 */
export function processFontAwesomeJS(CSSFile, faJS) {
  readCSS(CSSFile, (err, data) => {
    if (err) throw err

    const rules = _.map(data.stylesheet.rules, rule => {
      if (rule.type === 'rule' && rule.selectors[0].includes(':before') && !rule.selectors[0].includes('.fad')) {
        return {
          selector: rule.selectors[0].replace(':before', '').replace('.', '').replace(':', ''),
          property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
        }
      }
    })

    let fontAwesomeContent = fs.readFileSync(path.resolve(__dirname, faJS), 'utf8')

    fontAwesomeContent += '\n' + fs.readFileSync(path.resolve(__dirname, './lib/templates/icon-functions.js.cjs'), 'utf8')

    let exportIcons = '\nconst icons = {\n'

    _.each(rules, rule => {
      if (rule) {
        exportIcons += `\t'${prettifyFontName(rule.selector, 'fa')}': '\\u${rule.property}',\n`
      }
    })

    exportIcons += '}\n'

    exportIcons += 'export { icons as icons };\n'

    exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

    fontAwesomeContent += exportIcons

    makeSureFolderExists(projectsLibFolder)

    fs.writeFileSync(projectsFontAwesomeJS, fontAwesomeContent, err2 => {
      throw err2
    })

    logger.file('./app/lib/fontawesome.js')
  })
}

/**
 * Main FontAwesome TSS builder function
 * Supports Beta, Pro, and Pro Alt locations
 */
export function buildFontAwesome() {
  if (fs.existsSync(srcFA_Beta_CSSFile)) {
    processFontAwesomeTSS(srcFA_Beta_CSSFile, srcFA_Beta_TemplateTSS, srcFA_Beta_ResetTSS, srcFA_Beta_FontFamilies, srcFA_Beta_Web_Fonts_Folder)
  } else if (fs.existsSync(srcFA_Pro_CSS)) {
    processFontAwesomeTSS(srcFA_Pro_CSS, srcFA_ProTemplateTSS_File, srcFA_ProReset_TSS_File, srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder)
  } else if (fs.existsSync(srcFA_Pro_CSS_Alt)) {
    processFontAwesomeTSS(srcFA_Pro_CSS_Alt, srcFA_ProTemplateTSS_File, srcFA_ProReset_TSS_File, srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder_Alt)
  }
}

/**
 * Main FontAwesome JS builder function
 * Supports Beta and Pro versions
 */
export function buildFontAwesomeJS() {
  if (fs.existsSync(srcFA_Beta_CSSFile)) {
    processFontAwesomeJS(srcFA_Beta_CSSFile, './lib/templates/fontawesome/beta-template.js')
  } else if (fs.existsSync(srcFA_Pro_CSS)) {
    processFontAwesomeJS(srcFA_Pro_CSS, './lib/templates/fontawesome/pro-template.js')
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildFontAwesome()
  buildFontAwesomeJS()
}