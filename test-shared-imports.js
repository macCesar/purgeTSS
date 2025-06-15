/**
 * Test imports for shared modules
 */

import { logger } from './src/shared/logger.js'
import { getConfigFile } from './src/shared/config-manager.js'
import { alloyProject } from './src/shared/utils.js'
import {
  projectsLibFolder,
  projectsPurgeTSSFolder,
  PurgeTSSPackageJSON
} from './src/shared/constants.js'

console.log('Testing shared modules import...')
console.log('✅ Logger imported:', typeof logger)
console.log('✅ Config manager imported:', typeof getConfigFile)
console.log('✅ Utils imported:', typeof alloyProject)
console.log('✅ Constants imported:', typeof projectsLibFolder)
console.log('✅ Package info:', PurgeTSSPackageJSON.name, PurgeTSSPackageJSON.version)
console.log('All imports successful!')
