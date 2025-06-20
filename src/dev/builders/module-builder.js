/**
 * PurgeTSS v7.1 - Module Builder (Development)
 *
 * Builds purgetss.ui.js module for development/distribution.
 * COPIED from lib/build-module.js - NO CHANGES to logic.
 *
 * Generates: ./dist/purgetss.ui.js
 *
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import fs from 'fs'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { logger } from '../../shared/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')

/**
 * Main builder function
 * COPIED exactly from original logic
 */
export function buildModule() {
  const PurgeTSSModule = path.resolve(projectRoot, './lib/templates/purgetss.ui.js.cjs')
  const PurgeTSSPackageJSON = JSON.parse(fs.readFileSync(path.resolve(projectRoot, './package.json'), 'utf8'))
  const PurgeTSSPackageVersion = `// PurgeTSS v${PurgeTSSPackageJSON.version}\n`

  fs.writeFileSync(path.resolve(projectRoot, './dist/purgetss.ui.js'), PurgeTSSPackageVersion + fs.readFileSync(PurgeTSSModule, 'utf8'), err => {
    throw err
  })

  logger.file('./dist/purgetss.ui.js')
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildModule()
}
