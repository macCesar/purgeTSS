const fs = require('fs')
const cwd = process.cwd()
const path = require('path')

const projectsLibFolder = cwd + '/app/lib'
const classicProjectLibFolder = cwd + '/Resources/lib'
const projectsAppTSS = cwd + '/app/styles/app.tss'
const projectsUnderscoreAppTSS = cwd + '/app/styles/_app.tss'
const projectsAlloyJMKFile = cwd + '/app/alloy.jmk'
const projectsFontsFolder = cwd + '/app/assets/fonts'
const projectsFontAwesomeJS = cwd + '/app/lib/fontawesome.js'

const projectsPurgeTSSFolder = cwd + '/purgetss'
const projectsConfigJS = cwd + '/purgetss/config.js'
const projectsTailwindTSS = cwd + '/purgetss/styles/tailwind.tss'
const projectsPurgeTSSFontsFolder = cwd + '/purgetss/fonts'
const projectsPurgeTSSStylesFolder = cwd + '/purgetss/styles'
const projectsFATSSFile = cwd + '/purgetss/styles/fontawesome.tss'

// js icon modules
const srcLibFA = path.resolve(__dirname, './dist/fontawesome.js')
const srcLibMI = path.resolve(__dirname, './dist/materialicons.js')
const srcLibMS = path.resolve(__dirname, './dist/materialsymbols.js')
const srcLibF7 = path.resolve(__dirname, './dist/framework7icons.js')
const srcPurgeTSSLibrary = path.resolve(__dirname, './dist/purgetss.ui.js')

//
const srcTailwindTSS = path.resolve(__dirname, './dist/tailwind.tss')
//

// PRO
const srcFAProCSS = cwd + '/node_modules/@fortawesome/fontawesome-pro/css/all.css'
const srcFAProWebFontsFolder = cwd + '/node_modules/@fortawesome/fontawesome-pro/webfonts/'
// Alternate location
const srcFAProCSSAlt = cwd + '/app/lib/node_modules/@fortawesome/fontawesome-pro/css/all.css'
const srcFAProWebFontsFolderAlt = cwd + '/app/lib/node_modules/@fortawesome/fontawesome-pro/webfonts/'

const srcFAProResetTSSFile = './lib/templates/fontawesome/pro-reset.tss'
const srcFAProTemplateTSSFile = './lib/templates/fontawesome/pro-template.tss'
const srcFAProFontFamilies = {
  'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
  'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
  'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
  'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
  'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf'
}

// BETA
const srcFABetaCSSFile = cwd + '/purgetss/fontawesome-beta/css/all.css'
const srcFABetaWebFontsFolder = cwd + '/purgetss/fontawesome-beta/webfonts/'
const srcFABetaResetTSS = './lib/templates/fontawesome/beta-reset.tss'
const srcFABetaTemplateTSS = './lib/templates/fontawesome/beta-template.tss'
const srcFABetaFontFamilies = {
  'fa-thin-100.ttf': 'FontAwesome6Pro-Thin.ttf',
  'fa-light-300.ttf': 'FontAwesome6Pro-Light.ttf',
  'fa-brands-400.ttf': 'FontAwesome6Brands-Regular.ttf',
  'fa-regular-400.ttf': 'FontAwesome6Pro-Regular.ttf',
  'fa-solid-900.ttf': 'FontAwesome6Pro-Solid.ttf'
}
//
const srcFontsFolder = path.resolve(__dirname, './assets/fonts')
const srcResetTSSFile = path.resolve(__dirname, './dist/reset.tss')
const PurgeTSSPackageJSON = JSON.parse(fs.readFileSync(path.resolve(__dirname, './package.json'), 'utf8'))

const srcFontAwesomeTSSFile = path.resolve(__dirname, './dist/fontawesome.tss')
const srcFramework7FontTSSFile = path.resolve(__dirname, './dist/framework7icons.tss')
const srcMaterialIconsTSSFile = path.resolve(__dirname, './dist/materialicons.tss')
const srcMaterialSymbolsTSSFile = path.resolve(__dirname, './dist/materialsymbols.tss')

const srcConfigFile = path.resolve(__dirname, './lib/templates/purgetss.config.js')

const configFile = (fs.existsSync(projectsConfigJS)) ? require(projectsConfigJS) : require(srcConfigFile)
configFile.purge = configFile.purge ?? { mode: 'all', method: 'sync' }
configFile.purge.method = configFile.purge.method ?? 'sync'
configFile.theme.extend = configFile.theme.extend ?? {}

const configOptions = (configFile.purge && configFile.purge.options) ? configFile.purge.options : {}
if (configOptions) {
  configOptions.legacy = configOptions.legacy ?? false
  configOptions.widgets = configOptions.widgets ?? false
  configOptions.missing = configOptions.missing ?? true
  configOptions.plugins = configOptions.plugins ?? []
}

let methodCommand
let oppositeCommand
if (configFile.purge.method === 'sync' || configFile.purge.method === '') {
  oppositeCommand = "require('child_process').exec('purgetss"
  methodCommand = "\trequire('child_process').execSync('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));"
} else {
  oppositeCommand = "require('child_process').execSync('purgetss"
  methodCommand = "\trequire('child_process').exec('purgetss', logger.warn('::PurgeTSS:: Auto-Purging ' + event.dir.project));"
}
const srcJMKFile = path.resolve(__dirname, './lib/templates/alloy.jmk')

module.exports = {
  projectsLibFolder,
  classicProjectLibFolder,
  projectsAppTSS,
  projectsUnderscoreAppTSS,
  projectsAlloyJMKFile,
  projectsFontsFolder,
  projectsFontAwesomeJS,
  projectsPurgeTSSFolder,
  projectsConfigJS,
  projectsTailwindTSS,
  projectsPurgeTSSFontsFolder,
  projectsPurgeTSSStylesFolder,
  projectsFATSSFile,
  srcLibFA,
  srcLibMI,
  srcLibMS,
  srcLibF7,
  srcPurgeTSSLibrary,
  srcTailwindTSS,
  srcFAProCSS,
  srcFAProWebFontsFolder,
  srcFAProCSSAlt,
  srcFAProWebFontsFolderAlt,
  srcFAProResetTSSFile,
  srcFAProTemplateTSSFile,
  srcFAProFontFamilies,
  srcFABetaCSSFile,
  srcFABetaWebFontsFolder,
  srcFABetaResetTSS,
  srcFABetaTemplateTSS,
  srcFABetaFontFamilies,
  srcFontsFolder,
  srcResetTSSFile,
  PurgeTSSPackageJSON,
  srcFontAwesomeTSSFile,
  srcFramework7FontTSSFile,
  srcMaterialIconsTSSFile,
  srcMaterialSymbolsTSSFile,
  oppositeCommand,
  methodCommand,
  srcJMKFile
}
