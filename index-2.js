// index.js
const { init } = require('./src/core/init')
const { create } = require('./src/core/create')
const { shades } = require('./src/core/shades')
const { watchMode } = require('./src/core/watchMode')
const { colorModule } = require('./src/core/colorModule')
const { dependencies } = require('./src/core/dependencies')
const { purgeClasses } = require('./src/core/purgeClasses')
const { copyFonts, copyModulesLibrary } = require('./src/core/fonts')

const { buildFonts } = require('./src/build/buildFonts')
const { build, buildLegacy } = require('./src/build/buildTailwind')

module.exports = {
  init,
  build,
  create,
  shades,
  copyFonts,
  watchMode,
  buildFonts,
  buildLegacy,
  colorModule,
  dependencies,
  purgeClasses,
  copyModulesLibrary
}
