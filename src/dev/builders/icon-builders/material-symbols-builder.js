import { renderIconFontHeader } from '../../utils/icon-font-headers.js'
import { GeneratorInputs } from '../../utils/generator-inputs.js'
import { writeIfChanged } from '../../../shared/generated-files.js'
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
export function buildMaterialSymbols(inputs = new GeneratorInputs()) {
  let tssClasses = renderIconFontHeader(fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/template.tss'), 'utf8'), 'materialsymbols', projectRoot, inputs) + '\n'

  tssClasses += fs.readFileSync(path.resolve(projectRoot, './lib/templates/materialsymbols/reset.tss'), 'utf8')

  const codepoints = inputs.codepoints([
    path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsOutlined[FILL,GRAD,opsz,wght].codepoints'),
    path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsRounded[FILL,GRAD,opsz,wght].codepoints'),
    path.resolve(projectRoot, './lib/templates/materialsymbols/MaterialSymbolsSharp[FILL,GRAD,opsz,wght].codepoints'),
  ])


  tssClasses += processCodePoints(codepoints, 'ms-')

  writeIfChanged(path.resolve(projectRoot, './dist/materialsymbols.tss'), tssClasses)

  logger.file('./dist/materialsymbols.tss')
}


// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildMaterialSymbols()
}