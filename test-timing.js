import { localStart, localFinish } from './src/cli/utils/cli-helpers.js'

console.log('localStart type:', typeof localStart)
console.log('localFinish type:', typeof localFinish)

if (typeof localStart === 'function') {
  console.log('✅ localStart is a function')
} else {
  console.log('❌ localStart is not a function')
}

if (typeof localFinish === 'function') {
  console.log('✅ localFinish is a function')
} else {
  console.log('❌ localFinish is not a function')
}
