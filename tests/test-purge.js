#!/usr/bin/env node

// Quick test to see what's happening with purgeClasses
import { purgeClasses } from '../src/cli/commands/purge.js'

console.log('Testing purgeClasses...')

try {
  const result = purgeClasses({ debug: true })
  console.log('Result:', result)
} catch (error) {
  console.error('Error:', error.message)
  console.error('Stack:', error.stack)
}
