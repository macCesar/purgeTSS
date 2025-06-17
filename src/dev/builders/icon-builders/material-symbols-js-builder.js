/**
 * PurgeTSS v7.1 - Material Symbols JS Builder (Development)
 *
 * Builds Material Symbols JS functions for development/distribution.
 * COPIED from lib/build-material-symbols-js.js - NO CHANGES to logic.
 *
 * Generates: ./dist/materialsymbols.js
 *
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import _ from 'lodash'
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
export function buildMaterialSymbolsJS() {
  let codepoints = fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsSharp[FILL,GRAD,opsz,wght].codepoints'), 'utf8')

  const uniqueCodepoints = _.map(_.uniq(codepoints.split('\n').sort()), rule => {
    if (rule !== '') {
      const separado = rule.split(' ')
      return {
        selector: separado[0],
        property: separado[1]
      }
    }
  })

  let fileContent = fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/template.js.cjs'), 'utf8')

  fileContent += '\n' + fs.readFileSync(path.resolve(projectRoot, './lib/templates/icon-functions.js.cjs'), 'utf8')

  let exportIcons = '\nconst icons = {\n'

  _.each(uniqueCodepoints, rule => {
    if (rule) {
      exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`
    }
  })

  exportIcons += '};\n'

  exportIcons += 'exports.icons = icons;\n'

  exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

  fileContent += exportIcons

  fs.writeFileSync(path.resolve(projectRoot, './dist/materialsymbols.js'), fileContent, err => {
    throw err
  })

  logger.file('./dist/materialsymbols.js')
}

/**
 * Prettify font name for JS usage (Material Symbols version)
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
  buildMaterialSymbolsJS()
}
