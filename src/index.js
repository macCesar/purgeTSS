/**
 * PurgeTSS v7.1.0 - Minimal Main Entry Point
 *
 * This is the new minimal index.js after refactoring and modularization.
 * Most functionality has been extracted to dedicated modules.
 *
 * @fileoverview Main entry point - minimal after v7.1 refactoring
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-16
 */

// Re-export shared utilities and configurations for backward compatibility
export { colores } from './shared/brand-colors.js'
export * as helpers from './shared/helpers.js'
export * from './shared/config-manager.js'
export * from './shared/utils.js'

// Re-export CLI commands for external usage (if needed)
export { build } from './cli/commands/build.js'
export { init } from './cli/commands/init.js'
export { create } from './cli/commands/create.js'
export { purgeClasses } from './cli/commands/purge.js'
export { watchMode } from './cli/commands/watch.js'
export { dependencies } from './cli/commands/dependencies.js'
export { shades, colorModule } from './cli/commands/shades.js'
export { copyFonts } from './cli/commands/icon-library.js'
export { copyModulesLibrary } from './cli/commands/module.js'
export { buildFonts } from './cli/commands/fonts.js'

// Re-export builders for development usage
export { buildFontAwesome, buildFontAwesomeJS } from './dev/builders/fontawesome-builder.js'

// Re-export experimental features
export { autoBuildTailwindTSS } from '../experimental/completions2.js'

// Legacy exports for backward compatibility (these may be removed in future versions)
export { combineAllValues, getBaseValues } from './core/builders/tailwind-helpers.js'
export { createDefinitionsFile } from './cli/commands/init.js'
