/* eslint-disable camelcase, semi */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chalk from 'chalk'
import _ from 'lodash'

import { logger } from '../../shared/logger.js'
import {
  makeSureFolderExists,
  alloyProject,
  classicProject
} from '../utils/project-detection.js'

// Get current directory info
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../../')
const cwd = process.cwd()

// Folder paths
const projectsFontsFolder = `${cwd}/app/assets/fonts`
const projectsLibFolder = `${cwd}/app/lib`
const classicProjectLibFolder = `${cwd}/Resources/lib`
const projectsPurgeTSSFolder = `${cwd}/purgetss`
// eslint-disable-next-line camelcase
const projectsPurge_TSS_Styles_Folder = `${cwd}/purgetss/styles`

// Source paths
// eslint-disable-next-line camelcase
const srcFonts_Folder = path.resolve(projectRoot, './assets/fonts')
const srcLibFA = path.resolve(projectRoot, './dist/fontawesome.js')
const srcLibMI = path.resolve(projectRoot, './dist/materialicons.js')
const srcLibMS = path.resolve(projectRoot, './dist/materialsymbols.js')
const srcLibF7 = path.resolve(projectRoot, './dist/framework7icons.js')

// Font Awesome paths
// eslint-disable-next-line camelcase
const srcFA_Beta_CSSFile = `${cwd}/purgetss/fontawesome-beta/css/all.css`
// eslint-disable-next-line camelcase
const srcFA_Pro_CSS = `${cwd}/node_modules/@fortawesome/fontawesome-pro/css/all.css`
// eslint-disable-next-line camelcase
const srcFA_Beta_Web_Fonts_Folder = `${cwd}/purgetss/fontawesome-beta/webfonts/`
// eslint-disable-next-line camelcase
const srcFA_Pro_Web_Fonts_Folder = `${cwd}/node_modules/@fortawesome/fontawesome-pro/webfonts/`

// eslint-disable-next-line camelcase
const srcFA_ProFontFamilies = {
  'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
  'fa-brands-400.woff2': 'FontAwesome6Brands-Regular.woff2',
  'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
  'fa-regular-400.woff2': 'FontAwesome6Pro-Regular.woff2',
  'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf',
  'fa-solid-900.woff2': 'FontAwesome6Pro-Solid.woff2'
}

// eslint-disable-next-line camelcase
const srcFA_Beta_FontFamilies = {
  'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
  'fa-brands-400.woff2': 'FontAwesome6Brands-Regular.woff2',
  'fa-regular-400.ttf': 'FontAwesome6Beta-Regular.ttf',
  'fa-regular-400.woff2': 'FontAwesome6Beta-Regular.woff2',
  'fa-solid-900.ttf': 'FontAwesome6Beta-Solid.ttf',
  'fa-solid-900.woff2': 'FontAwesome6Beta-Solid.woff2'
}

// TSS file paths
const srcFontAwesomeTSSFile = path.resolve(projectRoot, './dist/fontawesome.tss')
const srcFramework7FontTSSFile = path.resolve(projectRoot, './dist/framework7icons.tss')
const srcMaterialIconsTSSFile = path.resolve(projectRoot, './dist/materialicons.tss')
const srcMaterialSymbolsTSSFile = path.resolve(projectRoot, './dist/materialsymbols.tss')

/**
 * Callback function for file operations
 * @param {Error} err - Error object if operation failed
 */
function callback(err) {
  if (err) throw err;
}

/**
 * Copy a file from source to destination in fonts folder
 * @param {string} src - Source file path
 * @param {string} dest - Destination filename
 * @returns {boolean} - True if file exists and was copied
 */
function copyFile(src, dest) {
  if (fs.existsSync(src)) {
    fs.copyFile(src, `${projectsFontsFolder}/${dest}`, callback);
    return true;
  }
  return false;
}

/**
 * Copy Font Awesome Free fonts to project
 */
function copyFreeFonts() {
  fs.copyFile(srcFonts_Folder + '/FontAwesome6Brands-Regular.ttf', projectsFontsFolder + '/FontAwesome6Brands-Regular.ttf', callback);
  fs.copyFile(srcFonts_Folder + '/FontAwesome6Free-Regular.ttf', projectsFontsFolder + '/FontAwesome6Free-Regular.ttf', callback);
  fs.copyFile(srcFonts_Folder + '/FontAwesome6Free-Solid.ttf', projectsFontsFolder + '/FontAwesome6Free-Solid.ttf', callback);

  logger.warn(' - Font Awesome Free');
}

/**
 * Copy Font Awesome Pro fonts to project
 * @param {Object} fontFamilies - Mapping of source to destination font names
 * @param {string} webFonts - Path to web fonts folder
 */
function copyProFonts(fontFamilies, webFonts) {
  _.each(fontFamilies, (dest, src) => {
    if (copyFile(`${webFonts}/${src}`, dest)) {
      logger.warn(` - ${dest} Font copied to`, chalk.yellow('./app/assets/fonts'), 'folder');
    }
  });
}

/**
 * Copy Material Icons fonts to project
 */
function copyMaterialIconsFonts() {
  // Material Icons Font
  const fontFamilies = [
    'MaterialIcons-Regular.ttf',
    'MaterialIconsOutlined-Regular.otf',
    'MaterialIconsRound-Regular.otf',
    'MaterialIconsSharp-Regular.otf',
    'MaterialIconsTwoTone-Regular.otf'
  ];

  _.each(fontFamilies, familyName => {
    copyFile(`${srcFonts_Folder}/${familyName}`, familyName);
  });

  logger.warn(' - Material Icons');
}

/**
 * Copy Material Symbols fonts to project
 */
function copyMaterialSymbolsFonts() {
  // Material Symbols Icons Font
  const fontFamilies = [
    'MaterialSymbolsOutlined-Regular.ttf',
    'MaterialSymbolsRounded-Regular.ttf',
    'MaterialSymbolsSharp-Regular.ttf'
  ];

  _.each(fontFamilies, familyName => {
    copyFile(`${srcFonts_Folder}/${familyName}`, familyName);
  });

  logger.warn(' - Material Symbols');
}

/**
 * Copy Framework7 Icons font to project
 */
function copyFramework7IconsFonts() {
  // Framework7 Font
  copyFile(srcFonts_Folder + '/Framework7-Icons.ttf', 'Framework7-Icons.ttf');
  logger.warn(' - Framework 7');
}

/**
 * Build Font Awesome JS module (imported from fonts.js)
 * This is a placeholder - actual implementation should be imported from fonts module
 */
function buildFontAwesomeJS() {
  // This function should be imported from the fonts module
  // For now, just log that it would be called
  logger.warn(' - Font Awesome JS module would be built');
}

/**
 * Copy font files based on vendor
 * @param {string} vendor - Font vendor (fa, mi, ms, f7)
 */
function copyFont(vendor) {
  makeSureFolderExists(projectsFontsFolder);

  switch (vendor) {
    case 'fa':
    case 'fontawesome':
      if (fs.existsSync(srcFA_Beta_CSSFile)) {
        copyProFonts(srcFA_Beta_FontFamilies, srcFA_Beta_Web_Fonts_Folder);
      } else if (fs.existsSync(srcFA_Pro_CSS)) {
        copyProFonts(srcFA_ProFontFamilies, srcFA_Pro_Web_Fonts_Folder);
      } else {
        copyFreeFonts();
      }
      break;
    case 'mi':
    case 'materialicons':
      copyMaterialIconsFonts();
      break;
    case 'ms':
    case 'materialsymbol':
      copyMaterialSymbolsFonts();
      break;
    case 'f7':
    case 'framework7':
      copyFramework7IconsFonts();
      break;
  }
}

/**
 * Copy font library modules based on vendor
 * @param {string} vendor - Font vendor (fa, mi, ms, f7)
 */
function copyFontLibrary(vendor) {
  switch (vendor) {
    case 'fa':
    case 'fontawesome':
      if (fs.existsSync(srcFA_Beta_CSSFile) || fs.existsSync(srcFA_Pro_CSS)) {
        buildFontAwesomeJS();
      } else {
        fs.copyFileSync(srcLibFA, projectsLibFolder + '/fontawesome.js');
        logger.warn(' - fontawesome.js');
      }
      break;
    case 'mi':
    case 'materialicons':
      fs.copyFileSync(srcLibMI, projectsLibFolder + '/materialicons.js');
      logger.warn(' - materialicons.js');
      break;
    case 'ms':
    case 'materialsymbol':
      fs.copyFileSync(srcLibMS, projectsLibFolder + '/materialsymbols.js');
      logger.warn(' - materialsymbols.js');
      break;
    case 'f7':
    case 'framework7':
      fs.copyFileSync(srcLibF7, projectsLibFolder + '/framework7icons.js');
      logger.warn(' - framework7icons.js');
      break;
  }
}

/**
 * Copy font style files based on vendor
 * @param {string} vendor - Font vendor (fa, mi, ms, f7)
 */
function copyFontStyle(vendor) {
  switch (vendor) {
    case 'fa':
    case 'fontawesome':
      if (fs.existsSync(srcFA_Beta_CSSFile) || fs.existsSync(srcFA_Pro_CSS)) {
        buildFontAwesomeJS();
      } else {
        fs.copyFileSync(srcFontAwesomeTSSFile, projectsPurge_TSS_Styles_Folder + '/fontawesome.tss')
        logger.warn(' - fontawesome.tss')
      }
      break
    case 'mi':
    case 'materialicons':
      fs.copyFileSync(srcMaterialIconsTSSFile, projectsPurge_TSS_Styles_Folder + '/materialicons.tss')
      logger.warn(' - materialicons.tss')
      break
    case 'ms':
    case 'materialsymbol':
      fs.copyFileSync(srcMaterialSymbolsTSSFile, projectsPurge_TSS_Styles_Folder + '/materialsymbols.tss')
      logger.warn(' - materialsymbols.tss')
      break
    case 'f7':
    case 'framework7':
      fs.copyFileSync(srcFramework7FontTSSFile, projectsPurge_TSS_Styles_Folder + '/framework7icons.tss')
      logger.warn(' - framework7icons.tss')
      break;
  }
}

/**
 * Copy font libraries to project lib folder
 * @param {Object} options - Command options
 */
function copyFontLibraries(options) {
  if (alloyProject()) {
    makeSureFolderExists(projectsLibFolder);

    if (options.vendor && typeof options.vendor === 'string') {
      const selected = _.uniq(options.vendor.replace(/ /g, '').split(','));
      _.each(selected, vendor => {
        copyFontLibrary(vendor);
      });
    } else {
      copyFontLibrary('fa');
      copyFontLibrary('mi');
      copyFontLibrary('ms');
      copyFontLibrary('f7');
    }
  }
}

/**
 * Copy font styles to project styles folder
 * @param {Object} options - Command options
 */
function copyFontStyles(options) {
  if (alloyProject()) {
    makeSureFolderExists(projectsPurgeTSSFolder);
    makeSureFolderExists(projectsPurge_TSS_Styles_Folder);

    if (options.vendor && typeof options.vendor === 'string') {
      const selected = _.uniq(options.vendor.replace(/ /g, '').split(','));
      _.each(selected, vendor => {
        copyFontStyle(vendor);
      });
    } else {
      copyFontStyle('fa');
      copyFontStyle('mi');
      copyFontStyle('ms');
      copyFontStyle('f7');
    }
  }
}

/**
 * Main command: Copy icon fonts to project
 * @param {Object} options - Command options
 * @param {string} options.vendor - Specific vendors to copy (comma-separated)
 * @param {boolean} options.module - Copy corresponding JS modules
 * @param {boolean} options.styles - Copy corresponding TSS styles
 * @returns {Promise<boolean>} - Success status
 */
export async function copyFonts(options = {}) {
  try {
    if (!alloyProject()) {
      return false;
    }

    makeSureFolderExists(projectsFontsFolder);

    if (options.vendor && typeof options.vendor === 'string') {
      const selected = _.uniq(options.vendor.replace(/ /g, '').split(','));
      logger.info('Copying Icon Fonts...');
      _.each(selected, vendor => {
        copyFont(vendor);
      });
    } else {
      logger.info('Copying Fonts to', chalk.yellow('./app/assets/fonts'), 'folder');
      copyFont('fa');
      copyFont('mi');
      copyFont('ms');
      copyFont('f7');
    }

    if (options.module) {
      console.log();
      logger.info('Copying Modules to', chalk.yellow('./app/lib'), 'folder');
      copyFontLibraries(options);
    }

    if (options.styles) {
      console.log();
      logger.info('Copying Styles to', chalk.yellow('./purgetss/styles'), 'folder');
      copyFontStyles(options);
    }

    return true;
  } catch (error) {
    logger.error('Error in copyFonts:', error.message);
    return false;
  }
}

/**
 * Copy PurgeTSS UI module to project
 * @returns {Promise<boolean>} - Success status
 */
export async function copyModulesLibrary() {
  try {
    const srcPurgeTSSLibrary = path.resolve(projectRoot, './dist/purgetss.ui.js');

    if (alloyProject(true)) {
      makeSureFolderExists(projectsLibFolder);
      fs.copyFileSync(srcPurgeTSSLibrary, projectsLibFolder + '/purgetss.ui.js');
      logger.info(chalk.yellow('purgetss.ui'), 'module copied to', chalk.yellow('./app/lib'), 'folder');
      return true;
    } else if (classicProject(true)) {
      makeSureFolderExists(classicProjectLibFolder);
      fs.copyFileSync(srcPurgeTSSLibrary, classicProjectLibFolder + '/purgetss.ui.js');
      logger.info(chalk.yellow('purgetss.ui'), 'module copied to', chalk.yellow('./Resources/lib'), 'folder');
      return true;
    } else {
      logger.info(`Please make sure you are running ${chalk.green('purgetss')} within an Alloy or Classic Project.`);
      logger.info(`For more information, visit ${chalk.green('https://purgetss.com')}`);
      return false;
    }
  } catch (error) {
    logger.error('Error in copyModulesLibrary:', error.message);
    return false;
  }
}
