/**
 * PurgeTSS v7.1.0 - Core Builder: Tailwind Builder
 * Functions for building Tailwind CSS from configuration
 *
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @since 7.1.0
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { logger } from '../../shared/logger.js'
import {
  projectRoot,
  projectsConfigJS,
  // eslint-disable-next-line camelcase
  projectsPurge_TSS_Styles_Folder,
  // eslint-disable-next-line camelcase
  projectsTailwind_TSS,
  srcTailwindTSS
} from '../../shared/constants.js'

/**
 * Build Tailwind CSS - COPIED exactly from original buildTailwind() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Object} options - Build options
 */
export function buildTailwind(options) {
  helpers.globalOptions.legacy = configOptions.legacy
  autoBuildTailwindTSS(options)
}

/**
 * Build Tailwind CSS (Legacy) - COPIED exactly from original buildTailwindLegacy() function
 * NO CHANGES to logic, preserving 100% of original functionality
 */
export function buildTailwindLegacy() {
  helpers.globalOptions.legacy = true

  const allValuesCombined = combineAllValues(getBaseValues(defaultTheme), defaultTheme)

  let tailwindStyles = fs.readFileSync(path.resolve(projectRoot, './lib/templates/tailwind/template.tss'), 'utf8')
  tailwindStyles += fs.readFileSync(path.resolve(projectRoot, './lib/templates/tailwind/custom-template.tss'), 'utf8')
  tailwindStyles += (fs.existsSync(projectsConfigJS)) ? `// config.js file updated on: ${getFileUpdatedDate(projectsConfigJS)}\n` : '// default config.js file\n'

  if (Object.keys(configFile.theme).length) {
    tailwindStyles += '\n// Custom Styles\n'
    _.each(configFile.theme, (value, key) => {
      tailwindStyles += helperToBuildTailwindClasses(key, value)
    })
  }

  tailwindStyles += '\n// Resets\n'

  // Generate glossary files
  const distributionFolder = !fs.existsSync(projectsConfigJS)

  let destinationFolder
  if (distributionFolder) {
    destinationFolder = path.resolve(projectRoot, './dist/glossary-legacy/')
    makeSureFolderExists(destinationFolder)
  }

  let menuPosition = 1
  _.each(allValuesCombined, (value, key) => {
    if (key.includes('Properties') && distributionFolder) {
      destinationFolder = path.resolve(projectRoot, './dist/glossary-legacy/' + key)
      makeSureFolderExists(destinationFolder)
      fs.writeFileSync(destinationFolder + '/_category_.json', `{ "label": "${key}", "position": ${menuPosition} }`)
      menuPosition++
    } else {
      const theClasses = helperToBuildTailwindClasses(key, value)

      if (destinationFolder) {
        const adMissingNewLineCharacter = theClasses.startsWith('\n') ? theClasses : '\n' + theClasses
        fs.writeFileSync(`${destinationFolder}/${key}.md`, '```scss' + adMissingNewLineCharacter + '```')
      }

      tailwindStyles += theClasses
    }
  })

  // Compile @apply properties
  const finalTailwindStyles = helpers.compileApplyDirectives(tailwindStyles)

  if (fs.existsSync(projectsConfigJS)) {
    makeSureFolderExists(projectsPurge_TSS_Styles_Folder)
    fs.writeFileSync(projectsTailwind_TSS, finalTailwindStyles)
    logger.file('./purgetss/styles/tailwind.tss', '( Legacy )')
  } else {
    fs.writeFileSync(srcTailwindTSS, finalTailwindStyles)
    logger.file('./dist/tailwind.tss', '( Legacy )')
  }
}

/**
 * Build Tailwind based on config options - COPIED exactly from original buildTailwindBasedOnConfigOptions() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Object} options - Build options (default: {})
 */
export function buildTailwindBasedOnConfigOptions(options = {}) {
  if (configOptions.legacy) {
    buildTailwindLegacy()
  } else {
    buildTailwind(options)
  }
}

/**
 * Remove fit/max/min from object - COPIED exactly from original removeFitMaxMin() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Object} theObject - Object to modify
 */
export function removeFitMaxMin(theObject) {
  delete theObject.width.fit
  delete theObject.width.max
  delete theObject.width.min
  delete theObject.height.fit
  delete theObject.height.max
  delete theObject.height.min
  delete theObject.spacing.fit
  delete theObject.spacing.max
  delete theObject.spacing.min
}

/**
 * Fix percentage values - COPIED exactly from original fixPercentages() function
 * NO CHANGES to logic, preserving 100% of original functionality
 *
 * @param {Object} theObject - Object to modify
 */
export function fixPercentages(theObject) {
  _.each(theObject, (value, key) => {
    if (value.toString().includes('.333333%')) {
      theObject[key] = value.replace('.333333%', '.333334%')
    }
  })
}

// TODO: These functions need to be imported from other modules when they're extracted
// For now, they will be available from the main index.js until refactor is complete

// Placeholder imports - these will be replaced with proper imports once modules are extracted
let helpers, configOptions, autoBuildTailwindTSS, combineAllValues, getBaseValues
let defaultTheme, getFileUpdatedDate, configFile, helperToBuildTailwindClasses, makeSureFolderExists

/**
 * Initialize function references from main index
 * This is a temporary solution until all modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializeTailwindBuilderFunctions(functions) {
  helpers = functions.helpers
  configOptions = functions.configOptions
  autoBuildTailwindTSS = functions.autoBuildTailwindTSS
  combineAllValues = functions.combineAllValues
  getBaseValues = functions.getBaseValues
  defaultTheme = functions.defaultTheme
  getFileUpdatedDate = functions.getFileUpdatedDate
  configFile = functions.configFile
  helperToBuildTailwindClasses = functions.helperToBuildTailwindClasses
  makeSureFolderExists = functions.makeSureFolderExists
}
