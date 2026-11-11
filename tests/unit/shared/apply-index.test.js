import assert from 'node:assert/strict'
import fs from 'node:fs'
import { _applyClasses, compileApplyDirectives } from '../../../src/shared/helpers/utils.js'

const originalRead = fs.readFileSync
let fontReads = 0
fs.readFileSync = function(file, ...args) {
  if (/\.(tss)$/.test(String(file))) fontReads++
  return originalRead.call(this, file, ...args)
}
try {
  assert.equal(compileApplyDirectives('\'.p-4\': { padding: 16 }\n'), '\'.p-4\': { padding: 16 }\n')
  assert.equal(compileApplyDirectives('\r\n'), '\n', 'no-apply output keeps LF normalization')
  assert.equal(fontReads, 0, 'no apply directives must not read font catalogs')
  _applyClasses['.first'] = new Set(['p-4'])
  _applyClasses['.second'] = new Set(['first', 'bg-red'])
  const result = compileApplyDirectives('\'.first\': { {_applyProperties_} }\n\'.second\': { {_applyProperties_} }\n\'.p-4\': { padding: 16 }\n\'.p-4\': { padding: 99 }\n\'.bg-red\': { backgroundColor: \'#ff0000\' }')
  assert.match(result, /'\.first': \{ padding: 16 \}/)
  assert.ok(result.includes('\'.second\': { backgroundColor: \'#ff0000\', padding: { 16 } }'))
  _applyClasses['.special'] = new Set(['a\\\'b'])
  const escaped = compileApplyDirectives('\'.special\': { {_applyProperties_} }\n\'.a\\\'b\': { text: \'escaped\' }')
  assert.ok(escaped.includes('\'.special\': { text: \'escaped\' }'), 'escaped exact selectors must retain prefix-lookup semantics')
} finally {
  fs.readFileSync = originalRead
  for (const key of Object.keys(_applyClasses)) delete _applyClasses[key]
}
console.log('Apply lookup and lazy catalog contracts passed')
