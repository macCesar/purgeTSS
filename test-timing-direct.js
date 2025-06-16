#!/usr/bin/env node

// Test directo de localStart/localFinish
import { localStart, localFinish } from './src/cli/utils/cli-helpers.js'

console.log('localStart type:', typeof localStart)
console.log('localFinish type:', typeof localFinish)

try {
  console.log('Calling localStart...')
  localStart()
  console.log('✅ localStart called successfully')

  console.log('Calling localFinish...')
  localFinish('Test operation completed')
  console.log('✅ localFinish called successfully')
} catch (error) {
  console.error('❌ Error:', error.message)
  console.error('Stack:', error.stack)
}
