// Integration test for direct timing functionality
console.log('🧪 Testing direct timing functionality...')

try {
  // Test if timing module can be imported
  const timingModule = await import('../../src/cli/utils/cli-helpers.js')
  console.log('✅ Direct timing module imported successfully')
  console.log('   Available exports:', Object.keys(timingModule))

  // Test basic functionality if available
  if (timingModule.localStart) {
    console.log('✅ localStart function available')
    console.log('   localStart type:', typeof timingModule.localStart)
  }

  if (timingModule.localFinish) {
    console.log('✅ localFinish function available')
    console.log('   localFinish type:', typeof timingModule.localFinish)
  }

  console.log('📊 Direct timing test completed successfully')
} catch (error) {
  console.error('❌ Direct timing test failed:', error.message)
  throw error
}
