import { GeneratorInputs } from '../../utils/generator-inputs.js'
import { writeIfChanged } from '../../../shared/generated-files.js'
/**
 * PurgeTSS v7.1 - Material Icons JS Builder (Development)
 *
 * Builds Material Icons JS functions for development/distribution.
 * COPIED from lib/build-material-icons-js.js - NO CHANGES to logic.
 *
 * Generates: ./dist/materialicons.js
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
export function buildMaterialIconsJS(inputs = new GeneratorInputs()) {
  const uniqueCodepoints = inputs.codepoints([
    path.resolve(projectRoot, './lib/templates/materialicons/MaterialIcons-Regular.codepoints'),
    path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsOutlined-Regular.codepoints'),
    path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsRound-Regular.codepoints'),
    path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsSharp-Regular.codepoints'),
    path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsTwoTone-Regular.codepoints'),
  ])

  let fileContent = fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/template.js.cjs'), 'utf8')

  fileContent += '\n' + fs.readFileSync(path.resolve(projectRoot, './lib/templates/icon-functions.js.cjs'), 'utf8')

  let exportIcons = '\nconst icons = {\n'

  _.each(uniqueCodepoints, rule => {
    if (rule) {
      exportIcons += `\t'${prettifyFontName(rule.selector)}': '\\u${rule.property}',\n`
    }
  })

  exportIcons += '};\n'

  exportIcons += 'exports.icons = icons;\n'

  exportIcons += `
const families = {
  default: 'MaterialIcons-Regular',
  regular: 'MaterialIcons-Regular',
  outlined: 'MaterialIconsOutlined-Regular',
  round: 'MaterialIconsRound-Regular',
  sharp: 'MaterialIconsSharp-Regular',
  twoTone: 'MaterialIconsTwoTone-Regular'
};
exports.families = families;
exports.regular = families.regular;
exports.outlined = families.outlined;
exports.round = families.round;
exports.sharp = families.sharp;
exports.twoTone = families.twoTone;
`

  exportIcons += '\nconst iconKeys = Object.keys(icons)\n'

  fileContent += exportIcons

  writeIfChanged(path.resolve(projectRoot, './dist/materialicons.js'), fileContent)

  logger.file('./dist/materialicons.js')
}

/**
 * Prettify font name for JS usage (Material Icons version)
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
  buildMaterialIconsJS()
}
