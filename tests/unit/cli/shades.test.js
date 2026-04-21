/**
 * Tests for the shades semantic helpers and the `semantic` command glue.
 * The helpers live in shades.js (single source of truth, reused by both
 * shades and semantic). The command-level orchestration lives in semantic.js
 * and is exercised via CLI E2E, not here.
 */

import assert from 'assert'

console.log('🧪 Testing shades.js semantic helpers...')

const {
  buildSemanticPalette,
  buildSingleSemantic,
  normalizeAlpha,
  stripFamilyKeys,
  detectFamilyShadeConflict,
  toCamelCase,
  wrapHexWithAlpha,
  missingHexMessage,
  shades
} = await import('../../../src/cli/commands/shades.js')

function makeFamily(name) {
  const numbers = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  return {
    name,
    hexcode: '#808080',
    shades: numbers.map(n => ({
      number: n,
      hexcode: `#${n.toString(16).padStart(2, '0').repeat(3)}`
    }))
  }
}

function assertMirrorByIndex() {
  const { semanticEntries } = buildSemanticPalette(makeFamily('Amazon'), 'amazon')
  assert.strictEqual(
    semanticEntries.amazon50.light,
    semanticEntries.amazon950.dark,
    'amazon50.light should equal amazon950.dark (mirror)'
  )
  assert.strictEqual(
    semanticEntries.amazon50.dark,
    semanticEntries.amazon950.light,
    'amazon50.dark should equal amazon950.light (mirror)'
  )
  assert.strictEqual(
    semanticEntries.amazon500.light,
    semanticEntries.amazon500.dark,
    'amazon500 is the anchor — light and dark identical'
  )
  console.log('   ✓ palette: mirror-by-index + anchor at 500')
}

function assertPaletteKeysAndMapping() {
  const { semanticEntries, configMapping } = buildSemanticPalette(makeFamily('Amazon Green'), 'amazon-green')
  const expected = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]
  for (const n of expected) {
    const key = `amazonGreen${n}`
    assert.ok(semanticEntries[key], `semanticEntries.${key} missing`)
    assert.strictEqual(configMapping[n], key)
  }
  assert.strictEqual(Object.keys(semanticEntries).length, 11)
  console.log('   ✓ palette: camelCase keys + 11-slot config mapping')
}

function assertToCamelCase() {
  assert.strictEqual(toCamelCase('amazon'), 'amazon')
  assert.strictEqual(toCamelCase('amazon-green'), 'amazonGreen')
  assert.strictEqual(toCamelCase('surface-high-color'), 'surfaceHighColor')
  console.log('   ✓ toCamelCase handles single/multi-word names')
}

function assertNormalizeAlpha() {
  assert.strictEqual(normalizeAlpha(undefined), undefined)
  assert.strictEqual(normalizeAlpha(''), undefined)
  assert.strictEqual(normalizeAlpha('50'), '50')
  assert.strictEqual(normalizeAlpha(50), '50')
  assert.strictEqual(normalizeAlpha('33.3'), '33.3')
  assert.strictEqual(normalizeAlpha(0), '0')
  assert.strictEqual(normalizeAlpha(100), '100')
  assert.throws(() => normalizeAlpha(-1), /between 0 and 100/)
  assert.throws(() => normalizeAlpha(101), /between 0 and 100/)
  assert.throws(() => normalizeAlpha('abc'), /between 0 and 100/)
  console.log('   ✓ normalizeAlpha validates range, returns string')
}

function assertSingleWithTwoColors() {
  const { semanticEntries } = buildSingleSemantic(
    'surfaceColor',
    '#F9FAFB',
    '#0f172a',
    undefined
  )
  assert.deepStrictEqual(semanticEntries, {
    surfaceColor: { light: '#F9FAFB', dark: '#0f172a' }
  }, 'single: explicit light + dark, key passed verbatim')
  console.log('   ✓ single: explicit light + dark hexes, key verbatim')
}

function assertSingleDarkDefaultsToLight() {
  const { semanticEntries } = buildSingleSemantic('overlayColor', '#000000', undefined, '50')
  assert.deepStrictEqual(semanticEntries, {
    overlayColor: {
      light: { color: '#000000', alpha: '50' },
      dark: { color: '#000000', alpha: '50' }
    }
  }, 'single + no dark + alpha: dark falls back to light hex, both wrapped')
  console.log('   ✓ single: dark defaults to light when omitted + alpha wraps both')
}

function assertSingleWithAlphaPerMode() {
  const { semanticEntries } = buildSingleSemantic('accentColor', '#3B82F6', '#60a5fa', '80')
  assert.deepStrictEqual(semanticEntries, {
    accentColor: {
      light: { color: '#3B82F6', alpha: '80' },
      dark: { color: '#60a5fa', alpha: '80' }
    }
  }, 'single + light + dark + alpha: wraps both with the same alpha value')
  console.log('   ✓ single: alpha wraps both modes uniformly')
}

function assertWrapHexWithAlpha() {
  assert.strictEqual(wrapHexWithAlpha('#111', undefined), '#111', 'no alpha → bare hex')
  assert.deepStrictEqual(wrapHexWithAlpha('#111', '50'), { color: '#111', alpha: '50' }, 'with alpha → wrapped')
  console.log('   ✓ wrapHexWithAlpha round-trips both forms')
}

function assertStripFamilyKeys() {
  const existing = {
    amazon: 'used-by-single',
    amazon50: {},
    amazon100: {},
    amazon500: {},
    amazon950: {},
    surfaceColor: { light: '#fff', dark: '#000' },
    amazonExtra: 'custom manual entry',
    sky500: { light: '#0ea5e9', dark: '#0ea5e9' }
  }
  const cleaned = stripFamilyKeys(existing, 'amazon')
  assert.deepStrictEqual(cleaned, {
    surfaceColor: { light: '#fff', dark: '#000' },
    amazonExtra: 'custom manual entry',
    sky500: { light: '#0ea5e9', dark: '#0ea5e9' }
  })
  console.log('   ✓ stripFamilyKeys removes family keys, preserves everything else')
}

function assertMissingHexMessage() {
  const lines = missingHexMessage('shades')
  assert.ok(Array.isArray(lines), 'returns an array of lines for logger.block(...)')
  const msg = lines.join('\n')
  assert.ok(msg.includes('No hex color provided'), 'mentions the core problem')
  assert.ok(msg.includes('pt shades #6A2489'), 'names the exact unquoted form')
  assert.ok(msg.includes("pt shades '#6A2489'"), 'suggests the quoted fix')
  assert.ok(msg.includes('pt shades --random'), 'suggests --random as alternative')
  assert.ok(missingHexMessage('semantic').join('\n').includes('pt semantic --random'), 'parameterized for semantic')
  console.log('   ✓ missingHexMessage covers shell-comment explanation + all three fixes')
}

async function assertShadesRequiresHexOrRandom() {
  const result = await shades({}, {})
  assert.strictEqual(result, false, 'shades() without hex and without --random returns false')
  console.log('   ✓ shades(): missing hex + no --random short-circuits (no silent random)')
}

function assertConflictDetection() {
  const config = {
    theme: { extend: { colors: { amazon: { '50': 'amazon50', '500': 'amazon500' } } } }
  }
  const c1 = detectFamilyShadeConflict(config, 'amazon50', 'amazon50')
  assert.ok(c1)
  assert.strictEqual(c1.parentName, 'amazon')
  assert.strictEqual(c1.shadeNum, '50')
  assert.strictEqual(c1.camelKey, 'amazon50')

  // Unrelated name — no conflict
  assert.strictEqual(detectFamilyShadeConflict(config, 'overlay', 'overlay'), null)

  // Parent is a string (single), not palette — no conflict
  const config2 = { theme: { extend: { colors: { overlay: 'overlay' } } } }
  assert.strictEqual(detectFamilyShadeConflict(config2, 'overlay50', 'overlay50'), null)

  // Multi-word kebab form
  const config3 = {
    theme: { extend: { colors: { 'amazon-green': { '500': 'amazonGreen500' } } } }
  }
  const c2 = detectFamilyShadeConflict(config3, 'amazon-green500', 'amazonGreen500')
  assert.ok(c2)
  assert.strictEqual(c2.parentName, 'amazon-green')
  console.log('   ✓ detectFamilyShadeConflict: positive, unrelated, single-parent, multi-word')
}

try {
  assertMirrorByIndex()
  assertPaletteKeysAndMapping()
  assertToCamelCase()
  assertNormalizeAlpha()
  assertSingleWithTwoColors()
  assertSingleDarkDefaultsToLight()
  assertSingleWithAlphaPerMode()
  assertWrapHexWithAlpha()
  assertStripFamilyKeys()
  assertConflictDetection()
  assertMissingHexMessage()
  await assertShadesRequiresHexOrRandom()
  console.log('\n🎉 All semantic helper tests passed!')
} catch (err) {
  console.error('\n❌ Semantic helper test failed:', err.message)
  process.exit(1)
}
