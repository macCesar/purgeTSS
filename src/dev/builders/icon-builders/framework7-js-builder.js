/**
 * PurgeTSS v7.1 - Framework7 Icons JS Builder (Development)
 *
 * Builds Framework7 Icons JS functions for development/distribution.
 * COPIED from lib/build-framework7-icons-js.js - NO CHANGES to logic.
 *
 * Generates: ./dist/framework7icons.js
 *
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import _ from 'lodash'
import { isNotJunk } from 'junk'
import { logger } from '../../../shared/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../../')

// Ensure dist directory exists
if (!fs.existsSync(path.resolve(projectRoot, './dist'))) {
  fs.mkdirSync(path.resolve(projectRoot, './dist'))
}

/**
 * Main builder function
 * COPIED exactly from original constructor() function
 */
export function buildFramework7IconsJS() {
  const files = fs.readdirSync(path.resolve(projectRoot, './node_modules/framework7-icons/svg'))

  const justNames = []

  files.filter(isNotJunk).forEach(name => {
    justNames.push(name.replace('.svg', ''))
  })

  let framework7 = fs.readFileSync(path.resolve(projectRoot, './lib/templates/framework7/template.js.cjs'), 'utf8')

  framework7 += '\n' + fs.readFileSync(path.resolve(projectRoot, './lib/templates/icon-functions.js.cjs'), 'utf8')

  let exportIcons = '\nconst icons = {\n'

  _.each(justNames, rule => {
    exportIcons += `\t'${prettifyFontName(rule)}': '${rule}',\n`
  })

  exportIcons += '};\n'

  exportIcons += 'exports.icons = icons;\n'

  exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

  framework7 += exportIcons

  fs.writeFileSync(path.resolve(projectRoot, './dist/framework7icons.js'), framework7, err => {
    throw err
  })

  logger.file('./dist/framework7icons.js')
}

/**
 * Prettify font name for JS usage (Framework7 version)
 * COPIED exactly from original prettifyFontName() function - NO CHANGES
 *
 * @param {string} str - Font name to prettify
 * @returns {string} Prettified name
 */
export function prettifyFontName(str) {
  const temp = str.split('_'); let i; let pretty

  for (i = 0; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }

  pretty = temp.join('')
  pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase())

  return pretty
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildFramework7IconsJS()
}
