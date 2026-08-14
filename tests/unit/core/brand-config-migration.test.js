/**
 * Tests for keeping purgetss/config.cjs current:
 *   - which `brand:` shapes are recognized as migratable (and which must not be)
 *   - values customized away from the defaults survive the rewrite
 *   - the rendered block parses, and its values match the piece table
 *   - the shipped template and the generator stay in sync
 */

import fs from 'fs'
import os from 'os'
import path from 'path'
import assert from 'assert'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'

import { needsBrandMigration, translateBrandSection, migrateBrandSection } from '../../../src/core/branding/migrate-brand-section.js'
import { renderBrandBlock } from '../../../src/core/branding/render-brand-block.js'
import { findSectionRange } from '../../../src/shared/config-writer.js'
import { BRAND_PIECES } from '../../../src/core/branding/pieces.js'
import { resolvePieces } from '../../../src/core/branding/brand-config.js'

const require = createRequire(import.meta.url)
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..')

const GROUPED = {
  logos: { primary: './art/logo.svg', androidLauncher: './art/icon.svg', monochrome: './art/mono.svg', androidSplash: './art/splash.svg' },
  padding: { ios: '7%', androidLegacy: '10%', androidAdaptive: '22%', featureGraphic: '12%' },
  android: { splash: true, notification: false, legacySplash: true },
  ios: { dark: false, tinted: true, darkBackground: '#1C1C1E' },
  colors: { background: '#0B1326' },
  confirmOverwrites: false
}

const FLAT = { padding: 15, iosPadding: 7, bgColor: '#123456', darkBgColor: '#000011', splash: true, notification: true }

const CURRENT = { background: '#FFFFFF', confirmOverwrites: true, icon: { padding: '4%' }, splashIcon: { enabled: false } }

/** Parse a rendered block by writing a throwaway module and requiring it. */
function parseBlock(block) {
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-')), 'config.cjs')
  fs.writeFileSync(file, `module.exports = {\n${block}\n}\n`, 'utf8')
  const parsed = require(file)
  fs.rmSync(path.dirname(file), { recursive: true, force: true })
  return parsed.brand
}

try {
  // ---- What is migratable ------------------------------------------------

  assert.strictEqual(needsBrandMigration(GROUPED), true, 'the 7.7.0 grouped shape migrates')
  assert.strictEqual(needsBrandMigration(FLAT), true, 'the flat pre-7.7.0 shape migrates')
  assert.strictEqual(needsBrandMigration(CURRENT), false, 'a current block is left alone')
  assert.strictEqual(needsBrandMigration({}), false)
  assert.strictEqual(needsBrandMigration(undefined), false)

  // A typo is not an old structure. Rewriting the block would drop it silently,
  // so it must fall through to the validator instead.
  assert.strictEqual(needsBrandMigration({ adaptive: { paddig: '22%' } }), false, 'a typo inside a piece is not migratable')
  assert.strictEqual(needsBrandMigration({ nonsense: 1 }), false, 'an unknown top-level key is not migratable')
  assert.strictEqual(needsBrandMigration({ colors: { background: '#FFF' }, nonsense: 1 }), false,
    'legacy keys mixed with an unknown key stay put until the unknown one is fixed')

  // ---- Values survive the translation ------------------------------------

  {
    const { overrides, carried, dropped } = translateBrandSection(GROUPED)

    assert.strictEqual(overrides.background, '#0B1326')
    assert.strictEqual(overrides.confirmOverwrites, false)
    assert.strictEqual(overrides.logo, './art/logo.svg')
    assert.strictEqual(overrides.monochromeLogo, './art/mono.svg')
    assert.strictEqual(overrides.pieces.adaptive.logo, './art/icon.svg')
    assert.strictEqual(overrides.pieces.adaptive.padding, '22%')
    assert.strictEqual(overrides.pieces.icon.padding, '7%')
    assert.strictEqual(overrides.pieces.tinted.padding, '7%')
    assert.strictEqual(overrides.pieces.marketplace.padding, '7%')
    assert.strictEqual(overrides.pieces.dark.padding, '7%')
    assert.strictEqual(overrides.pieces.dark.background, '#1C1C1E')
    assert.strictEqual(overrides.pieces.dark.enabled, false)
    assert.strictEqual(overrides.pieces.splashIcon.enabled, true)
    assert.strictEqual(overrides.pieces.splashIcon.logo, './art/splash.svg')
    assert.strictEqual(overrides.pieces.androidSplash.logo, './art/splash.svg', 'the old logo-splash fed both splash pieces')

    // Values that already matched the default are not carried into the block.
    assert.strictEqual(overrides.pieces.legacyIcon, undefined, 'androidLegacy 10% is the default — nothing to write')
    assert.strictEqual(overrides.pieces.featureGraphic, undefined, 'featureGraphic 12% is the default')
    assert.strictEqual(overrides.pieces.tinted.enabled, undefined, 'tinted true is the default')
    assert.strictEqual(overrides.pieces.notificationIcon, undefined, 'notification false is the default')

    assert.ok(carried.some((line) => /brand\.colors\.background → brand\.background/.test(line)))
    assert.ok(dropped.some((line) => /legacySplash/.test(line)), 'the dropped key is reported, not hidden')
  }

  {
    const { overrides } = translateBrandSection(FLAT)
    assert.strictEqual(overrides.pieces.adaptive.padding, '15%')
    assert.strictEqual(overrides.pieces.legacyIcon.padding, '15%')
    assert.strictEqual(overrides.pieces.icon.padding, '7%')
    assert.strictEqual(overrides.background, '#123456')
    assert.strictEqual(overrides.pieces.dark.background, '#000011')
    assert.strictEqual(overrides.pieces.splashIcon.enabled, true)
    assert.strictEqual(overrides.pieces.notificationIcon.enabled, true)
  }

  // ---- The rendered block is valid JS and means what the table says -------

  {
    const brand = parseBlock(renderBrandBlock())
    const { pieces, selection } = resolvePieces(brand, {}, '/tmp/nowhere', '/tmp/nowhere')

    for (const piece of BRAND_PIECES) {
      assert.strictEqual(pieces[piece.name].padding, piece.defaultPadding,
        `the default block must resolve ${piece.name} to its built-in padding`)
    }
    assert.strictEqual(pieces.dark.background, null, 'dark stays transparent')
    assert.deepStrictEqual(
      selection,
      BRAND_PIECES.filter((p) => p.mode === 'default').map((p) => p.name),
      'the default block enables exactly the default pieces'
    )
  }

  {
    // A migrated block must resolve to the values it carried over.
    const { overrides } = translateBrandSection(GROUPED)
    const brand = parseBlock(renderBrandBlock(overrides))
    const { pieces, selection } = resolvePieces(brand, {}, '/tmp/nowhere', '/tmp/nowhere')

    assert.strictEqual(pieces.adaptive.padding, 22)
    assert.strictEqual(pieces.icon.padding, 7)
    assert.strictEqual(pieces.adaptive.background, '#0B1326')
    assert.ok(!selection.includes('dark'), 'ios.dark: false survived as dark.enabled: false')
    assert.ok(selection.includes('splash-icon'), 'android.splash: true survived as splashIcon.enabled: true')
  }

  // ---- End to end on a real file -----------------------------------------

  {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-brand-file-'))
    const file = path.join(dir, 'config.cjs')
    fs.writeFileSync(file, [
      'module.exports = {',
      '  purge: { mode: \'all\' },',
      '  brand: {',
      '    padding: { androidAdaptive: \'22%\', ios: \'7%\' },',
      '    android: { splash: true },',
      '    colors: { background: \'#0B1326\' }',
      '  },',
      '  theme: { extend: {} }',
      '}',
      ''
    ].join('\n'), 'utf8')

    assert.strictEqual(migrateBrandSection(file), true, 'an old file is rewritten')
    const after = require(file)
    assert.strictEqual(after.brand.adaptive.padding, '22%')
    assert.strictEqual(after.brand.icon.padding, '7%')
    assert.strictEqual(after.brand.background, '#0B1326')
    assert.strictEqual(after.brand.splashIcon.enabled, true)
    assert.strictEqual(after.brand.padding, undefined, 'the old group is gone from the file')
    assert.strictEqual(after.brand.colors, undefined)

    // Sections around it are untouched.
    const text = fs.readFileSync(file, 'utf8')
    assert.match(text, /purge: \{ mode: 'all' \}/)
    assert.match(text, /theme: \{ extend: \{\} \}/)

    assert.strictEqual(migrateBrandSection(file), false, 'running again is a no-op')
    fs.rmSync(dir, { recursive: true, force: true })
  }

  // ---- Brace balancing on a nested section --------------------------------

  {
    const source = [
      'module.exports = {',
      '  brand: {',
      '    padding: { ios: \'4%\' },',
      '    colors: { background: \'#FFF\' } // } not the end',
      '  },',
      '  images: { quality: 85 }',
      '}'
    ].join('\n')

    const range = findSectionRange(source, 'brand')
    assert.ok(range, 'the brand section is located')
    assert.strictEqual(source.slice(range.start, range.end).trimEnd().endsWith('},'), true)
    assert.match(source.slice(range.start, range.end), /colors/, 'the whole nested section is captured')
    assert.doesNotMatch(source.slice(range.start, range.end), /images/, 'and it stops before the next one')
  }

  // ---- The shipped template matches the generator --------------------------

  for (const relative of ['lib/templates/purgetss.config.js.cjs', 'test-project/purgetss/config.cjs']) {
    const text = fs.readFileSync(path.join(repoRoot, relative), 'utf8')
    const range = findSectionRange(text, 'brand')
    assert.ok(range, `${relative} has a brand: section`)
    assert.strictEqual(
      text.slice(range.start, range.end),
      renderBrandBlock({}, { indent: range.indent }).trimEnd(),
      `${relative} is out of sync with renderBrandBlock() — regenerate it`
    )
  }

  console.log('All brand config migration tests passed!')
} catch (error) {
  console.error('Brand config migration test failed:', error.message)
  process.exit(1)
}
