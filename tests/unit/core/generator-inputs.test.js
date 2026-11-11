import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { GeneratorInputs } from '../../../src/dev/utils/generator-inputs.js'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-generators-'))
try {
  const file = path.join(root, 'codes')
  fs.writeFileSync(file, 'z ffff\na 1f600\nz ffff\n')
  const context = new GeneratorInputs()
  assert.deepEqual(context.codepoints([file]), [undefined, { selector: 'a', property: '1f600' }, { selector: 'z', property: 'ffff' }])
  assert.equal(context.codepoints([file]), context.codepoints([file]))
  fs.writeFileSync(file, 'new abcd')
  assert.equal(context.text(file), 'z ffff\na 1f600\nz ffff\n')
  assert.equal(new GeneratorInputs().text(file), 'new abcd')
} finally { fs.rmSync(root, { recursive: true, force: true }) }
console.log('Shared generator inputs contracts passed')
