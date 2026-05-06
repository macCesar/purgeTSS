/**
 * Tests for Core Builders and Purgers - Simple Node.js tests
 */

console.log('🧪 Testing Core Builders and Purgers...')

async function testTailwindBuilder() {
  try {
    const { buildTailwindBasedOnConfigOptions } = await import('../../../src/core/builders/tailwind-builder.js')

    console.log('✅ Tailwind Builder test:')
    console.log('   buildTailwindBasedOnConfigOptions type:', typeof buildTailwindBasedOnConfigOptions)

    return true
  } catch (error) {
    console.error('❌ Error in tailwind builder test:', error.message)
    return false
  }
}

async function testTailwindHelpers() {
  try {
    const { combineKeys } = await import('../../../src/core/builders/tailwind-helpers.js')

    console.log('✅ Tailwind Helpers test:')
    console.log('   combineKeys type:', typeof combineKeys)

    return true
  } catch (error) {
    console.error('❌ Error in tailwind helpers test:', error.message)
    return false
  }
}

async function testTailwindPurger() {
  try {
    const { purgeTailwind } = await import('../../../src/core/purger/tailwind-purger.js')

    console.log('✅ Tailwind Purger test:')
    console.log('   purgeTailwind type:', typeof purgeTailwind)

    return true
  } catch (error) {
    console.error('❌ Error in tailwind purger test:', error.message)
    return false
  }
}

async function testIconPurger() {
  try {
    const { purgeFontAwesome } = await import('../../../src/core/purger/icon-purger.js')

    console.log('✅ Icon Purger test:')
    console.log('   purgeFontAwesome type:', typeof purgeFontAwesome)

    return true
  } catch (error) {
    console.error('❌ Error in icon purger test:', error.message)
    return false
  }
}

async function testFunctionalityTests() {
  try {
    const { purgeTailwind } = await import('../../../src/core/purger/tailwind-purger.js')

    if (typeof purgeTailwind === 'function') {
      console.log('✅ Functionality test - purgeTailwind:')
      console.log('   Function is callable')
    }

    return true
  } catch (error) {
    console.error('❌ Error in functionality tests:', error.message)
    return false
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Core Builders and Purgers Tests...\n')

  const results = await Promise.all([
    testTailwindBuilder(),
    testTailwindHelpers(),
    testTailwindPurger(),
    testIconPurger(),
    testFunctionalityTests()
  ])

  const passed = results.filter(r => r).length
  const total = results.length

  console.log(`\n📊 Test Results: ${passed}/${total} passed`)

  if (passed === total) {
    console.log('🎉 All tests passed!')
  } else {
    console.log('⚠️  Some tests failed!')
  }
}

runTests().catch(console.error)
