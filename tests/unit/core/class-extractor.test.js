/**
 * Tests for processControllers() — AST walker + regex fallback
 *
 * Covers:
 *   - RFC patterns the AST walker must recover
 *   - RFC patterns that remain honest gaps (stay blind)
 *   - Regression preservation from the old regex scanner
 *   - Appendix bug fix (ternary-at-value with string branches)
 *   - Fail-soft on syntax errors
 */

console.log('🧪 Testing processControllers() AST walker...')

let passed = 0
let failed = 0

function assertTokens(testName, actual, expected) {
  const actualSorted = [...(actual || [])].sort()
  const expectedSorted = [...expected].sort()
  const ok =
    actualSorted.length === expectedSorted.length &&
    actualSorted.every((v, i) => v === expectedSorted[i])

  if (ok) {
    passed++
    console.log(`✅ ${testName}`)
    console.log(`   Expected: [${expectedSorted.join(', ')}]`)
    console.log(`   Actual:   [${actualSorted.join(', ')}]`)
  } else {
    failed++
    console.log(`❌ ${testName}`)
    console.log(`   Expected: [${expectedSorted.join(', ')}]`)
    console.log(`   Actual:   [${actualSorted.join(', ')}]`)
  }
}

function assertContainsAll(testName, actual, required) {
  const actualArr = actual || []
  const missing = required.filter(r => !actualArr.includes(r))
  if (missing.length === 0) {
    passed++
    console.log(`✅ ${testName}`)
    console.log(`   Contains all of: [${required.join(', ')}]`)
  } else {
    failed++
    console.log(`❌ ${testName}`)
    console.log(`   Missing: [${missing.join(', ')}]`)
    console.log(`   Actual:  [${actualArr.join(', ')}]`)
  }
}

async function runTests() {
  const { processControllers } = await import('../../../src/core/analyzers/class-extractor.js')

  if (typeof processControllers !== 'function') {
    failed++
    console.log('❌ processControllers is not exported from class-extractor.js')
    return
  }

  // ─── RFC patterns — AST should recover ─────────────────────────────

  // 1. Inline ternary in array
  assertTokens(
    '1. Inline ternary inside array',
    processControllers("var x = Alloy.createStyle('foo', { classes: ['a', isX ? 'b' : 'c'] })"),
    ['a', 'b', 'c']
  )

  // 2. Multi-line array
  assertTokens(
    '2. Multi-line array literal',
    processControllers(`
      $.foo.applyProperties(Alloy.createStyle('foo', {
        classes: [
          'a',
          'b'
        ]
      }))
    `),
    ['a', 'b']
  )

  // 3. Ternary-at-value (motivating bug)
  assertTokens(
    '3. Ternary-at-value with array branches',
    processControllers(`
      var style = Alloy.createStyle('foo', {
        classes: cond ? ['a', 'b'] : ['c', 'd']
      })
    `),
    ['a', 'b', 'c', 'd']
  )

  // 4. apply: 'a b c'
  assertTokens(
    '4. apply directive string',
    processControllers("$.foo.applyProperties({ apply: 'a b c' })"),
    ['a', 'b', 'c']
  )

  // 5. Template literal without interpolation
  assertTokens(
    '5. Template literal (no interpolation)',
    processControllers('var x = Alloy.createStyle("foo", { classes: [`a-b`] })'),
    ['a-b']
  )

  // 6. Nested: array of ternaries
  assertTokens(
    '6. Nested array of ternaries',
    processControllers(`
      var s = Alloy.createStyle('foo', {
        classes: [a ? 'x1' : 'x2', b ? 'y1' : 'y2']
      })
    `),
    ['x1', 'x2', 'y1', 'y2']
  )

  // ─── RFC patterns — honest gaps (stay blind) ───────────────────────

  // 7. Identifier inside array — string extracted, identifier NOT
  {
    const tokens = processControllers("var s = Alloy.createStyle('foo', { classes: ['a', b] })")
    assertTokens('7. Identifier in array — only literal extracted', tokens, ['a'])
  }

  // 8. Identifier as value — zero extraction
  assertTokens(
    '8. Identifier as value — zero extraction',
    processControllers("var s = Alloy.createStyle('foo', { classes: someVar })"),
    []
  )

  // 9. String concat — no BinaryExpression recursion
  assertTokens(
    '9. String concat in array — zero extraction',
    processControllers("var s = Alloy.createStyle('foo', { classes: ['a-' + x] })"),
    []
  )

  // 10. Function call argument
  assertTokens(
    '10. Function call as value — zero extraction',
    processControllers("var s = Alloy.createStyle('foo', { classes: getClasses('x') })"),
    []
  )

  // 11. Template literal with interpolation
  assertTokens(
    '11. Template literal with interpolation — zero extraction',
    processControllers('var s = Alloy.createStyle("foo", { classes: [`a-${x}`] })'),
    []
  )

  // ─── Regression preservation — current regex matches these ─────────

  // 12. .addClass($.foo, 'a b')
  assertContainsAll(
    '12. .addClass with string second arg',
    processControllers("$.foo.addClass($.bar, 'a b')"),
    ['a', 'b']
  )

  // 13. .removeClass($.foo, ['a', 'b'])
  assertContainsAll(
    '13. .removeClass with array second arg',
    processControllers("$.foo.removeClass($.bar, ['a', 'b'])"),
    ['a', 'b']
  )

  // 14. resetClass($.foo, 'a b')
  assertContainsAll(
    '14. resetClass with string second arg',
    processControllers("resetClass($.bar, 'a b')"),
    ['a', 'b']
  )

  // ─── Appendix bug fix ──────────────────────────────────────────────

  // 15. Ternary-at-value with string branches
  assertContainsAll(
    '15. Ternary-at-value with string branches',
    processControllers(`
      var s = Alloy.createStyle('foo', {
        classes: isActive ? 'ms-visibility' : 'ms-visibility_off'
      })
    `),
    ['ms-visibility', 'ms-visibility_off']
  )

  // ─── Fail-soft: syntax error falls back to regex ───────────────────

  // 16. Source with a syntax error must NOT throw
  {
    const brokenSource = "function broken( { classes: ['a', 'b'] }" // unbalanced paren
    let threw = false
    let tokens = []
    try {
      tokens = processControllers(brokenSource)
    } catch (e) {
      threw = true
      console.log('   Threw:', e.message)
    }
    if (threw) {
      failed++
      console.log('❌ 16. Syntax error must not throw (fail-soft)')
    } else {
      passed++
      console.log('✅ 16. Syntax error handled fail-soft (did not throw)')
      console.log(`   Fallback tokens: [${tokens.join(', ')}]`)
    }
  }

  // ─── Summary ───────────────────────────────────────────────────────

  console.log(`\n📊 processControllers tests: ${passed} passed, ${failed} failed`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch(err => {
  console.error('❌ Test runner error:', err)
  process.exit(1)
})
