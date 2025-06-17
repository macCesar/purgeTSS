/**
 * PurgeTSS v7.1 - Build Command
 *
 * CLI command for building Tailwind CSS and FontAwesome files.
 * COPIED from src/index.js during refactorization - NO CHANGES to logic.
 *
 * @fileoverview Build command
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-06-15
 */

import { alloyProject } from '../../shared/utils.js'
import { initIfNotConfig } from '../utils/file-operations.js'
import { buildTailwindBasedOnConfigOptions, buildTailwindLegacy } from '../../core/builders/tailwind-builder.js'
import { createDefinitionsFile } from './init.js'

// Import FontAwesome functions from their new modular location
import { buildFontAwesome, buildFontAwesomeJS } from '../../dev/builders/fontawesome-builder.js'

/**
 * Build command - generates all CSS files from Tailwind and icon libraries
 * COPIED exactly from original build() function
 * TODO: Need to COPY/IMPORT all building functions from core modules
 *
 * @param {Object} options - Command options
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
 * COPIED exactly from original buildLegacy() function
 * TODO: Need to COPY/IMPORT all building functions from core modules
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
