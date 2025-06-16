/**
 * PurgeTSS v7.1 - FontAwesome JS Builder (Development)
 * 
 * Builds FontAwesome JS functions for development/distribution.
 * COPIED from lib/build-fontawesome-free-js.js - NO CHANGES to logic.
 * 
 * Generates: ./dist/fontawesome.js
 * 
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import _ from 'lodash'
import read from 'read-css'
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
export function buildFontAwesomeJS() {
  read(path.resolve(projectRoot, './node_modules/@fortawesome/fontawesome-free/css/all.css'), (err, data) => {
    if (err) throw err

    const rules = _.map(data.stylesheet.rules, rule => {
      if (rule.type === 'rule' && rule.selectors && rule.declarations[0].value.includes('"\\')) {
        return {
          selector: rule.selectors[0].replace('::before', '').replace(':before', '').replace('.', ''),
          property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
        }
      }
    })

    let fontawesome = fs.readFileSync(path.resolve(projectRoot, './lib/templates/fontawesome/free-template.js.cjs'), 'utf8')

    fontawesome += '\n' + fs.readFileSync(path.resolve(projectRoot, './lib/templates/icon-functions.js.cjs'), 'utf8')

    let exportIcons = '\nconst icons = {\n'

    _.each(rules, rule => {
      if (rule) {
        exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`
      }
    })

    exportIcons += '};\n'

    exportIcons += 'export const icons = icons;\n'

    exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

    fontawesome += exportIcons

    fs.writeFileSync(path.resolve(projectRoot, './dist/fontawesome.js'), fontawesome, _err => {
      throw _err
    })

    logger.file('./dist/fontawesome.js')
  })
}

/**
 * Prettify font name for JS usage
 * COPIED exactly from original prettifyFontName() function - NO CHANGES
 * 
 * @param {string} str - Font name to prettify
 * @returns {string} Prettified name
 */
export function prettifyFontName(str) {
  str = str.replace('fa-', '')
  const temp = str.split('-'); let i; let pretty

  for (i = 0; i < temp.length; i++) {
    temp[i] = temp[i].charAt(0).toUpperCase() + temp[i].slice(1)
  }

  pretty = temp.join('')
  pretty = pretty.replace(/^.{1}/g, pretty[0].toLowerCase())

  return pretty
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildFontAwesomeJS()
}