/* eslint-disable camelcase */
/**
 * PurgeTSS v7.1 - Constants and Paths
 *
 * All project paths, directories, and static constants used throughout PurgeTSS.
 * Extracted from src/index.js during refactorization.
 *
 * @fileoverview Central constants configuration
 * @version 7.1.0
 * @author César Estrada
 * @since 2025-07-15
 */

import path from 'path'
import fs from 'fs'

// Get current working directory
export const cwd = process.cwd()

// ============================================================================
// PROJECT PATHS - Alloy/Titanium Project Structure
// ============================================================================

// Alloy Project Folders
export const projectsLibFolder = `${cwd}/app/lib`
export const classicProjectLibFolder = `${cwd}/Resources/lib`
export const projectsAppTSS = `${cwd}/app/styles/app.tss`
export const projects_AppTSS = `${cwd}/app/styles/_app.tss`
export const projectsAlloyJMKFile = `${cwd}/app/alloy.jmk`
export const projectsFontsFolder = `${cwd}/app/assets/fonts`
export const projectsFontAwesomeJS = `${cwd}/app/lib/fontawesome.js`

// ============================================================================
// PURGETSS PATHS - PurgeTSS Output Structure
// ============================================================================

export const projectsPurgeTSSFolder = `${cwd}/purgetss`
export const projectsConfigJS = `${cwd}/purgetss/config.cjs`
export const projectsTailwind_TSS = `${cwd}/purgetss/styles/tailwind.tss`
export const projectsPurge_TSS_Fonts_Folder = `${cwd}/purgetss/fonts`
export const projectsPurge_TSS_Styles_Folder = `${cwd}/purgetss/styles`
export const projectsFA_TSS_File = `${cwd}/purgetss/styles/fontawesome.tss`

// ============================================================================
// SOURCE PATHS - PurgeTSS Module Sources
// ============================================================================

// Get project root (one level up from src/)
export const projectRoot = path.resolve(import.meta.url.replace('file://', '').replace('/src/shared/constants.js', ''))

// JavaScript Icon Modules (generated)
export const srcLibFA = path.resolve(projectRoot, './dist/fontawesome.js')
export const srcLibMI = path.resolve(projectRoot, './dist/materialicons.js')
export const srcLibMS = path.resolve(projectRoot, './dist/materialsymbols.js')
export const srcLibF7 = path.resolve(projectRoot, './dist/framework7icons.js')
export const srcPurgeTSSLibrary = path.resolve(projectRoot, './dist/purgetss.ui.js')

// TSS Files (generated)
export const srcTailwindTSS = path.resolve(projectRoot, './dist/tailwind.tss')
export const srcFontAwesomeTSSFile = path.resolve(projectRoot, './dist/fontawesome.tss')
export const srcFramework7FontTSSFile = path.resolve(projectRoot, './dist/framework7icons.tss')
export const srcMaterialIconsTSSFile = path.resolve(projectRoot, './dist/materialicons.tss')
export const srcMaterialSymbolsTSSFile = path.resolve(projectRoot, './dist/materialsymbols.tss')

// Templates and Assets
export const srcFonts_Folder = path.resolve(projectRoot, './assets/fonts')
export const srcReset_TSS_File = path.resolve(projectRoot, './dist/reset.tss')
export const srcConfigFile = path.resolve(projectRoot, './lib/templates/purgetss.config.js.cjs')

// ============================================================================
// FONTAWESOME PRO PATHS
// ============================================================================

// Pro - Primary locations
export const srcFA_Pro_CSS = `${cwd}/node_modules/@fortawesome/fontawesome-pro/css/all.css`
export const srcFA_Pro_Web_Fonts_Folder = `${cwd}/node_modules/@fortawesome/fontawesome-pro/webfonts/`

// Pro - Alternate locations (fallback)
export const srcFA_Pro_CSS_Alt = `${cwd}/app/lib/node_modules/@fortawesome/fontawesome-pro/css/all.css`
export const srcFA_Pro_Web_Fonts_Folder_Alt = `${cwd}/app/lib/node_modules/@fortawesome/fontawesome-pro/webfonts/`

// Pro - Templates and Reset Files
export const srcFA_ProReset_TSS_File = './lib/templates/fontawesome/pro-reset.tss'
export const srcFA_ProTemplateTSS_File = './lib/templates/fontawesome/pro-template.tss'

// Pro - Font Family Mappings
export const srcFA_ProFontFamilies = {
  'fa-thin-100.ttf': 'FontAwesome7Pro-Thin.ttf',
  'fa-light-300.ttf': 'FontAwesome7Pro-Light.ttf',
  'fa-brands-400.ttf': 'FontAwesome7Brands-Regular.ttf',
  'fa-regular-400.ttf': 'FontAwesome7Pro-Regular.ttf',
  'fa-solid-900.ttf': 'FontAwesome7Pro-Solid.ttf'
}

// ============================================================================
// FONTAWESOME BETA PATHS
// ============================================================================

export const srcFA_Beta_CSSFile = `${cwd}/purgetss/fontawesome-beta/css/all.css`
export const srcFA_Beta_Web_Fonts_Folder = `${cwd}/purgetss/fontawesome-beta/webfonts/`
export const srcFA_Beta_ResetTSS = './lib/templates/fontawesome/beta-reset.tss'
export const srcFA_Beta_TemplateTSS = './lib/templates/fontawesome/beta-template.tss'

// Beta - Font Family Mappings
export const srcFA_Beta_FontFamilies = {
  'fa-thin-100.ttf': 'FontAwesome7Pro-Thin.ttf',
  'fa-light-300.ttf': 'FontAwesome7Pro-Light.ttf',
  'fa-brands-400.ttf': 'FontAwesome7Brands-Regular.ttf',
  'fa-regular-400.ttf': 'FontAwesome7Pro-Regular.ttf',
  'fa-solid-900.ttf': 'FontAwesome7Pro-Solid.ttf'
}

// ============================================================================
// PACKAGE INFORMATION
// ============================================================================

// Load package.json for version info and metadata
export const PurgeTSSPackageJSON = JSON.parse(
  fs.readFileSync(path.resolve(projectRoot, './package.json'), 'utf8')
)

// ============================================================================
// CONFIGURATION DEFAULTS
// ============================================================================

// Default configuration that will be loaded dynamically
export const defaultConfigPaths = {
  main: projectsConfigJS,
  template: srcConfigFile
}

// ============================================================================
// EXPORT GROUPS FOR CONVENIENCE
// ============================================================================

// Project structure paths
export const projectPaths = {
  lib: projectsLibFolder,
  classicLib: classicProjectLibFolder,
  appTSS: projectsAppTSS,
  _appTSS: projects_AppTSS,
  alloyJMK: projectsAlloyJMKFile,
  fonts: projectsFontsFolder,
  fontAwesomeJS: projectsFontAwesomeJS
}

// PurgeTSS output paths
export const purgePaths = {
  folder: projectsPurgeTSSFolder,
  config: projectsConfigJS,
  tailwindTSS: projectsTailwind_TSS,
  fontsFolder: projectsPurge_TSS_Fonts_Folder,
  stylesFolder: projectsPurge_TSS_Styles_Folder,
  fontAwesomeTSS: projectsFA_TSS_File
}

// Source module paths
export const sourcePaths = {
  root: projectRoot,
  fonts: srcFonts_Folder,
  reset: srcReset_TSS_File,
  config: srcConfigFile,
  libs: {
    fontAwesome: srcLibFA,
    materialIcons: srcLibMI,
    materialSymbols: srcLibMS,
    framework7: srcLibF7,
    purgeTSS: srcPurgeTSSLibrary
  },
  tssFiles: {
    tailwind: srcTailwindTSS,
    fontAwesome: srcFontAwesomeTSSFile,
    framework7: srcFramework7FontTSSFile,
    materialIcons: srcMaterialIconsTSSFile,
    materialSymbols: srcMaterialSymbolsTSSFile
  }
}

// FontAwesome Pro paths
export const fontAwesomeProPaths = {
  css: srcFA_Pro_CSS,
  cssAlt: srcFA_Pro_CSS_Alt,
  fonts: srcFA_Pro_Web_Fonts_Folder,
  fontsAlt: srcFA_Pro_Web_Fonts_Folder_Alt,
  reset: srcFA_ProReset_TSS_File,
  template: srcFA_ProTemplateTSS_File,
  fontFamilies: srcFA_ProFontFamilies
}

// FontAwesome Beta paths
export const fontAwesomeBetaPaths = {
  css: srcFA_Beta_CSSFile,
  fonts: srcFA_Beta_Web_Fonts_Folder,
  reset: srcFA_Beta_ResetTSS,
  template: srcFA_Beta_TemplateTSS,
  fontFamilies: srcFA_Beta_FontFamilies
}
