/* eslint-disable camelcase */
/**
 * PurgeTSS v7.1.0 - Core Purger: Icon Fonts
 * Icon font purging engines for FontAwesome, Material Icons, Material Symbols, Framework7
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import _ from 'lodash'
import chalk from 'chalk'
import * as helpers from '../../../lib/helpers.js'
import { logger } from '../../shared/logger.js'
import { localStart, localFinish } from '../../cli/utils/cli-helpers.js'
import {
  projectsFA_TSS_File,
  srcFontAwesomeTSSFile,
  srcMaterialIconsTSSFile,
  srcMaterialSymbolsTSSFile,
  srcFramework7FontTSSFile,
  cwd
} from '../../shared/constants.js'

/**
 * Purge FontAwesome classes - COPIED exactly from original purgeFontAwesome() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged FontAwesome CSS classes as string
 */
export function purgeFontAwesome(uniqueClasses, cleanUniqueClasses) {
  let fontAwesome = false

  // check if fonts.tss exists and if it includes Font Awesome
  if (fs.existsSync(`${cwd}/purgetss/styles/fonts.tss`)) {
    const fontsTSS = fs.readFileSync(`${cwd}/purgetss/styles/fonts.tss`, 'utf8')
    fontAwesome = fontsTSS.includes('Font Awesome')
  }

  if (!fontAwesome) {
    let sourceFolder = ''
    let purgedClasses = ''
    let purgingMessage = ''

    if (fs.existsSync(projectsFA_TSS_File)) {
      sourceFolder = projectsFA_TSS_File
      purgedClasses = '\n// Pro/Beta Font Awesome\n'
      purgingMessage = `Purging ${chalk.yellow('Pro/Beta Font Awesome')} styles...')`
    } else {
      sourceFolder = srcFontAwesomeTSSFile
      purgedClasses = '\n// Default Font Awesome\n'
      purgingMessage = 'Purging Default Font Awesome styles...'
    }

    purgedClasses += purgeFontIcons(sourceFolder, uniqueClasses, purgingMessage, cleanUniqueClasses, ['fa', 'fat', 'fas', 'fal', 'far', 'fab', 'fa-thin', 'fa-solid', 'fa-light', 'fa-regular', 'fa-brands', 'fontawesome', 'fontawesome-thin', 'fontawesome-solid', 'fontawesome-light', 'fontawesome-regular', 'fontawesome-brands'])

    return (purgedClasses === '\n// Pro/Beta Font Awesome\n' || purgedClasses === '\n// Default Font Awesome\n') ? '' : purgedClasses
  }

  return ''
}

/**
 * Purge Material Icons classes - COPIED exactly from original purgeMaterialIcons() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged Material Icons CSS classes as string
 */
export function purgeMaterialIcons(uniqueClasses, cleanUniqueClasses) {
  let purgedClasses = '\n// Material Icons\n'

  purgedClasses += purgeFontIcons(srcMaterialIconsTSSFile, uniqueClasses, 'Purging Material Icons styles...', cleanUniqueClasses, ['mi', 'mio', 'mir', 'mis', 'mit', 'material-icons', 'material-icons-round', 'material-icons-sharp', 'material-icons-two-tone', 'material-icons-outlined'])

  return (purgedClasses === '\n// Material Icons\n') ? '' : purgedClasses
}

/**
 * Purge Material Symbols classes - COPIED exactly from original purgeMaterialSymbols() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged Material Symbols CSS classes as string
 */
export function purgeMaterialSymbols(uniqueClasses, cleanUniqueClasses) {
  let purgedClasses = '\n// Material Symbols\n'

  purgedClasses += purgeFontIcons(srcMaterialSymbolsTSSFile, uniqueClasses, 'Purging Material Symbols styles...', cleanUniqueClasses, ['ms', 'msr', 'mss', 'mso', 'materialsymbol', 'materialsymbol-rounded', 'materialsymbol-sharp', 'materialsymbol-outlined', 'material-symbol', 'material-symbol-rounded', 'material-symbol-sharp', 'material-symbol-outlined'])

  return (purgedClasses === '\n// Material Symbols\n') ? '' : purgedClasses
}

/**
 * Purge Framework7 classes - COPIED exactly from original purgeFramework7() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged Framework7 CSS classes as string
 */
export function purgeFramework7(uniqueClasses, cleanUniqueClasses) {
  let purgedClasses = '\n// Framework7\n'

  purgedClasses += purgeFontIcons(srcFramework7FontTSSFile, uniqueClasses, 'Purging Framework7 Icons styles...', cleanUniqueClasses, ['f7', 'f7i', 'framework7'])

  return (purgedClasses === '\n// Framework7\n') ? '' : purgedClasses
}

/**
 * Purge font icons from source file - COPIED exactly from original purgeFontIcons() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {string} sourceFolder - Path to source TSS file
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {string} message - Message to display during purging
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @param {Array} _prefixes - Array of icon prefixes (not used in original)
 * @returns {string} Purged icon CSS classes as string
 */
export function purgeFontIcons(sourceFolder, uniqueClasses, message, cleanUniqueClasses, _prefixes) {
  localStart()

  let purgedClasses = ''
  const sourceTSS = fs.readFileSync(sourceFolder, 'utf8')

  if (cleanUniqueClasses.some(element => sourceTSS.includes(`'.${element}'`))) {
    logger.info(message)
    const sourceTSSFile = sourceTSS.split(/\r?\n/)
    uniqueClasses.forEach(className => {
      const cleanClassName = cleanClassNameFn(className)
      if (sourceTSS.includes(`'.${cleanClassName}'`)) {
        const newLine = _.filter(sourceTSSFile, s => s.indexOf(`'.${cleanClassName}'`) !== -1)[0]
        purgedClasses += helpers.checkPlatformAndDevice(newLine, className)
      }
    })
  }

  localFinish(message)

  return purgedClasses
}

// TODO: These functions need to be imported from other modules when they're extracted
// For now, they will be available from the main index.js until refactor is complete

/**
 * Clean class name by removing platform and modifier prefixes
 * COPIED exactly from original cleanClassNameFn() function
 */
function cleanClassNameFn(className) {
  return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('children:', '').replace('child:', '').replace('open:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '')
}
