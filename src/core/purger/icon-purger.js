
/**
 * PurgeTSS v7.1.0 - Core Purger: Icon Fonts
 * Icon font purging engines for FontAwesome, Material Icons, Material Symbols, Framework7
 *
 * Resolve icon selectors by source priority, with per-purge catalog caching.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import _ from 'lodash'
import { createFontCatalogs, higherPriorityFontSources } from '../../shared/font-catalogs.js'
import chalk from 'chalk'
import * as helpers from '../../shared/helpers.js'
import { logger } from '../../shared/logger.js'
import { localStart, localFinish } from '../../cli/utils/cli-helpers.js'
import {
  projectsFA_TSS_File,
  srcFontAwesomeTSSFile,
  srcMaterialIconsTSSFile,
  srcMaterialSymbolsTSSFile,
  srcFramework7FontTSSFile
} from '../../shared/constants.js'

/**
 * Purge FontAwesome classes
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged FontAwesome CSS classes as string
 */
export function purgeFontAwesome(uniqueClasses, cleanUniqueClasses, debug = false, catalogs = createFontCatalogs()) {
  let purged = ''
  for (const [file, label] of [[projectsFA_TSS_File, 'Pro/Beta Font Awesome'], [srcFontAwesomeTSSFile, 'Default Font Awesome']]) {
    const classes = purgeFontIcons(file, uniqueClasses, `Purging ${chalk.yellow(label)} styles...`, cleanUniqueClasses, [], debug, catalogs)
    if (classes) purged += `\n// ${label}\n` + classes
  }
  return purged
}

/**
 * Purge Material Icons classes
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged Material Icons CSS classes as string
 */
export function purgeMaterialIcons(uniqueClasses, cleanUniqueClasses, debug = false, catalogs = createFontCatalogs()) {
  let purgedClasses = '\n// Material Icons\n'

  purgedClasses += purgeFontIcons(srcMaterialIconsTSSFile, uniqueClasses, 'Purging Material Icons styles...', cleanUniqueClasses, ['mi', 'mio', 'mir', 'mis', 'mit', 'material-icons', 'material-icons-round', 'material-icons-sharp', 'material-icons-two-tone', 'material-icons-outlined'], debug, catalogs)

  return (purgedClasses === '\n// Material Icons\n') ? '' : purgedClasses
}

/**
 * Purge Material Symbols classes
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged Material Symbols CSS classes as string
 */
export function purgeMaterialSymbols(uniqueClasses, cleanUniqueClasses, debug = false, catalogs = createFontCatalogs()) {
  let purgedClasses = '\n// Material Symbols\n'

  purgedClasses += purgeFontIcons(srcMaterialSymbolsTSSFile, uniqueClasses, 'Purging Material Symbols styles...', cleanUniqueClasses, ['ms', 'msr', 'mss', 'mso', 'materialsymbol', 'materialsymbol-rounded', 'materialsymbol-sharp', 'materialsymbol-outlined', 'material-symbol', 'material-symbol-rounded', 'material-symbol-sharp', 'material-symbol-outlined'], debug, catalogs)

  return (purgedClasses === '\n// Material Symbols\n') ? '' : purgedClasses
}

/**
 * Purge Framework7 classes
 *
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @returns {string} Purged Framework7 CSS classes as string
 */
export function purgeFramework7(uniqueClasses, cleanUniqueClasses, debug = false, catalogs = createFontCatalogs()) {
  let purgedClasses = '\n// Framework7\n'

  purgedClasses += purgeFontIcons(srcFramework7FontTSSFile, uniqueClasses, 'Purging Framework7 Icons styles...', cleanUniqueClasses, ['f7', 'f7i', 'framework7'], debug, catalogs)

  return (purgedClasses === '\n// Framework7\n') ? '' : purgedClasses
}

/**
 * Purge font icons from source file
 *
 * @param {string} sourceFolder - Path to source TSS file
 * @param {Array} uniqueClasses - Array of unique class names found in XML files
 * @param {string} message - Message to display during purging
 * @param {Array} cleanUniqueClasses - Array of cleaned unique class names
 * @param {Array} _prefixes - Array of icon prefixes (not used in original)
 * @returns {string} Purged icon CSS classes as string
 */
export function purgeFontIcons(sourceFolder, uniqueClasses, message, cleanUniqueClasses, _prefixes, debug = false, catalogs = createFontCatalogs()) {
  const timing = localStart()

  let purgedClasses = ''
  const sourceTSSFile = catalogs.lines(sourceFolder)
  const sourceTSS = sourceTSSFile.join('\n')
  const higherSources = higherPriorityFontSources(sourceFolder)
  const isOverridden = name => higherSources.some(file => catalogs.has(file, name))
  const sourceIndex = uniqueClasses.length > 32 ? new Map() : null
  if (sourceIndex) {
    for (const line of sourceTSSFile) {
      for (const match of line.matchAll(/'\.([^']*)'/g)) {
        if (!sourceIndex.has(match[1])) sourceIndex.set(match[1], line)
      }
    }
  }
  const canIndex = name => sourceIndex && !/[\\']/.test(name)
  const hasMatches = cleanUniqueClasses.some(element => {
    const name = cleanClassNameFn(element)
    return !isOverridden(name) && (canIndex(name) ? sourceIndex.has(name) : sourceTSS.includes(`'.${name}'`))
  })

  if (hasMatches) {
    // In debug mode the label is emitted by localFinish inline with the timing.
    // In non-debug mode this is the progress indicator (only shown when there's
    // actual work for this font, matching pre-existing behavior).
    if (!debug) logger.info(message)
    uniqueClasses.forEach(className => {
      const cleanClassName = cleanClassNameFn(className)
      if (isOverridden(cleanClassName)) return
      if (canIndex(cleanClassName) ? sourceIndex.has(cleanClassName) : sourceTSS.includes(`'.${cleanClassName}'`)) {
        const newLine = canIndex(cleanClassName) ? sourceIndex.get(cleanClassName) : _.filter(sourceTSSFile, s => s.indexOf(`'.${cleanClassName}'`) !== -1)[0]
        purgedClasses += helpers.checkPlatformAndDevice(newLine, className)
      }
    })
  }

  if (debug) localFinish(message, timing)

  return purgedClasses
}

/**
 * Clean class name by removing platform and modifier prefixes
 * COPIED exactly from original cleanClassNameFn() function
 */
function cleanClassNameFn(className) {
  return className.replace('ios:', '').replace('android:', '').replace('handheld:', '').replace('tablet:', '').replace('children:', '').replace('child:', '').replace('open:', '').replace('close:', '').replace('complete:', '').replace('drag:', '').replace('drop:', '').replace('bounds:', '')
}
