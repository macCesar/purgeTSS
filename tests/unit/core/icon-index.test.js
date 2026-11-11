import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { purgeFontIcons } from '../../../src/core/purger/icon-purger.js'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-icon-index-'))
try {
  const file = path.join(root, 'fonts.tss')
  fs.writeFileSync(file, '\'.normal\': { text: \'first\' }\n\'.normal\': { text: \'second\' }\n\'.a\\\'b\': { text: \'escaped\' }\n')
  for (const name of ['normal', 'a\\\'b']) {
    const small = purgeFontIcons(file, [name], '', [name], [])
    const names = [name, ...Array.from({ length: 32 }, (_, i) => 'unused' + i)]
    const indexed = purgeFontIcons(file, names, '', names, [])
    assert.notEqual(small, '')
    assert.equal(indexed, small, 'threshold must not change escaped selector or first-match behavior')
  }
} finally { fs.rmSync(root, { recursive: true, force: true }) }
console.log('Icon index threshold and first-match contracts passed')
