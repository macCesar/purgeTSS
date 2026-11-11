import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-lazy-'))
const bin = path.resolve('bin/purgetss')
const run = args => spawnSync(process.execPath, [bin, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_UPDATE_NOTIFIER: '1' } })
try {
  fs.mkdirSync(path.join(root, 'app/views'), { recursive: true })
  fs.mkdirSync(path.join(root, 'purgetss'), { recursive: true })
  const file = path.join(root, 'purgetss/config.cjs')
  fs.writeFileSync(file, 'require(\'fs\').writeFileSync(\'evaluated\', \'yes\'); throw new Error(\'configuration evaluated\')')
  for (const args of [['--help'], ['--version'], ['b', '--help']]) {
    assert.equal(run(args).status, 0)
    assert.equal(fs.existsSync(path.join(root, 'evaluated')), false)
  }
  fs.writeFileSync(file, 'module.exports = { theme: { fontFamily: { bad: 3 } } }')
  const result = run(['w'])
  assert.equal(result.status, 1)
  assert.match(result.stderr, /Error managing watch mode:/)
  assert.doesNotMatch(result.stderr, /at file:\/\//)
} finally { fs.rmSync(root, { recursive: true, force: true }) }
console.log('Lazy command loading and error handling contracts passed')
