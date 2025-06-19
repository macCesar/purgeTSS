
// Simple test script for fonts.js
console.log('Starting import test...')

try {
  const fonts = await import('../../src/cli/commands/fonts.js')
  console.log('✅ fonts.js imported successfully!')
  console.log('Exports:', Object.keys(fonts))

  // Test buildFonts function exists
  if (typeof fonts.buildFonts === 'function') {
    console.log('✅ buildFonts function found')
  } else {
    console.log('❌ buildFonts function missing')
  }

  // Test copyFonts function exists in icon-library.js (moved there)
  try {
    const iconLibrary = await import('../../src/cli/commands/icon-library.js')
    if (typeof iconLibrary.copyFonts === 'function') {
      console.log('✅ copyFonts function found in icon-library.js')
    } else {
      console.log('❌ copyFonts function missing in icon-library.js')
    }
  } catch (error) {
    console.log('❌ icon-library.js import failed:', error.message)
  }
} catch (error) {
  console.error('❌ Import failed:', error.message)
  console.error('Stack:', error.stack)
}
