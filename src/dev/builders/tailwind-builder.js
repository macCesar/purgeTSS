/**
 * PurgeTSS v7.1 - Tailwind Builder (Development)
 * 
 * Builds Tailwind CSS files for development/distribution using auto-generation.
 * COPIED from lib/build-tailwind.js - NO CHANGES to logic.
 * 
 * Generates: ./dist/tailwind.tss
 * 
 * @since 7.1.0 (refactored from lib/)
 * @author César Estrada
 */

import { autoBuildTailwindTSS } from '../../../experimental/completions2.js'

/**
 * Main builder function
 * COPIED exactly from original constructor() function
 */
export function buildTailwind() {
  autoBuildTailwindTSS()
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildTailwind()
}