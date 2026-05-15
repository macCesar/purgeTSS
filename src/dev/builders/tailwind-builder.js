/**
 * PurgeTSS - Utilities Builder (Development entry point)
 *
 * Thin CLI wrapper invoked by the `build:tailwind` npm script.
 * Generates: ./dist/utilities.tss
 *
 * @author César Estrada
 */

import { autoBuildUtilitiesTSS } from '../../core/builders/auto-utilities-builder.js'

export function buildTailwind() {
  autoBuildUtilitiesTSS()
}

if (import.meta.url === `file://${process.argv[1]}`) {
  buildTailwind()
}
