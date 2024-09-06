// index.js
const { purgeClasses } = require('./src/core/purgeClasses')
const { init } = require('./src/core/init')
const { watchMode } = require('./src/core/watchMode')
const { copyFonts, copyFontLibraries } = require('./src/core/fonts')
const { create } = require('./src/core/create')
const { shades } = require('./src/core/shades')
const { dependencies } = require('./src/core/dependencies')
const { build, buildLegacy } = require('./src/build/buildTailwind')
const { buildFonts } = require('./src/build/buildFonts')
const { colorModule } = require('./src/core/colorModule')

module.exports = {
  purgeClasses,
  init,
  watchMode,
  copyFonts,
  copyFontLibraries,
  create,
  shades,
  dependencies,
  build,
  buildLegacy,
  buildFonts,
  colorModule
}
