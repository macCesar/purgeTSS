/**
 * Tests for Android `theme` value quoting — checkTitanium() / parseValue() / customRules()
 *
 * Android theme names are STRINGS, not JavaScript expressions:
 *   theme: 'Theme.AppDerived.NoTitleBar'   ✅ valid TSS
 *   theme: Theme.AppDerived.NoTitleBar     ❌ Alloy fails to compile
 *
 * Only real expressions (Ti.*, Titanium.*, Alloy.*, L(...)) may be emitted raw.
 */

console.log('🧪 Testing Android theme value quoting...')

let passed = 0
let failed = 0

let counter = 0

function assertEqual(testName, actual, expected) {
  counter++

  if (actual === expected) {
    passed++
    console.log(`✅ ${counter}. ${testName}`)
    console.log(`   Value: ${actual}`)
  } else {
    failed++
    console.log(`❌ ${counter}. ${testName}`)
    console.log(`   Expected: ${expected}`)
    console.log(`   Actual:   ${actual}`)
  }
}

async function runTests() {
  const { checkTitanium, parseValue, customRules } = await import('../../../src/shared/helpers/utils.js')

  // ─── checkTitanium(): theme names are NOT Titanium expressions ─────

  assertEqual(
    'checkTitanium() does not treat Theme.AppDerived.* as an expression',
    checkTitanium('Theme.AppDerived.NoTitleBar') === 'titanium' ? 'titanium' : 'not-titanium',
    'not-titanium'
  )

  assertEqual(
    'checkTitanium() does not treat Theme.Titanium.* as an expression',
    checkTitanium('Theme.Titanium.Dark.NoTitleBar') === 'titanium' ? 'titanium' : 'not-titanium',
    'not-titanium'
  )

  // ─── checkTitanium(): real expressions stay raw ────────────────────

  const expressions = [
    'Ti.UI.FILL',
    'Ti.UI.TEXT_ALIGNMENT_CENTER',
    'Titanium.UI.SIZE',
    'Alloy.Globals.iPhoneX',
    'Alloy.CFG.someValue',
    'L(\'welcome\')'
  ]

  expressions.forEach(expression => {
    assertEqual(
      `checkTitanium() keeps ${expression} as an expression`,
      checkTitanium(expression),
      'titanium'
    )
  })

  // ─── Array literals of constants are expressions too ───────────────

  assertEqual(
    'checkTitanium() keeps a single-constant array as an expression',
    checkTitanium('[ Ti.UI.PORTRAIT ]'),
    'titanium'
  )

  assertEqual(
    'parseValue() emits a multi-constant array raw',
    parseValue('[ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]'),
    '[ Ti.UI.LANDSCAPE_LEFT, Ti.UI.LANDSCAPE_RIGHT ]'
  )

  // ─── parseValue(): quoting ─────────────────────────────────────────

  assertEqual(
    'parseValue() quotes Theme.AppDerived.NoTitleBar',
    parseValue('Theme.AppDerived.NoTitleBar'),
    '\'Theme.AppDerived.NoTitleBar\''
  )

  assertEqual(
    'parseValue() quotes Theme.Titanium.DayNight.Solid',
    parseValue('Theme.Titanium.DayNight.Solid'),
    '\'Theme.Titanium.DayNight.Solid\''
  )

  assertEqual(
    'parseValue() quotes a fully custom theme name',
    parseValue('MyCompany.CustomTheme'),
    '\'MyCompany.CustomTheme\''
  )

  assertEqual(
    'parseValue() emits Ti.UI.FILL raw',
    parseValue('Ti.UI.FILL'),
    'Ti.UI.FILL'
  )

  assertEqual(
    'parseValue() emits Alloy.Globals.iPhoneX raw',
    parseValue('Alloy.Globals.iPhoneX'),
    'Alloy.Globals.iPhoneX'
  )

  assertEqual(
    'parseValue() emits L(...) raw',
    parseValue('L(\'welcome\')'),
    'L(\'welcome\')'
  )

  // ─── customRules(): the reported bug ───────────────────────────────

  assertEqual(
    'customRules() quotes a platform-specific custom theme',
    customRules({ android: { theme: 'Theme.AppDerived.NoTitleBar' } }, '.welcome-window').trim(),
    '\'.welcome-window[platform=android]\': { theme: \'Theme.AppDerived.NoTitleBar\' }'
  )

  assertEqual(
    'customRules() quotes a theme without a platform modifier',
    customRules({ global: { theme: 'Theme.Titanium.Dark' } }, '.dark-window').trim(),
    '\'.dark-window\': { theme: \'Theme.Titanium.Dark\' }'
  )

  assertEqual(
    'customRules() still emits Ti.* expressions raw',
    customRules({ global: { width: 'Ti.UI.FILL', height: 'Ti.UI.SIZE' } }, '.filled').trim(),
    '\'.filled\': { width: Ti.UI.FILL, height: Ti.UI.SIZE }'
  )

  assertEqual(
    'customRules() keeps theme quoted alongside other properties',
    customRules({ android: { theme: 'Theme.AppDerived.Fullscreen', backgroundColor: '#ffffff' } }, '.full-window').trim(),
    '\'.full-window[platform=android]\': { theme: \'Theme.AppDerived.Fullscreen\', backgroundColor: \'#ffffff\' }'
  )

  // ─── Summary ───────────────────────────────────────────────────────

  console.log(`\n📊 theme quoting tests: ${passed} passed, ${failed} failed`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch(err => {
  console.error('❌ Test runner error:', err)
  process.exit(1)
})
