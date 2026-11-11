import assert from 'node:assert/strict'
import { findSubstrings } from '../../../src/core/analyzers/substring-matcher.js'
const cases = [
  ['ushers', ['he', 'she', 'his', 'hers', '', 'he', 'ers', 'x']],
  ['a😀b\ud83d', ['😀', '\ud83d', '\ude00', 'b\ud83d', '😀b', 'z']],
  ['aaaa', ['a', 'aa', 'aaa', 'aaaa', 'aaaaa']],
  ['', ['', 'a']]
]
for (const [text, patterns] of cases) {
  assert.deepEqual([...findSubstrings(text, patterns)].sort(), [...new Set(patterns.filter(p => text.includes(p)))].sort())
}
console.log('Substring equivalence contracts passed')
