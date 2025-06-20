/**
 * PurgeTSS v7.1 - FontAwesome Builder (Development)
 * 
 * Builds FontAwesome TSS files for development/distribution.
 * COPIED from lib/build-fontawesome-free-tss.js - NO CHANGES to logic.
 * 
 * Generates: ./dist/fontawesome.tss
 * 
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import _ from 'lodash'
import css from 'css'
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
export function buildFontAwesome() {
  const cssContent = fs.readFileSync(path.resolve(projectRoot, './node_modules/@fortawesome/fontawesome-free/css/all.css'), 'utf8')
  const data = css.parse(cssContent)

  let tssClasses = fs.readFileSync(path.resolve(projectRoot, './lib/templates/fontawesome/free-template.tss'), 'utf8') + '\n'

  tssClasses += fs.readFileSync(path.resolve(projectRoot, './lib/templates/fontawesome/free-reset.tss'), 'utf8')

  tssClasses += processCSS(data)

  fs.writeFileSync(path.resolve(projectRoot, './dist/fontawesome.tss'), tssClasses, _err => {
    throw _err
  })

  logger.file('./dist/fontawesome.tss')
}

/**
 * Process CSS data to TSS format
 * COPIED exactly from original processCSS() function - NO CHANGES
 *
 * @param {Object} data - CSS data from readCSS
 * @returns {string} Processed TSS classes
 */
export function processCSS(data) {
  const rules = _.map(data.stylesheet.rules, rule => {
    if (rule.type === 'rule' && rule.selectors && rule.declarations[0].value.includes('"\\')) {
      return {
        selector: rule.selectors[0].replace('::before', '').replace(':before', ''),
        property: ('0000' + rule.declarations[0].value.replace('\"\\', '').replace('\"', '')).slice(-4)
      }
    }
  })

  let paraTSS = ''

  _.each(rules, rule => {
    if (rule) {
      paraTSS += `'${rule.selector}': { text: '\\u${rule.property}', title: '\\u${rule.property}' }\n`
    }
  })

  return paraTSS
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildFontAwesome()
}
