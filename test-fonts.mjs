#!/usr/bin/env node

// Simple test script for fonts.js
console.log('Starting import test...')

try {
  const fonts = await import('./src/cli/commands/fonts.js')
  console.log('✅ fonts.js imported successfully!')
  console.log('Exports:', Object.keys(fonts))

  // Test buildFonts function exists
  if (typeof fonts.buildFonts === 'function') {
    console.log('✅ buildFonts function found')
  } else {
    console.log('❌ buildFonts function missing')
  }

  // Test copyFonts function exists
  if (typeof fonts.copyFonts === 'function') {
    console.log('✅ copyFonts function found')
  } else {
    console.log('❌ copyFonts function missing')
  }
} catch (error) {
  console.error('❌ Import failed:', error.message)
  console.error('Stack:', error.stack)
}
