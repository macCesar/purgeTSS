import { GeneratorInputs } from '../utils/generator-inputs.js'

const inputs = new GeneratorInputs()
// Keep the published generation order; every stage (including font copies) finishes first.
for (const [file, method] of [
  ['module-builder', 'buildModule'],
  ['tailwind-builder', 'buildTailwind'],
  ['icon-builders/fontawesome-builder', 'buildFontAwesome'],
  ['icon-builders/fontawesome-js-builder', 'buildFontAwesomeJS'],
  ['icon-builders/material-icons-builder', 'buildMaterialIcons'],
  ['icon-builders/material-icons-js-builder', 'buildMaterialIconsJS'],
  ['icon-builders/material-symbols-builder', 'buildMaterialSymbols'],
  ['icon-builders/material-symbols-js-builder', 'buildMaterialSymbolsJS'],
  ['icon-builders/framework7-builder', 'buildFramework7Icons'],
  ['icon-builders/framework7-js-builder', 'buildFramework7IconsJS'],
  ['fonts-folder-builder', 'buildFontsFolder']
]) {
  const builder = await import(`./${file}.js`)
  await builder[method](inputs)
}
