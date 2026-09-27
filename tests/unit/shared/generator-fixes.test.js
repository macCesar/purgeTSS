/**
 * Class generation and CLI parsing contracts: platform/device modifiers,
 * arbitrary gradient values, keyboard and animation utilities, the class
 * syntax validator, --vendor aliases and project-type detection.
 */

import assert from 'assert'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { fileURLToPath } from 'url'

console.log('🧪 Testing generator and parsing contracts...')

const { checkPlatformAndDevice, formatArbitraryValues } = await import('../../../src/shared/helpers/utils.js')
const { snap } = await import('../../../src/shared/helpers/animation.js')
const { validateClassSyntax } = await import('../../../src/cli/utils/unsupported-class-reporter.js')
const { parseVendors } = await import('../../../src/cli/commands/icon-library.js')
const { detectProjectType } = await import('../../../src/cli/utils/project-detection.js')
const { detectProjectType: detectProjectTypeCore } = await import('../../../src/core/branding/tiapp-reader.js')

function assertModifiers() {
  const bgRed = '\'.bg-red-500\': { backgroundColor: \'#ef4444\' }'
  const statusBar = '\'.status-bar-dark[platform=ios]\': { statusBarStyle: Ti.UI.iOS.StatusBar.DARK_CONTENT }'

  assert.strictEqual(checkPlatformAndDevice(bgRed, 'ios:bg-red-500'), '\'.ios:bg-red-500[platform=ios]\': { backgroundColor: \'#ef4444\' }\n')
  assert.strictEqual(checkPlatformAndDevice(statusBar, 'ios:status-bar-dark'), '\'.ios:status-bar-dark[platform=ios]\': { statusBarStyle: Ti.UI.iOS.StatusBar.DARK_CONTENT }\n')

  // Alloy keeps only the last [...] of a selector, so conditions share one bracket
  assert.strictEqual(checkPlatformAndDevice(bgRed, 'ios:tablet:bg-red-500'), '\'.ios:tablet:bg-red-500[platform=ios formFactor=tablet]\': { backgroundColor: \'#ef4444\' }\n')
  assert.strictEqual(checkPlatformAndDevice(statusBar, 'tablet:status-bar-dark'), '\'.tablet:status-bar-dark[platform=ios formFactor=tablet]\': { statusBarStyle: Ti.UI.iOS.StatusBar.DARK_CONTENT }\n')

  assert.ok(checkPlatformAndDevice(statusBar, 'android:status-bar-dark').startsWith('// Conflicting modifiers'))
  assert.ok(checkPlatformAndDevice(bgRed, 'ios:android:bg-red-500').startsWith('// Conflicting modifiers'))

  assert.strictEqual(checkPlatformAndDevice('\'.opacity-0\': { opacity: 0 }', 'open:opacity-0'), '\'.open:opacity-0\': { animationProperties: { open: { opacity: 0 } } }\n')
  console.log('   ✓ platform/device modifiers stack in one bracket and reject conflicts')
}

function assertArbitraryGradient() {
  const bgFrom = formatArbitraryValues('bg-from-(#ccc)', true)
  assert.ok(!bgFrom.includes('{value1}'), bgFrom)
  assert.strictEqual(bgFrom, formatArbitraryValues('from-(#ccc)', true).replace('.from-', '.bg-from-'))
  assert.strictEqual(formatArbitraryValues('w-(100px)', true), '\'.w-(100px)\': { width: \'100px\' }')
  console.log('   ✓ bg-from-(…) fills its transparent start color; (Npx) stays explicit pixels')
}

function assertKeyboardAndSnap() {
  const utilities = fs.readFileSync(path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../dist/utilities.tss'), 'utf8')
  assert.ok(!/KeyboardType: Ti\.UI\.KEYBOARD_APPEARANCE|keyboardType: Ti\.UI\.KEYBOARD_APPEARANCE/.test(utilities), 'keyboard type utilities must not use appearance constants')
  assert.ok(utilities.includes('keyboardAppearance: Ti.UI.KEYBOARD_APPEARANCE_DARK'))
  assert.ok(!snap().includes('magnet'), 'snap-magnet has no runtime behavior')
  assert.ok(!utilities.includes('snap-magnet'))
  assert.ok(snap().includes('.snap-center'))
  console.log('   ✓ keyboard type and snap utilities only emit supported values')
}

function assertSyntaxValidator() {
  // Positive control: a known mistake still halts
  assert.throws(() => validateClassSyntax({ classes: ['top-[10]'], viewPaths: [] }), err => err.isClassSyntaxError)
  assert.doesNotThrow(() => validateClassSyntax({ classes: ['w-(100px)', 'top-(10px)'], viewPaths: [] }))
  console.log('   ✓ (Npx) is accepted by the class syntax validator')
}

function assertVendors() {
  assert.deepStrictEqual(parseVendors('=materialsymbols, FA'), { vendors: ['ms', 'fa'], unknown: [] })
  assert.deepStrictEqual(parseVendors('ms,materialsymbol,materialsymbols'), { vendors: ['ms'], unknown: [] })
  assert.deepStrictEqual(parseVendors('ms,bogus').unknown, ['bogus'])
  console.log('   ✓ --vendor accepts every alias and reports unknown values')
}

function assertProjectDetection() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pt-detect-'))
  try {
    fs.mkdirSync(path.join(root, 'app'))
    fs.mkdirSync(path.join(root, 'Resources'))
    assert.strictEqual(detectProjectType(root), 'classic')
    assert.strictEqual(detectProjectTypeCore(root), 'classic')
    fs.mkdirSync(path.join(root, 'app', 'views'))
    assert.strictEqual(detectProjectType(root), 'alloy')
    assert.strictEqual(detectProjectTypeCore(root), 'alloy')
  } finally {
    fs.rmSync(root, { recursive: true, force: true })
  }
  console.log('   ✓ every command detects the project type the same way')
}

try {
  assertModifiers()
  assertArbitraryGradient()
  assertKeyboardAndSnap()
  assertSyntaxValidator()
  assertVendors()
  assertProjectDetection()
  console.log('\n🎉 All generator contract tests passed!')
} catch (err) {
  console.error('\n❌ Generator contract test failed:', err.message)
  process.exit(1)
}
