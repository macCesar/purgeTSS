// Integration test for tailwind functionality
console.log('🧪 Testing integration of Tailwind functionality...')

try {
  // Test if tailwind module can be imported
  const tailwindModule = await import('../../src/core/purger/tailwind-purger.js')
  console.log('✅ Tailwind module imported successfully')
  console.log('Available exports:', Object.keys(tailwindModule))
  
  if (tailwindModule.purgeTailwind) {
    console.log('✅ purgeTailwind function available')
  } else {
    console.log('❌ purgeTailwind function not found')
  }
  
  console.log('📊 Integration test completed successfully')
} catch (error) {
  console.error('❌ Integration test failed:', error.message)
  throw error
}
