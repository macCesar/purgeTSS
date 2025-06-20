/**
 * PurgeTSS v7.1 - Framework7 Icons Builder (Development)
 * 
 * Builds Framework7 Icons TSS files for development/distribution.
 * COPIED from lib/build-framework7-icons-tss.js - NO CHANGES to logic.
 * 
 * Generates: ./dist/framework7icons.tss
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
export function buildFramework7Icons() {
  const files = fs.readdirSync(path.resolve(projectRoot, './node_modules/framework7-icons/svg'))

  const justNames = []

  files.filter(isNotJunk).forEach(name => {
    justNames.push(name.replace('.svg', ''))
  })

  let tssClasses = fs.readFileSync(path.resolve(projectRoot, './lib/templates/framework7/template.tss'), 'utf8') + '\n'

  tssClasses += fs.readFileSync(path.resolve(projectRoot, './lib/templates/framework7/reset.tss'), 'utf8')

  tssClasses += processNames(justNames)

  fs.writeFileSync(path.resolve(projectRoot, './dist/framework7icons.tss'), tssClasses, err => {
    throw err
  })

  logger.file('./dist/framework7icons.tss')
}

/**
 * Process Framework7 icon names to TSS format
 * COPIED exactly from original processNames() function - NO CHANGES
 * 
 * @param {Array} data - Array of icon names
 * @returns {string} Processed TSS classes
 */
export function processNames(data) {
  let paraTSS = ''

  _.each(data, rule => {
    paraTSS += `'.f7-${rule}': { text: '${rule}', title: '${rule}' }\n`
  })

  return paraTSS
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildFramework7Icons()
}