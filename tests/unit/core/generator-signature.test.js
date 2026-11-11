import assert from 'node:assert/strict'
import fs from 'node:fs'
import { generatorSignature } from '../../../src/core/builders/generator-signature.js'
const before = generatorSignature({ theme: {} })
assert.equal(generatorSignature({ theme: { unsupported: () => 1 } }), null)
const read = fs.readFileSync
fs.readFileSync = function(file, ...args) {
  if (String(file).endsWith('/src/shared/helpers.js')) return Buffer.from('// changed generator exports\n')
  return read.call(this, file, ...args)
}
try {
  assert.notEqual(generatorSignature({ theme: {} }), before, 'generator export changes must invalidate utilities')
} finally { fs.readFileSync = read }
console.log('Generator source invalidation and conservative signing contracts passed')
