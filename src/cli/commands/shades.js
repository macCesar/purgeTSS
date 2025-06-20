/* eslint-disable camelcase */
/**
 * PurgeTSS v7.1 - Shades Commands
 *
 * CLI commands for color shade generation and management.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Color shades and colorModule commands
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import fs from 'fs'
import chalk from 'chalk'
import { createRequire } from 'module'
import { alloyProject, makeSureFolderExists } from '../../shared/utils.js'
import { projectsConfigJS, projectsLibFolder } from '../../shared/constants.js'
import { logger } from '../../shared/logger.js'
import { initIfNotConfig, cleanDoubleQuotes } from '../utils/file-operations.js'

// Create require for ESM compatibility
const require = createRequire(import.meta.url)

/**
 * Create color module with all colors from config
 * Maintains exact same logic as original colorModule() function
 *
 * @returns {boolean} Success status
 */
export function colorModule() {
  if (!alloyProject()) {
    return false
  }

  initIfNotConfig()

  const colorModuleConfigFile = require(projectsConfigJS)

  makeSureFolderExists(projectsLibFolder)

  const mainColors = {
    ...colorModuleConfigFile.theme.colors,
    ...colorModuleConfigFile.theme.extend.colors
  }

  fs.writeFileSync(
    `${projectsLibFolder}/purgetss.colors.js`,
    'module.exports = ' + cleanDoubleQuotes(mainColors, {}),
    'utf8',
    err => { throw err }
  )

  logger.info(`All colors copied to ${chalk.yellow('lib/purgetss.colors.js')}`)

  return true
}

/**
 * Check if color module exists and update if needed
 * Maintains exact same logic as original checkIfColorModule() function
 */
export function checkIfColorModule() {
  if (fs.existsSync(`${projectsLibFolder}/purgetss.colors.js`)) {
    colorModule()
  }
}

/**
 * Main shades command - generates color shades from hex codes
 * Maintains exact same logic as original shades() function
 *
 * @param {Object} args - Command arguments
 * @param {string} args.hexcode - Hex color code
 * @param {string} args.name - Color name
 * @param {Object} options - Command options
 * @param {boolean} options.random - Generate random color
 * @param {string} options.name - Color name from options
 * @param {boolean} options.override - Override existing colors
 * @param {boolean} options.tailwind - Tailwind output format
 * @param {boolean} options.json - JSON output format
 * @param {boolean} options.log - Log output
 * @param {boolean} options.quotes - Use quotes in output
 * @param {boolean} options.single - Single color format
 * @returns {Promise<boolean>} Success status
 */
export async function shades(args, options) {
  const chroma = (await import('chroma-js')).default
  const referenceColorFamilies = (await import('../../../lib/color-shades/tailwindColors.js')).default
  const generateColorShades = (await import('../../../lib/color-shades/generateColorShades.js')).default

  const colorFamily = (options.random || !args.hexcode)
    ? generateColorShades(chroma.random(), referenceColorFamilies)
    : generateColorShades(args.hexcode, referenceColorFamilies)

  if (args.name) colorFamily.name = args.name
  else if (options.name) colorFamily.name = options.name

  colorFamily.name = colorFamily.name.replace(/'/g, '').replace(/\//g, '').replace(/\s+/g, ' ')

  const colorObject = createColorObject(colorFamily, colorFamily.hexcode, options)

  const silent = options.tailwind || options.json || options.log
  
  // Get config file first (this triggers auto-migration if needed)
  const configFile = getConfigFile()
  
  if (alloyProject(silent) && !silent) {

    if (options.override) {
      if (!configFile.theme.colors) configFile.theme.colors = {}
      configFile.theme.colors[colorObject.name] = colorObject.shades

      if (configFile.theme.extend.colors) {
        if (configFile.theme.extend.colors[colorObject.name]) delete configFile.theme.extend.colors[colorObject.name]
        if (Object.keys(configFile.theme.extend.colors).length === 0) delete configFile.theme.extend.colors
      }
    } else {
      if (!configFile.theme.extend.colors) configFile.theme.extend.colors = {}
      configFile.theme.extend.colors[colorObject.name] = colorObject.shades

      if (configFile.theme.colors) {
        if (configFile.theme.colors[colorObject.name]) delete configFile.theme.colors[colorObject.name]
        if (Object.keys(configFile.theme.colors).length === 0) delete configFile.theme.colors
      }
    }

    fs.writeFileSync(projectsConfigJS, 'module.exports = ' + cleanDoubleQuotes(configFile, options), 'utf8', err => { throw err })
    checkIfColorModule()
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)}) saved in`, chalk.yellow('config.js'))
  } else if (options.json) {
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)})\n${JSON.stringify(colorObject, null, 2)}`)
  } else {
    if (options.tailwind) delete colorObject.shades.default
    logger.info(`${chalk.hex(colorFamily.hexcode).bold(`"${colorFamily.name}"`)} (${chalk.bgHex(colorFamily.hexcode)(colorFamily.hexcode)})\n${cleanDoubleQuotes({ colors: { [colorObject.name]: colorObject.shades } }, options)}`)
  }

  return true
}

/**
 * Create color object from color family and options
 * Maintains exact same logic as original createColorObject() function
 *
 * @param {Object} family - Color family object
 * @param {string} hexcode - Hex color code
 * @param {Object} options - Command options
 * @returns {Object} Color object
 */
function createColorObject(family, hexcode, options) {
  const colors = {}
  const name = family.name.toLowerCase().split(' ').join('-')

  if (options.json) {
    const shades = {}
    colors.global = {}
    shades[name] = hexcode
    family.shades.forEach((shade) => {
      shades[`${name}-${shade.number}`] = shade.hexcode
    })
    colors.global.colors = (options.single) ? { [name]: hexcode } : shades
  } else if (options.single) {
    colors.name = name
    colors.shades = hexcode
  } else {
    const shades = { default: hexcode }
    family.shades.forEach((shade) => {
      shades[shade.number] = shade.hexcode
    })
    colors.name = name
    colors.shades = shades
  }

  return colors
}

// Import config manager
import { getConfigFile } from '../../shared/config-manager.js'

/**
 * Export for CLI usage
 */
export default {
  colorModule,
  checkIfColorModule,
  shades
}
