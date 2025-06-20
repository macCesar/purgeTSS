/**
 * PurgeTSS v7.1 - Material Symbols Builder (Development)
 * 
 * Builds Material Symbols TSS files for development/distribution.
 * COPIED from lib/build-material-symbols-tss.js - NO CHANGES to logic.
 * 
 * Generates: ./dist/materialsymbols.tss
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
export function buildMaterialSymbols() {
  let tssClasses = fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/template.tss'), 'utf8') + '\n'

  tssClasses += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/reset.tss'), 'utf8')

  let codepoints = fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints'), 'utf8')
  codepoints += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsSharp[FILL,GRAD,opsz,wght].codepoints'), 'utf8')

  codepoints = codepoints.split('\n').sort()

  tssClasses += processCodePoints(_.uniq(codepoints), 'ms-')

  fs.writeFileSync(path.resolve(projectRoot, './dist/materialsymbols.tss'), tssClasses, err => {
    throw err
  })

  logger.file('./dist/materialsymbols.tss')
}


// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildMaterialSymbols()
}