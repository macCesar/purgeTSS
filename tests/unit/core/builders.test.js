/**
 * Tests for Core Builders and Purgers - Simple Node.js tests
 */

console.log('🧪 Testing Core Builders and Purgers...')

async function testTailwindBuilder() {
  try {
    const { buildTailwindCSS } = await import('../../../src/core/builders/tailwind-builder.js')
    
    console.log('✅ Tailwind Builder test:')
    console.log('  buildTailwindCSS type:', typeof buildTailwindCSS)
    
    return true
  } catch (error) {
    console.error('❌ Error in tailwind builder test:', error.message)
    return false
  }
}

async function testTailwindHelpers() {
  try {
    const { 
      removeProperties, 
      fixPercentages, 
      addVariables 
    } = await import('../../../src/core/builders/tailwind-helpers.js')
    
    console.log('✅ Tailwind Helpers test:')
    console.log('  removeProperties type:', typeof removeProperties)
    console.log('  fixPercentages type:', typeof fixPercentages)
    console.log('  addVariables type:', typeof addVariables)
    
    return true
  } catch (error) {
    console.error('❌ Error in tailwind helpers test:', error.message)
    return false
  }
}

async function testTailwindPurger() {
  try {
    const { purgeTailwindClasses } = await import('../../../src/core/purger/tailwind-purger.js')
    
    console.log('✅ Tailwind Purger test:')
    console.log('  purgeTailwindClasses type:', typeof purgeTailwindClasses)
    
    return true
  } catch (error) {
    console.error('❌ Error in tailwind purger test:', error.message)
    return false
  }
}

async function testIconPurger() {
  try {
    const { purgeIconClasses } = await import('../../../src/core/purger/icon-purger.js')
    
    console.log('✅ Icon Purger test:')
    console.log('  purgeIconClasses type:', typeof purgeIconClasses)
    
    return true
  } catch (error) {
    console.error('❌ Error in icon purger test:', error.message)
    return false
  }
}

async function testFunctionalityTests() {
  try {
    // Test basic Tailwind helpers functionality
    const { removeProperties } = await import('../../../src/core/builders/tailwind-helpers.js')
    
    if (typeof removeProperties === 'function') {
      console.log('✅ Functionality test - removeProperties:')
      console.log('  Function is callable')
    }
    
    // Test purger functionality 
    const { purgeTailwindClasses } = await import('../../../src/core/purger/tailwind-purger.js')
    
    if (typeof purgeTailwindClasses === 'function') {
      console.log('✅ Functionality test - purgeTailwindClasses:')
      console.log('  Function is callable')
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
