#!/usr/bin/env node

// Test simple de tailwind-purger
import { purgeTailwind } from './src/core/purger/tailwind-purger.js'

console.log('purgeTailwind function:', typeof purgeTailwind)

try {
  // Test con array vacío
  const result = purgeTailwind([])
  console.log('✅ purgeTailwind works')
} catch (error) {
  console.error('❌ Error in purgeTailwind:', error.message)
  console.error('Stack:', error.stack)
}
