/**
 * PurgeTSS v7.1 - Material Icons Builder (Development)
 * 
 * Builds Material Icons TSS files for development/distribution.
 * COPIED from lib/build-material-icons-tss.js - NO CHANGES to logic.
 * 
 * Generates: ./dist/materialicons.tss
 * 
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import _ from 'lodash'
import { logger } from '../../../shared/logger.js'
import { processCodePoints } from '../../utils/codepoints-processor.js'

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
export function buildMaterialIcons() {
  let tssClasses = fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/template.tss'), 'utf8') + '\n'

  tssClasses += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/reset.tss'), 'utf8')

  let codepoints = fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/MaterialIcons-Regular.codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsOutlined-Regular.codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsRound-Regular.codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsSharp-Regular.codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialicons/MaterialIconsTwoTone-Regular.codepoints'), 'utf8')

  codepoints = codepoints.split('\n').sort()

  tssClasses += processCodePoints(_.uniq(codepoints), 'mi-')

  fs.writeFileSync(path.resolve(projectRoot, './dist/materialicons.tss'), tssClasses, err => {
    throw err
  })

  logger.file('./dist/materialicons.tss')
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildMaterialIcons()
}