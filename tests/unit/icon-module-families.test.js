/**
 * Public font-family aliases exposed by the generated icon modules.
 *
 * These modules are copied verbatim to app/lib (Alloy) or Resources/lib
 * (Classic), so this asserts the API that Titanium applications consume.
 */

import assert from 'assert'
import fs from 'fs'
import path from 'path'
import vm from 'vm'
import { fileURLToPath } from 'url'

const distFolder = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'dist')

function loadCommonJSModule(filename) {
  const module = { exports: {} }
  vm.runInNewContext(fs.readFileSync(path.join(distFolder, filename), 'utf8'), {
    console,
    module,
    exports: module.exports
  })
  return module.exports
}

const fontAwesome = loadCommonJSModule('fontawesome.js')
const materialIcons = loadCommonJSModule('materialicons.js')
const materialSymbols = loadCommonJSModule('materialsymbols.js')
const framework7 = loadCommonJSModule('framework7icons.js')

assert.strictEqual(fontAwesome.solid, 'FontAwesome7Free-Solid')
assert.strictEqual(fontAwesome.regular, 'FontAwesome7Free-Regular')
assert.strictEqual(fontAwesome.brands, 'FontAwesome7Brands-Regular')
assert.strictEqual(fontAwesome.families.default, fontAwesome.solid)

assert.strictEqual(materialIcons.regular, 'MaterialIcons-Regular')
assert.strictEqual(materialIcons.outlined, 'MaterialIconsOutlined-Regular')
assert.strictEqual(materialIcons.round, 'MaterialIconsRound-Regular')
assert.strictEqual(materialIcons.sharp, 'MaterialIconsSharp-Regular')
assert.strictEqual(materialIcons.twoTone, 'MaterialIconsTwoTone-Regular')
assert.strictEqual(materialIcons.families.default, materialIcons.regular)

assert.strictEqual(materialSymbols.outlined, 'MaterialSymbolsOutlined-Regular')
assert.strictEqual(materialSymbols.rounded, 'MaterialSymbolsRounded-Regular')
assert.strictEqual(materialSymbols.sharp, 'MaterialSymbolsSharp-Regular')
assert.strictEqual(materialSymbols.families.default, materialSymbols.outlined)

assert.strictEqual(framework7.fontFamily, 'Framework7-Icons')
assert.strictEqual(framework7.families.default, framework7.fontFamily)

console.log('✅ Icon module font-family aliases are available')
