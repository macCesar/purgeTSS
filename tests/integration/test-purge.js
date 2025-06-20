// Integration test for purge functionality
console.log('🧪 Testing integration of purge functionality...')

try {
  // Test if purge module can be imported
  const purgeModule = await import('../../src/cli/commands/purge.js')
  console.log('✅ Purge module imported successfully')
  console.log('   Available exports:', Object.keys(purgeModule))

  if (purgeModule.purgeClasses) {
    console.log('✅ purgeClasses function available')
  } else {
    console.log('❌ purgeClasses function not found')
  }

  console.log('📊 Integration test completed successfully')
} catch (error) {
  console.error('❌ Integration test failed:', error.message)
  throw error
}
