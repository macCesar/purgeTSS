/**
 * PurgeTSS v7.1.0 - CLI Command: build
 * Build command for generating CSS files from Tailwind and icon libraries
 *
 * @since 7.1.0
 * @author César Estrada
 */

import { alloyProject } from '../../shared/utils.js'

/**
 * Build command - generates all CSS files from Tailwind and icon libraries
 * This builds the complete library for the project
 *
 * @param {Object} options - CLI options
 * @returns {boolean} - Success status
 */
export function build(options) {
  if (alloyProject()) {
    initIfNotConfig()
    buildTailwindBasedOnConfigOptions(options)
    buildFontAwesome()
    buildFontAwesomeJS()
    createDefinitionsFile()
    return true
  }
  return false
}

/**
 * Build legacy command - generates CSS files using legacy Tailwind build
 * Used for older projects or when legacy mode is required
 *
 * @returns {void}
 */
export function buildLegacy() {
  if (alloyProject()) {
    initIfNotConfig()
    buildTailwindLegacy()
    buildFontAwesome()
    buildFontAwesomeJS()
    createDefinitionsFile()
  }
}

// TODO: These functions need to be imported from core modules when they're extracted
// For now, they will be available from the main index.js until core refactor is complete

// Placeholder imports - these will be replaced with proper imports once core modules are extracted
let initIfNotConfig, buildTailwindBasedOnConfigOptions, buildFontAwesome
let buildFontAwesomeJS, createDefinitionsFile, buildTailwindLegacy

/**
 * Initialize function references from main index
 * This is a temporary solution until core modules are extracted
 *
 * @param {Object} functions - Function references from main index
 */
export function initializeBuildFunctions(functions) {
  initIfNotConfig = functions.initIfNotConfig
  buildTailwindBasedOnConfigOptions = functions.buildTailwindBasedOnConfigOptions
  buildFontAwesome = functions.buildFontAwesome
  buildFontAwesomeJS = functions.buildFontAwesomeJS
  createDefinitionsFile = functions.createDefinitionsFile
  buildTailwindLegacy = functions.buildTailwindLegacy
}
