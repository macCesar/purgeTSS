import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'purgetss-signature-'))
const bin = path.resolve('bin/purgetss')
try {
  fs.mkdirSync(path.join(root, 'app/views'), { recursive: true })
  fs.mkdirSync(path.join(root, 'app/controllers'), { recursive: true })
  fs.mkdirSync(path.join(root, 'app/styles'), { recursive: true })
  fs.mkdirSync(path.join(root, 'purgetss'), { recursive: true })
  fs.writeFileSync(path.join(root, 'app/views/index.xml'), '<Alloy><Window class="bg-stamp" /></Alloy>')
  const config = path.join(root, 'purgetss/config.cjs')
  const run = args => {
    const result = spawnSync(process.execPath, [bin, ...args], { cwd: root, encoding: 'utf8', env: { ...process.env, NO_UPDATE_NOTIFIER: '1' } })
    assert.equal(result.status, 0, result.stdout + result.stderr)
  }
  const stamp = Math.floor(Date.now() / 1000)
  fs.writeFileSync(config, 'module.exports = { theme: { extend: { colors: { stamp: \'#112233\' } } } }')
  fs.utimesSync(config, stamp + 0.1, stamp + 0.1)
  run(['build'])
  // Keep the same second and the same string length.
  fs.writeFileSync(config, fs.readFileSync(config, 'utf8').replace('#112233', '#445566'))
  fs.utimesSync(config, stamp + 0.8, stamp + 0.8)
  run([])
  assert.match(fs.readFileSync(path.join(root, 'app/styles/app.tss'), 'utf8'), /#445566/)
  const metadata = path.join(root, 'purgetss/.cache/generator-signature.json')
  assert.ok(fs.statSync(metadata).size <= 4096)
  const app = path.join(root, 'app/styles/app.tss')
  const mtime = fs.statSync(app).mtimeMs
  const profile = path.join(root, 'skip.json')
  run(['--profile', profile])
  assert.equal(JSON.parse(fs.readFileSync(profile)).status, 'skipped')
  assert.equal(fs.statSync(app).mtimeMs, mtime)
  run(['--all', '--profile', profile])
  const combined = JSON.parse(fs.readFileSync(profile))
  assert.equal(combined.status, 'completed', '--all completed build work even when purge is guarded')
  assert.ok(combined.phases.some(phase => phase.status === 'skipped' && phase.skipReason === 'liveview-2s'))
} finally {
  fs.rmSync(root, { recursive: true, force: true })
}
console.log('Same-second config invalidation and LiveView contracts passed')
