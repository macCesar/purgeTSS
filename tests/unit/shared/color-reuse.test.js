import assert from 'node:assert/strict'
import chroma from 'chroma-js'
import old from '../../fixtures/color-shades/generateColorShades.js'
import findClosestColor from '../../../lib/color-shades/findClosestColor.js'
import generate from '../../../lib/color-shades/generateColorShades.js'
import references from '../../../lib/color-shades/tailwindColors.js'
const before = JSON.stringify(references)
const ids = new Set()
for (const input of ['#336699', '#fff', '#000000', '#ef4444', '#808080', '#17bf91', chroma('#aa55cc')]) {
  const actual = generate(input, references)
  const expected = old(input, structuredClone(references))
  ids.add(actual.id)
  delete actual.id
  delete expected.id
  assert.deepEqual(actual, expected, input)
}
assert.equal(ids.size, 7)
assert.equal(JSON.stringify(references), before, 'constant palettes must remain unchanged')
const shades = [{ number: '50', hexcode: '#336699' }, { number: '100', hexcode: '#336699' }]
const tied = findClosestColor('#336699', [{ name: 'first', shades }, { name: 'last', shades }])
assert.equal(tied.name, 'last')
assert.equal(tied.closestShade.number, '100')
assert.equal(tied.closestShadeLightness.number, '100')
console.log('Color equivalence and fresh UUID contracts passed')
