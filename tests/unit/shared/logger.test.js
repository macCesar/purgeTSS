/**
 * Tests for logger.block and logger.item helpers.
 *
 * These helpers produce multi-line output with a single ::PurgeTSS:: header:
 *   - logger.block(header, ...lines) → purgeLabel + header, then each line
 *     indented 3 spaces (or '' for a blank line).
 *   - logger.item(...args) → no prefix, indented 3 spaces. For use in
 *     sequential flows where a prior logger.info emitted the header.
 */

import assert from 'assert'

console.log('🧪 Testing logger.block / logger.item helpers...')

const { logger } = await import('../../../src/shared/logger.js')
const { colores } = await import('../../../src/shared/brand-colors.js')
const purgeLabel = colores.purgeLabel

function captureConsole(fn) {
  const calls = []
  const original = console.log
  console.log = (...args) => { calls.push(args) }
  try {
    fn()
  } finally {
    console.log = original
  }
  return calls
}

function assertBlockBasic() {
  const calls = captureConsole(() => logger.block('header', 'a', '', 'b'))
  assert.strictEqual(calls.length, 4, 'expected 4 console.log calls')
  assert.deepStrictEqual(calls[0], [purgeLabel, 'header'], 'first call is purgeLabel + header')
  assert.deepStrictEqual(calls[1], ['   a'], 'continuation lines indent by 3 spaces')
  assert.deepStrictEqual(calls[2], [''], "'' emits a truly blank line (no indent)")
  assert.deepStrictEqual(calls[3], ['   b'], 'subsequent lines continue to indent')
  console.log('   ✓ logger.block: purgeLabel header, indented lines, blank separator')
}

function assertBlockHeaderOnly() {
  const calls = captureConsole(() => logger.block('solo header'))
  assert.strictEqual(calls.length, 1)
  assert.deepStrictEqual(calls[0], [purgeLabel, 'solo header'])
  console.log('   ✓ logger.block: header without lines prints single labeled line')
}

function assertItemSingleArg() {
  const calls = captureConsole(() => logger.item('x'))
  assert.strictEqual(calls.length, 1)
  assert.deepStrictEqual(calls[0], ['   x'])
  console.log('   ✓ logger.item: single arg prints indented without prefix')
}

function assertItemVariadic() {
  const calls = captureConsole(() => logger.item('a', 'b'))
  assert.strictEqual(calls.length, 1)
  assert.deepStrictEqual(calls[0], ['   a b'])
  console.log('   ✓ logger.item: variadic args join with space (matches logger.info)')
}

try {
  assertBlockBasic()
  assertBlockHeaderOnly()
  assertItemSingleArg()
  assertItemVariadic()
  console.log('\n🎉 All logger helper tests passed!')
} catch (err) {
  console.error('\n❌ Logger helper test failed:', err.message)
  process.exit(1)
}
