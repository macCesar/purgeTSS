/**
 * PurgeTSS v7.1.0 - Library Entry Point
 *
 * This file serves as the main entry point when PurgeTSS is used as a library.
 * For CLI usage, use the `purgetss` command directly.
 *
 * @fileoverview Library entry point for programmatic usage
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-17
 */

// Export only the most commonly used functions for programmatic usage
export { build } from './cli/commands/build.js'
export { purgeClasses } from './cli/commands/purge.js'
export { buildFonts } from './cli/commands/fonts.js'
export { shades } from './cli/commands/shades.js'

// Export utilities that might be useful for external tools
export { colores } from './shared/brand-colors.js'
export * as helpers from './shared/helpers.js'
export { configFile, configOptions } from './shared/config-manager.js'
